import React, { useEffect, useState } from 'react';
import { FollowUpTask } from '../../types/database.types';
import { crmService } from '../../services/crmService';
import { Clock, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { CRMNavigationHeader } from './LeadsCRM';

export const FollowUps: React.FC = () => {
  const [tasks, setTasks] = useState<FollowUpTask[]>([]);

  useEffect(() => {
    crmService.getFollowUps().then(setTasks);
  }, []);

  const handleToggle = async (taskId: string) => {
    const updated = await crmService.toggleFollowUpTask(taskId);
    setTasks(tasks.map(t => t.id === taskId ? updated : t));
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* CRM UNIFIED SUB-NAVIGATION HEADER */}
      <CRMNavigationHeader />

      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white">Automated Follow-up Sequences</h2>
        <p className="text-slate-400 text-xs mt-1">Review scheduled sales outreach tasks, calls, and email follow-ups.</p>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => {
          const isDone = task.status === 'COMPLETED';
          return (
            <div key={task.id} className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={() => handleToggle(task.id)}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                    isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-700 text-transparent hover:border-brand-500'
                  }`}
                >
                  ✓
                </button>
                <div>
                  <h4 className={`text-sm font-bold ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                    {task.title}
                  </h4>
                  <div className="text-xs text-slate-400 mt-0.5">Lead: {task.lead_name} • Assigned: {task.assigned_to}</div>
                </div>
              </div>
              <div className="text-xs font-semibold text-rose-400 pl-9 sm:pl-0 font-mono">
                Due: {new Date(task.due_date).toLocaleDateString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
