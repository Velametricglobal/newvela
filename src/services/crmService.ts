import { PipelineStage, Deal, FollowUpTask, LeadStatus } from '../types/database.types';

let localStages: PipelineStage[] = [
  { id: 'stg-1', name: 'NEW', label: 'New Inquiries', sort_order: 1, color: '#3b82f6' },
  { id: 'stg-2', name: 'CONTACTED', label: 'Contacted', sort_order: 2, color: '#8b5cf6' },
  { id: 'stg-3', name: 'QUALIFIED', label: 'Qualified', sort_order: 3, color: '#06b6d4' },
  { id: 'stg-4', name: 'MEETING', label: 'Meeting Scheduled', sort_order: 4, color: '#f59e0b' },
  { id: 'stg-5', name: 'PROPOSAL', label: 'Proposal Sent', sort_order: 5, color: '#ec4899' },
  { id: 'stg-6', name: 'NEGOTIATION', label: 'In Negotiation', sort_order: 6, color: '#eab308' },
  { id: 'stg-7', name: 'WON', label: 'Closed Won', sort_order: 7, color: '#10b981' },
  { id: 'stg-8', name: 'LOST', label: 'Closed Lost', sort_order: 8, color: '#ef4444' }
];

let localDeals: Deal[] = [
  {
    id: 'deal-1',
    title: 'Nexus Group — Web App Platform Rebuild',
    lead_id: 'lead-101',
    lead_name: 'Alexander Wright (Nexus Group)',
    stage_id: 'stg-3',
    stage_name: 'QUALIFIED',
    value: 45000,
    expected_close_date: '2026-09-30',
    assigned_to: 'David Vance',
    status: 'OPEN',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'deal-2',
    title: 'Apogee Health — Subsidy Loan Advisory',
    lead_id: 'lead-102',
    lead_name: 'Elena Rostova (Apogee Health)',
    stage_id: 'stg-5',
    stage_name: 'PROPOSAL',
    value: 35000,
    expected_close_date: '2026-09-15',
    assigned_to: 'Sarah Connor',
    status: 'OPEN',
    created_at: new Date(Date.now() - 86400000 * 8).toISOString()
  },
  {
    id: 'deal-3',
    title: 'Vanguard Labs — Digital Growth retainer',
    lead_id: 'lead-103',
    lead_name: 'Marcus Sterling (Vanguard Labs)',
    stage_id: 'stg-1',
    stage_name: 'NEW',
    value: 18000,
    expected_close_date: '2026-10-15',
    assigned_to: 'Unassigned',
    status: 'OPEN',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

let localFollowUps: FollowUpTask[] = [
  {
    id: 'fup-1',
    lead_id: 'lead-101',
    lead_name: 'Alexander Wright',
    contact_name: 'Alexander Wright',
    type: 'EMAIL',
    title: 'Send Follow-up Email: Architecture Spec Confirmation',
    due_date: new Date(Date.now() + 86400000 * 1).toISOString(),
    assigned_to: 'David Vance',
    status: 'PENDING'
  },
  {
    id: 'fup-2',
    lead_id: 'lead-102',
    lead_name: 'Elena Rostova',
    contact_name: 'Elena Rostova',
    type: 'CALL',
    title: 'Call Client: Proposal #PROP-2026-004 Review',
    due_date: new Date(Date.now() - 3600000 * 4).toISOString(), // Overdue
    assigned_to: 'Sarah Connor',
    status: 'PENDING'
  }
];

export const crmService = {
  async getStages(): Promise<PipelineStage[]> {
    return [...localStages];
  },

  async getDeals(): Promise<Deal[]> {
    return [...localDeals];
  },

  async updateDealStage(dealId: string, newStageName: LeadStatus): Promise<Deal> {
    const dealIdx = localDeals.findIndex(d => d.id === dealId);
    if (dealIdx === -1) throw new Error('Deal not found');

    const stageObj = localStages.find(s => s.name === newStageName);
    localDeals[dealIdx].stage_name = newStageName;
    if (stageObj) localDeals[dealIdx].stage_id = stageObj.id;

    if (newStageName === 'WON') localDeals[dealIdx].status = 'WON';
    else if (newStageName === 'LOST') localDeals[dealIdx].status = 'LOST';

    return JSON.parse(JSON.stringify(localDeals[dealIdx]));
  },

  async getFollowUps(): Promise<FollowUpTask[]> {
    return [...localFollowUps];
  },

  async toggleFollowUpTask(taskId: string): Promise<FollowUpTask> {
    const idx = localFollowUps.findIndex(t => t.id === taskId);
    if (idx === -1) throw new Error('Task not found');

    const isDone = localFollowUps[idx].status === 'COMPLETED';
    localFollowUps[idx].status = isDone ? 'PENDING' : 'COMPLETED';
    localFollowUps[idx].completed_at = isDone ? undefined : new Date().toISOString();

    return JSON.parse(JSON.stringify(localFollowUps[idx]));
  }
};
