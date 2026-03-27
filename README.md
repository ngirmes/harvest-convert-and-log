# Harvest Auto Logger

AI-assisted time logging tool that automatically matches natural language task descriptions to Harvest project tasks using OpenAI embeddings.

This project integrates the **Harvest API** with **OpenAI embeddings and similarity search** to automatically determine the most relevant project task and submit time entries with minimal manual input.

---

Live Demo

https://harvest-time-logger.ngirmes.dev

This application integrates the Harvest API with OpenAI embedding similarity matching to automatically determine the most relevant project task and submit time entries with minimal manual input.

---

## Features

* Automatic mapping of task descriptions to Harvest project tasks
* Natural language task entry
* Secure storage of user credentials
* Integration with the Harvest API
* AI-assisted similarity matching using OpenAI embeddings

---

## Tech Stack

**Frontend**

* React
* TypeScript
* TailwindCSS

**Backend**

* Node.js
* Express

**APIs / Services**

* OpenAI Embeddings API
* Harvest API

**Database**

* SQLite

---

## Security

User credentials and sensitive data are protected using modern security practices:

* AES-256 encryption for stored credentials
* bcrypt password hashing for authentication
* Server-side credential decryption before API calls

---

## Installation

Local Development (Optional)

Clone the repository:

git clone https://github.com/YOUR_USERNAME/harvest-auto-logger.git
cd harvest-auto-logger

Install dependencies:

npm install
cd /client
npm install
cd /server
npm install

Run the development server:

npm run dev

## Usage

1. Log into the application.
2. Provide your Harvest credentials:

   * API Token
   * Account ID
   * Email
3. Select a project.
4. Enter natural language task descriptions.
5. The system will automatically match the descriptions to the most relevant Harvest tasks and provide the option to submit the time entries.

---

## Example Workflow

Example input:

```
Field sampling at Safeway site
```

The system uses embedding similarity to match the description to a relevant Harvest task and automatically logs the time entry under the appropriate project.

---

## Project Goals

This project demonstrates:

* API integration
* AI-assisted task classification
* secure credential storage
* full-stack application development
* modern React + TypeScript architecture

---

## Links

GitHub Repository
https://github.com/ngirmes

LinkedIn
https://linkedin.com/in/nicholas-girmes

---

## Version

v1.0.0

---

## License

MIT License

Copyright (c) 2026 Nicholas Girmes

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction.

See the LICENSE file for full details.
