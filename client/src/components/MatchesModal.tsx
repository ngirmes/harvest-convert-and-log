import type { Log } from "./MainPanel";
import { useState } from "react";
import { X } from "lucide-react";

type MatchesModalProps = {
  logs: Log[];
  projectName: string;
  setMatchesModal: (value: boolean) => void;
  submitLogs: (value: Log[]) => void;
};

export default function MatchesModal({
  logs,
  projectName,
  setMatchesModal,
  submitLogs,
}: MatchesModalProps) {
  const [times, setTimes] = useState(logs.map(() => ({ start: "", end: "" })));

  function updateTime(index: number, field: "start" | "end", value: string) {
    setTimes((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    );
  }

  function calculateHours(start: string, end: string) {
    if (!start || !end) return 0;

    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    return Math.max((endMinutes - startMinutes) / 60, 0);
  }

  const computedHours = logs.map((_, i) => {
    const base = calculateHours(times[i].start, times[i].end);
    return base;
  });

  const totalHours = computedHours.reduce((a, b) => a + b, 0);

  function submit() {
    const logsWithHours = logs.map((log, i) => ({
      ...log,
      hours: computedHours[i],
    }));

    console.log("Submitting logs:", logsWithHours);
    submitLogs(logsWithHours);
  }
  return (
    <div className="fixed inset-0 z-[9998] bg-black/40 flex items-center justify-center">
      <div className="relative bg-white rounded-xl shadow-lg w-[800px] max-h-[80vh] overflow-y-auto p-6">
        <button
          onClick={() => setMatchesModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">{projectName}</h2>

        <div className="grid grid-cols-6 font-semibold border-b pb-2 mb-3">
          <div>Task</div>
          <div>Description</div>
          <div>Start</div>
          <div>End</div>
          <div>Hours</div>
          <div></div>
        </div>

        {logs.map((log, i) => (
          <div
            key={i}
            className="grid grid-cols-5 items-center gap-3 py-2 border-b"
          >
            <div className="text-sm">{log.task_name}</div>

            <div className="text-sm text-gray-700">{log.notes}</div>

            <input
              type="time"
              value={times[i].start}
              onChange={(e) => updateTime(i, "start", e.target.value)}
              className="border rounded px-2 py-1"
            />

            <input
              type="time"
              value={times[i].end}
              onChange={(e) => updateTime(i, "end", e.target.value)}
              className="border rounded px-2 py-1"
            />

            <div className="text-sm font-medium text-center">
              {computedHours[i].toFixed(2)}
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mt-6 border-t pt-4">
          <div className="font-semibold text-lg">
            Total Hours: {totalHours.toFixed(2)}
          </div>

          <button
            onClick={submit}
            className="bg-orange-300 hover:bg-orange-400 font-bold px-6 py-2 rounded-lg"
          >
            Submit Logs to Harvest
          </button>
        </div>
      </div>
    </div>
  );
}
