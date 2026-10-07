import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  Filter, 
  Sparkles 
} from 'lucide-react';
import { api } from '../services/api';

export default function DrivesView({ onDriveApplied }) {
  const [drives, setDrives] = useState([]);
  const [filterEligibleOnly, setFilterEligibleOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    loadDrives();
  }, []);

  const loadDrives = async () => {
    try {
      setLoading(true);
      const data = await api.getDrives();
      setDrives(data);
    } catch (err) {
      console.error('Error fetching drives:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (driveId, companyName) => {
    try {
      const res = await api.applyForDrive(driveId);
      setActionMessage({ type: 'success', text: res.message || `Successfully registered for ${companyName}!` });
      await loadDrives();
      if (onDriveApplied) onDriveApplied();
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Application failed. Verify eligibility criteria.' });
    } finally {
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  const displayedDrives = filterEligibleOnly ? drives.filter((d) => d.isEligible) : drives;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Campus Recruitment Drives</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Upcoming Company Placement Drives & Eligibility Status
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Automatic qualification evaluation against company criteria (CGPA, active backlogs, department, and mandatory skills).
            </p>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <button
              onClick={() => setFilterEligibleOnly(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                !filterEligibleOnly ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Drives ({drives.length})
            </button>
            <button
              onClick={() => setFilterEligibleOnly(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterEligibleOnly ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Eligible Only ({drives.filter((d) => d.isEligible).length})
            </button>
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {actionMessage && (
        <div className={`p-3.5 rounded-xl text-xs font-semibold ${
          actionMessage.type === 'success' 
            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' 
            : 'bg-rose-950/80 text-rose-300 border border-rose-800'
        }`}>
          {actionMessage.text}
        </div>
      )}

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedDrives.map((drive) => {
          const driveDateStr = new Date(drive.driveDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return (
            <div
              key={drive._id}
              className={`bg-slate-800/60 border rounded-2xl p-6 flex flex-col justify-between shadow-sm transition-all ${
                drive.isEligible ? 'border-slate-700/60 hover:border-indigo-500/50' : 'border-rose-950/40 bg-slate-900/30'
              }`}
            >
              <div>
                {/* Header: Company & CTC */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">{drive.companyName}</h3>
                    <p className="text-xs font-medium text-indigo-400 mt-0.5">{drive.role}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-emerald-400">{drive.ctcLpa} LPA</span>
                    <span className="text-[10px] text-slate-500 block">Package CTC</span>
                  </div>
                </div>

                {/* Drive Meta */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-3 pb-3 border-b border-slate-700/50">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{driveDateStr}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{drive.location}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>{drive.applicantCount} Registered</span>
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {drive.jobDescription}
                </p>

                {/* Eligibility Criteria Box */}
                <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Recruiter Criteria:
                  </span>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Min CGPA: <strong>{drive.criteria.minCgpa}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Max Backlogs: <strong>{drive.criteria.maxBacklogs}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Branches: {drive.criteria.allowedBranches?.join(', ')}
                    </span>
                  </div>
                </div>

                {/* Required Skills Badges */}
                {(drive.criteria.requiredSkills || []).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {drive.criteria.requiredSkills.map((sk, sIdx) => (
                      <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                        {sk}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer: Eligibility Status & Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between">
                <div>
                  {drive.isEligible ? (
                    <span className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Eligible for this drive</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1.5 text-xs text-rose-400 font-semibold" title={drive.eligibilityReasons?.join(', ')}>
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>Ineligible (Criteria unmet)</span>
                    </span>
                  )}
                </div>

                {drive.isRegistered ? (
                  <span className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-700">
                    Registered ✓
                  </span>
                ) : (
                  <button
                    onClick={() => handleApply(drive._id, drive.companyName)}
                    disabled={!drive.isEligible}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
                  >
                    Apply Now
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
