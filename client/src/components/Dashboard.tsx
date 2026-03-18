import { useState } from "react";
import { CornerRightDown } from "lucide-react";

type Project = {
  name: string;
  tasks: string[];
};

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [task, setTask] = useState("");

  console.log(task);

  return (
    <>
      <div className="bg-orange-300 h-screen w-screen flex items-center justify-center">
        <header className="absolute top-0 left-0 w-full p-4 bg-orange-50 text-black/70 text-center font-bold border-2 border-black/70">
          Harvest Convert & Log
        </header>
        <div className="grid grid-cols-3 relative bg-orange-50 p-8 rounded-lg shadow-lg w-3/4 h-3/4 border-2 border-black/70">
          <div className="flex flex-col col-span-2">
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
          <div className="col-span-1 flex h-full flex-col justify-end items-end gap-3">
            <button className="rounded-lg border-2 border-black/70 bg-orange-50 px-6 py-3 text-lg font-bold text-black/70 hover:bg-orange-300 w-72">
              Login
            </button>
            <button className="rounded-lg border-2 border-black/70 bg-orange-50 px-6 py-3 text-lg font-bold text-black/70 hover:bg-orange-300  w-72">
              Register
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
