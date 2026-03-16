import { db } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  const { email, password } = req.body;
  const sql = "INSERT INTO users (email, password) VALUES (?, ?)";

  db.run(sql, [email, password], (err) => {
    if (err) {
      console.error("Error inserting user", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(201).json({ message: "User registered successfully" });
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";

  try {
    const row = await new Promise((resolve, reject) => {
      db.get(sql, [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!row) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, row.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: row.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
