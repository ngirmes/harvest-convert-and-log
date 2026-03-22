# Lessons

- Using ES module syntax instead of CommonJS because it is the modern JavaScript standard and offers better compatibility with browser environments.
- Named exports allow multiple exports from a file.
  `export const login = () => {};
export const register = () => {};`
- Why Async is Useful ~ Async functions allow Node to handle other requests while waiting for slow operations.
- Nodemon ~ nodemon automatically restarts your server when files change.
- Dependencies vs Dev Dependencies
  - ex: installing a dev dependecy: npm install -D nodemon
  - ex: installing production dependencies: npm install "production"
- Concurrent Scripts
  - Using concurrently allows both frontend and backend to run with a single command.

  -while trying to figure out updating tasks, I ran into an issue where I was trying to filter so only NEW tasks
  would be added, and while MOST of the logic was right, a syntax issue was causing a comparison of a TRIMMED
  version of the tasks vs. an UNTRIMMED, so it was never correctly filtering out
