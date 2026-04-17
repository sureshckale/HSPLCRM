/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { Lead, Activity, UserProfile, UserRole } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LeadList from './components/LeadList';
import PipelineView from './components/PipelineView';
import LeadDetails from './components/LeadDetails';
import LeadForm from './components/LeadForm';
import AdminPanel from './components/AdminPanel';
import Reports from './components/Reports';
import Activities from './components/Activities';
import { Plus, Bell, Search, Filter, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { cn } from './lib/utils';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [users, setUsers] = useState<{ uid: string, name: string }[]>([]);

  // Initialize Gemini for smart features
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ uid: doc.id, name: doc.data().name })));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        // Fetch or create user profile
        const userDocRef = doc(db, 'users', fbUser.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            // New user - default to sales_rep or check if sureshckale@gmail.com
            const role: UserRole = fbUser.email === 'sureshckale@gmail.com' ? 'admin' : 'sales_rep';
            const newProfile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              name: fbUser.displayName || 'Unnamed User',
              role: role,
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, 'users');
        }
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Real-time leads
    const leadsQuery = query(collection(db, 'leads'), orderBy('updatedAt', 'desc'));
    const unsubscribeLeads = onSnapshot(leadsQuery, (snapshot) => {
      const leadsList = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Lead));
      setLeads(leadsList);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'leads'));

    return () => unsubscribeLeads();
  }, [user]);

  // Fetch activities (Global subscription)
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'activities'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity)));
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => {
    if (isSigningIn) return;
    
    setAuthError(null);
    setIsSigningIn(true);
    
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login Error:", error);
      
      if (error.code === 'auth/popup-blocked') {
        setAuthError("Popup blocked. Please enable popups for this site and try again.");
      } else if (error.code === 'auth/cancelled-popup-request') {
        setAuthError("Login request cancelled. Please try again.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        setAuthError("Login window was closed before completion.");
      } else {
        setAuthError("An error occurred during sign-in. Please try again.");
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = () => signOut(auth);

  const handleSaveLead = async (data: Partial<Lead>) => {
    if (!user) return;
    try {
      if (selectedLead?.id) {
        await updateDoc(doc(db, 'leads', selectedLead.id), {
          ...data,
          updatedAt: new Date().toISOString()
        });
      } else {
        await addDoc(collection(db, 'leads'), {
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastActivityAt: new Date().toISOString(),
          assignedTo: data.assignedTo || user.uid,
          isOem: data.isOem ?? true,
          urgency: data.urgency ?? 'Medium'
        });
      }
      setIsLeadFormOpen(false);
      setSelectedLead(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'leads');
    }
  };

  const handleUpdateStatus = async (status: Lead['status']) => {
    if (!selectedLead) return;
    try {
      await updateDoc(doc(db, 'leads', selectedLead.id), { 
        status, 
        updatedAt: new Date().toISOString() 
      });
      setSelectedLead(prev => prev ? { ...prev, status } : null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `leads/${selectedLead.id}`);
    }
  };

  const handleAddActivity = async (content: string, type: string) => {
    if (!selectedLead || !user) return;
    try {
      await addDoc(collection(db, 'activities'), {
        leadId: selectedLead.id,
        content,
        type,
        createdBy: user.uid,
        timestamp: new Date().toISOString()
      });
      await updateDoc(doc(db, 'leads', selectedLead.id), {
        lastActivityAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'activities');
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#2E7D32]/20 border-t-[#2E7D32] rounded-full animate-spin"></div>
          <p className="text-[10px] text-[#616161] font-bold uppercase tracking-widest">WireFlow Loading</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen flex flex-col lg:flex-row bg-white">
        <div className="lg:w-1/2 bg-[#2E7D32] flex flex-col justify-center p-12 lg:p-24 text-white">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-lg">
            <span className="text-[#2E7D32] font-black text-3xl">W</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">Precision Lead Management.</h1>
          <p className="text-xl text-green-100 max-w-lg mb-8 opacity-80 font-light">
            The specialized CRM for Automotive Wiring Harness Manufacturing. Track RFQs, BOMs, and technical feasibility with surgical precision.
          </p>
          <ul className="space-y-4 mb-2">
             <li className="flex items-center gap-3 text-green-50">
               <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
               Centralized Lead Pipeline
             </li>
             <li className="flex items-center gap-3 text-green-50">
               <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
               Technical RFQ Tracking
             </li>
             <li className="flex items-center gap-3 text-green-50">
               <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
               Role-Based Dashboards
             </li>
          </ul>
        </div>
        <div className="lg:w-1/2 flex items-center justify-center p-8">
           <div className="w-full max-w-sm">
             <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
             <p className="text-gray-500 mb-8">Sign in to access your dashboard</p>
             
             {authError && (
               <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                 <p className="text-xs text-red-700 font-bold leading-relaxed">{authError}</p>
               </div>
             )}

             <button 
              onClick={handleLogin}
              disabled={isSigningIn}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-3 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {isSigningIn ? (
                 <div className="w-5 h-5 border-2 border-[#2E7D32] border-t-transparent rounded-full animate-spin"></div>
               ) : (
                 <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
               )}
               {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
             </button>
             <p className="mt-8 text-xs text-gray-400 text-center">
               Access restricted to authorized @company.com employees
             </p>
           </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard leads={leads} onLeadClick={(l) => {
          setSelectedLead(l);
          setActiveView('leads');
        }} />;
      case 'leads':
        return (
          <LeadList 
            leads={leads} 
            onLeadClick={setSelectedLead} 
            onEditLead={(l) => {
              setSelectedLead(l);
              setIsLeadFormOpen(true);
            }}
          />
        );
      case 'pipeline':
        return <PipelineView leads={leads} onLeadClick={setSelectedLead} />;
      case 'activities':
        const activitiesWithNames = activities.map(a => ({
          ...a,
          leadName: leads.find(l => l.id === a.leadId)?.companyName || 'Unknown Lead'
        }));
        return <Activities 
          activities={activitiesWithNames} 
          onLeadClick={(id) => {
            const lead = leads.find(l => l.id === id);
            if (lead) setSelectedLead(lead);
          }} 
        />;
      case 'reports':
        return <Reports leads={leads} />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard leads={leads} onLeadClick={setSelectedLead} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA]">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        user={profile}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 ml-[220px] flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-[#E0E0E0] bg-white flex items-center justify-between px-10 z-10">
          <div className="flex items-center gap-4 flex-1">
             <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BDBDBD]" />
                <input 
                  type="text" 
                  placeholder="Architect Search..." 
                  className="w-full bg-[#F5F5F5] border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-[#2E7D32] transition-all placeholder:text-[#BDBDBD]" 
                />
             </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="p-2 text-[#9E9E9E] hover:text-[#2E7D32] relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#D32F2F] rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-100 mx-2" />
            <button 
              onClick={() => {
                setSelectedLead(null);
                setIsLeadFormOpen(true);
              }}
              className="bg-[#2E7D32] text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#1B5E20] transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" /> New RFQ Lead
            </button>
          </div>
        </header>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
           <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#212121] tracking-tight">
                  {activeView === 'dashboard' ? 'Sales Architect Dashboard' : activeView.replace('_', ' ').charAt(0).toUpperCase() + activeView.replace('_', ' ').slice(1)}
                </h1>
                <p className="text-sm text-[#616161] font-medium mt-1">
                  Automotive Division | {new Date().getFullYear()} Performance Overview
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-[#E0E0E0]">
                <button className="px-3 py-1.5 text-[10px] font-bold text-[#2E7D32] bg-[#E8F5E9] rounded-md transition-colors">QTD</button>
                <button className="px-3 py-1.5 text-[10px] font-bold text-[#616161] hover:bg-gray-50 rounded-md transition-colors">YTD</button>
              </div>
           </header>

           <div className="max-w-[1240px] mx-auto">
             {renderContent()}
           </div>
        </div>
      </main>

      {/* Detail Overlay */}
      {selectedLead && (
        <LeadDetails 
          lead={selectedLead} 
          activities={activities.filter(a => a.leadId === selectedLead.id)}
          onClose={() => setSelectedLead(null)}
          onUpdateStatus={handleUpdateStatus}
          onAddActivity={handleAddActivity}
          aiInstance={ai}
        />
      )}

      {isLeadFormOpen && (
        <LeadForm 
          lead={selectedLead}
          onClose={() => {
            setIsLeadFormOpen(false);
            setSelectedLead(null);
          }}
          onSave={handleSaveLead}
          users={users}
        />
      )}
    </div>
  );
}
