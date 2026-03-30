import { db } from "../db/db.js";

export default function checkIdempotency(req, res, next) {
  const userId = req.user.userId;
  const { submissionIdRef } = req.body;

  if (!submissionIdRef) {
    return res.status(400).json({ error: "Missing submissionId" });
  }
  const sql = `INSERT INTO idempotencies (user_id, submission_id) VALUES (?, ?)`;

  db.run(
    sql,
    [userId, submissionIdRef]((err, row) => {
      if (err) {
        if (err.code === "SQLITE_CONTSTRAINT") {
          return res
            .status(409)
            .json({ error: "Duplicate submission event detected" });
        }
        return res.status(500).json({ err: err.message });
      }

      next();
    }),
  );
}
