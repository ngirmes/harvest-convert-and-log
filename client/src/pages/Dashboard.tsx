import { useState } from "react";

import AuthPanel from "../components/authPanel";
import MainPanel from "../components/mainPanel";
import Header from "../components/header";

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(true);

  return (
    <>
      <div className="bg-orange-200 h-screen w-screen flex items-center justify-center">
        <Header />
        <div className="grid grid-cols-3 relative bg-orange-50 p-8 rounded-lg shadow-lg w-3/4 h-3/4 border-2 border-black/70">
          <MainPanel
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            setSessionExpired={setSessionExpired}
          />
          <AuthPanel
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            sessionExpired={sessionExpired}
            setSessionExpired={setSessionExpired}
          />
        </div>
      </div>
    </>
  );
}
