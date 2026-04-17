/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { Lead } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { TrendingUp, Target, Briefcase, Activity } from 'lucide-react';

interface DashboardProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
}

const COLORS = ['#2E7D32', '#4CAF50', '#81C784', '#A5D6A7', '#C8E6C9', '#E8F5E9'];

export default function Dashboard({ leads, onLeadClick }: DashboardProps) {
  // Aggregate data
  const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  const activeLeads = leads.filter(l => l.status !== 'Won' && l.status !== 'Lost').length;
  const winRate = leads.length > 0 
    ? (leads.filter(l => l.status === 'Won').length / leads.length) * 100 
    : 0;

  const pipelineByStage = [
    { name: 'RFQ', value: leads.filter(l => l.status === 'RFQ Received').reduce((s, l) => s + (l.value || 0), 0) },
    { name: 'Feasibility', value: leads.filter(l => l.status === 'Technical Feasibility').reduce((s, l) => s + (l.value || 0), 0) },
    { name: 'Quotation', value: leads.filter(l => l.status === 'Quotation').reduce((s, l) => s + (l.value || 0), 0) },
    { name: 'Negotiation', value: leads.filter(l => l.status === 'Negotiation').reduce((s, l) => s + (l.value || 0), 0) },
    { name: 'Sample', value: leads.filter(l => l.status === 'Sample Development').reduce((s, l) => s + (l.value || 0), 0) },
  ];

  const salesMix = [
    { name: 'New Business', value: leads.filter(l => l.pipeline === 'New Business').length },
    { name: 'Repeat Orders', value: leads.filter(l => l.pipeline === 'Repeat Orders').length },
    { name: 'Development', value: leads.filter(l => l.pipeline === 'Development Projects').length },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
      {/* Large Card: Pipeline Value by Stage */}
      <div className="md:col-span-2 md:row-span-2 bento-card flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-bold text-[#616161] uppercase tracking-wider">Active Pipeline Value</h3>
          <span className="text-lg font-bold text-[#2E7D32]">{formatCurrency(totalValue)}</span>
        </div>
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pipelineByStage} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                width={100}
                tick={{ fontSize: 12, fontWeight: 500, fill: '#616161' }}
              />
              <Tooltip 
                formatter={(v: number) => formatCurrency(v)}
                contentStyle={{ borderRadius: '8px', border: '1px solid #E0E0E0' }} 
              />
              <Bar dataKey="value" fill="#2E7D32" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 pt-4 border-t border-[#E0E0E0] flex gap-4">
           <div className="bg-[#F8F9FA] px-4 py-2 rounded-lg flex-1">
             <p className="text-[10px] text-[#616161] font-bold uppercase">WIN RATIO</p>
             <p className="text-lg font-bold text-[#2E7D32]">{winRate.toFixed(1)}%</p>
           </div>
           <div className="bg-[#F8F9FA] px-4 py-2 rounded-lg flex-1">
             <p className="text-[10px] text-[#616161] font-bold uppercase">AVG CYCLE</p>
             <p className="text-lg font-bold text-[#212121]">42 Days</p>
           </div>
        </div>
      </div>

      {/* Stat Cards - Small */}
      <StatCard 
        title="Active Leads" 
        value={activeLeads.toString()} 
        icon={Briefcase} 
        color="text-blue-600" 
        bg="bg-blue-50" 
        subText="+4 since yesterday"
      />
      <StatCard 
        title="Win Rate" 
        value={`${winRate.toFixed(1)}%`} 
        icon={Target} 
        color="text-orange-600" 
        bg="bg-orange-50" 
        subText="Target: 30%"
      />
      <StatCard 
        title="Average Deal" 
        value={formatCurrency(leads.length > 0 ? totalValue / leads.length : 0)} 
        icon={Activity} 
        color="text-purple-600" 
        bg="bg-purple-50" 
        subText="Top segment: SUV"
      />
      <StatCard 
        title="Critical RFQs" 
        value="08" 
        icon={TrendingUp} 
        color="text-red-600" 
        bg="bg-red-50" 
        subText="6 Pending Feasibility"
      />

      {/* Medium Card: Pipeline Mix */}
      <div className="md:col-span-2 bento-card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-bold text-[#616161] uppercase tracking-wider">Pipeline Mix</h3>
          <span className="text-[10px] text-[#2E7D32] font-bold cursor-pointer hover:underline">VIEW ALL</span>
        </div>
        <div className="h-48 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={salesMix}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {salesMix.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E0E0E0' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 ml-4">
            {salesMix.map((item, i) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-[10px] text-[#616161] font-medium whitespace-nowrap">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Extra Grid Fillers or Small lists */}
      <div className="bento-card">
        <h3 className="text-[10px] font-bold text-[#616161] uppercase mb-4 tracking-wider">Recent Activities</h3>
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-[#2E7D32] rounded-full mt-1 flex-shrink-0" />
              <div>
                <p className="text-[11px] text-[#212121] leading-tight">RFQ #4052 updated by Eng.</p>
                <p className="text-[9px] text-[#616161]">10 mins ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bento-card">
        <h3 className="text-[10px] font-bold text-[#616161] uppercase mb-4 tracking-wider">Follow-ups</h3>
        <div className="bg-red-50 border-l-2 border-red-500 p-2 rounded">
          <p className="text-[11px] font-bold text-red-900">Tata Motors</p>
          <p className="text-[10px] text-red-700">Follow up on BOM Rev 2.1</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg, subText }: any) {
  return (
    <div className="bento-card flex flex-col justify-between">
      <div>
        <h3 className="text-[10px] font-bold text-[#616161] uppercase tracking-wider mb-2">{title}</h3>
        <div className="text-3xl font-bold text-[#2E7D32] tabular-nums">{value}</div>
        <p className="text-[11px] text-[#616161] mt-1">{subText}</p>
      </div>
      <div className="mt-4 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
         <Icon className={cn("w-5 h-5", color)} />
      </div>
    </div>
  );
}
