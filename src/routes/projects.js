'use strict';

const express = require('express');
const { searchProjects, getProjectById, getRecommendations } = require('../handlers/projectHandler');
const { VALID_INDUSTRIES, VALID_STAGES } = require('../data/mockData');

const router = express.Router();

/**
 * GET /api/projects
 * Search and list startup projects with optional filters.
 *
 * Query parameters:
 *   industry, stage, location, tag, minAmount, maxAmount, page, pageSize
 */
router.get('/', (req, res) => {
  const { industry, stage, location, tag, minAmount, maxAmount, page, pageSize } = req.query;

  const filters = {
    ...(industry && { industry }),
    ...(stage && { stage }),
    ...(location && { location }),
    ...(tag && { tag }),
    ...(minAmount !== undefined && { minAmount }),
    ...(maxAmount !== undefined && { maxAmount }),
    ...(page !== undefined && { page }),
    ...(pageSize !== undefined && { pageSize }),
  };

  const result = searchProjects(filters);
  res.json({ success: true, data: result });
});

/**
 * GET /api/projects/meta
 * Returns valid industries and funding stages for filter options.
 */
router.get('/meta', (req, res) => {
  res.json({
    success: true,
    data: {
      industries: VALID_INDUSTRIES,
      stages: VALID_STAGES,
    },
  });
});

/**
 * GET /api/projects/recommendations
 * Returns recommended projects based on investor preferences.
 *
 * Query parameters:
 *   industries (comma-separated), stages (comma-separated), maxAmount, limit
 */
router.get('/recommendations', (req, res) => {
  const { industries, stages, maxAmount, limit } = req.query;

  const preferences = {
    industries: industries ? industries.split(',').map((s) => s.trim()).filter(Boolean) : [],
    stages: stages ? stages.split(',').map((s) => s.trim()).filter(Boolean) : [],
    ...(maxAmount !== undefined && { maxAmount }),
    ...(limit !== undefined && { limit }),
  };

  const results = getRecommendations(preferences);
  res.json({ success: true, data: results });
});

/**
 * GET /api/projects/:id
 * Returns detailed information for a single project.
 */
router.get('/:id', (req, res) => {
  const project = getProjectById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: '项目不存在' });
  }
  res.json({ success: true, data: project });
});

module.exports = router;
