import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const AuthLogic = () => {
  const [view, setView] = useState("login");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-purple-200">
      {view === "login" ? (
        <Login toggleView={setView} />
      ) : (
        <Register toggleView={setView} />
      )}
    </div>
  );
};

export default AuthLogic;
