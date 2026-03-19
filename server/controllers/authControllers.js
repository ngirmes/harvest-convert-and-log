import { db } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, password } = req.body;
  const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
  db.run(sql, [email, password], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "User registered successfully" });
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  db.get(sql, [email], async (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    try {
      const match = await bcrypt.compare(password, row.password);
      if (!match) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = jwt.sign({ userId: row.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      res
        .status(200)
        .json({ message: "Login successful", token, userId: row.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};
