import { useState, useEffect, useRef } from "react";
import { CornerRightDown } from "lucide-react";

type Project = {
  name: string;
  tasks: string[];
};

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [task, setTask] = useState("");
  const [authModal, setAuthModal] = useState(false);
  const authModalRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    return !!token;
  });
  const [loginOrRegister, setLoginOrRegister] = useState<"Login" | "Register">(
    "Login",
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        authModalRef.current &&
        !authModalRef.current.contains(e.target as Node)
      ) {
        setAuthModal(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  function reset() {
    setEmail("");
    setPassword("");
  }

  async function login() {
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
      reset();
      getProjects();
      console.log(data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  async function register() {
    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log(data);
      reset();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    reset();
  }

  async function getProjects() {
    const response = await fetch("http://localhost:3000/api/projects", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();
    setProjects(data.projects);
  }

  async function postProject() {
    const projectName = prompt("Enter project name:");
    if (projectName) {
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
      console.log(data);
    }
  }

  return (
    <>
      <div className="bg-orange-300 h-screen w-screen flex items-center justify-center">
        <header className="absolute top-0 left-0 w-full p-4 bg-orange-50 text-black/70 text-center font-bold border-2 border-black/70">
          Harvest Convert & Log
        </header>
        <div className="grid grid-cols-3 relative bg-orange-50 p-8 rounded-lg shadow-lg w-3/4 h-3/4 border-2 border-black/70">
          <div className="flex flex-col col-span-2">
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
              Create Project
            </button>
            <label
              htmlFor="taskdescription"
              className="inline-flex text-lg font-medium text-gray-700 mt-4"
            >
              Task Description
              <CornerRightDown size={16} className="mt-2" />
            </label>
            <textarea
              id="taskdescription"
              placeholder="Description of task..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="rounded-lg border-2 border-black/70"
            />
          </div>
          {!isAuthenticated && (
            <div className="col-span-1 flex h-full flex-col justify-end items-end gap-3">
              <div className="relative">
                {authModal && (
                  <div
                    ref={authModalRef}
                    className="absolute bottom-full mb-2 right-0 bg-orange-50 p-8 rounded-lg shadow-lg border-2 border-black/70 w-72"
                  >
                    <input
                      type="text"
                      placeholder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full mb-4 px-3 py-2 border rounded-lg border-black/70"
                    />
                    <input
                      type="text"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full mb-4 px-3 py-2 border rounded-lg border-black/70"
                    />
                    <button
                      onClick={() => {
                        if (loginOrRegister === "Login") {
                          login();
                        } else {
                          register();
                        }
                      }}
                      className="w-full bg-orange-300 text-black/70 font-bold py-2 rounded-lg hover:bg-orange-400"
                    >
                      {loginOrRegister}
                    </button>
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAuthModal((prev) => !prev);
                    setLoginOrRegister("Login");
                  }}
                  className="rounded-lg border-2 border-black/70 bg-orange-50 px-6 py-3 text-lg font-bold text-black/70 hover:bg-orange-300 w-72"
                >
                  Login
                </button>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAuthModal((prev) => !prev);
                  setLoginOrRegister("Register");
                }}
                className="rounded-lg border-2 border-black/70 bg-orange-50 px-6 py-3 text-lg font-bold text-black/70 hover:bg-orange-300  w-72"
              >
                Register
              </button>
            </div>
          )}
          {isAuthenticated && (
            <div className="col-span-1 flex h-full flex-col justify-end items-end gap-3">
              <button
                onClick={() => logout()}
                className="rounded-lg border-2 border-black/70 bg-orange-50 px-6 py-3 text-lg font-bold text-black/70 hover:bg-orange-300 w-72"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
