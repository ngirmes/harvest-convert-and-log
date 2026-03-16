import { db } from "../db/db.js";

export const harvestToken = (req, res) => {
  const { harvest_token } = req.body;
  const userId = req.user.userId;
  const sql = `UPDATE users SET harvest_token = ? WHERE id = ?`;

  db.run(sql, [harvest_token, userId], (err) => {
    if (err) {
      console.error("Error updating harvest token", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ message: "Harvest token updated successfully" });
  });
};
