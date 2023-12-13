const testingRouter = require("express").Router();
const User = require("../models/user");
const Blog = require("../models/blog");

testingRouter.post("/reset", async (request, response, next) => {
  try {
    await Blog.deleteMany({});
    await User.deleteMany({});

    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = testingRouter;