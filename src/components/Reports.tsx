import { useMemo } from 'react';
import { Lead } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { TrendingUp, Users, Target, Award, Download } from 'lucide-react';

interface ReportsProps {
  leads: Lead[];
}

export default function Reports({ leads }: ReportsProps) {
  const stats = useMemo(() => {
    const byStatus = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byValue = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + lead.value;
      return acc;
    }, {} as Record<string, number>);

    const stageData = Object.keys(byValue).map(key => ({
      name: key,
      value: byValue[key],
      count: byStatus[key]
    })).sort((a, b) => b.value - a.value);

    const totalValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);
    const avgDealSize = leads.length > 0 ? totalValue / leads.length : 0;
    const highValueCount = leads.filter(l => l.value > 1000000).length;

    return { stageData, totalValue, avgDealSize, highValueCount };
  }, [leads]);

  const COLORS = ['#2E7D32', '#43A047', '#66BB6A', '#81C784', '#A5D6A7', '#C8E6C9', '#E8F5E9'];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-[#212121] tracking-tight">Performance Intelligence</h2>
          <p className="text-sm font-bold text-[#616161] uppercase tracking-[0.2em] mt-1">Cross-Pipeline Analytical Review</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E0E0E0] rounded-xl text-xs font-bold text-[#616161] hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
          <Download className="w-4 h-4" />
          Export Dataset
        </button>
      </div>

      {/* Analytical Kpis */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bento-card p-6 bg-white border-l-4 border-l-[#2E7D32]">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-4 h-4 text-[#2E7D32]" />
            <span className="text-[10px] font-black text-[#9E9E9E] uppercase tracking-widest">Gross Forecast</span>
          </div>
          <div className="text-2xl font-black text-[#212121]">{formatCurrency(stats.totalValue)}</div>
        </div>
        <div className="bento-card p-6 bg-white border-l-4 border-l-[#EF6C00]">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-4 h-4 text-[#EF6C00]" />
            <span className="text-[10px] font-black text-[#9E9E9E] uppercase tracking-widest">Avg Capture</span>
          </div>
          <div className="text-2xl font-black text-[#212121]">{formatCurrency(stats.avgDealSize)}</div>
        </div>
        <div className="bento-card p-6 bg-white border-l-4 border-l-blue-600">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] font-black text-[#9E9E9E] uppercase tracking-widest">Lead Volume</span>
          </div>
          <div className="text-2xl font-black text-[#212121]">{leads.length}</div>
        </div>
        <div className="bento-card p-6 bg-white border-l-4 border-l-purple-600">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-4 h-4 text-purple-600" />
            <span className="text-[10px] font-black text-[#9E9E9E] uppercase tracking-widest">High Potential</span>
          </div>
          <div className="text-2xl font-black text-[#212121]">{stats.highValueCount}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Value Concentration Bar Chart */}
        <div className="bento-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-sm text-[#212121] uppercase tracking-widest border-b-2 border-[#2E7D32] pb-1">Value Concentration by Stage</h3>
            <span className="text-[10px] font-bold text-[#9E9E9E]">Metric: Aggregate INR</span>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.stageData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F0F0F0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 10, fontWeight: 700, fill: '#616161' }} />
                <Tooltip 
                  cursor={{ fill: '#F8F9FA' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E0E0E0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [formatCurrency(value), 'Total Value']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                  {stats.stageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Distribution Pie Chart */}
        <div className="bento-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-sm text-[#212121] uppercase tracking-widest border-b-2 border-amber-500 pb-1">Inquiry Distribution</h3>
            <span className="text-[10px] font-bold text-[#9E9E9E]">Metric: Volume Count</span>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.stageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {stats.stageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E0E0E0' }}
                />
                <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
