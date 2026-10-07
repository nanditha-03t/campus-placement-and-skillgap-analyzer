import React from 'react';
import { 
  GraduationCap, 
  Building2, 
  User, 
  CheckCircle2, 
  TrendingUp, 
  BookOpen, 
  Award, 
  Briefcase 
} from 'lucide-react';

export default function Navbar({ activePortal, setActivePortal, student, activeTab, setActiveTab }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Project Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 via-sky-300 to-teal-300 bg-clip-text text-transparent">
                CampusPlacement & SkillGap
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800/60">
                AI Readiness Analyzer
              </span>
            </div>
          </div>

          {/* Dual Portal Switcher */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActivePortal('student')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePortal === 'student'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student Portal</span>
            </button>
            <button
              onClick={() => setActivePortal('tpo')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePortal === 'tpo'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>TPO / Officer Portal</span>
            </button>
          </div>

          {/* User Context Info */}
          <div className="hidden md:flex items-center space-x-3 text-xs">
            {activePortal === 'student' && student ? (
              <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="font-semibold text-slate-200">{student.name}</span>
                <span className="text-slate-400">({student.department} • CGPA {student.cgpa})</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/50 text-emerald-300">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-medium">TPO Admin View (Dr. Rajesh Sharma)</span>
              </div>
            )}
          </div>

        </div>

        {/* Sub-navigation tabs for Student Portal */}
        {activePortal === 'student' && (
          <div className="flex space-x-1 sm:space-x-4 border-t border-slate-800/80 py-2 overflow-x-auto scrollbar-none text-xs sm:text-sm">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Placement Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('analyzer')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'analyzer'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Skill Gap Analyzer</span>
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'roadmap'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Learning Roadmap</span>
            </button>

            <button
              onClick={() => setActiveTab('assessments')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'assessments'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Mock Assessments</span>
            </button>

            <button
              onClick={() => setActiveTab('drives')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'drives'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Campus Drives</span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
}
