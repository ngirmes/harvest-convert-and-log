import { db } from "../db/db.js";
import OpenAI from "openai";

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

export const getEmbeddings = async (req, res) => {
  const { workDescriptions, tasks } = req.body;
  const client = new OpenAI();

  const workEmbeddings = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: workDescriptions,
    encoding_format: "float",
  });
  const taskEmbeddings = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: tasks,
    encoding_format: "float",
  });

  const matches = [];

  for (let i = 0; i < workEmbeddings.data.length; i++) {
    const workVector = workEmbeddings.data[i].embedding;
    let bestScore = -Infinity;
    let bestTask = null;
    for (let i = 0; i < taskEmbeddings.data.length; i++) {
      const taskVector = taskEmbeddings.data[i].embedding;
      const score = cosineSimilarity(workVector, taskVector);

      if (score > bestScore) {
        bestScore = score;
        bestTask = tasks[i];
      }
    }
    matches.push(bestTask);
  }

  res.json({ matches });
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

export function postHarvestCredentials(req, res) {
  const userID = req.user.userID;
  const harvest_token = req.harvest_token;
  const { harvest_id, harvest_email } = req.body;
  const sql = `UPDATE users SET harvest_token = ?, harvest_id = ?, harvest_email = ? WHERE id = ?`;

  db.run(
    sql,
    [JSON.stringify(harvest_token), harvest_id, harvest_email, userID],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      }

      res.status(200).json({ message: "Credentials successfully stored" });
    },
  );
}

function parseHarvestProjects(data) {
  return data.map((projectAssignment) => {
    const projectId = projectAssignment.project.id;
    const projectName = projectAssignment.project.name;

    const tasks = projectAssignment.task_assignments.map((taskAssignment) => {
      return {
        id: taskAssignment.task.id,
        name: taskAssignment.task.name,
      };
    });

    return {
      id: projectId,
      name: projectName,
      tasks: tasks,
    };
  });
}

export async function getHarvestProjects(req, res) {
  const options = {
    headers: {
      Authorization: `Bearer ${req.harvest_token}`,
      "Harvest-Account-Id": req.harvest_id,
      "User-Agent": `MyApp (${req.harvest_email})`,
    },
  };
  const response = await fetch(
    " https://api.harvestapp.com/v2/users/me/project_assignments",
    options,
  );

  const data = await response.json();
  const projects = parseHarvestProjects(data.project_assignments);
  res
    .status(200)
    .json({ message: "Projects successfully retrieved", projects });
}

export async function postTimeEntries(req, res) {
  console.log(`body: ${JSON.stringify(req.body)}`);
  const { logs } = req.body;
  /*
  const responses = await Promise.all(
    logs.map((log) =>
      fetch("https://api.harvestapp.com/v2/time_entries", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${req.harvest_token}`,
          "Harvest-Account-Id": req.harvest_id,
          "User-Agent": `MyApp (${req.harvest_email})`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: log.project_id,
          task_id: log.task_id,
          spent_date: log.spent_date,
          hours: log.hours,
          notes: log.notes,
        }),
      }),
    ),
  );

  const data = await Promise.all(responses.map((r) => r.json()));

  const failed = responses.find((r) => !r.ok);

  if (failed) {
    return res
      .status(failed.status)
      .json({ message: "One or more entries failed", data });
  }

  res.status(200).json({
    message: "Entries successfully submitted",
    data,
  });

  console.log(data);
  */
}
