/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lead, LeadStatus } from '../types';
import { formatCurrency, getStatusColor, cn } from '../lib/utils';
import { MoreVertical, User, Calendar } from 'lucide-react';

interface PipelineViewProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
}

const STAGES: LeadStatus[] = [
  'New',
  'RFQ Received',
  'Technical Feasibility',
  'Quotation',
  'Sample Development',
  'Won'
];

export default function PipelineView({ leads, onLeadClick }: PipelineViewProps) {
  return (
    <div className="flex gap-6 overflow-x-auto pb-6 h-full">
      {STAGES.map((stage) => {
        const stageLeads = leads.filter(l => l.status === stage);
        const stageValue = stageLeads.reduce((sum, l) => sum + (l.value || 0), 0);
        
        return (
          <div key={stage} className="flex-shrink-0 w-80 flex flex-col group">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="font-bold text-[#616161] text-[10px] uppercase tracking-widest flex items-center gap-2">
                {stage}
                <span className="bg-[#E0E0E0] text-[#212121] px-1.5 py-0.5 rounded text-[10px] font-black">{stageLeads.length}</span>
              </h3>
              <p className="text-[10px] font-bold text-[#2E7D32]">{formatCurrency(stageValue)}</p>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto min-h-0 custom-scrollbar pr-1">
              {stageLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => onLeadClick(lead)}
                  className="bento-card cursor-pointer group/card border-[#E0E0E0] hover:border-[#2E7D32]/30"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-[#212121] text-sm leading-tight group-hover/card:text-[#2E7D32] transition-colors">
                      {lead.companyName}
                    </h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-bold text-[#9E9E9E] uppercase tracking-tighter">Quote Value</p>
                       <p className="text-xs font-bold text-[#2E7D32]">{formatCurrency(lead.value)}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <div className={cn("text-[9px] px-2 py-0.5 rounded font-bold uppercase", getStatusColor(lead.status))}>
                        {lead.status}
                      </div>
                      {lead.urgency === 'High' && (
                        <div className="text-[9px] px-2 py-0.5 rounded bg-red-50 text-red-700 font-bold uppercase">
                          Urgent
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-bold text-[#616161]">
                          {lead.contactPerson?.charAt(0) || 'U'}
                        </div>
                        <span className="text-[10px] font-medium text-[#616161]">{lead.contactPerson}</span>
                      </div>
                      <span className="text-[9px] font-bold text-[#BDBDBD]">{lead.rfqNumber || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
              {stageLeads.length === 0 && (
                <div className="h-24 flex items-center justify-center border border-dashed border-[#E0E0E0] rounded-xl bg-gray-50/30">
                  <p className="text-[10px] font-bold text-[#BDBDBD] uppercase tracking-widest">No Leads</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
