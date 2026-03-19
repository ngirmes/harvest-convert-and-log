import AuthPanel from "../components/authPanel";
import MainPanel from "../components/mainPanel";
import Header from "../components/header";

export default function Dashboard() {
  return (
    <>
      <div className="bg-orange-300 h-screen w-screen flex items-center justify-center">
        <Header />
        <div className="grid grid-cols-3 relative bg-orange-50 p-8 rounded-lg shadow-lg w-3/4 h-3/4 border-2 border-black/70">
          <MainPanel />
          <AuthPanel />
        </div>
      </div>
    </>
  );
}
