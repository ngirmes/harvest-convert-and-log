import { db } from "../db/db.js";

export const harvestCredentials = (req, res) => {
  const { harvest_token, harvest_ID } = req.body;
  const userId = req.user.userId;
  const sql = `UPDATE users SET harvest_token = ?, harvest_ID = ? WHERE id = ?`;

  db.run(sql, [harvest_token, harvest_ID, userId], (err) => {
    if (err) {
      console.error("Error updating harvest token", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ message: "Harvest credentials updated successfully" });
  });
};

/*
export const harvestMe = (req, res) => {
  const userId = req.user.userId;
  const {harvest_token, harvest_ID} = req.body;

  db.get(sql, [userId], (err, row) => {
    if (err) {
      console.error("Error fetching harvest credentials", err);
      return res.status(500).json({ error: "Internal server error" });
    } */
