import { db } from "../db/db.js";

const checkUserExists = (req, res, next) => {
  const { email } = req.body;
  const sql = `SELECT 1 FROM users WHERE email = ?`;

  db.get(sql, [email], (err, row) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
    } else if (row) {
      res.status(400).json({ error: "User already exists" });
    } else {
      next();
    }
  });
};

export default checkUserExists;
