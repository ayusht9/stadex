const request = require('supertest');
const app = require('./index.cjs'); // This will run the DB connection

describe('Authentication API with SQLite', () => {
  it('should fail login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'wrong@fifa.com', password: 'wrong' });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should successfully login as the seeded Fan', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'fan@fifa.com', password: 'password123' });
    
    // We need to wait for the seed to happen. If this fails, the DB might not be seeded in time.
    // In a real test, we would wait for a DB connected event, but we'll try this as a quick integration check.
    if (res.statusCode === 401) {
      // Possible race condition if seed hasn't finished, wait a sec and try again.
      await new Promise(r => setTimeout(r, 1000));
      const retryRes = await request(app)
        .post('/api/login')
        .send({ email: 'fan@fifa.com', password: 'password123' });
      expect(retryRes.statusCode).toEqual(200);
      expect(retryRes.body.user).toHaveProperty('role', 'Fan');
    } else {
      expect(res.statusCode).toEqual(200);
      expect(res.body.user).toHaveProperty('role', 'Fan');
    }
  });

  it('should successfully login as the seeded Staff', async () => {
    // Adding small delay to ensure DB is seeded
    await new Promise(r => setTimeout(r, 500));
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'staff@fifa.com', password: 'password123' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.user).toHaveProperty('role', 'Staff');
  });
});
