import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Dev() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.userId !== "1") {
        navigate("/");
      }
    }
  });

  async function dev() {
    const response = await fetch("http://localhost:3000/api/dev", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();
    console.log(data);
  }

  return (
    <>
      <p>hi</p>
    </>
  );
}
