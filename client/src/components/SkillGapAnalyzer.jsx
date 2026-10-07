import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertOctagon, 
  Sparkles, 
  Plus, 
  Trash2, 
  Sliders, 
  Layers, 
  Search,
  Check,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { api } from '../services/api';

export default function SkillGapAnalyzer({ 
  student, 
  roles, 
  selectedRole, 
  onSelectRole, 
  analysisData, 
  onRefreshData 
}) {
  const [activeSubTab, setActiveSubTab] = useState('breakdown'); // 'breakdown' | 'manage' | 'simulator'
  
  // Skill Add/Edit State
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Programming');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Simulator State
  const [simulatedSkills, setSimulatedSkills] = useState([]);
  const [simulatedCgpa, setSimulatedCgpa] = useState(student?.cgpa || 8.0);
  const [simulatedResult, setSimulatedResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const analysis = analysisData?.analysis;
  const matchedSkills = analysis?.matchedSkills || [];
  const criticalGaps = analysis?.criticalGaps || [];
  const recommendedGaps = analysis?.recommendedGaps || [];
  const bonusGaps = analysis?.bonusGaps || [];

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    setIsSubmitting(true);
    try {
      await api.addOrUpdateSkill({
        name: newSkillName.trim(),
        category: newSkillCategory,
        level: newSkillLevel,
      });
      setMessage({ type: 'success', text: `Skill "${newSkillName}" updated successfully!` });
      setNewSkillName('');
      await onRefreshData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update skill' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(null), 3500);
    }
  };

  const handleDeleteSkill = async (skillName) => {
    try {
      await api.deleteSkill(skillName);
      await onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Run What-If Simulation
  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const allSimSkills = [
        ...(student?.technicalSkills || []).map((s) => s.name),
        ...simulatedSkills,
      ];
      const result = await api.simulateSkillAnalysis({
        roleName: selectedRole,
        skills: allSimSkills,
        cgpa: simulatedCgpa,
      });
      setSimulatedResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const toggleSimSkill = (skillName) => {
    if (simulatedSkills.includes(skillName)) {
      setSimulatedSkills(simulatedSkills.filter((s) => s !== skillName));
    } else {
      setSimulatedSkills([...simulatedSkills, skillName]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Role Selector & Top Navigation */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Skill Gap & Competency Engine</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select an industry target benchmark to evaluate matched skills vs missing competencies
            </p>
          </div>

          {/* Role Dropdown */}
          <div className="flex items-center space-x-3">
            <label className="text-xs font-semibold text-slate-300">Target Benchmark:</label>
            <select
              value={selectedRole}
              onChange={(e) => onSelectRole(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white text-xs font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {roles.map((r, idx) => (
                <option key={idx} value={r.roleName}>
                  {r.roleName} ({r.tier.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sub-tabs within Analyzer */}
        <div className="flex space-x-2 mt-6 border-t border-slate-700/60 pt-4 text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('breakdown')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'breakdown'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-900/40'
            }`}
          >
            Skill Match & Gap Breakdown
          </button>
          <button
            onClick={() => setActiveSubTab('manage')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'manage'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-900/40'
            }`}
          >
            My Skill Inventory (Add/Edit)
          </button>
          <button
            onClick={() => setActiveSubTab('simulator')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'simulator'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-900/40'
            }`}
          >
            What-If Simulator
          </button>
        </div>
      </div>

      {/* Message Banner */}
      {message && (
        <div className={`p-3 rounded-xl text-xs font-medium ${
          message.type === 'success' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' : 'bg-rose-950/80 text-rose-300 border border-rose-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* TAB 1: BREAKDOWN */}
      {activeSubTab === 'breakdown' && (
        <div className="space-y-6">
          
          {/* Quick Metrics Header */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-4">
              <span className="text-xs font-medium text-emerald-400 block uppercase">Acquired Skills</span>
              <span className="text-2xl font-black text-emerald-200 mt-1 block">{matchedSkills.length}</span>
              <span className="text-[11px] text-slate-400">Match target industry threshold</span>
            </div>

            <div className="bg-rose-950/30 border border-rose-800/40 rounded-xl p-4">
              <span className="text-xs font-medium text-rose-400 block uppercase">Critical Skill Gaps</span>
              <span className="text-2xl font-black text-rose-200 mt-1 block">{criticalGaps.length}</span>
              <span className="text-[11px] text-slate-400">Essential for passing campus screening</span>
            </div>

            <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4">
              <span className="text-xs font-medium text-amber-400 block uppercase">Recommended Next Steps</span>
              <span className="text-2xl font-black text-amber-200 mt-1 block">{recommendedGaps.length + bonusGaps.length}</span>
              <span className="text-[11px] text-slate-400">Provide competitive edge in interviews</span>
            </div>
          </div>

          {/* Section: Critical Gaps */}
          {criticalGaps.length > 0 && (
            <div className="bg-slate-800/60 border border-rose-900/40 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-rose-400 flex items-center space-x-2 mb-3">
                <AlertOctagon className="w-4 h-4" />
                <span>Critical Missing Competencies (Highest Priority)</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Recruiters require proficiency in these foundational skills. Prioritize these in your weekly prep:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {criticalGaps.map((gap, i) => (
                  <div key={i} className="p-3.5 bg-slate-900/70 border border-rose-900/50 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-rose-200">{gap.name}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800/60">
                          {gap.importance}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 mt-1 block">
                        Category: {gap.category} • Required Level: {gap.requiredLevel}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-400">~{gap.estimatedHoursToLearn} hrs</span>
                      <span className="text-[10px] text-slate-500 block">Est. Prep Time</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Recommended Gaps */}
          {recommendedGaps.length > 0 && (
            <div className="bg-slate-800/60 border border-amber-900/40 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-amber-400 flex items-center space-x-2 mb-3">
                <Sliders className="w-4 h-4" />
                <span>Recommended Technical Skills</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {recommendedGaps.map((gap, i) => (
                  <div key={i} className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl">
                    <span className="text-sm font-semibold text-slate-200 block">{gap.name}</span>
                    <div className="flex justify-between items-center mt-2 text-xs text-slate-400">
                      <span>{gap.category}</span>
                      <span className="text-amber-400 text-[11px] font-medium">{gap.requiredLevel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Acquired & Matched Skills */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center space-x-2 mb-4">
              <CheckCircle2 className="w-4 h-4" />
              <span>Acquired & Verified Competencies</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-2.5 px-4 rounded-l-lg">Skill Name</th>
                    <th className="py-2.5 px-3">Domain</th>
                    <th className="py-2.5 px-3">Your Level</th>
                    <th className="py-2.5 px-3">Target Req</th>
                    <th className="py-2.5 px-3">Rating Score</th>
                    <th className="py-2.5 px-4 rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {matchedSkills.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white flex items-center space-x-2">
                        <span>{s.name}</span>
                        {s.verified && (
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800/60">
                            Verified
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-400">{s.category}</td>
                      <td className="py-3 px-3 font-medium text-slate-200">{s.studentLevel}</td>
                      <td className="py-3 px-3 text-slate-400">{s.requiredLevel}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-200">{s.score}%</span>
                          <div className="w-16 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${s.score}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.status === 'Proficient' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MY SKILL INVENTORY (ADD / EDIT) */}
      {activeSubTab === 'manage' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Add Skill Form */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 mb-3">
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Add / Update Technical Skill</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Add languages, frameworks, or databases you have learned to reflect in your placement readiness.
            </p>

            <form onSubmit={handleAddSkill} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Skill Name</label>
                <input
                  type="text"
                  placeholder="e.g. Docker, Python, System Design"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Category</label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Programming">Programming Languages</option>
                  <option value="Frameworks">Frameworks & Libraries</option>
                  <option value="Core CS">Core CS (DSA, OS, DBMS)</option>
                  <option value="Database">Database & Storage</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Tools">Developer Tools</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Proficiency Level</label>
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Beginner">Beginner (Basic understanding)</option>
                  <option value="Intermediate">Intermediate (Project experience)</option>
                  <option value="Advanced">Advanced (Deep theoretical & production)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !newSkillName.trim()}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors shadow-md shadow-indigo-600/30"
              >
                {isSubmitting ? 'Saving...' : 'Add / Update Skill'}
              </button>
            </form>
          </div>

          {/* Current Skills List */}
          <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 mb-3">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Current Profile Skills ({(student?.technicalSkills || []).length})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {(student?.technicalSkills || []).map((skill, idx) => (
                <div key={idx} className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">{skill.name}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {skill.category} • <strong className="text-indigo-400">{skill.level}</strong> ({skill.score}%)
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteSkill(skill.name)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-950/40"
                    title="Remove skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: WHAT-IF SIMULATOR */}
      {activeSubTab === 'simulator' && (
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>What-If Placement Readiness Simulator</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Test what happens to your placement readiness score and tier probability if you acquire new skills or increase your CGPA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Input Options */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Simulated CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  min="5.0"
                  max="10.0"
                  value={simulatedCgpa}
                  onChange={(e) => setSimulatedCgpa(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-2">Simulate Learning Missing Skills:</label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {[...criticalGaps, ...recommendedGaps].map((gap, i) => (
                    <label key={i} className="flex items-center space-x-2 p-2 rounded-lg bg-slate-900/50 border border-slate-800 cursor-pointer hover:border-slate-700">
                      <input
                        type="checkbox"
                        checked={simulatedSkills.includes(gap.name)}
                        onChange={() => toggleSimSkill(gap.name)}
                        className="rounded text-indigo-600 focus:ring-0"
                      />
                      <span className="text-slate-200 text-xs font-medium">{gap.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold rounded-xl shadow-lg transition-all"
              >
                {isSimulating ? 'Simulating...' : 'Recalculate Probability'}
              </button>
            </div>

            {/* Simulation Results Display */}
            <div className="md:col-span-2 bg-slate-900/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-center">
              {simulatedResult ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block uppercase">Projected Readiness</span>
                      <span className="text-4xl font-extrabold text-white mt-1 block">
                        {simulatedResult.overallReadiness}%
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block uppercase">Projected Tier</span>
                      <span className="text-sm font-bold text-amber-300 bg-amber-950/60 px-3 py-1 rounded-lg border border-amber-800/60 block mt-1">
                        {simulatedResult.predictedTier}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-300 h-full rounded-full transition-all duration-500"
                      style={{ width: `${simulatedResult.overallReadiness}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                    <div className="p-3 bg-slate-800/60 rounded-lg">
                      <span className="text-slate-400">Remaining Critical Gaps:</span>
                      <span className="text-sm font-bold text-rose-300 block mt-0.5">{simulatedResult.criticalGaps.length}</span>
                    </div>
                    <div className="p-3 bg-slate-800/60 rounded-lg">
                      <span className="text-slate-400">Skill Match Score:</span>
                      <span className="text-sm font-bold text-emerald-300 block mt-0.5">{simulatedResult.skillMatchPercentage}%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Select simulated skills on the left and click <strong>"Recalculate Probability"</strong> to test scenario outcomes.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
