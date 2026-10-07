import React, { useState } from 'react';
import { X, User, GraduationCap, Award, Link2 } from 'lucide-react';
import { api } from '../services/api';

export default function ProfileModal({ isOpen, onClose, student, roles, onProfileUpdated }) {
  if (!isOpen || !student) return null;

  const [formData, setFormData] = useState({
    name: student.name || '',
    department: student.department || 'CSE',
    cgpa: student.cgpa || 8.0,
    backlogs: student.backlogs || 0,
    targetRole: student.targetRole || 'Software Development Engineer (SDE)',
    githubProfile: student.githubProfile || '',
    leetcodeProfile: student.leetcodeProfile || '',
    linkedinProfile: student.linkedinProfile || '',
    resumeUploaded: student.resumeUploaded || false,
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateStudentProfile(formData);
      await onProfileUpdated();
      onClose();
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <User className="w-4 h-4" />
          <span>Student Information</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-4">Edit Profile & Academic Records</h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="AI & DS">AI & DS</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Placement Role</label>
              <select
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                {(roles || []).map((r, i) => (
                  <option key={i} value={r.roleName}>
                    {r.roleName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Current Cumulative CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Active Backlogs Count</label>
              <input
                type="number"
                min="0"
                value={formData.backlogs}
                onChange={(e) => setFormData({ ...formData, backlogs: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <label className="block text-slate-300 font-medium">Coding & Portfolio Profiles</label>
            <input
              type="text"
              placeholder="LeetCode Profile URL"
              value={formData.leetcodeProfile}
              onChange={(e) => setFormData({ ...formData, leetcodeProfile: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="GitHub Profile URL"
              value={formData.githubProfile}
              onChange={(e) => setFormData({ ...formData, githubProfile: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={formData.resumeUploaded}
                onChange={(e) => setFormData({ ...formData, resumeUploaded: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-0"
              />
              <span>Resume PDF Uploaded & Verified</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md transition-colors"
            >
              {saving ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
