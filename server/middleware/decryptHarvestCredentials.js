import crypto from "crypto";
import { db } from "../db/db.js";

const algorithm = "aes-256-gcm";

function decrypt(encrypted) {
  if (!encrypted) {
    throw new Error("No encrypted payload provided");
  }

  const { iv, tag, content } = encrypted;
  if (!iv || !tag || !content) {
    throw new Error("Encrypted data missing required fields");
  }

  const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, "hex"),
  );
  decipher.setAuthTag(Buffer.from(tag, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(content, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

export default function decryptHarvestCredentials(req, res, next) {
  const userID = req.user.userID;
  const sql = `SELECT * from users WHERE id = ?`;

  db.get(sql, [userID], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) return res.status(400).json({ error: "User not found" });

    const storedToken = JSON.parse(row.harvest_token);
    const storedId = row.harvest_id || row.harvest_ID;
    const storedEmail = row.harvest_email;

    if (!storedToken || !storedId || !storedEmail) {
      console.warn("decryptHarvestCredentials missing fields", { userID, row });
      return res.status(400).json({ error: "Necessary credentials not found" });
    }
    let decrypted_token = decrypt(storedToken);
    req.harvest_token = decrypted_token;
    req.harvest_id = storedId;
    req.harvest_email = storedEmail;

    next();
  });
}
