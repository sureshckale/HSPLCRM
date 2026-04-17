/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'sales_rep' | 'manager' | 'admin' | 'top_management' | 'viewer';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export type LeadStatus = 
  | 'New' 
  | 'Qualification' 
  | 'RFQ Received' 
  | 'Technical Feasibility' 
  | 'Quotation' 
  | 'Negotiation' 
  | 'Sample Development' 
  | 'Won' 
  | 'Lost';

export type PipelineType = 
  | 'New Business' 
  | 'Repeat Orders' 
  | 'Development Projects';

export interface Lead {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: LeadStatus;
  pipeline: PipelineType;
  assignedTo: string; // User UID
  value: number;
  drawingNumber: string;
  rfqNumber: string;
  bomReference: string;
  revisionNumber: string;
  connectorType: string;
  wireSpecification: string;
  testingRequirements: string;
  applicationType: string;
  vehicleType: string;
  region: string;
  productInterest: string;
  budgetRange: string;
  urgency: 'Low' | 'Medium' | 'High';
  isOem: boolean;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
}

export interface Activity {
  id: string;
  leadId: string;
  type: 'Call' | 'Meeting' | 'Email' | 'Note';
  content: string;
  createdBy: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  leadId: string;
  userId: string;
  dueDate: string;
  type: string;
  status: 'Pending' | 'Completed';
  message: string;
}
