/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lead, Activity } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Settings, 
  FileText, 
  Truck, 
  ShieldCheck,
  PlusCircle,
  MessageSquare,
  Briefcase,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface LeadDetailsProps {
  lead: Lead;
  activities: Activity[];
  onClose: () => void;
  onAddActivity: (content: string, type: string) => void;
  onUpdateStatus: (status: Lead['status']) => void;
  aiInstance: GoogleGenAI | null;
}

export default function LeadDetails({ lead, activities, onClose, onAddActivity, onUpdateStatus, aiInstance }: LeadDetailsProps) {
  const [activeTab, setActiveTab] = useState<'specs' | 'ai'>('specs');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);

  const runAnalysis = async () => {
    if (!aiInstance) {
      setAiAnalysis("Intelligence Engine is currently unavailable. Please check system configuration.");
      return;
    }
    setIsAnalysing(true);
    try {
      const response = await aiInstance.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this automotive wiring harness lead for technical feasibility and business potential. 
        Company: ${lead.companyName}
        RFQ: ${lead.rfqNumber}
        Vehicle Type: ${lead.vehicleType}
        Wire Specs: ${lead.wireSpecification}
        Connector Type: ${lead.connectorType}
        Application: ${lead.applicationType}
        Testing Requirements: ${lead.testingRequirements}
        Budget: ${lead.value}
        Urgency: ${lead.urgency}
        
        Provide a concise report in Markdown with:
        1. Technical Risk Level (Low/Med/High)
        2. Feasibility Summary
        3. Strategic Recommendation`,
        config: {
          systemInstruction: "You are a senior technical sales engineer for automotive wiring harnesses. Your goal is to provide blunt, accurate technical assessment and strategic advice for new RFQs."
        }
      });
      setAiAnalysis(response.text || "Analysis failed to generate.");
    } catch (error) {
      console.error("AI Error:", error);
      setAiAnalysis("Technical error connecting to Intelligence Engine.");
    } finally {
      setIsAnalysing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#F8FAF8]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#2E7D32] rounded-xl flex items-center justify-center text-white text-xl font-bold">
              {lead.companyName.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{lead.companyName}</h2>
              <p className="text-sm text-[#556B55] flex items-center gap-2">
                {lead.contactPerson} • <Mail className="w-3 h-3" /> {lead.email}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Specs Left Section */}
          <div className="flex-1 overflow-y-auto border-r border-gray-50 flex flex-col">
            <div className="flex border-b border-gray-100 bg-white sticky top-0 z-10">
              <button 
                onClick={() => setActiveTab('specs')}
                className={cn(
                  "px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2",
                  activeTab === 'specs' ? "text-[#2E7D32] border-[#2E7D32]" : "text-gray-400 border-transparent hover:text-gray-600"
                )}
              >
                Engineering Specs
              </button>
              <button 
                onClick={() => setActiveTab('ai')}
                className={cn(
                  "px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 flex items-center gap-2",
                  activeTab === 'ai' ? "text-[#212121] border-[#2E7D32]" : "text-gray-400 border-transparent hover:text-gray-600"
                )}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
                Smart Analysis
              </button>
            </div>

            <div className="p-8 space-y-8 flex-1">
              {activeTab === 'specs' ? (
                <>
                  <section>
                    <h3 className="text-xs font-bold text-[#2E7D32] uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Settings className="w-4 h-4" /> Technical Specifications
                    </h3>
                    <div className="grid grid-cols-2 gap-6 bg-[#F9FAF9] p-6 rounded-xl border border-[#E0E7E0]">
                      <SpecItem label="RFQ Number" value={lead.rfqNumber} icon={FileText} />
                      <SpecItem label="Drawing #" value={lead.drawingNumber} icon={FileText} />
                      <SpecItem label="Wire Spec" value={lead.wireSpecification} icon={Settings} />
                      <SpecItem label="Connector Type" value={lead.connectorType} icon={Zap} />
                      <SpecItem label="Vehicle Type" value={lead.vehicleType} icon={Truck} />
                      <SpecItem label="Testing Req" value={lead.testingRequirements} icon={ShieldCheck} />
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-bold text-[#2E7D32] uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> Business Opportunity
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Deal Value</p>
                        <p className="text-lg font-bold text-[#2E7D32]">{formatCurrency(lead.value)}</p>
                      </div>
                      <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Pipeline</p>
                        <p className="text-sm font-bold text-gray-700">{lead.pipeline}</p>
                      </div>
                      <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Region</p>
                        <p className="text-sm font-bold text-gray-700">{lead.region}</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-bold text-[#2E7D32] uppercase tracking-widest mb-4">Application Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center justify-between p-3 border-b border-gray-50">
                          <span className="text-gray-500">Is OEM?</span>
                          <span className={cn("px-2 py-0.5 rounded text-xs font-bold", lead.isOem ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600")}>
                            {lead.isOem ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 border-b border-gray-50">
                          <span className="text-gray-500">Urgency</span>
                          <span className={cn("px-2 py-0.5 rounded text-xs font-bold", 
                            lead.urgency === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          )}>
                            {lead.urgency}
                          </span>
                        </div>
                    </div>
                  </section>
                </>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  {!aiAnalysis && !isAnalysing ? (
                    <div className="bg-[#212121] text-white p-10 rounded-2xl text-center flex flex-col items-center">
                      <div className="w-16 h-16 bg-[#2E7D32]/20 rounded-full flex items-center justify-center mb-6">
                        <Sparkles className="w-8 h-8 text-[#2E7D32]" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">Initialize Intelligent Review</h4>
                      <p className="text-sm text-gray-400 max-w-sm mb-8">
                        Use Gemini AI to analyze technical feasibility, identify procurement risks, and generate manufacturing strategic recommendations.
                      </p>
                      <button 
                        onClick={runAnalysis}
                        className="bg-[#2E7D32] px-8 py-3 rounded-xl font-bold flex items-center gap-3 hover:bg-[#1B5E20] transition-all"
                      >
                        <Zap className="w-4 h-4" />
                        Generate AI Insight
                      </button>
                    </div>
                  ) : isAnalysing ? (
                    <div className="p-20 flex flex-col items-center justify-center space-y-6">
                       <div className="flex gap-2">
                         {[1,2,3].map(i => (
                           <div key={i} className="w-3 h-3 bg-[#2E7D32] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}></div>
                         ))}
                       </div>
                       <p className="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">Consulting Harness Intelligence Engine...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-[#E8F5E9] p-6 rounded-2xl border border-[#2E7D32]/10 flex items-start gap-4">
                        <CheckCircle2 className="w-6 h-6 text-[#2E7D32] flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="text-[#1B5E20] font-black uppercase text-xs tracking-widest mb-2">Automated Analysis Complete</h4>
                          <div className="prose prose-sm prose-green max-w-none text-[#2E7D32]/80 leading-relaxed font-medium">
                            {aiAnalysis?.split('\n').map((line, i) => (
                              <p key={i} className="mb-2">{line}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setAiAnalysis(null)}
                        className="text-[10px] font-bold text-gray-400 hover:text-[#2E7D32] uppercase tracking-widest"
                      >
                        ← Reset Intelligence Module
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="w-96 bg-[#FAFBFB] flex flex-col border-l border-gray-100">
            <div className="p-6 border-b border-gray-100">
               <h3 className="text-sm font-bold text-[#2E7D32] mb-4">Current Status</h3>
               <select 
                value={lead.status}
                onChange={(e) => onUpdateStatus(e.target.value as any)}
                className="w-full bg-white border border-[#E0E7E0] rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-[#2E7D32] outline-none"
               >
                 <option value="New">New</option>
                 <option value="Qualification">Qualification</option>
                 <option value="RFQ Received">RFQ Received</option>
                 <option value="Technical Feasibility">Technical Feasibility</option>
                 <option value="Quotation">Quotation</option>
                 <option value="Negotiation">Negotiation</option>
                 <option value="Sample Development">Sample Development</option>
                 <option value="Won">Order Confirmation (Won)</option>
                 <option value="Lost">Lost / Dropped</option>
               </select>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Activity Timeline</h3>
              {activities.map((activity) => (
                <div key={activity.id} className="bg-white p-4 rounded-xl border border-[#E0E7E0] shadow-sm relative pl-6 before:content-[''] before:absolute before:left-0 before:top-4 before:bottom-0 before:w-1 before:bg-[#E8F5E9] before:rounded-full">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-[#2E7D32] uppercase">{activity.type}</span>
                    <span className="text-[10px] text-gray-400">{new Date(activity.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-700">{activity.content}</p>
                </div>
              ))}
              {activities.length === 0 && (
                 <div className="text-center py-10">
                   <MessageSquare className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                   <p className="text-xs text-gray-400 italic">No activities logged yet</p>
                 </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
               <form onSubmit={(e) => {
                 e.preventDefault();
                 const content = (e.currentTarget.elements.namedItem('content') as HTMLTextAreaElement).value;
                 if (content) {
                   onAddActivity(content, 'Note');
                   e.currentTarget.reset();
                 }
               }} className="space-y-2">
                 <textarea 
                  name="content"
                  placeholder="Add a follow-up note..." 
                  className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm focus:bg-white transition-colors outline-none h-20 resize-none"
                 />
                 <button className="w-full bg-[#2E7D32] text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#1B5E20] transition-colors">
                   <PlusCircle className="w-4 h-4" /> Log Note
                 </button>
               </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecItem({ label, value, icon: Icon }: any) {
  return (
    <div>
      <p className="text-[10px] text-[#556B55] uppercase font-bold mb-1 flex items-center gap-1">
        <Icon className="w-3 h-3" /> {label}
      </p>
      <p className="text-sm text-gray-700 font-medium truncate">{value || 'Not provided'}</p>
    </div>
  );
}

function ClipboardList(props: any) {
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
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}
