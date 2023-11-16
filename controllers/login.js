const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (request, response, next) => {
  try {
    const { username, password } = request.body;

    const user = await User.findOne({ username });

    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      return response.status(401).json({ error: 'invalid username or password' });
    }

    const infoForToken = {
      username: user.username,
      id: user.id
    };

    const token = jwt.sign(infoForToken, process.env.SECRET, { expiresIn: 60 * 60 });

    response.status(201).json({ token, username: user.username, name: user.name });

  } catch (error) {
    next(error);
  }
});


module.exports = loginRouter;