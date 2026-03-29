import { CornerRightDown } from "lucide-react";
import { useState, useEffect, useTransition, useRef } from "react";
import type { ApiFunction } from "../pages/Dashboard";
import MatchesModal from "./MatchesModal";

type MainPanelProps = {
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

export type Log = {
  project_id: number;
  task_name: string;
  task_id: number | undefined;
  spent_date: string;
  hours: number;
  notes: string;
};

export default function MainPanel({ api }: MainPanelProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project>({
    id: 0,
    name: "",
    tasks: [],
  });
  const [logs, setLogs] = useState<Log[]>([]);
  const [textboxInput, setTextboxInput] = useState<string>("");
  const [, startTransition] = useTransition();
  const [showTasks, setShowTasks] = useState(false);
  const [bestMatches, setBestMatches] = useState<string[]>([]);
  const [matchesModal, setMatchesModal] = useState(false);
  const [workDescriptions, setWorkDescriptions] = useState<string[]>([]);

  function reset() {
    setProjects([]);
    setSelectedProject({ id: 0, name: "", tasks: [] });
    setTextboxInput("");
    setBestMatches([]);
  }

  /*
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
  }, [isAuthenticated]);*/
  function createLogs(matches: string[]) {
    const date = new Date().toLocaleDateString("en-CA");

    const newLogs = workDescriptions.map((desc, i) => ({
      project_id: selectedProject.id,
      task_name: matches[i],
      task_id: selectedProject.tasks.find((t) => t.name === matches[i])?.id,
      spent_date: date,
      hours: 0,
      notes: desc,
    }));
    setLogs(newLogs);
  }

  async function runMatcher() {
    try {
      const token = localStorage.getItem("token");
      const taskNames = selectedProject.tasks.map((t) => t.name);

      const response = await api<{
        status: number | null;
        message: string;
        matches: [];
      }>("/api/embed", {
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
      if (response.status === 401) reset();
      else {
        setBestMatches(response.data.matches);
        createLogs(response.data.matches);
      }
    } catch (error) {
      console.error("Finding matches failed: ", error);
    }
  }

  async function getProjects() {
    try {
      const token = localStorage.getItem("token");
      const response = await api<{
        status: number | null;
        message: string;
        projects: [];
      }>("/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        reset();
      }
      setProjects(response.data.projects);
      console.log(projects);
      alert(response.data.message);
    } catch (error) {
      console.error("Getting projects failed: ", error);
    }
  }

  async function submitLogs(logs: Log[]) {
    console.log(`hi ${JSON.stringify(logs)}, ${typeof logs}`);
    try {
      const token = localStorage.getItem("token");
      const response = await api<{ status: number | null; message: string }>(
        `/api/time-entries`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            logs,
          }),
        },
      );

      if (response.status === 401) {
        reset();
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Getting projects failed: ", error);
    }
  }

  return (
    <>
      {matchesModal && (
        <MatchesModal
          logs={logs}
          projectName={selectedProject.name}
          setMatchesModal={setMatchesModal}
          submitLogs={submitLogs}
        />
      )}
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
                Get Projects from Harvest
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
              onChange={(e) => {
                setTextboxInput(e.target.value);
                setWorkDescriptions(textboxInput.split(","));
              }}
              className="w-full p-2 border-2 border-black/70 rounded-lg h-24 resize-none"
            />

            <div className="flex space-x-4">
              <button
                onClick={runMatcher}
                className="rounded-lg border-2 border-black/70 bg-orange-300 px-6 py-3 text-lg font-bold text-black/70 hover:bg-orange-400 disabled:text-gray-400 disabled:border-gray-400 disabled:bg-orange-50"
              >
                Run Matcher
              </button>
              <button
                onClick={() => setMatchesModal(true)}
                disabled={logs.length === 0}
                className="rounded-lg border-2 border-black/70 bg-orange-300 px-6 py-3 text-lg font-bold text-black/70 hover:bg-orange-400 disabled:text-gray-400 disabled:border-gray-400 disabled:bg-orange-50"
              >
                See Logs
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
