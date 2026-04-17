/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lead } from '../types';
import { formatCurrency, getStatusColor, cn } from '../lib/utils';
import { Search, Filter, ArrowUpDown, ChevronRight } from 'lucide-react';

interface LeadListProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
}

export default function LeadList({ leads, onLeadClick, onEditLead }: LeadListProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
      <div className="p-6 border-b border-[#E0E0E0] flex items-center justify-between bg-white">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BDBDBD]" />
            <input 
              type="text" 
              placeholder="Search leads, RFQs, drawings..." 
              className="w-full bg-[#F5F5F5] border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-[#2E7D32] outline-none placeholder:text-[#BDBDBD]"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#616161] border border-[#E0E0E0] hover:bg-gray-50 rounded-lg transition-all">
            <Filter className="w-3 h-3" /> Filter
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAF9] text-[10px] uppercase font-bold tracking-widest text-[#9E9E9E] border-b border-[#E0E0E0]">
              <th className="px-8 py-5">Company</th>
              <th className="px-8 py-5">RFQ / Drawing</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5">Value</th>
              <th className="px-8 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.map((lead) => (
              <tr 
                key={lead.id} 
                className="hover:bg-[#F8F9FA] cursor-pointer group transition-colors"
                onClick={() => onLeadClick(lead)}
              >
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#212121] group-hover:text-[#2E7D32] transition-colors">{lead.companyName}</span>
                    <span className="text-[10px] uppercase font-bold text-[#9E9E9E]">{lead.contactPerson}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-[#212121]">{lead.rfqNumber || '--'}</span>
                    <span className="text-[10px] font-medium text-[#616161]">{lead.drawingNumber || '--'}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold inline-block uppercase", getStatusColor(lead.status))}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-sm font-bold text-[#2E7D32]">
                  {formatCurrency(lead.value)}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditLead(lead);
                      }}
                      className="p-2 text-gray-400 hover:text-[#2E7D32] hover:bg-[#E8F5E9] rounded-lg transition-colors"
                    >
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-white rounded-lg group-hover:text-[#2E7D32] transition-colors border border-transparent group-hover:border-gray-100">
                      <ChevronRight className="w-4 h-4 text-[#BDBDBD]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
