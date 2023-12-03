const blogListRouter = require("express").Router();
const middleware = require("../utils/middleware");
const Blog = require("../models/blog");
const User = require("../models/user");


blogListRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogListRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  try {
    const body = request.body;
    const extractedUser = request.user;

    const user = await User.findById(extractedUser.id);


    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      user: user.id,
      likes: body.likes || 0
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog.id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }

});

blogListRouter.put("/:id", middleware.userExtractor, async (request, response, next) => {
  const body = request.body;
  const id = request.params.id;

  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  };

  try {
    const blogToUpdate = await Blog.findByIdAndUpdate(id, updatedBlog, { new: true, runValidators: true, context: "query" });
    response.status(201).json(blogToUpdate);
  } catch (error) {
    next(error);
  }
});

blogListRouter.delete("/:id", middleware.userExtractor, async (request, response, next) => {
  const id = request.params.id;
  const extractedUser = request.user;
  try {
    const blogToDelete = await Blog.findById(id).populate("user");

    if (!blogToDelete) {
      return response.status(404).json({ error: "Blog not found" });
    }


    if (blogToDelete.user.id !== extractedUser.id) {
      return response.status(403).json({ error: "NOT authorized to delete this blog" });
    }

    await Blog.findByIdAndDelete(id);
    response.status(200).json({ message: "BLOG DELETED" });
  } catch (error) {
    next(error);
  }
});

module.exports = blogListRouter;
