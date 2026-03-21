import { BrowserRouter, Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard.tsx";
import Dev from "./Dev/Dev.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dev" element={<Dev />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
