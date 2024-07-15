const blogsRouter = require("express").Router();
const Blog = require("../models/blogs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  console.log("Request Body:", request.body);

  const body = request.body;
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
    comments: [],
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  const populatedBlog = await Blog.findById(savedBlog._id).populate("user");
  response.status(201).json(populatedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const { likes } = request.body;
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { $set: { likes } },
    { new: true, runValidators: true, context: "query" }
  ).populate("user", { username: 1, name: 1 });
  console.log(updatedBlog); // debug
  response.json(updatedBlog);
});

blogsRouter.post("/:id/comments", async (request, response) => {
  console.log("Request Body:", request.body);
  const { id } = request.params;
  const { comment } = request.body;

  const blog = await Blog.findById(id);
  if (blog) {
    blog.comments = blog.comments.concat(comment);
    console.log(blog);
    await blog.save();
    const updatedBlog = await Blog.findById(id).populate("user");
    response.status(201).json(updatedBlog);
  } else {
    response.status(404).end();
  }
});

module.exports = blogsRouter;
