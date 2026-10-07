import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Award, 
  FolderGit2, 
  ArrowRight, 
  Layers, 
  Sparkles,
  Briefcase,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';

export default function StudentDashboard({ student, analysisData, setActiveTab, onOpenProfile }) {
  if (!student || !analysisData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { analysis, jobRole } = analysisData;
  const readiness = analysis?.overallReadiness || student.readinessScore || 70;
  const criticalGaps = analysis?.criticalGaps || [];
  const matchedSkills = analysis?.matchedSkills || [];

  // Radar chart data preparation
  const categoryData = Object.entries(analysis?.categoryBreakdown || {}).map(([cat, stats]) => ({
    subject: cat.replace(' & ', '\n& '),
    acquired: stats.acquired,
    total: stats.total,
    score: Math.round((stats.acquired / (stats.total || 1)) * 100),
  }));

  // Fallback radar data if none populated
  const chartData = categoryData.length > 0 ? categoryData : [
    { subject: 'Core CS', score: 80 },
    { subject: 'Programming', score: 85 },
    { subject: 'Frameworks', score: 65 },
    { subject: 'Database', score: 75 },
    { subject: 'Cloud & Tools', score: 50 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Student Target & Predicted Placement Band */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-800/40 p-6 shadow-xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Target Role Benchmark Analysis</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {jobRole?.roleName}
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              {jobRole?.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenProfile}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors shadow-sm"
            >
              Edit Profile & CGPA
            </button>
            <button
              onClick={() => setActiveTab('analyzer')}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <span>Explore Skill Gaps</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Prediction Tag */}
        <div className="mt-4 pt-4 border-t border-indigo-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Predicted Placement Bracket:</span>
            <span className="font-bold text-amber-300 bg-amber-950/50 px-2.5 py-1 rounded-lg border border-amber-800/60">
              {analysis?.predictedTier}
            </span>
          </div>
          <div className="text-slate-400 flex items-center space-x-4">
            <span>Average CTC: <strong className="text-emerald-400">{jobRole?.averageCtcLpa?.min} - {jobRole?.averageCtcLpa?.max} LPA</strong></span>
            <span>Target Batch: <strong className="text-slate-200">{student.batch}</strong></span>
          </div>
        </div>
      </div>

      {/* Grid of Key Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Placement Readiness Score */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Placement Readiness</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{readiness}%</h3>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              readiness >= 75 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-700/60 h-2 rounded-full mt-4 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${
                readiness >= 75 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-orange-400'
              }`}
              style={{ width: `${readiness}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {readiness >= 75 ? 'Strong placement probability' : 'Bridge critical gaps to cross 75%'}
          </p>
        </div>

        {/* Academic Eligibility */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Academic Record</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{student.cgpa} <span className="text-sm font-normal text-slate-400">CGPA</span></h3>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              analysis?.isAcademicEligible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              <Award className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4 text-xs">
            <span className={`px-2 py-0.5 rounded font-medium ${student.backlogs === 0 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-rose-950 text-rose-400 border border-rose-800/50'}`}>
              {student.backlogs} Backlogs
            </span>
            <span className="text-slate-400">Min CGPA Req: {jobRole?.minCgpa}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 truncate">
            {analysis?.eligibilityNotes}
          </p>
        </div>

        {/* Critical Skill Gaps Count */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Critical Blockers</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{criticalGaps.length}</h3>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              criticalGaps.length === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-1">
            {criticalGaps.length > 0 ? (
              criticalGaps.slice(0, 2).map((g, i) => (
                <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/50 truncate max-w-[120px]">
                  {g.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-emerald-400 font-medium">All critical skills matched!</span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {criticalGaps.length > 0 ? 'Urgent focus for screening rounds' : 'Ready for technical interviews'}
          </p>
        </div>

        {/* Active Campus Drives */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Applied Drives</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{(student.appliedDrives || []).length}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-400">Total Drives in Portal:</span>
            <span className="text-slate-200 font-semibold">5 Active</span>
          </div>
          <button
            onClick={() => setActiveTab('drives')}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center space-x-1 mt-2"
          >
            <span>View drive roster</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Main Content Split: Radar Chart & Critical Gap Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Skill Radar & Category Strength */}
        <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <span>Domain Competency Radar</span>
              </h2>
              <p className="text-xs text-slate-400">
                Evaluating student competencies across core technical domains
              </p>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <span className="flex items-center space-x-1 text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span>Proficiency %</span>
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fill: '#64748b', fontSize: 10 }} />
                <Radar
                  name="Proficiency"
                  dataKey="score"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.45}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Domain Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-700/50">
            {chartData.slice(0, 4).map((item, idx) => (
              <div key={idx} className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block truncate">{item.subject.replace('\n', ' ')}</span>
                <span className="text-sm font-bold text-slate-200">{item.score}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Immediate Actionable Gaps & Recommendations */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>Placement Blockers</span>
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800/50">
                Action Required
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Target companies shortlist candidates based heavily on these competencies:
            </p>

            <div className="space-y-3">
              {criticalGaps.length > 0 ? (
                criticalGaps.map((gap, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-rose-900/40 hover:border-rose-700/60 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-rose-200">{gap.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-400 font-bold">
                        {gap.importance}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                      <span>Category: {gap.category}</span>
                      <span>Target Level: {gap.requiredLevel}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-center">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-emerald-200">No Critical Gaps Found</p>
                  <p className="text-xs text-slate-400 mt-1">You meet all mandatory skill thresholds for this role!</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/60">
            <button
              onClick={() => setActiveTab('roadmap')}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 transition-colors"
            >
              <span>View Step-by-Step Learning Pathway</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Projects & Practical Portfolio Section */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <FolderGit2 className="w-5 h-5 text-teal-400" />
              <span>Project Portfolio & Verified Work</span>
            </h2>
            <p className="text-xs text-slate-400">
              High-impact projects demonstrate problem-solving depth to campus recruiters
            </p>
          </div>
          <button
            onClick={onOpenProfile}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center space-x-1"
          >
            <span>+ Add or Edit Projects</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(student.projects || []).map((proj, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {proj.description || 'Full-stack software engineering project showcasing distributed architecture.'}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(proj.techStack || []).map((tech, tIdx) => (
                  <span key={tIdx} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700/50">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
