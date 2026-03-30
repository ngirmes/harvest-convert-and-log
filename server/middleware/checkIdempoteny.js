import { db } from "../db/db.js";

export default function checkIdempotency(req, res, next) {
  console.log("hi idempotency");
  const userID = req.user.userID;
  console.log(req.body, req.body.user, req.user.userID);
  const { submissionIdRef } = req.body;

  if (!submissionIdRef) {
    return res.status(400).json({ error: "Missing submissionId" });
  }
  const sql = `INSERT INTO idempotencies (user_id, submission_id) VALUES (?, ?)`;

  db.run(sql, [userID, submissionIdRef.current], (err) => {
    if (err) {
      if (err.code === "SQLITE_CONTSTRAINT") {
        return res
          .status(409)
          .json({ error: "Duplicate submission event detected" });
      }
      return res.status(500).json({ err: err.message });
    }

    next();
  });
}
