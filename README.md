## 📝 Backend API for Blog Posts
This is a Node.js + Express + MongoDB backend that provides authentication and CRUD operations for blog posts.

## 🚀 Features

  * User Authentication
        - Register new users
        - Login and receive JWT token
        - Protected routes with JWT middleware
  * CRUD Operations for Blog Posts
        - Create, Read, Update, and Delete blog posts
        - Only authenticated users can create, update, or delete posts
  * MongoDB Database
        - Stores user information and blog posts.
## 🔑 API Endpoints for Testing

| **Method** | **Endpoint**         | **Description**                         | **Authentication** |
|-----------|----------------------|-----------------------------------------|--------------------|
| **POST**  | `/api/register`       | Register a new user                    | ❌ No              |
| **POST**  | `/api/login`          | Login and receive JWT token            | ❌ No              |
| **GET**   | `/api/protected`      | Access a protected route               | ✅ Yes (JWT)       |
| **POST**  | `/api/posts`          | Create a new blog post                 | ✅ Yes (JWT)       |
| **GET**   | `/api/posts`          | Get all blog posts                      | ❌ No              |
| **GET**   | `/api/posts/:id`      | Get a single blog post by ID           | ❌ No              |
| **PUT**   | `/api/posts/:id`      | Update a blog post                     | ✅ Yes (JWT)       |
| **DELETE**| `/api/posts/:id`      | Delete a blog post                     | ✅ Yes (JWT)       |
