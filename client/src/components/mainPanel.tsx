import { CornerRightDown } from "lucide-react";
import { useState, useEffect } from "react";

type Project = {
  id: number;
  name: string;
  tasks: string[];
};

export default function MainPanel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newTask, setNewTask] = useState("");
  const [loggingDescription, setLoggingDescription] = useState("");

  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:3000/api/projects", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      setProjects(data.projects);
      console.log(data);
    })();
  }, []);

  async function postProject() {
    const response = await fetch("http://localhost:3000/api/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: newProjectName,
        tasks: [],
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setProjects((prev) => [...prev, data.project]);
      console.log(data);
    } else {
      console.log({ error: data.error });
    }
  }

  return (
    <div className="flex flex-col col-span-2">
      <select
        value={selectedProject?.id || 0}
        onChange={(e) => {
          const projectId = Number(e.target.value);
          const project = projects.find((p) => p.id === projectId) || null;
          setSelectedProject(project);
        }}
      >
        <option value={0}>Select a project</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
      <h1>Tasks</h1>
      <ul>
        {selectedProject?.tasks.map((task) => (
          <li key={task}>{task}</li>
        ))}
      </ul>
      <label htmlFor="newProject">New Project</label>
      <input
        id="newProject"
        placeholder="Project Name"
        onChange={(e) => setNewProjectName(e.target.value)}
      />
      <button
        onClick={() => postProject()}
        className="rounded-lg border-2 border-black/70 bg-orange-300 px-6 py-3 text-lg font-bold text-black/70 hover:bg-orange-400 w-72 mt-4"
      >
        Add New Project
      </button>
      <label
        htmlFor="taskdescription"
        className="inline-flex text-lg font-medium text-gray-700 mt-4"
      >
        Logging Description
        <CornerRightDown size={16} className="mt-2" />
      </label>
      <textarea
        id="taskdescription"
        placeholder="Description of task..."
        value={loggingDescription}
        onChange={(e) => setLoggingDescription(e.target.value)}
        className="rounded-lg border-2 border-black/70"
      />
    </div>
  );
}
