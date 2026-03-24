import { db } from "../db/db.js";

export function postHarvestCredentials(req, res) {
  const userID = req.user.userID;
  const { harvest_token, harvest_ID } = req;
  console.log(
    `userID: ${userID}, token: ${JSON.stringify(harvest_token)}, ${JSON.stringify(harvest_ID)}`,
  );
  const sql = `UPDATE users SET harvest_token = ?, harvest_id = ? WHERE id = ?`;

  db.run(
    sql,
    [JSON.stringify(harvest_token), JSON.stringify(harvest_ID), userID],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      }

      res.status(200).json({ message: "Credentials successfully stored" });
    },
  );
}
