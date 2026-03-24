import crypto from "crypto";

const algorithm = "aes-256-gcm";
const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

function encrypt(data) {
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(data, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return JSON.stringify({
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
    tag: tag.toString("hex"),
  });
}

export default function encryptHarvestCredentials(req, req, next) {
  req.harvest_token = encrypt(harvest_token);
  req.harvest_ID = encrypt(harvest_ID);
  next();
}
