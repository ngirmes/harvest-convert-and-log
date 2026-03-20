import { CornerRightDown } from "lucide-react";
import { useState, useEffect, useTransition } from "react";

type MainPanelProps = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setSessionExpired: (value: boolean) => void;
};

type Project = {
  id: number;
  name: string;
  tasks: string[];
};

export default function MainPanel({
  isAuthenticated,
  setIsAuthenticated,
  setSessionExpired,
}: MainPanelProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newTasks, setNewTasks] = useState([]);
  const [loggingDescription, setLoggingDescription] = useState("");
  const [, startTransition] = useTransition();
  const [matcherButton, setMatcherButton] = useState<true | false>(false);
  const [tasksButton, setTasksButton] = useState<true | false>(false);

  function reset() {
    setProjects([]);
    setNewProjectName("");
    setSelectedProject(null);
    setLoggingDescription("");
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        const response = await fetch("http://localhost:3000/api/projects", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setProjects(data.projects);
          console.log(data);
        } else if (response.status === 401) {
          localStorage.removeItem("token");
          setSessionExpired(true);
          setIsAuthenticated(false);
          console.log(data);
        } else {
          console.log(data.error);
        }
      })();
    } else {
      startTransition(() => {
        reset();
      });
    }
  }, [isAuthenticated]);

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
    } else if (response.status === 401) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      console.log(data);
    } else {
      console.log({ error: data.error });
    }
  }

  async function patchTasks() {
    const response = await fetch(
      `http://localhost:3000/api/addTasks/:${selectedProject?.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newTasks),
      },
    );

    const data = await response.json();
    if (response.ok) {
      console.log("Tasks successfully added");
      const proj = projects.find((p) => p.id === selectedProject?.id);
      proj.tasks = data.tasks;
    } else {
      console.log({ error: data.error });
    }
  }

  function runMatcher() {
    console.log("matcher");
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
        <button
          onClick={() => {
            setMatcherButton(true);
            setTasksButton(false);
          }}
          className="hover:border-2 hover:border-black hover:rounded-lg p-2"
        >
          Run Matcher{" "}
        </button>{" "}
        or
        <button
          onClick={() => {
            setMatcherButton(false);
            setTasksButton(true);
          }}
          className="hover:border-2 hover:border-black hover:rounded-lg p-2"
        >
          {" "}
          Add Tasks to '{selectedProject?.name}'
        </button>
        <CornerRightDown size={16} className="mt-2" />
      </label>
      <textarea
        id="taskdescription"
        placeholder="Description of task..."
        value={loggingDescription}
        onChange={(e) => setLoggingDescription(e.target.value)}
        className="rounded-lg border-2 border-black/70"
      />
      <button
        disabled={!matcherButton}
        onClick={() => runMatcher()}
        className="rounded-lg border-2 border-black/70 bg-orange-300 px-6 py-3 text-lg font-bold text-black/70 hover:bg-orange-400 w-72 mt-4 disabled:text-gray-400 disabled:border-gray-400 disabled:bg-orange-50"
      >
        Run Matcher
      </button>
      <button
        disabled={!tasksButton}
        onClick={() => patchTasks()}
        className="rounded-lg border-2 border-black/70 bg-orange-300 px-6 py-3 text-lg font-bold text-black/70 hover:bg-orange-400 w-72 mt-4 disabled:text-gray-400 disabled:border-gray-400 disabled:bg-orange-50"
      >
        Add Tasks
      </button>
    </div>
  );
}
