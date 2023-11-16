const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const helper = require("../tests/helper");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = new User({ username: 'root', passwordHash });

  await user.save();
});

describe("POST api/users", () => {
  test("user can be added with unique username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "unique-test",
      name: "uniqute-test-name",
      password: "123"
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const userAtEnd = await helper.usersInDb();
    expect(userAtEnd).toHaveLength(usersAtStart.length + 1);
  });
});


afterAll(async () => {
  await mongoose.connection.close();
});