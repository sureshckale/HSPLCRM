import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, UserRole } from '../types';
import { Shield, User, Mail, ChevronRight, UserCog } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../firebase';
import { cn } from '../lib/utils';

export default function AdminPanel() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ ...doc.data() } as UserProfile));
      setUsers(list);
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'users'));

    return () => unsubscribe();
  }, []);

  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    try {
      await updateDoc(doc(db, 'users', uid), { role: newRole });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-[#212121] tracking-tight">System Administration</h2>
          <p className="text-sm font-bold text-[#616161] uppercase tracking-[0.2em] mt-1">User Rights & Access Control</p>
        </div>
        <div className="bg-[#E8F5E9] px-4 py-2 rounded-xl text-[#2E7D32] text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Admin Session
        </div>
      </div>

      <div className="bento-card overflow-hidden">
        <div className="p-6 bg-gray-50/50 border-b border-[#E0E0E0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCog className="w-5 h-5 text-[#2E7D32]" />
            <h3 className="font-bold text-[#212121]">Account Registry</h3>
          </div>
          <span className="text-[10px] font-black text-[#9E9E9E] uppercase tracking-widest">{users.length} Active Records</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F0F0F0]">
                <th className="px-6 py-4 text-[10px] font-bold text-[#9E9E9E] uppercase tracking-widest">Personnel</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#9E9E9E] uppercase tracking-widest">Email Identity</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#9E9E9E] uppercase tracking-widest">Authorization Role</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#9E9E9E] uppercase tracking-widest">Enrollment</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F0]">
              {users.map((user) => (
                <tr key={user.uid} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F5F5F5] flex items-center justify-center text-[#2E7D32] font-black shadow-sm group-hover:bg-[#E8F5E9] transition-all">
                        {user.name?.charAt(0) || <User className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#212121]">{user.name || 'Incognito User'}</div>
                        <div className="text-[10px] text-[#9E9E9E] font-mono">{user.uid.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-[#616161]">
                      <Mail className="w-3 h-3 text-[#BDBDBD]" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.uid, e.target.value as UserRole)}
                      className={cn(
                        "text-xs font-bold px-3 py-1.5 rounded-lg border-none outline-none ring-1 ring-[#E0E0E0] focus:ring-2 focus:ring-[#2E7D32] transition-all",
                        user.role === 'admin' ? "bg-purple-50 text-purple-700" :
                        user.role === 'manager' ? "bg-blue-50 text-blue-700" :
                        user.role === 'top_management' ? "bg-amber-50 text-amber-700" :
                        "bg-green-50 text-green-700"
                      )}
                    >
                      <option value="sales_rep">Sales Representative</option>
                      <option value="manager">Lead Manager</option>
                      <option value="admin">System Administrator</option>
                      <option value="top_management">Top Management</option>
                      <option value="viewer">Guest Viewer</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-[#BDBDBD] font-mono">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-[#E0E0E0] hover:text-[#2E7D32] transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bento-card p-8 bg-[#212121] text-white">
          <h4 className="text-lg font-bold mb-4">Security Protocol Info</h4>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            Permissions are enforced at the Firestore level via Security Rules. Roles defined here determine visible UI elements and API mutation access. Changes take effect on next synchronization.
          </p>
          <div className="flex gap-4">
            <div className="flex-1 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-[10px] font-black text-[#2E7D32] uppercase mb-1">Write Access</div>
              <div className="text-xs">Propagated Instantly</div>
            </div>
            <div className="flex-1 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-[10px] font-black text-[#EF6C00] uppercase mb-1">Session TTL</div>
              <div className="text-xs">Standard JWT (1hr)</div>
            </div>
          </div>
        </div>
        
        <div className="bento-card p-8 border-dashed border-2 border-[#E0E0E0] flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-[#F5F5F5] rounded-full flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-[#BDBDBD]" />
            </div>
            <h4 className="text-sm font-bold text-[#212121]">Add External Partner</h4>
            <p className="text-xs text-[#9E9E9E] mt-1">Configure cross-domain guest access for suppliers.</p>
        </div>
      </div>
    </div>
  );
}

function Plus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
