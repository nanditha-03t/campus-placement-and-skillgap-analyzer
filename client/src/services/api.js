const BASE_URL = '/api';

export const api = {
  // Health
  checkHealth: async () => {
    const res = await fetch(`${BASE_URL}/health`);
    return res.json();
  },

  // Student Profile
  getStudentProfile: async () => {
    const res = await fetch(`${BASE_URL}/students/profile`);
    return res.json();
  },

  updateStudentProfile: async (data) => {
    const res = await fetch(`${BASE_URL}/students/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  addOrUpdateSkill: async (skillData) => {
    const res = await fetch(`${BASE_URL}/students/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skillData),
    });
    return res.json();
  },

  deleteSkill: async (skillName) => {
    const res = await fetch(`${BASE_URL}/students/skills/${encodeURIComponent(skillName)}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  addProject: async (projectData) => {
    const res = await fetch(`${BASE_URL}/students/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });
    return res.json();
  },

  // Skill Gap Analysis
  getJobRoles: async () => {
    const res = await fetch(`${BASE_URL}/analysis/roles`);
    return res.json();
  },

  getSkillGapAnalysis: async (roleName = '') => {
    const query = roleName ? `?roleName=${encodeURIComponent(roleName)}` : '';
    const res = await fetch(`${BASE_URL}/analysis/gap${query}`);
    return res.json();
  },

  simulateSkillAnalysis: async (payload) => {
    const res = await fetch(`${BASE_URL}/analysis/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Drives
  getDrives: async () => {
    const res = await fetch(`${BASE_URL}/drives`);
    return res.json();
  },

  applyForDrive: async (driveId) => {
    const res = await fetch(`${BASE_URL}/drives/${driveId}/apply`, {
      method: 'POST',
    });
    return res.json();
  },

  createDrive: async (driveData) => {
    const res = await fetch(`${BASE_URL}/drives`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(driveData),
    });
    return res.json();
  },

  // Assessments
  getAssessments: async () => {
    const res = await fetch(`${BASE_URL}/assessments`);
    return res.json();
  },

  getAssessmentDetails: async (id) => {
    const res = await fetch(`${BASE_URL}/assessments/${id}`);
    return res.json();
  },

  submitAssessment: async (id, answers) => {
    const res = await fetch(`${BASE_URL}/assessments/${id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    return res.json();
  },

  // TPO
  getTpoStats: async () => {
    const res = await fetch(`${BASE_URL}/tpo/stats`);
    return res.json();
  },

  getCohortStudents: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/tpo/cohort${query ? `?${query}` : ''}`);
    return res.json();
  },

  getDriveEligibilityRoster: async (driveId) => {
    const res = await fetch(`${BASE_URL}/tpo/drive-eligibility/${driveId}`);
    return res.json();
  },
};
