import { useState } from "react";

import AuthPanel from "../components/AuthPanel";
import MainPanel from "../components/MainPanel";
import Header from "../components/Header";

type ApiResponse<T> = {
  status: number;
  data: T;
};

export type ApiFunction = <T>(
  url: string,
  options?: RequestInit,
) => Promise<ApiResponse<T>>;

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [sessionExpired, setSessionExpired] = useState<boolean>(true);

  function logout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setSessionExpired(true);
  }

  async function api<T>(
    url: string,
    options?: RequestInit,
  ): Promise<ApiResponse<T>> {
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.status === 401) logout();
    if (!response.ok) throw new Error(data.error || "Request Failed");
    return { status: response.status, data };
  }

  return (
    <>
      <Header />
      <div className="bg-orange-200 h-screen w-screen flex items-center justify-center">
        <div className="grid grid-cols-3 grid-rows-1 gap-6 relative bg-orange-50 p-8 rounded-lg shadow-lg w-3/4 h-3/4 border-2 border-black/70">
          <MainPanel api={api} />
          <AuthPanel
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            sessionExpired={sessionExpired}
            api={api}
          />
        </div>
      </div>
    </>
  );
}
