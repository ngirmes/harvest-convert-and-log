import { useState } from "react";

import AuthPanel from "../components/AuthPanel";
import MainPanel from "../components/MainPanel";
import Header from "../components/Header";

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Request Failed");
  } else return data;
}

export type ApiFunction = <T>(url: string, options?: RequestInit) => Promise<T>;

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<true | false>(false);
  const [sessionExpired, setSessionExpired] = useState<true | false>(true);

  return (
    <>
      <div className="bg-orange-200 h-screen w-screen flex items-center justify-center">
        <Header />
        <div className="grid grid-cols-3 gap-12 relative bg-orange-50 p-8 rounded-lg shadow-lg w-3/4 h-3/4 border-2 border-black/70">
          <MainPanel
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            setSessionExpired={setSessionExpired}
            api={api}
          />
          <AuthPanel
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            sessionExpired={sessionExpired}
            setSessionExpired={setSessionExpired}
            api={api}
          />
        </div>
      </div>
    </>
  );
}
