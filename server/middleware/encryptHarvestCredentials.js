import crypto from "crypto";

const algorithm = "aes-256-gcm";

function encrypt(data) {
  if (typeof data !== "string") {
    throw new Error("Encryption input must be a string");
  }
  const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(data, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
    tag: tag.toString("hex"),
  };
}

export default function encryptHarvestCredentials(req, res, next) {
  console.log("err917-4");

  const { harvest_token } = req.body;
  if (!harvest_token) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  req.harvest_token = encrypt(harvest_token);
  next();
}
