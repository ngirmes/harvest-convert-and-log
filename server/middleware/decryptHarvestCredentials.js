import crypto from "crypto";
import { db } from "../db/db.js";

const algorithm = "aes-256-gcm";

function decrypt(encryptedRecord) {
  if (!encryptedRecord) {
    throw new Error("No encrypted payload provided");
  }

  let encrypted = encryptedRecord;
  if (typeof encryptedRecord === "string") {
    try {
      encrypted = JSON.parse(encryptedRecord);
    } catch (parseErr) {
      throw new Error("Invalid encrypted payload format");
    }
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

    const storedToken = row.harvest_token;
    const storedId = row.harvest_id || row.harvest_ID;
    const storedEmail = row.harvest_email;

    if (!storedToken || !storedId || !storedEmail) {
      console.warn("decryptHarvestCredentials missing fields", { userID, row });
      return res.status(400).json({ error: "Necessary credentials not found" });
    }

    let harvest_token;
    try {
      harvest_token = decrypt(storedToken);
    } catch (decryptErr) {
      // support already-plaintext token in case field is not a JSON credential object
      if (
        storedToken &&
        typeof storedToken === "string" &&
        !storedToken.startsWith("{")
      ) {
        harvest_token = storedToken;
      } else {
        console.error("decryptHarvestCredentials decrypt error", decryptErr, {
          userID,
          row,
        });
        return res.status(500).json({ error: decryptErr.message });
      }
    }

    req.harvest_token = harvest_token;
    req.harvest_id = storedId;
    req.harvest_email = storedEmail;

    console.log("Decrypted harvest credentials for user", userID);
    next();
  });
}
