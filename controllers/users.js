const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const User = require("../models/user");

//get all users
userRouter.get("/", async (request, response, next) => {
  try {
    const users = await User.find({}).populate("blogs");
    response.json(users);
  } catch (error) {
    next(error);
  }
});

//add new user
userRouter.post("/", async (request, response, next) => {
  try {
    const { username, name, password } = request.body;

    if (password.length < 3) {
      const passwordError = new Error('User validation failed: password: Path `password` is shorter than the minimum allowed length (3).');
      passwordError.name = 'ValidationError';
      throw passwordError;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username: username,
      name: name,
      passwordHash: passwordHash
    });

    const savedUser = await newUser.save();
    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/:id", async (request, response, next) => {
  const id = request.params.id;

  try {
    await User.findByIdAndDelete(id);

    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;