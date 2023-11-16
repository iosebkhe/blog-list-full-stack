const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const { getToken } = require('./helper');


const initialBlogs = [
  {
    title: "body.title",
    author: "body.author",
    url: "body.url",
    likes: 10
  }
];


beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of initialBlogs) {
    let blogObj = new Blog(blog);
    await blogObj.save();
  }
});

describe("GET api/blogs", () => {

  test("all blogs are returned as json", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test("that the unique identifier property of the blog posts is named id", async () => {
    const response = await api.get("/api/blogs");
    const blogsId = response.body.map(r => r.id);
    expect(blogsId).toBeDefined();
  });
});

describe("POST api/blogs", () => {
  let token;

  beforeAll(async () => {
    token = await getToken();
  });

  test("that blog can be added", async () => {
    const newBlog = {
      title: "body.title-NEW",
      author: "body.author-NEW",
      url: "body.url-NEW",
      likes: 20
    };

    await api
      .post("/api/blogs")
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const dbBlogs = await Blog.find({});
    expect(dbBlogs).toHaveLength(initialBlogs.length + 1);
  });

  test("if the likes property is missing from the request, it will default to the value 0", async () => {
    const newBlog = {
      title: "body.title-NEW",
      author: "body.author-NEW",
      url: "body.url-NEW",
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.likes).toBe(0);
  });

  test("if the title or url properties are missing, it will return status 400 bad request", async () => {
    const newBlog = {
      author: "body.author-NEW",
      likes: 34
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(400);

    const expectedErrorMessage = "Blog validation failed: ";
    const expectedErrors = ["title: Path `title` is required.", "url: Path `url` is required."];

    expect(response.body.error).toContain(expectedErrorMessage);

    for (const error of expectedErrors) {
      expect(response.body.error).toContain(error);
    }
  });

});

describe("PUT api/blogs", () => {

  test("succeeds with status code 201 if id is valid", async () => {
    const blogsAtStart = await Blog.find({});
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = {
      url: "body.url-UPDATED",
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await Blog.find({});
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);

    const contents = blogsAtEnd.map(r => r.url);

    expect(contents).toContain(updatedBlog.url);
  });

});

describe("DELETE api/blogs", () => {

  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await Blog.find({});
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(200);

    const blogsAtEnd = await Blog.find({});
    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1);

    const contents = blogsAtEnd.map(r => r.title);

    expect(contents).not.toContain(blogToDelete.title);
  });

});


afterAll(async () => {
  await mongoose.connection.close();
});