const { mongoose } = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

afterAll( async () => {
  await mongoose.connection.close();
})


test('get homepage of client', async() => {
    let res = request.get('/ ')
    expect(res.status).toBe(200);
});