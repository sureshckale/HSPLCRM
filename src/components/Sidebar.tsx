/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  Settings, 
  LogOut, 
  Briefcase,
  PieChart,
  ClipboardList,
  Database
} from 'lucide-react';
import { UserProfile } from '../types';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  user: UserProfile | null;
  onLogout: () => void;
}

export default function Sidebar({ activeView, setActiveView, user, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'All Leads', icon: Briefcase },
    { id: 'pipeline', label: 'Sales Pipeline', icon: Kanban },
    { id: 'activities', label: 'Activities', icon: ClipboardList },
  ];

  if (user?.role === 'admin' || user?.role === 'manager' || user?.role === 'top_management') {
    menuItems.push({ id: 'reports', label: 'Reports', icon: PieChart });
  }

  if (user?.role === 'admin') {
    menuItems.push({ id: 'admin', label: 'System Admin', icon: Settings });
  }

  const seedMockData = async () => {
    if (!user) return;
    const mockLeads = [
      {
        companyName: 'Mahindra & Mahindra',
        contactPerson: 'Rahul Sharma',
        email: 'rahul.s@mahindra.com',
        phone: '+91 98230 11223',
        status: 'RFQ Received',
        pipeline: 'New Business',
        assignedTo: user.uid,
        value: 1250000,
        drawingNumber: 'M&M-XUV700-WH-01',
        rfqNumber: 'RFQ/2026/045',
        bomReference: 'BOM-7721',
        revisionNumber: '3.1',
        connectorType: 'TE Connectivity Superseal',
        wireSpecification: 'FLRY-B 0.5mm - 2.5mm',
        testingRequirements: 'LV214, High Voltage Isolation',
        applicationType: 'Chassis Wiring',
        vehicleType: 'SUV',
        region: 'Pune',
        isOem: true,
        urgency: 'High',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        companyName: 'Tata Motors',
        contactPerson: 'Anjali Gupta',
        email: 'anjali.g@tatamotors.com',
        phone: '+91 91122 33445',
        status: 'Technical Feasibility',
        pipeline: 'Development Projects',
        assignedTo: user.uid,
        value: 850000,
        drawingNumber: 'TATA-NEXON-EV-BT-09',
        rfqNumber: 'RFQ/EV/992',
        bomReference: 'BOM-EV-01',
        revisionNumber: '1.0',
        connectorType: 'Amphenol HV Series',
        wireSpecification: 'Orange Shielded HV Wire',
        testingRequirements: 'IP67, Thermal Cycling',
        applicationType: 'Battery Management',
        vehicleType: 'EV',
        region: 'Jamshedpur',
        isOem: true,
        urgency: 'Medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    for (const lead of mockLeads) {
      await addDoc(collection(db, 'leads'), lead);
    }
    alert('Mock leads seeded successfully!');
  };

  return (
    <div className="w-[220px] bg-white border-r border-[#E0E0E0] flex flex-col h-screen fixed left-0 top-0 z-20">
      <div className="p-6 pb-8 flex items-center gap-3">
        <div className="w-8 h-8 bg-[#2E7D32] rounded-md flex items-center justify-center text-white font-bold text-lg">
          W
        </div>
        <h1 className="text-[#212121] font-bold text-lg tracking-tight">Harness<span className="text-[#2E7D32]">CRM</span></h1>
      </div>

      <nav className="flex-1 space-y-0">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all group relative",
              activeView === item.id 
                ? "text-[#2E7D32] bg-[#E8F5E9] border-r-4 border-[#2E7D32]" 
                : "text-[#616161] hover:text-[#2E7D32] hover:bg-gray-50"
            )}
          >
            <item.icon className={cn("w-5 h-5 transition-colors", activeView === item.id ? "text-[#2E7D32]" : "text-[#9E9E9E] group-hover:text-[#2E7D32]")} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-[#E0E0E0] space-y-4">
        {user?.role === 'admin' && (
          <button
            onClick={seedMockData}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-[#616161] border border-[#E0E0E0] hover:bg-gray-50 transition-colors"
          >
            <Database className="w-4 h-4" />
            Seed Demo Data
          </button>
        )}
        
        {user && (
          <div className="px-2">
            <div className="text-[10px] font-bold text-[#BDBDBD] uppercase tracking-widest mb-1">Authenticated</div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-bold text-[#212121]">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#212121] truncate">{user.name}</p>
                <p className="text-[9px] text-[#616161] uppercase font-bold">{user.role?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-[#D32F2F] hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout User
        </button>
      </div>
    </div>
  );
}
