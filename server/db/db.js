// import SQLite 3 Node module with verbose for better debugging/logging
import sqlite3 from "sqlite3";
const sqlite = sqlite3.verbose();
// establish connection to database -> returns database object
export const db = new sqlite.Database("./data.db", (err) => {
  if (err) {
    console.error("Error opening database", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

// use serialize() to ensure DB commands run in sequence, preventing race conditions during table creation
db.serialize(() => {
  db.run(`
        CREATE TABLE IF NOT EXISTS users 
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            password TEXT NOT NULL
        )
    `);
  db.run(`
    CREATE TABLE IF NOT EXISTS idempotencies (
      user_id INTEGER,
      submission_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, submission_id)
      )`);
});
