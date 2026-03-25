import { Info } from "lucide-react";

function displayInfo() {
  return (
    <>
      <p>
        This app uses openAI's embed and similarities logic and Harvest's API to
        automatically link task descriptions to project tasks and submit time
        entries. A user is required to have a Harvest account and must provide
        their API token, account Id, and email. All sensitive data is secure via
        AES-256 encryption with bcrypt for account password hashing.
      </p>
    </>
  );
}

export default function Header() {
  return (
    <div className="flex flex-col justify-center items-center">
      <header className=" absolute top-0 left-0 w-full p-4 bg-orange-50 text-black/70 text-center font-bold border-2 border-black/70">
        Harvest Auto Logger
        <p className="italic text-sm">Developed by Nicholas Girmes</p>
        <p onMouseOver={() => displayInfo()} className="hover:text-orange-400">
          <Info />
        </p>
      </header>
    </div>
  );
}
