import { json } from "zod";
import { db } from "../db/db.js";

export function postHarvestCredentials(req, res) {
  const userID = req.user.userID;
  const harvest_token = req.harvest_token;
  const { harvest_id, harvest_email } = req.body;
  const sql = `UPDATE users SET harvest_token = ?, harvest_id = ?, harvest_email = ? WHERE id = ?`;

  db.run(
    sql,
    [JSON.stringify(harvest_token), harvest_id, harvest_email, userID],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      }

      res.status(200).json({ message: "Credentials successfully stored" });
    },
  );
}

export async function getData(req, res) {
  const options = {
    headers: {
      Authorization: `Bearer ${req.harvest_token}`,
      "Harvest-Account-Id": req.harvest_id,
      "User-Agent": `MyApp (${req.harvest_email})`,
    },
  };
  console.log(options);
  const response = await fetch(
    " https://api.harvestapp.com/v2/users/me/project_assignments",
    options,
  );

  const data = await response.json();
  res.status(200).json(data.project_assignments);
  console.log(data);
}
