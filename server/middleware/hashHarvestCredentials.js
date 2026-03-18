import bcrypt from "bcrypt";

export default async function hashHarvestCredentials(req, res, next) {
  const { harvest_token, harvest_ID } = req.body;
  try {
    const hashedToken = await bcrypt.hash(harvest_token, 10);
    req.body.harvest_token = hashedToken;
  } catch (error) {
    console.error("Error hashing harvest token", error);
    return res.status(500).json({ error: "Internal server error" });
  }
  try {
    const hashedID = await bcrypt.hash(harvest_ID, 10);
    req.body.harvest_ID = hashedID;
    next();
  } catch (error) {
    console.error("Error hashing harvest ID", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
