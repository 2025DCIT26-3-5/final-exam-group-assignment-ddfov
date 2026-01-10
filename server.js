// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Neon PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Neon requires this
});

// Health check
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "Server running", time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB connection failed" });
  }
});

// Signup Endpoint
// Signup Endpoint
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password)
    return res.status(400).json({ message: "Missing username or password" });

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user and get their ID
    const userResult = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
      [username, hashedPassword]
    );
    const newUserId = userResult.rows[0].id;

    // Initialize progress for all courses for this new user
    await pool.query(
      `
      INSERT INTO progress (user_id, course_id)
      SELECT $1, id
      FROM courses
      `,
      [newUserId]
    );

    // Respond success
    res.status(201).json({ message: "Account created successfully", userId: newUserId });
  } catch (err) {
    console.error(err);

    // Handle unique username error
    if (err.code === "23505") { // unique violation
      res.status(400).json({ message: "Username already exists" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});

// Login Endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Missing username or password" });

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      message: `Welcome back, ${username}`,
      userId: user.id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Dashboard Endpoint
app.get("/dashboard/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.title,
        c.lesson_order,

        -- completed status
        COALESCE(p.completed, false) AS completed,

        -- unlock logic
        CASE
          WHEN c.lesson_order = 1 THEN true
          WHEN EXISTS (
            SELECT 1
            FROM courses prev
            JOIN progress pp
              ON pp.course_id = prev.id
             AND pp.user_id = $1
             AND pp.completed = true
            WHERE prev.lesson_order = c.lesson_order - 1
          ) THEN true
          ELSE false
        END AS unlocked

      FROM courses c
      LEFT JOIN progress p
        ON p.course_id = c.id
       AND p.user_id = $1

      ORDER BY c.lesson_order;
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
});

// Mark lesson as completed
app.post("/progress/complete", async (req, res) => {
  const { userId, lesson_order } = req.body;

  if (!userId || !lesson_order) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  try {
    // Get course ID by lesson_order
    const courseRes = await pool.query("SELECT id FROM courses WHERE lesson_order = $1", [lesson_order]);
    if (courseRes.rows.length === 0) return res.status(404).json({ message: "Course not found" });

    const courseId = courseRes.rows[0].id;

    // Update progress
    await pool.query("UPDATE progress SET completed = true WHERE user_id = $1 AND course_id = $2", [userId, courseId]);

    res.json({ message: "Progress updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Run 3000 PORT
const PORT = process.env.PORT || 3000;
// Listen on 0.0.0.0 so other devices (or Codespace public URL) can reach it
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);