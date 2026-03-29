import React, { useState, useEffect, useRef } from "react";
import { CircleCheck } from "lucide-react";
import type { ApiFunction } from "../pages/Dashboard";
import Instructions from "./Instructions";
import Button from "./Button";
import { MoveLeft, MoveRight } from "lucide-react";
type AuthPanelProps = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  sessionExpired: boolean;
  api: ApiFunction;
};

export default function AuthPanel({
  isAuthenticated,
  setIsAuthenticated,
  sessionExpired,
  api,
}: AuthPanelProps) {
  const [authModal, setAuthModal] = useState(false);
  const [harvestModal, setHarvestModal] = useState(false);
  const authModalRef = useRef<HTMLDivElement>(null);
  const harvestModalRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginOrRegister, setLoginOrRegister] = useState<"Login" | "Register">(
    "Login",
  );

  const [message, setMessage] = useState("");
  const [harvest_token, setHarvestToken] = useState("");
  const [harvest_id, setHarvestId] = useState("");
  const [harvest_email, setHarvestEmail] = useState("");
  // const [timer, setTimer] = useState(15 * 60 * 1000);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        harvestModalRef.current &&
        !harvestModalRef.current.contains(e.target as Node)
      ) {
        setHarvestModal(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (loginOrRegister === "Login") {
      login();
    } else {
      register();
    }
  }

  function reset() {
    setEmail("");
    setPassword("");
    setHarvestEmail("");
    setHarvestId("");
    setHarvestToken("");
  }

  async function login() {
    try {
      const response = await api<{ message: string; token: string }>(
        "/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      console.log(response.data.message);
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      alert(response.data.message);
    } catch (error) {
      alert(error);
    }
  }

  async function register() {
    try {
      const response = await api<{ message: string }>("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      setMessage(response.data.message);
      alert(response.data.message);
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error);
      //setMessage("Registration failed. Please try again.");
    }
  }

  async function setCredentials() {
    const token = localStorage.getItem("token");
    try {
      const response = await api<{ status: number | null; message: string }>(
        "/api/credentials",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            harvest_token,
            harvest_id,
            harvest_email,
          }),
        },
      );

      if (response.status === 401) {
        reset();
      }
      alert(response.data.message);
    } catch (error) {
      console.error("Setting credentials failed:", error);
      //setMessage("Setting credentials failed. Please try again.");
      alert(error);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="col-span-1 flex h-full flex-col justify-end items-end gap-3">
        {sessionExpired && (
          <div className="bg-red-200 text-red-800 p-3 rounded w-72 text-center">
            Please log in.
          </div>
        )}
        <div className="relative">
          {authModal && (
            <div
              ref={authModalRef}
              className="absolute bottom-full mb-2 right-0 bg-orange-50 p-8 rounded-lg shadow-lg border-2 border-black/70 w-72"
            >
              {" "}
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mb-4 px-3 py-2 border rounded-lg border-black/70"
                />
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mb-4 px-3 py-2 border rounded-lg border-black/70"
                />
                <button
                  type="submit"
                  className="w-full bg-orange-300 text-black/70 font-bold py-2 rounded-lg hover:bg-orange-400"
                >
                  {loginOrRegister}
                </button>
              </form>
              <div className="italic text-green-600 text-sm">
                {message && (
                  <p className="text-sm p-2 flex">
                    <CircleCheck className="text-green-600" />
                    {message} <br></br>
                    Please log in
                  </p>
                )}
              </div>
            </div>
          )}

          <Button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setAuthModal((prev) => !prev);
              setLoginOrRegister("Login");
            }}
          >
            Login
          </Button>
        </div>

        <Button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setAuthModal((prev) => !prev);
            setLoginOrRegister("Register");
          }}
        >
          Register
        </Button>
      </div>
    );
  }

  return (
    <div className="col-span-1 flex h-full flex-col gap-3">
      <div className="w-full overflow-y-auto flex-1">
        <Instructions />
      </div>
      <div className="relative">
        {harvestModal && (
          <div
            ref={harvestModalRef}
            className="absolute bottom-full mb-2 bg-orange-50 p-8 rounded-lg shadow-lg border-2 border-black/70 w-72"
          >
            <div className="flex justify-center">
              <a
                href="https://id.getharvest.com/sessions/new?go_back=%2Fdevelopers"
                target="_blank"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 underline text-sm mb-2"
              >
                <MoveRight />
                Obtain Credentials Here
                <MoveLeft />
              </a>
            </div>
            <label htmlFor="token" />
            <input
              id="token"
              type="password"
              placeholder="Token"
              onChange={(e) => setHarvestToken(e.target.value)}
              className="w-full mb-4 px-3 py-2 border rounded-lg border-black/70"
            />
            <label htmlFor="id" />
            <input
              id="id"
              type="text"
              placeholder="Account Id"
              onChange={(e) => setHarvestId(e.target.value)}
              className="w-full mb-4 px-3 py-2 border rounded-lg border-black/70"
            />
            <label htmlFor="harvestEmail" />
            <input
              id="harvestEmail"
              type="text"
              placeholder="Harvest Email"
              onChange={(e) => setHarvestEmail(e.target.value)}
              className="w-full mb-4 px-3 py-2 border rounded-lg border-black/70"
            />
            <button
              onClick={() => setCredentials()}
              type="submit"
              className="rounded-lg border-2 border-black/70 bg-orange-50 px-6 py-3 text-lg font-bold text-black/70 hover:bg-orange-300 w-56"
            >
              Submit Credentials
            </button>
            <div className="italic text-green-600 text-sm"></div>
          </div>
        )}
        <Button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setHarvestModal((prev) => !prev);
          }}
        >
          Set Harvest Credentials
        </Button>
        <div className="p-1" />
        <Button onClick={() => setIsAuthenticated(false)}>Logout</Button>
      </div>
    </div>
  );
}
