import request from 'supertest';
import { createApp } from '../src/app';

describe('Task Validation Endpoints', () => {
  const app = createApp();

  it('should reject task creation if title is missing', async () => {
    const response = await request(app)
      .post('/api/v1/tasks')
      .send({ description: 'Missing title' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Title is required'
    });
  });
});
