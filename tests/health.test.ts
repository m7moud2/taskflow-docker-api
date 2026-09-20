import request from 'supertest';
import { createApp } from '../src/app';

describe('GET /api/v1/health', () => {
  const app = createApp();

  it('should return healthcheck response object structure', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('services');
  });
});
