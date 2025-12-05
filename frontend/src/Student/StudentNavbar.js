import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./student.css";

const StudentNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { studentId } = useParams();
  const name = localStorage.getItem("studentname");

  const isDashboard =
    location.pathname === `/student/${studentId}` ;
  const isEnroll=
    location.pathname === `/student/${studentId}/enroll`;

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="studentheader">
      <img 
        src="/image.png"
        alt="icon"
        style={{ width: "90px", height: "30px" }}
      />

      <div className="headertitle">Student Dashboard</div>

      <div className="headerright">
        <span className="welcome">Welcome, {name}</span>

        {!isDashboard && (
          <button
            className="home"
            onClick={() => navigate(`/student/${studentId}`)}
          >
            Dashboard
          </button>
        )}
        {!isEnroll && (
        <button
          className="home"
          onClick={() => navigate(`/student/${studentId}/enroll`)}
        >
          Enroll
        </button>
        )}

        <button className="logout" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default StudentNavbar;
