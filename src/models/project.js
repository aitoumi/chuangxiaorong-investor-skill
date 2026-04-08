'use strict';

/**
 * Project model with validation and formatting utilities
 */

/**
 * Formats a funding amount into a human-readable Chinese string
 * @param {number} amount - Amount in RMB (yuan)
 * @returns {string} Formatted string (e.g., "2000万元", "1亿元")
 */
function formatFundingAmount(amount) {
  if (!Number.isFinite(amount) || amount < 0) return '未披露';
  if (amount >= 100000000) {
    const yi = (amount / 100000000).toFixed(amount % 100000000 === 0 ? 0 : 1);
    return `${yi}亿元`;
  }
  if (amount >= 10000) {
    const wan = (amount / 10000).toFixed(amount % 10000 === 0 ? 0 : 1);
    return `${wan}万元`;
  }
  return `${amount}元`;
}

/**
 * Validates a project object to ensure required fields are present
 * @param {object} project - Project object to validate
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateProject(project) {
  const errors = [];
  const required = ['id', 'name', 'company', 'industry', 'stage', 'description', 'status'];
  for (const field of required) {
    if (!project[field]) errors.push(`Missing required field: ${field}`);
  }
  if (project.fundingAmount !== undefined && !Number.isFinite(project.fundingAmount)) {
    errors.push('fundingAmount must be a finite number');
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Converts a raw project record into a summary suitable for list views
 * @param {object} project - Full project record
 * @returns {object} Project summary
 */
function toSummary(project) {
  return {
    id: project.id,
    name: project.name,
    company: project.company,
    industry: project.industry,
    stage: project.stage,
    fundingAmount: formatFundingAmount(project.fundingAmount),
    location: project.location,
    tags: project.tags || [],
    status: project.status,
  };
}

/**
 * Converts a raw project record into a detailed view
 * @param {object} project - Full project record
 * @returns {object} Project detail
 */
function toDetail(project) {
  return {
    id: project.id,
    name: project.name,
    company: project.company,
    industry: project.industry,
    stage: project.stage,
    fundingAmount: formatFundingAmount(project.fundingAmount),
    fundingAmountRaw: project.fundingAmount,
    fundingCurrency: project.fundingCurrency || 'RMB',
    description: project.description,
    founded: project.founded,
    location: project.location,
    teamSize: project.teamSize,
    annualRevenue: project.annualRevenue ? formatFundingAmount(project.annualRevenue) : '未披露',
    tags: project.tags || [],
    contact: project.contact,
    status: project.status,
    createdAt: project.createdAt,
  };
}

module.exports = { formatFundingAmount, validateProject, toSummary, toDetail };
