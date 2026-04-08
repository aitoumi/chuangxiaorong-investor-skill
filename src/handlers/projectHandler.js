'use strict';

const { projects } = require('../data/mockData');
const { toSummary, toDetail } = require('../models/project');

/**
 * Returns all active projects, with optional filtering.
 *
 * Supported query parameters (all optional):
 *   - industry   {string}  Filter by industry name (exact match, case-insensitive)
 *   - stage      {string}  Filter by funding stage (exact match, case-insensitive)
 *   - location   {string}  Filter by city/province (substring match, case-insensitive)
 *   - tag        {string}  Filter by tag (substring match, case-insensitive)
 *   - minAmount  {number}  Minimum funding amount (RMB yuan)
 *   - maxAmount  {number}  Maximum funding amount (RMB yuan)
 *   - page       {number}  Page number (1-based, default 1)
 *   - pageSize   {number}  Results per page (default 10, max 50)
 *
 * @param {object} filters
 * @returns {{ total: number, page: number, pageSize: number, projects: object[] }}
 */
function searchProjects(filters = {}) {
  const {
    industry,
    stage,
    location,
    tag,
    minAmount,
    maxAmount,
    page = 1,
    pageSize = 10,
  } = filters;

  let results = projects.filter((p) => p.status === 'active');

  if (industry) {
    results = results.filter(
      (p) => p.industry.toLowerCase() === industry.toLowerCase()
    );
  }

  if (stage) {
    results = results.filter(
      (p) => p.stage.toLowerCase() === stage.toLowerCase()
    );
  }

  if (location) {
    results = results.filter((p) =>
      (p.location || '').toLowerCase().includes(location.toLowerCase())
    );
  }

  if (tag) {
    results = results.filter((p) =>
      (p.tags || []).some((t) => t.toLowerCase().includes(tag.toLowerCase()))
    );
  }

  if (minAmount !== undefined) {
    const min = Number(minAmount);
    if (Number.isFinite(min)) {
      results = results.filter((p) => (p.fundingAmount || 0) >= min);
    }
  }

  if (maxAmount !== undefined) {
    const max = Number(maxAmount);
    if (Number.isFinite(max)) {
      results = results.filter((p) => (p.fundingAmount || 0) <= max);
    }
  }

  const total = results.length;
  const parsedPage = Math.max(1, Math.floor(Number(page) || 1));
  const parsedPageSize = Math.min(50, Math.max(1, Math.floor(Number(pageSize) || 10)));
  const start = (parsedPage - 1) * parsedPageSize;
  const paged = results.slice(start, start + parsedPageSize);

  return {
    total,
    page: parsedPage,
    pageSize: parsedPageSize,
    projects: paged.map(toSummary),
  };
}

/**
 * Returns detailed information for a single project by ID.
 *
 * @param {string} projectId
 * @returns {object|null} Project detail or null if not found
 */
function getProjectById(projectId) {
  const project = projects.find((p) => p.id === projectId);
  return project ? toDetail(project) : null;
}

/**
 * Returns projects recommended for an investor based on their preferences.
 *
 * @param {object} preferences
 * @param {string[]} [preferences.industries]  Preferred industries
 * @param {string[]} [preferences.stages]      Preferred funding stages
 * @param {number}   [preferences.maxAmount]   Maximum investment size (RMB yuan)
 * @param {number}   [preferences.limit]       Max number of results (default 5)
 * @returns {object[]} Array of project summaries
 */
function getRecommendations(preferences = {}) {
  const { industries = [], stages = [], maxAmount, limit = 5 } = preferences;

  let candidates = projects.filter((p) => p.status === 'active');

  // Score each project based on preference match
  const scored = candidates.map((p) => {
    let score = 0;
    if (industries.length > 0 && industries.some((i) => i.toLowerCase() === p.industry.toLowerCase())) score += 2;
    if (stages.length > 0 && stages.some((s) => s.toLowerCase() === p.stage.toLowerCase())) score += 2;
    if (maxAmount !== undefined && Number.isFinite(Number(maxAmount)) && p.fundingAmount <= Number(maxAmount)) score += 1;
    return { project: p, score };
  });

  // Sort by score descending, then by createdAt descending for tie-breaking
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.project.createdAt) - new Date(a.project.createdAt);
  });

  const parsedLimit = Math.min(20, Math.max(1, Math.floor(Number(limit) || 5)));
  return scored.slice(0, parsedLimit).map((s) => toSummary(s.project));
}

module.exports = { searchProjects, getProjectById, getRecommendations };
