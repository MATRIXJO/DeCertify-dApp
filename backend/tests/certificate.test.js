const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

const testStudent = {
  walletAddress: '0xCertTestStudent',
  name: 'Cert Test Student',
  userType: 'student',
  password: 'testpassword',
  email: 'certstudent@example.com',
};

const testOrg = {
  walletAddress: '0xCertTestOrg',
  name: 'Cert Test Org',
  userType: 'organization',
  password: 'orgpassword',
  email: 'certorg@example.com',
};

describe('Certificate Request API', () => {
  let studentToken;
  let orgId;

  beforeAll(async () => {
    // Register organization
    const orgRes = await request(app)
      .post('/api/auth/register')
      .send(testOrg);
    orgId = orgRes.body._id;
    // Register student
    const studentRes = await request(app)
      .post('/api/auth/register')
      .send(testStudent);
    studentToken = studentRes.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.db.collection('users').deleteMany({ walletAddress: { $in: [testStudent.walletAddress.toLowerCase(), testOrg.walletAddress.toLowerCase()] } });
    await mongoose.connection.db.collection('certificaterequests').deleteMany({});
    // Close the connection if it's still open
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  it('should allow a student to request a certificate', async () => {
    const res = await request(app)
      .post('/api/users/request-certificate')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        organizationId: orgId,
        usn: 'USN123',
        yearOfGraduation: 2024,
        certificateType: 'Degree',
      });
    expect(res.statusCode).toBe(201);
    console.log(res.body); // Debug response
    // Accept either direct id or populated object
    expect(
      res.body.request.organization === orgId ||
      (res.body.request.organization && res.body.request.organization._id === orgId)
    ).toBeTruthy();
    expect(res.body.request.usn).toBe('USN123');
    expect(res.body.request.certificateType).toBe('Degree');
    expect(res.body.request.status).toBe('pending');
  });

  it('should fail if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/users/request-certificate')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({});
    expect(res.statusCode).toBe(400);
  });

  it('should fail if organization does not exist', async () => {
    const res = await request(app)
      .post('/api/users/request-certificate')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        organizationId: new mongoose.Types.ObjectId(),
        usn: 'USN999',
        yearOfGraduation: 2025,
        certificateType: 'Diploma',
      });
    expect([400, 404]).toContain(res.statusCode);
  });
});
