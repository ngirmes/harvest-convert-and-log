import { db } from "../db/db.js";

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
/*
export const harvestMe = (req, res) => {
  const userId = req.user.userId;
  const {harvest_token, harvest_ID} = req.body;

  db.get(sql, [userId], (err, row) => {
    if (err) {
      console.error("Error fetching harvest credentials", err);
      return res.status(500).json({ error: "Internal server error" });
    } */
