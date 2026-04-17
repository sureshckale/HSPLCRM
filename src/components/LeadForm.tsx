import { useState, ChangeEvent, FormEvent } from 'react';
import { X, Save } from 'lucide-react';
import { Lead, LeadStatus, PipelineType } from '../types';
import { cn } from '../lib/utils';

interface LeadFormProps {
  lead?: Lead | null;
  onClose: () => void;
  onSave: (lead: Partial<Lead>) => void;
  users: { uid: string, name: string }[];
}

export default function LeadForm({ lead, onClose, onSave, users }: LeadFormProps) {
  const [formData, setFormData] = useState<Partial<Lead>>(lead || {
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    status: 'New',
    pipeline: 'New Business',
    assignedTo: '',
    value: 0,
    drawingNumber: '',
    rfqNumber: '',
    bomReference: '',
    revisionNumber: '1.0',
    connectorType: '',
    wireSpecification: '',
    testingRequirements: '',
    applicationType: '',
    vehicleType: '',
    region: '',
    urgency: 'Medium',
    isOem: true,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <header className="p-6 border-b border-[#E0E0E0] flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-[#212121]">{lead ? 'Edit' : 'Create New'} Lead</h2>
            <p className="text-[11px] font-bold text-[#616161] uppercase tracking-widest mt-0.5">Automotive Specification Entry</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <X className="w-5 h-5 text-[#616161]" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Info Section */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-[#2E7D32] uppercase tracking-[0.2em] border-b border-[#E8F5E9] pb-2">Business Information</h3>
              
              <div className="space-y-4">
                <div className="group">
                  <label className="block text-[10px] font-bold text-[#9E9E9E] uppercase mb-1.5 transition-colors group-focus-within:text-[#2E7D32]">Company Name</label>
                  <input
                    required
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full bg-[#F5F5F5] border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#2E7D32] outline-none"
                    placeholder="e.g. Mahindra & Mahindra"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#9E9E9E] uppercase mb-1.5">Contact Person</label>
                    <input
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      className="w-full bg-[#F5F5F5] border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#2E7D32] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#9E9E9E] uppercase mb-1.5">Phone</label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-[#F5F5F5] border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#2E7D32] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#9E9E9E] uppercase mb-1.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#F5F5F5] border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#2E7D32] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#9E9E9E] uppercase mb-1.5">Deal Value (₹)</label>
                    <input
                      type="number"
                      name="value"
                      value={formData.value}
                      onChange={handleChange}
                      className="w-full bg-[#F5F5F5] border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#2E7D32] outline-none font-bold text-[#2E7D32]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#9E9E9E] uppercase mb-1.5">Assigned To</label>
                    <select
                      name="assignedTo"
                      value={formData.assignedTo}
                      onChange={handleChange}
                      className="w-full bg-[#F5F5F5] border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#2E7D32] outline-none"
                    >
                      <option value="">Unassigned</option>
                      {users.map(u => (
                        <option key={u.uid} value={u.uid}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Section */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-[#2E7D32] uppercase tracking-[0.2em] border-b border-[#E8F5E9] pb-2">Technical Specifications</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#9E9E9E] uppercase mb-1.5">RFQ Number</label>
                    <input
                      name="rfqNumber"
                      value={formData.rfqNumber}
                      onChange={handleChange}
                      className="w-full bg-[#F5F5F5] border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#2E7D32] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#9E9E9E] uppercase mb-1.5">Drawing Number</label>
                    <input
                      name="drawingNumber"
                      value={formData.drawingNumber}
                      onChange={handleChange}
                      className="w-full bg-[#F5F5F5] border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#2E7D32] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#9E9E9E] uppercase mb-1.5">Revision</label>
                    <input
                      name="revisionNumber"
                      value={formData.revisionNumber}
                      onChange={handleChange}
                      className="w-full bg-[#F5F5F5] border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#2E7D32] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#9E9E9E] uppercase mb-1.5">Vehicle Type</label>
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      className="w-full bg-[#F5F5F5] border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#2E7D32] outline-none"
                    >
                      <option value="">Select...</option>
                      <option value="Passenger Car">Passenger Car</option>
                      <option value="SUV">SUV</option>
                      <option value="LCV">LCV</option>
                      <option value="HCV">HCV</option>
                      <option value="EV">EV / Electric</option>
                      <option value="Industrial">Industrial</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#9E9E9E] uppercase mb-1.5">Connector Types</label>
                  <input
                    name="connectorType"
                    value={formData.connectorType}
                    onChange={handleChange}
                    className="w-full bg-[#F5F5F5] border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#2E7D32] outline-none"
                    placeholder="e.g. Tyco Superseal, Molex Mini-Fit"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#9E9E9E] uppercase mb-1.5">Wire Specifications</label>
                  <textarea
                    name="wireSpecification"
                    value={formData.wireSpecification}
                    onChange={handleChange}
                    rows={2}
                    className="w-full bg-[#F5F5F5] border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#2E7D32] outline-none resize-none"
                    placeholder="FLRY-B, Shielded, Cross-linked..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Section */}
          <div className="mt-8 space-y-6 bg-gray-50/50 p-6 rounded-xl border border-[#E0E0E0]">
            <h3 className="text-[10px] font-black text-[#2E7D32] uppercase tracking-[0.2em]">Workflow & Stage</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div>
                <label className="block text-[10px] font-bold text-[#9E9E9E] uppercase mb-1.5">Current Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#DDD] rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#2E7D32] outline-none"
                >
                  <option value="New">New Lead</option>
                  <option value="Qualification">Qualification</option>
                  <option value="RFQ Received">RFQ Received</option>
                  <option value="Technical Feasibility">Technical Feasibility</option>
                  <option value="Quotation">Quotation Sent</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Sample Development">Sample Development</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#9E9E9E] uppercase mb-1.5">Pipeline Category</label>
                <select
                  name="pipeline"
                  value={formData.pipeline}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#DDD] rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#2E7D32] outline-none"
                >
                  <option value="New Business">New Business</option>
                  <option value="Repeat Orders">Repeat Orders</option>
                  <option value="Development Projects">Development Projects</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#9E9E9E] uppercase mb-1.5">Urgency Level</label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#DDD] rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#2E7D32] outline-none"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority (ASAP)</option>
                </select>
              </div>
            </div>
          </div>
        </form>

        <footer className="p-6 border-t border-[#E0E0E0] bg-white flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-[#616161] hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-2.5 bg-[#2E7D32] text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#1B5E20] shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            {lead ? 'Update System' : 'Provision Lead'}
          </button>
        </footer>
      </div>
    </div>
  );
}
