const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

const testStudent = {
  walletAddress: '0xOrgTestStudent',
  name: 'Org Test Student',
  userType: 'student',
  password: 'testpassword',
  email: 'orgteststudent@example.com',
};

const testOrg = {
  walletAddress: '0xOrgTestOrg',
  name: 'Org Test Org',
  userType: 'organization',
  password: 'orgpassword',
  email: 'orgtestorg@example.com',
};

describe('Organization Actions API', () => {
  let studentToken, orgToken, orgId, studentId, requestId;

  beforeAll(async () => {
    // Register organization
    const orgRes = await request(app)
      .post('/api/auth/register')
      .send(testOrg);
    orgToken = orgRes.body.token;
    orgId = orgRes.body._id;
    // Register student
    const studentRes = await request(app)
      .post('/api/auth/register')
      .send(testStudent);
    studentToken = studentRes.body.token;
    studentId = studentRes.body._id;
    // Student requests a certificate
    const certRes = await request(app)
      .post('/api/users/request-certificate')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        organizationId: orgId,
        usn: 'ORGUSN1',
        yearOfGraduation: 2025,
        certificateType: 'TestType',
      });
    requestId = certRes.body.request._id;
  });

  afterAll(async () => {
    await mongoose.connection.db.collection('users').deleteMany({ walletAddress: { $in: [testStudent.walletAddress.toLowerCase(), testOrg.walletAddress.toLowerCase()] } });
    await mongoose.connection.db.collection('certificaterequests').deleteMany({});
    // Do not close the connection here to avoid double closing
  });

  it('should allow organization to view pending requests', async () => {
    const res = await request(app)
      .get('/api/users/organization-requests')
      .set('Authorization', `Bearer ${orgToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(r => r._id === requestId)).toBe(true);
  });

  it('should allow organization to accept a certificate request', async () => {
    const res = await request(app)
      .put(`/api/users/request/${requestId}/status`)
      .set('Authorization', `Bearer ${orgToken}`)
      .send({ status: 'accepted', remarks: 'Approved for testing' });
    expect(res.statusCode).toBe(200);
    expect(res.body.request.status).toBe('accepted');
    expect(res.body.request.remarks).toBe('Approved for testing');
  });

  it('should allow organization to reject a certificate request', async () => {
    // Create a new request to reject
    const certRes = await request(app)
      .post('/api/users/request-certificate')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        organizationId: orgId,
        usn: 'ORGUSN2',
        yearOfGraduation: 2026,
        certificateType: 'TestType2',
      });
    const rejectRequestId = certRes.body.request._id;
    const res = await request(app)
      .put(`/api/users/request/${rejectRequestId}/status`)
      .set('Authorization', `Bearer ${orgToken}`)
      .send({ status: 'rejected', remarks: 'Rejected for testing' });
    expect(res.statusCode).toBe(200);
    expect(res.body.request.status).toBe('rejected');
    expect(res.body.request.remarks).toBe('Rejected for testing');
  });

  it('should not allow organization to update a request it does not own', async () => {
    // Register a second organization
    const otherOrg = {
      walletAddress: '0xOtherOrg',
      name: 'Other Org',
      userType: 'organization',
      password: 'otherorgpassword',
      email: 'otherorg@example.com',
    };
    const otherOrgRes = await request(app)
      .post('/api/auth/register')
      .send(otherOrg);
    const otherOrgToken = otherOrgRes.body.token;
    // Try to update a request owned by testOrg
    const res = await request(app)
      .put(`/api/users/request/${requestId}/status`)
      .set('Authorization', `Bearer ${otherOrgToken}`)
      .send({ status: 'accepted', remarks: 'Should not be allowed' });
    expect(res.statusCode).toBe(404);
  });

  it('should not allow invalid status update', async () => {
    const res = await request(app)
      .put(`/api/users/request/${requestId}/status`)
      .set('Authorization', `Bearer ${orgToken}`)
      .send({ status: 'notavalidstatus', remarks: 'Invalid status' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/invalid status/i);
  });
}); 