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
  const [newProjectName, setNewProjectName] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<Project>({
    id: 0,
    name: "",
    tasks: [],
  });
  const [textboxInput, setTextboxInput] = useState<string>("");
  const [, startTransition] = useTransition();
  const [matcherButton, setMatcherButton] = useState<true | false>(false);
  const [tasksButton, setTasksButton] = useState<true | false>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showTasks, setShowTasks] = useState<boolean>(false);
  const [bestTask, setBestTask] = useState<string>("");

  function reset() {
    setProjects([]);
    setNewProjectName("");
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

  async function postProject() {
    const response = await fetch("/api/project", {
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
    if (response.status === 401) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setSessionExpired(true);
    }
    if (response.ok) {
      setProjects((prev) => [...prev, data.project]);
      setNewProjectName("");
      setIsModalOpen(false);
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
    const newTasks = textboxInput.split(",").map((t) => t.trim());
    console.log(`new tasks: ${newTasks}`);
    console.log(`current tasks: ${selectedProject.tasks}`);
    const uniqueNewTasks = newTasks.filter(
      (t) => !selectedProject.tasks.includes(t),
    );
    console.log(`unique tasks: ${uniqueNewTasks}`);
    const updatedTasks = [...selectedProject.tasks, ...uniqueNewTasks];
    console.log(`updated tasks: ${updatedTasks}`);

    const response = await fetch(`/api/projects/${selectedProject.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ tasks: updatedTasks }),
    });

    const data = await response.json();
    if (response.status === 401) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setSessionExpired(true);
    }
    if (response.ok) {
      setSelectedProject((prev) => ({
        ...prev,
        tasks: updatedTasks,
      }));

      console.log("Tasks successfully added");
    } else {
      console.log({ error: data.error });
    }
  }

  async function runMatcher() {
    const token = localStorage.getItem("token");

    const response = await fetch("/api/embed", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: textboxInput,
        tasks: selectedProject.tasks,
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

  return (
    <div className="flex flex-col col-span-2 space-y-6 overflow-y-auto">
      {/* Project Selection Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="selectProject" className="text-lg font-medium">
            Select Project <span className="text-gray-500">or</span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg border-2 border-black/70 bg-orange-300 px-4 py-2 text-sm font-bold text-black/70 hover:bg-orange-400 ml-3"
            >
              Create New Project
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
            <h1 className="text-xl">Tasks for {selectedProject.name}</h1>
            <button
              onClick={() => setShowTasks(!showTasks)}
              className="rounded-lg border-2 border-black/70 bg-orange-300 px-4 py-2 text-sm font-bold text-black/70 hover:bg-orange-400"
            >
              {showTasks ? "Hide Tasks" : "Show Tasks"}
            </button>
          </div>
          {showTasks && (
            <div className="flex flex-wrap gap-2">
              {selectedProject.tasks.length > 0 ? (
                selectedProject.tasks.map((task, index) => (
                  <span
                    key={index}
                    className="bg-orange-100 text-gray-700 px-3 py-1 rounded-full border border-orange-200 text-sm"
                  >
                    {task}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 italic">No tasks yet</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Task Management Section */}
      {selectedProject.id !== 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setMatcherButton(true);
                setTasksButton(false);
              }}
              className={`px-4 py-2 rounded-lg border-2 ${
                matcherButton
                  ? "border-black bg-orange-300"
                  : "border-gray-300 hover:border-black"
              }`}
            >
              Run Matcher
            </button>
            <span className="text-gray-500">or</span>
            <button
              onClick={() => {
                setMatcherButton(false);
                setTasksButton(true);
              }}
              className={`px-4 py-2 rounded-lg border-2 ${
                tasksButton
                  ? "border-black bg-orange-300"
                  : "border-gray-300 hover:border-black"
              }`}
            >
              Add Tasks to '{selectedProject.name}'
            </button>
            <CornerRightDown size={16} />
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
              disabled={!matcherButton}
              onClick={runMatcher}
              className="rounded-lg border-2 border-black/70 bg-orange-300 px-6 py-3 text-lg font-bold text-black/70 hover:bg-orange-400 disabled:text-gray-400 disabled:border-gray-400 disabled:bg-orange-50"
            >
              Run Matcher
            </button>
            <button
              disabled={!tasksButton}
              onClick={patchTasks}
              className="rounded-lg border-2 border-black/70 bg-orange-300 px-6 py-3 text-lg font-bold text-black/70 hover:bg-orange-400 disabled:text-gray-400 disabled:border-gray-400 disabled:bg-orange-50"
            >
              Add Tasks
            </button>
            <h1>Best match: {bestTask}</h1>
          </div>
        </div>
      )}

      {/* Modal for Creating New Project */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            <label
              htmlFor="modalProjectName"
              className="block text-sm font-medium mb-2"
            >
              Project Name
            </label>
            <input
              id="modalProjectName"
              type="text"
              placeholder="Enter project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full p-2 border-2 border-black/70 rounded-lg mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setNewProjectName("");
                }}
                className="px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={postProject}
                disabled={!newProjectName.trim()}
                className="px-4 py-2 rounded-lg border-2 border-black/70 bg-orange-300 text-black/70 hover:bg-orange-400 disabled:text-gray-400 disabled:border-gray-400 disabled:bg-orange-50"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
