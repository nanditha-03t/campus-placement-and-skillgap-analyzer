import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  ExternalLink, 
  Clock, 
  Target, 
  Sparkles,
  CheckSquare,
  Square
} from 'lucide-react';

export default function RoadmapView({ analysisData }) {
  const roadmap = analysisData?.analysis?.personalizedRoadmap || [];
  const targetRole = analysisData?.jobRole?.roleName || 'Target Role';

  // Track checked action items
  const [completedItems, setCompletedItems] = useState({});

  const toggleItem = (phaseIdx, itemIdx) => {
    const key = `${phaseIdx}-${itemIdx}`;
    setCompletedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Calculate overall checklist completion
  const totalTasks = roadmap.reduce((acc, step) => acc + (step.actionItems?.length || 0), 0);
  const doneTasks = Object.values(completedItems).filter(Boolean).length;
  const progressPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Personalized Learning Pathway</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Placement Preparation Roadmap for {targetRole}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Dynamically synthesized roadmap specifically targeted at eliminating your identified skill blockers and maximizing placement test clearance.
            </p>
          </div>

          {/* Progress Tracker */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 min-w-[200px]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Roadmap Progress</span>
              <span className="font-bold text-indigo-400">{progressPct}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1 text-right">
              {doneTasks} of {totalTasks} milestones completed
            </span>
          </div>
        </div>
      </div>

      {/* Roadmap Steps */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-7 before:w-0.5 before:bg-slate-800 before:hidden md:before:block">
        {roadmap.map((step, pIdx) => {
          return (
            <div 
              key={pIdx} 
              className="relative md:pl-16 bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6 shadow-sm hover:border-slate-600/80 transition-all"
            >
              {/* Step indicator node */}
              <div className="hidden md:flex absolute -left-0 top-6 w-8 h-8 rounded-full bg-indigo-600 border-4 border-slate-900 items-center justify-center text-xs font-bold text-white shadow-md">
                {pIdx + 1}
              </div>

              {/* Phase Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-700/50">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white">{step.phase}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      step.priority === 'Urgent' 
                        ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                        : step.priority === 'High'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {step.priority}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-slate-400 mt-1">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{step.timeframe}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Target className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Focus: {(step.focusSkills || []).slice(0, 3).join(', ')}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Items Checklist */}
              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Actionable Milestones:
                </h4>
                <div className="space-y-2">
                  {(step.actionItems || []).map((action, aIdx) => {
                    const isChecked = !!completedItems[`${pIdx}-${aIdx}`];
                    return (
                      <div
                        key={aIdx}
                        onClick={() => toggleItem(pIdx, aIdx)}
                        className={`flex items-start space-x-3 p-3 rounded-xl cursor-pointer transition-colors text-xs ${
                          isChecked 
                            ? 'bg-emerald-950/20 border border-emerald-900/40 text-slate-400 line-through' 
                            : 'bg-slate-900/50 border border-slate-800 text-slate-200 hover:bg-slate-900/80'
                        }`}
                      >
                        <button className="mt-0.5 text-indigo-400 flex-shrink-0">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-500" />
                          )}
                        </button>
                        <span>{action}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Curated Resources */}
              {(step.recommendedResources || []).length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-700/40">
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Curated Learning Links:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {step.recommendedResources.map((res, rIdx) => (
                      <a
                        key={rIdx}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-indigo-500 text-xs text-sky-300 hover:text-white transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{res.title}</span>
                        <span className="text-[10px] text-slate-500 uppercase">({res.type})</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 ml-1" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
