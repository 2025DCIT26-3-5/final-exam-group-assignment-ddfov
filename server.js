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
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Missing username or password" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      username,
      hashedPassword,
    ]);
    res.status(201).json({ message: "Account created successfully" });
  } catch (err) {
    console.error(err);
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
        c.lesson_order,
        COALESCE(p.progress, 0) AS completed,
        CASE
          WHEN c.lesson_order = 1 THEN true
          WHEN EXISTS (
            SELECT 1 FROM progress p2
            WHERE p2.user_id = $1
            AND p2.course_id = c.id - 1
            AND p2.progress = true
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

// Run 3000 PORT
const PORT = process.env.PORT || 3000;
// Listen on 0.0.0.0 so other devices (or Codespace public URL) can reach it
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);