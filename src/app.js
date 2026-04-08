'use strict';

const express = require('express');
const projectsRouter = require('./routes/projects');
const investorsRouter = require('./routes/investors');

/**
 * Creates and configures the Express application.
 * Exported as a factory so tests can create fresh instances.
 */
function createApp() {
  const app = express();

  // Parse JSON request bodies
  app.use(express.json());

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: '创小融投资人Skill', version: '1.0.0' });
  });

  // API routes
  app.use('/api/projects', projectsRouter);
  app.use('/api/investors', investorsRouter);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ success: false, message: '接口不存在' });
  });

  // Generic error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  });

  return app;
}

module.exports = createApp;
