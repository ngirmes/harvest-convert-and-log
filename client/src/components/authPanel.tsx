import { useState, useEffect, useRef } from "react";

export default function AuthPanel() {
  const [authModal, setAuthModal] = useState(false);
  const authModalRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userID, setUserID] = useState(0);
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
      if (response.ok) {
        localStorage.setItem("token", data.token);
        setUserID(data.userId);
        reset();
        setIsAuthenticated(true);
        console.log(data);
      } else {
        console.log({ error: data.error });
      }
    } catch (error) {
      console.log(error);
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
  if (!isAuthenticated) {
    return (
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
    );
  }

  return (
    <div className="col-span-1 flex h-full flex-col justify-end items-end gap-3">
      <button
        onClick={() => logout()}
        className="rounded-lg border-2 border-black/70 bg-orange-50 px-6 py-3 text-lg font-bold text-black/70 hover:bg-orange-300 w-72"
      >
        Logout
      </button>
    </div>
  );
}
