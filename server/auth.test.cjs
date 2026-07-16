const request = require('supertest');
const app = require('./index.cjs');

describe('Auth Endpoints with SQLite', () => {
  it('should authenticate the sample Fan user', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'fan@fifa.com', password: 'password123' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.user).toHaveProperty('role', 'Fan');
  });

  it('should authenticate the sample Staff user', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'staff@fifa.com', password: 'password123' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.user).toHaveProperty('role', 'Staff');
  });
});
