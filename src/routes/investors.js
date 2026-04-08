'use strict';

const express = require('express');
const { registerInterest } = require('../handlers/investorHandler');
const { getProjectById } = require('../handlers/projectHandler');

const router = express.Router();

/**
 * POST /api/investors/interest
 * Register an investor's interest in a project.
 *
 * Request body (JSON):
 *   {
 *     "projectId":     "proj_001",
 *     "investorName":  "张三",
 *     "investorEmail": "zhangsan@example.com",
 *     "note":          "希望了解更多财务数据"  // optional
 *   }
 */
router.post('/interest', (req, res) => {
  const { projectId, investorName, investorEmail, note } = req.body || {};

  // Verify the project exists before registering interest
  if (projectId) {
    const project = getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: '项目不存在' });
    }
  }

  const result = registerInterest({ projectId, investorName, investorEmail, note });
  if (!result.success) {
    return res.status(400).json({ success: false, message: result.message });
  }

  res.status(201).json({ success: true, data: result });
});

module.exports = router;
