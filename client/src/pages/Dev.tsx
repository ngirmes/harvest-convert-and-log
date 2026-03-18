import { useLocation, useNavigate } from "react-router";

type LocationState = {
  userID: number;
};

export default function Dev() {
  const navigate = useNavigate();
  const location = useLocation() as { state: LocationState };
  const userID = Number(location.state?.userID);

  if (userID !== 1) {
    navigate("/dashboard");
  }

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
