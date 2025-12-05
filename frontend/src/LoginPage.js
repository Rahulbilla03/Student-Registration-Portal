import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const LoginPage = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("adminToken");
  }, []);

  const handleLogin = async () => {
    setMsg("");

    try {
      const admin = await fetch("http://localhost:5284/api/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });

      const adminData = await admin.text();

      if (admin.ok && adminData !== "invalid details") {
        localStorage.setItem("adminToken", adminData);
        const tokenData = JSON.parse(atob(adminData.split(".")[1]));
        const role = tokenData.role;

        if (role === "Admin") {
          navigate("/admin");
          return;
        }
        if (role === "Student") {
          const studentRes = await fetch(`http://localhost:5284/api/Admin/ByUsername/${userName}`);
          const studentData = await studentRes.json();
          localStorage.setItem("studentId", studentData.studentId);
          localStorage.setItem("studentname", userName);
          navigate(`/student/${studentData.studentId}`);
          return;
        }
      }
    } catch {
      alert("Server error");
    }

    setMsg("Invalid username or password");
    setUserName("");
    setPassword("");
  };

  return (
    <div className="login-container">
      <h1 className="portal-title">Win Academy</h1>

      <div className="login-box">
        <h2 className="login-title">Login</h2>

        <input
          type="text"
          className="login-input"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <input
          type="password"
          className="login-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>

        <p className="login-msg">{msg}</p>
      </div>
    </div>
  );
};

export default LoginPage;
