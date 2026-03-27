import { CornerRightDown } from "lucide-react";
import { useState, useEffect, useTransition } from "react";
import type { ApiFunction } from "../pages/Dashboard";

type MainPanelProps = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setSessionExpired: (value: boolean) => void;
  api: ApiFunction;
};

type Task = {
  id: number;
  name: string;
};

type Project = {
  id: number;
  name: string;
  tasks: Task[];
};

export default function MainPanel({
  isAuthenticated,
  setIsAuthenticated,
  setSessionExpired,
  api,
}: MainPanelProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project>({
    id: 0,
    name: "",
    tasks: [],
  });
  const [textboxInput, setTextboxInput] = useState<string>("");
  const [, startTransition] = useTransition();
  const [showTasks, setShowTasks] = useState<boolean>(false);
  const [bestTask, setBestTask] = useState<string>("");

  function reset() {
    setProjects([]);
    setSelectedProject({ id: 0, name: "", tasks: [] });
    setTextboxInput("");
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        const response = await fetch("/api/projects", {
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
          setIsAuthenticated(false);
          setSessionExpired(true);
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

  async function runMatcher() {
    const token = localStorage.getItem("token");
    const workDescriptions = textboxInput.split(",");
    const taskNames = selectedProject.tasks.map((t) => t.name);
    console.log(taskNames);

    const response = await fetch("/api/embed", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workDescriptions: workDescriptions,
        tasks: taskNames,
      }),
    });

    const data = await response.json();

    if (response.status === 401) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setSessionExpired(true);
    } else {
      setBestTask(data.bestTask);
      console.log(data);
    }
  }

  async function getProjects() {
    try {
      const token = localStorage.getItem("token");
      const response = await api<{ message: string; projects: [] }>(
        "http://localhost:3000/harvest",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setProjects(response.projects);
      console.log(projects);
      alert(response.message);
    } catch (error) {
      console.error("Getting projects failed: ", error);
    }
  }

  return (
    <div className="flex flex-col col-span-2 space-y-6 overflow-y-auto">
      {/* Project Selection Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="selectProject" className="text-lg font-medium">
            Select Project <span className="text-gray-500">or</span>
            <button
              onClick={getProjects}
              className="rounded-lg border-2 border-black/70 bg-orange-300 px-4 py-2 text-sm font-bold text-black/70 hover:bg-orange-400 ml-3"
            >
              Refresh Projects
            </button>
          </label>
        </div>
        <select
          id="selectProject"
          value={selectedProject?.id || ""}
          onChange={(e) => {
            const projectId = Number(e.target.value);
            const project = projects.find((p) => p.id === projectId) || {
              id: 0,
              name: "",
              tasks: [],
            };
            setSelectedProject(project);
            console.log(selectedProject);
            setShowTasks(false); // Hide tasks when switching projects
          }}
          className="w-full p-2 border-2 border-black/70 rounded-lg"
        >
          <option value="" disabled>
            Choose a project
          </option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tasks Display Section */}
      {selectedProject.id !== 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-xl">Tasks for "{selectedProject.name}"</h1>
            <div className="mx-2 grow border-t border-black/40"></div>
            <button
              onClick={() => setShowTasks(!showTasks)}
              className="rounded-lg border-2 border-black/70 bg-orange-300 px-4 py-2 text-sm font-bold text-black/70 hover:bg-orange-400"
            >
              {showTasks ? "Hide Tasks" : "Show Tasks"}
            </button>
          </div>
          {showTasks && (
            <div className="flex flex-wrap gap-2">
              {selectedProject.tasks.map((task) => (
                <span
                  key={task.id}
                  className="bg-orange-100 text-gray-700 px-3 py-1 rounded-full border border-orange-200 text-sm"
                >
                  {task.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Task Management Section */}
      {selectedProject.id !== 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <button>Add work description</button>
            <CornerRightDown size={16} className="mt-1" />
          </div>

          <textarea
            id="taskdescription"
            placeholder="Enter tasks separated by commas..."
            value={textboxInput}
            onChange={(e) => setTextboxInput(e.target.value)}
            className="w-full p-2 border-2 border-black/70 rounded-lg h-24 resize-none"
          />

          <div className="flex space-x-4">
            <button
              onClick={runMatcher}
              className="rounded-lg border-2 border-black/70 bg-orange-300 px-6 py-3 text-lg font-bold text-black/70 hover:bg-orange-400 disabled:text-gray-400 disabled:border-gray-400 disabled:bg-orange-50"
            >
              Run Matcher
            </button>

            <h1>Best match: {bestTask}</h1>
          </div>
        </div>
      )}
    </div>
  );
}
