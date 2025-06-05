const request = require('supertest');
const express = require('express');
const app = require('../server');
const mongoose = require('mongoose');

describe('Auth API', () => {
  it('should return 400 for missing fields on register', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('should return 400 for missing wallet address on login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBeDefined();
  });
});

afterAll(async () => {
  await mongoose.connection.close();
}); 