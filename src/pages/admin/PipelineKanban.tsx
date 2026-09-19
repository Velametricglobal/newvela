import React, { useEffect, useState } from 'react';
import { Deal, PipelineStage, LeadStatus } from '../../types/database.types';
import { crmService } from '../../services/crmService';
import { GitPullRequest, DollarSign, Calendar, User, ArrowRight } from 'lucide-react';
import { CRMNavigationHeader } from './LeadsCRM';

import { useCurrency } from '../../context/CurrencyContext';

export const PipelineKanban: React.FC = () => {
  const { formatAmount } = useCurrency();
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    crmService.getStages().then(setStages);
    crmService.getDeals().then(setDeals);
  }, []);

  const handleStageMove = async (dealId: string, newStageName: LeadStatus) => {
    const updated = await crmService.updateDealStage(dealId, newStageName);
    setDeals(deals.map(d => d.id === dealId ? updated : d));
  };

  const totalPipelineValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);

  return (
    <div className="space-y-6">
      {/* CRM UNIFIED SUB-NAVIGATION HEADER */}
      <CRMNavigationHeader />

      {/* Kanban Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white">Sales Pipeline Kanban Board</h2>
          <p className="text-slate-400 text-xs mt-1">Track active opportunities, deal values, and stage transitions.</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-left sm:text-right w-full sm:w-auto flex sm:block justify-between items-center">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Pipeline Value</div>
          <div className="text-lg font-black text-brand-400">{formatAmount(totalPipelineValue)}</div>
        </div>
      </div>

      {/* Mobile Stage Quick-Jump Selector Pills */}
      <div className="flex sm:hidden items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {stages.map((stg) => (
          <button
            key={stg.id}
            onClick={() => {
              const el = document.getElementById(`kanban-col-${stg.name}`);
              el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-slate-900 border border-slate-800 text-slate-300 shrink-0 whitespace-nowrap active:bg-slate-800"
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stg.color }} />
            <span>{stg.label}</span>
          </button>
        ))}
      </div>

      {/* Kanban Columns */}
      <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth">
        {stages.map((stg) => {
          const stageDeals = deals.filter(d => d.stage_name === stg.name);
          const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div
              key={stg.id}
              id={`kanban-col-${stg.name}`}
              className="w-[85vw] sm:w-80 shrink-0 snap-center bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col max-h-[75vh]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stg.color }} />
                  <span className="text-xs font-bold text-white">{stg.label}</span>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {stageDeals.length}
                </span>
              </div>
              <div className="text-[11px] font-semibold text-slate-400 mb-4">{formatAmount(stageValue)}</div>

              {/* Deal Cards */}
              <div className="flex-1 overflow-y-auto space-y-3">
                {stageDeals.map((deal) => (
                  <div key={deal.id} className="bg-slate-900 border border-slate-800 hover:border-brand-500/50 p-4 rounded-xl shadow space-y-3">
                    <h4 className="text-xs font-bold text-white">{deal.title}</h4>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-brand-400">{formatAmount(deal.value)}</span>
                      <span className="text-[10px] text-slate-400">{deal.assigned_to}</span>
                    </div>

                    {/* Move Stage Selector */}
                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                      <span className="text-[10px] text-slate-500">Move to:</span>
                      <select
                        value={deal.stage_name}
                        onChange={(e) => handleStageMove(deal.id, e.target.value as LeadStatus)}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-[10px] text-slate-300"
                      >
                        {stages.map(s => (
                          <option key={s.id} value={s.name}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
