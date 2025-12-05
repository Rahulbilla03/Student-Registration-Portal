import React from "react";
import RegisterStudent from "./RegisterStudent";

const AdminDashboard = () => {
  const getAdminNameFromToken = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return "Admin";

    const payload = token.split(".")[1];
    if (!payload) return "Admin";

    try {
      const decoded = JSON.parse(atob(payload));
      return  decoded.unique_name ||  "Admin";
    } catch {
      return "Admin";
    }
  };

  const adminName = getAdminNameFromToken();

  return (
    <div className="course">
      <h1>Welcome, {adminName}</h1>

      <RegisterStudent />
    </div>
  );
};

export default AdminDashboard;
