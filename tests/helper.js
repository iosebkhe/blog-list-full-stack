const User = require("../models/user");
const request = require('supertest');
const app = require('../app');

let authToken = null;

const loginAndGetToken = async () => {
  const loginResponse = await request(app)
    .post('/api/login')
    .send({
      username: 'root',
      password: 'sekret'
    });

  authToken = loginResponse.body.token;
};

const getToken = async () => {
  if (!authToken) {
    await loginAndGetToken(); // Ensure token is present before retrieving
  }
  return authToken;
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(u => u.toJSON());
};

module.exports = { usersInDb, getToken };