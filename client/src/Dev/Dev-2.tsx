import { useState, useEffect } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    clearInterval(interval);
  }, []);

  return <h1>{count}</h1>;
}
