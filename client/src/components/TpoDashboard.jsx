import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  AlertTriangle, 
  Download, 
  Search, 
  Filter, 
  Plus, 
  Briefcase, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { api } from '../services/api';

export default function TpoDashboard() {
  const [stats, setStats] = useState(null);
  const [cohort, setCohort] = useState([]);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterMinCgpa, setFilterMinCgpa] = useState('');
  const [filterMinReadiness, setFilterMinReadiness] = useState('');
  
  // Drive Eligibility Modal
  const [selectedDriveId, setSelectedDriveId] = useState('');
  const [driveRoster, setDriveRoster] = useState(null);

  // New Drive Modal
  const [showAddDriveModal, setShowAddDriveModal] = useState(false);
  const [newDriveForm, setNewDriveForm] = useState({
    companyName: '',
    role: '',
    ctcLpa: 12,
    minCgpa: 7.0,
    maxBacklogs: 0,
    jobDescription: '',
    requiredSkills: 'Data Structures & Algorithms, DBMS & SQL',
  });

  useEffect(() => {
    loadTpoData();
  }, []);

  const loadTpoData = async () => {
    try {
      setLoading(true);
      const [statsData, cohortData, drivesData] = await Promise.all([
        api.getTpoStats(),
        api.getCohortStudents(),
        api.getDrives(),
      ]);
      setStats(statsData);
      setCohort(cohortData);
      setDrives(drivesData);
    } catch (err) {
      console.error('Error loading TPO data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async () => {
    const params = {};
    if (filterDept !== 'All') params.department = filterDept;
    if (filterMinCgpa) params.minCgpa = filterMinCgpa;
    if (filterMinReadiness) params.minReadiness = filterMinReadiness;
    if (search) params.search = search;

    const data = await api.getCohortStudents(params);
    setCohort(data);
  };

  const handleInspectDriveRoster = async (driveId) => {
    if (!driveId) {
      setDriveRoster(null);
      return;
    }
    setSelectedDriveId(driveId);
    try {
      const roster = await api.getDriveEligibilityRoster(driveId);
      setDriveRoster(roster);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCsv = (dataToExport, filename) => {
    if (!dataToExport || dataToExport.length === 0) return;
    const headers = ['Roll No', 'Name', 'Department', 'CGPA', 'Backlogs', 'Readiness Score', 'Target Role'];
    const rows = dataToExport.map((s) => [
      s.rollNo,
      `"${s.name}"`,
      s.department,
      s.cgpa,
      s.backlogs,
      `${s.readinessScore}%`,
      `"${s.targetRole || 'SDE'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename || 'candidates'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateDrive = async (e) => {
    e.preventDefault();
    try {
      await api.createDrive({
        ...newDriveForm,
        requiredSkills: newDriveForm.requiredSkills.split(',').map((s) => s.trim()),
      });
      setShowAddDriveModal(false);
      setNewDriveForm({
        companyName: '',
        role: '',
        ctcLpa: 12,
        minCgpa: 7.0,
        maxBacklogs: 0,
        jobDescription: '',
        requiredSkills: 'Data Structures & Algorithms, DBMS & SQL',
      });
      await loadTpoData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Chart data
  const readinessPieData = [
    { name: 'High Readiness (>=75%)', value: stats.readinessBuckets?.high || 0, color: '#10b981' },
    { name: 'Moderate (50-74%)', value: stats.readinessBuckets?.moderate || 0, color: '#f59e0b' },
    { name: 'Needs Attention (<50%)', value: stats.readinessBuckets?.needsImprovement || 0, color: '#f43f5e' },
  ];

  return (
    <div className="space-y-6">
      
      {/* TPO Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border border-emerald-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4" />
              <span>Training & Placement Cell Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Campus Placement & Skill Gap Analytics Dashboard
            </h1>
            <p className="text-slate-400 text-xs mt-1 max-w-2xl">
              Monitor batch readiness indices, campus-wide skill deficits, eligible candidate pools, and company drive compliance.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddDriveModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Announce Placement Drive</span>
            </button>
          </div>
        </div>
      </div>

      {/* High-level TPO Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Cohort Students</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{stats.totalStudents}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">Batch of 2026 Graduating Class</p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Average Placement Readiness</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{stats.averageReadiness}%</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${stats.averageReadiness}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Cohort Mean CGPA</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{stats.averageCgpa}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">Across Engineering Branches</p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Placement Drives</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{stats.activeDrivesCount}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">Upcoming & Open for Applications</p>
        </div>

      </div>

      {/* Analytics Visuals: Campus-wide Missing Skill Trends & Readiness Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Campus-Wide Common Skill Deficits (Training Recommendations) */}
        <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>Campus-Wide Skill Deficits (% Students Lacking Competency)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Key areas requiring urgent faculty bootcamps or industry guest workshops
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.missingSkillCounts} margin={{ top: 10, right: 20, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="skillName" 
                  stroke="#94a3b8" 
                  tick={{ fill: '#cbd5e1', fontSize: 10 }} 
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 10 }} domain={[0, 100]} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="missingPercentage" fill="#f43f5e" radius={[4, 4, 0, 0]} name="% Students Missing" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Readiness Distribution Pie */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2 mb-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>Readiness Segmentation</span>
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Student distribution by recruitment preparedness tier
            </p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={readinessPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {readinessPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs pt-2">
              {readinessPieData.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                    <span className="text-slate-300">{d.name}</span>
                  </div>
                  <span className="font-bold text-white">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Drive Eligibility Quick Match Tool */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <span>Company Drive Candidate Eligibility Roster</span>
            </h3>
            <p className="text-xs text-slate-400">
              Select an upcoming recruitment drive to instantly filter and export students who clear all criteria
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedDriveId}
              onChange={(e) => handleInspectDriveRoster(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- Choose Recruitment Drive --</option>
              {drives.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.companyName} ({d.role} - {d.ctcLpa} LPA)
                </option>
              ))}
            </select>

            {driveRoster && driveRoster.eligibleCount > 0 && (
              <button
                onClick={() => handleExportCsv(driveRoster.eligible.map((e) => e.student), `${driveRoster.drive?.companyName}_Eligible_Candidates`)}
                className="flex items-center space-x-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV ({driveRoster.eligibleCount})</span>
              </button>
            )}
          </div>
        </div>

        {driveRoster && (
          <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs">
              <div>
                <span className="font-bold text-white">{driveRoster.drive?.companyName}</span>
                <span className="text-slate-400 ml-2">({driveRoster.drive?.role})</span>
              </div>
              <div className="space-x-4">
                <span className="text-emerald-400 font-semibold">Eligible: {driveRoster.eligibleCount} candidates</span>
                <span className="text-rose-400">Ineligible: {driveRoster.ineligibleCount} candidates</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3 max-h-48 overflow-y-auto">
              {driveRoster.eligible.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{item.student.name}</span>
                    <span className="text-slate-400 text-[11px]">{item.student.rollNo} • {item.student.department} • CGPA {item.student.cgpa}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold text-[10px] border border-emerald-800">
                    {item.student.readinessScore}% Match
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cohort Candidates Filter & Roster Table */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>Cohort Candidate Shortlisting & Roster</span>
            </h3>
            <p className="text-xs text-slate-400">
              Filter by department, minimum CGPA, or readiness score threshold
            </p>
          </div>

          <button
            onClick={() => handleExportCsv(cohort, 'Filtered_Cohort_Roster')}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Filtered Roster</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Search Name / Roll No</label>
            <input
              type="text"
              placeholder="e.g. Alex, 22CS1045"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Department</label>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="AI & DS">AI & DS</option>
              <option value="ECE">ECE</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Min CGPA</label>
            <input
              type="number"
              step="0.5"
              placeholder="e.g. 7.5"
              value={filterMinCgpa}
              onChange={(e) => setFilterMinCgpa(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Min Readiness %</label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="e.g. 70"
                value={filterMinReadiness}
                onChange={(e) => setFilterMinReadiness(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleApplyFilters}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Cohort Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-4 rounded-l-lg">Roll No</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Dept</th>
                <th className="py-2.5 px-3">CGPA</th>
                <th className="py-2.5 px-3">Backlogs</th>
                <th className="py-2.5 px-3">Target Role</th>
                <th className="py-2.5 px-4 rounded-r-lg">Placement Readiness</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {cohort.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-300">{s.rollNo}</td>
                  <td className="py-3 px-3 font-semibold text-white">{s.name}</td>
                  <td className="py-3 px-3 text-slate-400">{s.department}</td>
                  <td className="py-3 px-3 font-bold text-slate-200">{s.cgpa}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      s.backlogs === 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                    }`}>
                      {s.backlogs}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 truncate max-w-[160px]">{s.targetRole}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${
                        (s.readinessScore || 0) >= 75 ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {s.readinessScore || 65}%
                      </span>
                      <div className="w-16 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            (s.readinessScore || 0) >= 75 ? 'bg-emerald-400' : 'bg-amber-400'
                          }`}
                          style={{ width: `${s.readinessScore || 65}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Drive Modal */}
      {showAddDriveModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-base font-bold text-white">Announce New Campus Placement Drive</h3>
            
            <form onSubmit={handleCreateDrive} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Atlassian, Goldman Sachs"
                  value={newDriveForm.companyName}
                  onChange={(e) => setNewDriveForm({ ...newDriveForm, companyName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SDE-1"
                    value={newDriveForm.role}
                    onChange={(e) => setNewDriveForm({ ...newDriveForm, role: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Package CTC (LPA)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newDriveForm.ctcLpa}
                    onChange={(e) => setNewDriveForm({ ...newDriveForm, ctcLpa: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Min CGPA Required</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newDriveForm.minCgpa}
                    onChange={(e) => setNewDriveForm({ ...newDriveForm, minCgpa: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Max Backlogs Allowed</label>
                  <input
                    type="number"
                    value={newDriveForm.maxBacklogs}
                    onChange={(e) => setNewDriveForm({ ...newDriveForm, maxBacklogs: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={newDriveForm.requiredSkills}
                  onChange={(e) => setNewDriveForm({ ...newDriveForm, requiredSkills: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Brief Job Description</label>
                <textarea
                  rows="2"
                  value={newDriveForm.jobDescription}
                  onChange={(e) => setNewDriveForm({ ...newDriveForm, jobDescription: e.target.value })}
                  placeholder="Key responsibilities and qualifications..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddDriveModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl"
                >
                  Publish Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
