import React, { useState } from "react";

const Login = ({ toggleView }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "http://74.248.77.144/adoptions/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userName, password }),
        }
      );

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", userName); // ✅ Save username

      alert("Login Successful!");
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 w-96 border-t-4 border-purple-600">
      <h2 className="text-2xl font-bold text-center text-purple-700 mb-4">
        Welcome Back!
      </h2>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold py-3 rounded-md shadow-md transition-all"
          onClick={handleLogin}
        >
          Sign In
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      )}

      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          className="text-purple-500 hover:underline font-semibold"
          onClick={() => toggleView("register")}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;
