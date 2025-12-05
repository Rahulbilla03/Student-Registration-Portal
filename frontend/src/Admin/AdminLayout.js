import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import "./admin.css";

const AdminLayout = () => {
  const navigate=useNavigate(); 
  return (
    <div className="admin-container">
      <AdminNavbar />

      <div className="sidebar">
  
        <button onClick={() => navigate("/admin/courses")}>All Courses</button>
        <button onClick={() => navigate("/admin/students")}>All Students</button>
        <button onClick={() => navigate("/admin/course-enrollments")}>Enrollments</button>
        <button onClick={() => navigate("/admin/delete-course")}>Delete/Update Course</button>
        <button onClick={() => navigate("/admin/delete-student")}>Delete/Update Student</button>
        <button onClick={() => navigate("/admin/progress")}>Student Progress </button>

      </div>

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
