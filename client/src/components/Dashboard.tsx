import { useState } from "react";

type Project = {
  name: string;
  tasks: string[];
};

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState([]);

  return (
    <>
      <div className="bg-orange-500 h-screen w-screen relative">
        <div className="absolute inset-0">
          <h1 className="">Dashboard</h1>
          <label htmlFor="project">Add new project:</label>
          <input
            id="project"
            placeholder="Project Name"
            value={currentProject?.name || ""}
            type="text"
            onChange={(e) =>
              setProjects({ ...currentProject, name: e.target.value })
            }
          />
          <button
            onClick={() =>
              setProjects([...projects, { name: projectName, tasks: [] }])
            }
          >
            Add Project
          </button>
        </div>
      </div>
    </>
  );
}
