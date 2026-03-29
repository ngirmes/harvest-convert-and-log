import type { ReactNode } from "react";

type ButtonProps = {
  onClick?: () => void;
  children: ReactNode;
};

export default function Button({ onClick, children }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border-2 border-black/70 bg-orange-50 px-6 py-3 text-lg font-bold text-black/70 hover:bg-orange-300 w-72"
    >
      {children}
    </button>
  );
}
