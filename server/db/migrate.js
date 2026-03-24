// import SQLite 3 Node module with verbose for better debugging/logging
import sqlite3 from "sqlite3";
const sqlite = sqlite3.verbose();
// establish connection to database -> returns database object
export const db = new sqlite.Database("../data.db", (err) => {
  if (err) {
    console.error("Error opening database", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

// use serialize() to ensure DB commands run in sequence, preventing race conditions during table creation
db.serialize(() => {
  db.run(`
        ALTER TABLE users ADD COLUMN harvest_email TEXT;
    `);
});
