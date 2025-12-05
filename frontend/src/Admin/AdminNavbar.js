import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./admin.css";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === "/admin";

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <div className="admin-header">
        <img 
    src="/image.png"
    alt="icon"
    style={{width:"90px" , height:"30px"}}/>

      <div className="admin-title">Admin Dashboard</div>

      <div className="admin-right">
        {!isDashboard && (
          <button className="admin-btn" onClick={() => navigate("/admin")}>
            Dashboard
          </button>
        )}

        <button className="logout" onClick={logout}>
          Logout
        </button>
      </div>

    </div>
  );
};

export default AdminNavbar;
