import bcrypt from "bcrypt";

export default async function hashPass(req, res, next) {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;
    next();
  } catch (error) {
    console.error("Error hashing password", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
