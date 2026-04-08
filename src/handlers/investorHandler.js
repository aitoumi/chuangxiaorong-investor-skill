'use strict';

/**
 * In-memory store for investor interest registrations.
 * In production this would be persisted to a database.
 */
const interestStore = new Map();

/**
 * Registers an investor's interest in a specific project.
 *
 * @param {object} params
 * @param {string} params.projectId    - ID of the project
 * @param {string} params.investorName - Investor's name
 * @param {string} params.investorEmail - Investor's email
 * @param {string} [params.note]       - Optional note from the investor
 * @returns {{ success: boolean, message: string, registrationId: string }}
 */
function registerInterest({ projectId, investorName, investorEmail, note = '' }) {
  const errors = [];
  if (!projectId) errors.push('projectId is required');
  if (!investorName || typeof investorName !== 'string' || !investorName.trim()) {
    errors.push('investorName is required');
  }
  if (!investorEmail || typeof investorEmail !== 'string' || !isValidEmail(investorEmail)) {
    errors.push('a valid investorEmail is required');
  }
  if (errors.length > 0) {
    return { success: false, message: errors.join('; '), registrationId: null };
  }

  const registrationId = `reg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const record = {
    registrationId,
    projectId,
    investorName: investorName.trim(),
    investorEmail: investorEmail.trim().toLowerCase(),
    note: typeof note === 'string' ? note.trim() : '',
    registeredAt: new Date().toISOString(),
  };

  if (!interestStore.has(projectId)) interestStore.set(projectId, []);
  interestStore.get(projectId).push(record);

  return {
    success: true,
    message: `感谢您对项目 ${projectId} 的关注，我们的团队将在1-2个工作日内联系您。`,
    registrationId,
  };
}

/**
 * Returns all interest registrations for a given project (used internally/admin).
 * @param {string} projectId
 * @returns {object[]}
 */
function getInterestsForProject(projectId) {
  return interestStore.get(projectId) || [];
}

/**
 * Basic email format validation using string operations to avoid ReDoS.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  if (typeof email !== 'string' || /\s/.test(email)) return false;
  const atIndex = email.indexOf('@');
  // Must have exactly one '@', not at start or end
  if (atIndex <= 0 || atIndex !== email.lastIndexOf('@')) return false;
  const domain = email.slice(atIndex + 1);
  if (!domain) return false;
  const dotIndex = domain.lastIndexOf('.');
  // Domain must have a dot that is not at start or end
  return dotIndex > 0 && dotIndex < domain.length - 1;
}

module.exports = { registerInterest, getInterestsForProject, isValidEmail };
