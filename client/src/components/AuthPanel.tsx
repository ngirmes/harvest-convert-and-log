import { useState, useEffect, useRef } from "react";
import { CircleCheck } from "lucide-react";
import type { ApiFunction } from "../pages/Dashboard";
import Instructions from "./Instructions";

type AuthPanelProps = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  sessionExpired: boolean;
  setSessionExpired: (value: boolean) => void;
  api: ApiFunction;
};

export default function AuthPanel({
  isAuthenticated,
  setIsAuthenticated,
  sessionExpired,
  setSessionExpired,
  api,
}: AuthPanelProps) {
  const [authModal, setAuthModal] = useState(false);
  const authModalRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginOrRegister, setLoginOrRegister] = useState<"Login" | "Register">(
    "Login",
  );
  const [regMessage, setRegMessage] = useState<string | null>(null);
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
    async function checkAuth() {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await fetch("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data);
        if (data.message === "Valid token") {
          return setIsAuthenticated(true);
        }
      }
    }
    checkAuth();
  }, []);

  function reset() {
    setEmail("");
    setPassword("");
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

      console.log(response.message);
      localStorage.setItem("token", response.token);
      reset();
      setSessionExpired(false);
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error);
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

      setRegMessage(response.message);
      setTimeout(() => {
        setRegMessage(null);
      }, 2000);
      reset();
    } catch (error) {
      console.error("Registration failed:", error);
      setRegMessage("Registration failed. Please try again.");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    reset();
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
              <div className="italic text-green-600 text-sm">
                {regMessage && (
                  <p className="text-sm p-2 flex">
                    <CircleCheck className="text-green-600" />
                    Registration Successful <br></br>
                    Please log in
                  </p>
                )}
              </div>
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
    );
  }

  return (
    <div className="justify-end col-span-1 flex h-full flex-col gap-3">
      <div className="w-full max-h-100 overflow-y-auto">
        <Instructions />
      </div>

      <button
        onClick={() => logout()}
        className="rounded-lg border-2 border-black/70 bg-orange-50 px-6 py-3 text-lg font-bold text-black/70 hover:bg-orange-300 w-72"
      >
        Logout
      </button>
    </div>
  );
}
