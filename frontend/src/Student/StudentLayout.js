import React from "react";
import { Outlet } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";
import "./student.css";

const StudentLayout = () => {
  return (
    <div className="main">
      <StudentNavbar />

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;
