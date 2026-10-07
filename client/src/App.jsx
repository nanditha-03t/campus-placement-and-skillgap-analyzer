import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StudentDashboard from './components/StudentDashboard';
import SkillGapAnalyzer from './components/SkillGapAnalyzer';
import RoadmapView from './components/RoadmapView';
import MockAssessments from './components/MockAssessments';
import DrivesView from './components/DrivesView';
import TpoDashboard from './components/TpoDashboard';
import ProfileModal from './components/ProfileModal';
import { api } from './services/api';


export default function App() {
  const [activePortal, setActivePortal] = useState('student'); // 'student' | 'tpo'
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'analyzer' | 'roadmap' | 'assessments' | 'drives'
  
  const [student, setStudent] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('Software Development Engineer (SDE)');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      setLoading(true);
      const [studentData, rolesData] = await Promise.all([
        api.getStudentProfile(),
        api.getJobRoles(),
      ]);

      setStudent(studentData);
      setRoles(rolesData);

      const targetRoleName = studentData?.targetRole || 'Software Development Engineer (SDE)';
      setSelectedRole(targetRoleName);

      const gapData = await api.getSkillGapAnalysis(targetRoleName);
      setAnalysisData(gapData);
    } catch (err) {
      console.error('Initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (newRoleName) => {
    setSelectedRole(newRoleName);
    try {
      const gapData = await api.getSkillGapAnalysis(newRoleName);
      setAnalysisData(gapData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefreshData = async () => {
    try {
      const studentData = await api.getStudentProfile();
      setStudent(studentData);
      const gapData = await api.getSkillGapAnalysis(selectedRole);
      setAnalysisData(gapData);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activePortal={activePortal}
        setActivePortal={setActivePortal}
        student={student}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400 font-medium tracking-wide">
              Initializing Campus Placement Intelligence Engine...
            </p>
          </div>
        ) : activePortal === 'student' ? (
          <div>
            {activeTab === 'overview' && (
              <StudentDashboard
                student={student}
                analysisData={analysisData}
                setActiveTab={setActiveTab}
                onOpenProfile={() => setIsProfileModalOpen(true)}
              />
            )}

            {activeTab === 'analyzer' && (
              <SkillGapAnalyzer
                student={student}
                roles={roles}
                selectedRole={selectedRole}
                onSelectRole={handleRoleChange}
                analysisData={analysisData}
                onRefreshData={handleRefreshData}
              />
            )}

            {activeTab === 'roadmap' && (
              <RoadmapView analysisData={analysisData} />
            )}

            {activeTab === 'assessments' && (
              <MockAssessments onAssessmentCompleted={handleRefreshData} />
            )}

            {activeTab === 'drives' && (
              <DrivesView onDriveApplied={handleRefreshData} />
            )}
          </div>
        ) : (
          <TpoDashboard />
        )}
      </main>

      {/* Profile Edit Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        student={student}
        roles={roles}
        onProfileUpdated={handleRefreshData}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-300">CampusPlacement & SkillGap Analyzer</span>
            <span>• Full-Stack MERN System</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-emerald-400 font-medium">● System Status: Online</span>
            <span className="text-slate-400">Node.js + Express + MongoDB + React</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
