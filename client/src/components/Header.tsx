import { useState } from "react";
import { Info, Github, Linkedin, X } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between w-full p-4 bg-orange-50 border-b-2 border-black/70">
        <div>
          <h1 className="font-bold text-2xl">Harvest Auto Logger</h1>
          <p className="text-sm italic text-black/60">
            Developed by Nicholas Girmes
          </p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/ngirmes/harvest-convert-and-log"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-500"
          >
            <Github size={30} />
          </a>

          <a
            href="www.linkedin.com/in/nicholas-girmes"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-500"
          >
            <Linkedin size={30} />
          </a>

          <button
            onClick={() => setOpen(true)}
            className="hover:text-orange-500"
          >
            <Info size={30} />
          </button>
        </div>
      </header>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
          <div className="bg-white w-[420px] p-6 rounded-lg shadow-xl relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-bold mb-1">Harvest Auto Logger</h2>

            <p className="text-sm text-gray-600 mb-4">
              AI-assisted tool that automatically matches natural language task
              descriptions to Harvest project tasks using embeddings.
            </p>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  Tech Stack
                </p>
                <p>
                  React • TypeScript • Node • OpenAI API • Harvest API • SQLite
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  Security
                </p>
                <p>
                  Credentials encrypted using AES-256. Passwords hashed with
                  bcrypt.
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  Links
                </p>

                <div className="flex gap-4 mt-1">
                  <a
                    href="https://github.com/ngirmes/harvest-convert-and-log"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-orange-500"
                  >
                    <Github size={16} />
                    GitHub
                  </a>

                  <a
                    href="www.linkedin.com/in/nicholas-girmes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-orange-500"
                  >
                    <Linkedin size={16} />
                    LinkedIn
                  </a>
                </div>
              </div>

              <div className="text-xs text-gray-500">v1.0.0</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
