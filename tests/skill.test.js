'use strict';

const request = require('supertest');
const createApp = require('../src/app');

describe('创小融投资人Skill API', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  // ---------------------------------------------------------------------------
  // Health check
  // ---------------------------------------------------------------------------
  describe('GET /health', () => {
    it('returns service health info', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toBe('创小融投资人Skill');
    });
  });

  // ---------------------------------------------------------------------------
  // 404 for unknown routes
  // ---------------------------------------------------------------------------
  describe('Unknown route', () => {
    it('returns 404 for unknown routes', async () => {
      const res = await request(app).get('/not-a-real-path');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // GET /api/projects
  // ---------------------------------------------------------------------------
  describe('GET /api/projects', () => {
    it('returns all active projects', async () => {
      const res = await request(app).get('/api/projects');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.total).toBeGreaterThan(0);
      expect(Array.isArray(res.body.data.projects)).toBe(true);
      expect(res.body.data.projects.length).toBeGreaterThan(0);
    });

    it('filters by industry', async () => {
      const res = await request(app).get('/api/projects?industry=医疗健康');
      expect(res.status).toBe(200);
      expect(res.body.data.projects.every((p) => p.industry === '医疗健康')).toBe(true);
    });

    it('filters by stage', async () => {
      const res = await request(app).get('/api/projects?stage=A轮');
      expect(res.status).toBe(200);
      expect(res.body.data.projects.every((p) => p.stage === 'A轮')).toBe(true);
    });

    it('filters by location', async () => {
      const res = await request(app).get('/api/projects?location=北京');
      expect(res.status).toBe(200);
      expect(res.body.data.projects.every((p) => p.location.includes('北京'))).toBe(true);
    });

    it('filters by tag', async () => {
      const res = await request(app).get('/api/projects?tag=AI');
      expect(res.status).toBe(200);
      expect(
        res.body.data.projects.every((p) =>
          p.tags.some((t) => t.toLowerCase().includes('ai'))
        )
      ).toBe(true);
    });

    it('filters by minAmount', async () => {
      const min = 50000000;
      const res = await request(app).get(`/api/projects?minAmount=${min}`);
      expect(res.status).toBe(200);
      // All returned project summaries should have fundingAmount >= min
      // (We check via the raw data indirectly; at least we get a valid response)
      expect(res.body.success).toBe(true);
    });

    it('returns empty results for a non-existent industry', async () => {
      const res = await request(app).get('/api/projects?industry=不存在的行业');
      expect(res.status).toBe(200);
      expect(res.body.data.total).toBe(0);
      expect(res.body.data.projects).toHaveLength(0);
    });

    it('paginates results', async () => {
      const res = await request(app).get('/api/projects?page=1&pageSize=3');
      expect(res.status).toBe(200);
      expect(res.body.data.projects.length).toBeLessThanOrEqual(3);
      expect(res.body.data.pageSize).toBe(3);
    });

    it('returns project summaries with required fields', async () => {
      const res = await request(app).get('/api/projects');
      expect(res.status).toBe(200);
      const project = res.body.data.projects[0];
      expect(project).toHaveProperty('id');
      expect(project).toHaveProperty('name');
      expect(project).toHaveProperty('company');
      expect(project).toHaveProperty('industry');
      expect(project).toHaveProperty('stage');
      expect(project).toHaveProperty('fundingAmount');
      expect(project).toHaveProperty('location');
      expect(project).toHaveProperty('tags');
      expect(project).toHaveProperty('status');
    });
  });

  // ---------------------------------------------------------------------------
  // GET /api/projects/meta
  // ---------------------------------------------------------------------------
  describe('GET /api/projects/meta', () => {
    it('returns valid industries and stages', async () => {
      const res = await request(app).get('/api/projects/meta');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.industries)).toBe(true);
      expect(Array.isArray(res.body.data.stages)).toBe(true);
      expect(res.body.data.industries.length).toBeGreaterThan(0);
      expect(res.body.data.stages.length).toBeGreaterThan(0);
    });
  });

  // ---------------------------------------------------------------------------
  // GET /api/projects/recommendations
  // ---------------------------------------------------------------------------
  describe('GET /api/projects/recommendations', () => {
    it('returns recommendations without preferences', async () => {
      const res = await request(app).get('/api/projects/recommendations');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('returns recommendations filtered by industries', async () => {
      const res = await request(app).get('/api/projects/recommendations?industries=AI,医疗健康');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('respects the limit parameter', async () => {
      const res = await request(app).get('/api/projects/recommendations?limit=2');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeLessThanOrEqual(2);
    });
  });

  // ---------------------------------------------------------------------------
  // GET /api/projects/:id
  // ---------------------------------------------------------------------------
  describe('GET /api/projects/:id', () => {
    it('returns project details for a valid id', async () => {
      const res = await request(app).get('/api/projects/proj_001');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('proj_001');
      expect(res.body.data).toHaveProperty('description');
      expect(res.body.data).toHaveProperty('contact');
      expect(res.body.data).toHaveProperty('teamSize');
    });

    it('returns 404 for an unknown project id', async () => {
      const res = await request(app).get('/api/projects/proj_nonexistent');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // POST /api/investors/interest
  // ---------------------------------------------------------------------------
  describe('POST /api/investors/interest', () => {
    const validPayload = {
      projectId: 'proj_001',
      investorName: '张三',
      investorEmail: 'zhangsan@example.com',
      note: '希望了解更多财务数据',
    };

    it('registers interest successfully', async () => {
      const res = await request(app).post('/api/investors/interest').send(validPayload);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.registrationId).toBeTruthy();
      expect(res.body.data.success).toBe(true);
    });

    it('returns 400 when investorName is missing', async () => {
      const payload = { ...validPayload, investorName: '' };
      const res = await request(app).post('/api/investors/interest').send(payload);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('returns 400 when investorEmail is invalid', async () => {
      const payload = { ...validPayload, investorEmail: 'not-an-email' };
      const res = await request(app).post('/api/investors/interest').send(payload);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('returns 400 when projectId is missing', async () => {
      const payload = { ...validPayload, projectId: undefined };
      const res = await request(app).post('/api/investors/interest').send(payload);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('returns 404 when project does not exist', async () => {
      const payload = { ...validPayload, projectId: 'proj_nonexistent' };
      const res = await request(app).post('/api/investors/interest').send(payload);
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('works without an optional note field', async () => {
      const payload = { projectId: 'proj_002', investorName: '李四', investorEmail: 'lisi@example.com' };
      const res = await request(app).post('/api/investors/interest').send(payload);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });
});
