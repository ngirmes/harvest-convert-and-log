import { db } from "../db/db.js";
import OpenAI from "openai";

export const harvestCredentials = (req, res) => {
  const { harvest_token, harvest_ID } = req.body;
  const userId = req.user.userId;
  const sql = `UPDATE users SET harvest_token = ?, harvest_ID = ? WHERE id = ?`;

  db.run(sql, [harvest_token, harvest_ID, userId], (err) => {
    if (err) {
      console.error("Error updating harvest token", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ message: "Harvest credentials updated successfully" });
  });
};

export const postProject = (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId;
  const sql = `INSERT INTO projects (name, user_id) VALUES (?, ?)`;

  db.run(sql, [name, userId], function (err) {
    if (err) {
      console.error("Error creating project", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(201).json({
      message: "Project created successfully",
      project: {
        id: this.lastID,
        name,
        tasks: [],
      },
    });
  });
};

export const getProjects = (req, res) => {
  const userId = req.user.userId;
  const sql = `SELECT id, name, tasks FROM projects WHERE user_id = ?`;

  db.all(sql, [userId], (err, rows) => {
    if (err) {
      console.error("Error fetching projects", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    const projects = rows.map((row) => ({
      id: row.id,
      name: row.name,
      tasks: JSON.parse(row.tasks || "[]"),
    }));
    res.json({ projects });
  });
};

export const patchTasks = (req, res) => {
  const projectId = req.params.id;
  const { tasks } = req.body;
  console.log(tasks);
  const sql = `UPDATE projects SET tasks = ? WHERE id = ?`;

  db.run(sql, [JSON.stringify(tasks), projectId], function (err) {
    if (err) {
      console.error("Error adding tasks to project", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ message: "Tasks added to project successfully" });
  });
};

function cosineSimilarity(a, b) {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  return dot / (magA * magB);
}

export const embed = async (req, res) => {
  const { description, tasks } = req.body;
  const client = new OpenAI();
  const data = [description, ...tasks];

  const embedding = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: data,
    encoding_format: "float",
  });
  let bestScore = -Infinity;
  let bestTask = null;

  const descriptionVector = embedding.data[0].embedding;

  for (let i = 1; i < embedding.data.length; i++) {
    const taskVector = embedding.data[i].embedding;
    const score = cosineSimilarity(descriptionVector, taskVector);

    if (score > bestScore) {
      bestScore = score;
      bestTask = tasks[i - 1];
    }
  }

  res.json({ bestTask, confidence: bestScore });
};
/*
export const harvestMe = (req, res) => {
  const userId = req.user.userId;
  const {harvest_token, harvest_ID} = req.body;

  db.get(sql, [userId], (err, row) => {
    if (err) {
      console.error("Error fetching harvest credentials", err);
      return res.status(500).json({ error: "Internal server error" });
    } */
