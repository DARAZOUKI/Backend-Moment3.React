const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;

// ------------------ User Authentication ------------------ //

// User Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ message: "Access Denied" });
  
    const token = authHeader.split(" ")[1]; // Remove "Bearer " part
  
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
      req.user = verified;
      next();
    } catch (err) {
      res.status(400).json({ message: "Invalid Token" });
    }
  };
  

// Register User
app.post("/api/register", async (req, res) => {
    const { email, password } = req.body;
  
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
  
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Save new user
      const user = new User({ email, password: hashedPassword });
      await user.save();
  
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  

// Login User
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1h" });

  res.json({ token });
});

// Protected Route Example
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// ------------------ CRUD Operations for Blog Posts ------------------ //

// Blog Post Schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
});
const Post = mongoose.model("Post", postSchema);

// Create a New Post
app.post("/api/posts", verifyToken, async (req, res) => {
    const { title, content } = req.body;
  
    // Validate input
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }
  
    try {
      const post = new Post({ title, content, author: req.user._id });
      await post.save();
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  

// Get All Posts
app.get("/api/posts", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// Get a Single Post
app.get("/api/posts/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

// Update a Post
app.put("/api/posts/:id", verifyToken, async (req, res) => {
  const { title, content } = req.body;
  const post = await Post.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

// Delete a Post
app.delete("/api/posts/:id", verifyToken, async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json({ message: "Post deleted" });
});

// Start Server
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
