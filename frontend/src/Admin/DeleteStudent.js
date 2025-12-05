import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DeleteStudent = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await fetch("http://localhost:5284/api/Admin/all-students");
      const text = await res.text();

      try {
        setStudents(JSON.parse(text));
      } catch {
        setStudents([]);
      }
    } catch {
      alert("Error loading students");
    }
  };

  const deleteStudent = async (student) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete student: ${student.userName}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5284/api/Admin/delete/student/${student.studentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("adminToken"),
          },
        }
      );

      const text = await response.text();
      alert(text);

      loadStudents();
    } catch {
      alert("Error deleting student");
    }
  };

  const updateStudent = (student) => {
    navigate(`/admin/update-student/${student.studentId}`);
  };


  const filteredStudents = students.filter((s) => s.userName.toLowerCase().includes(search.toLowerCase())) ;

  return (
    <div className="course">
      <h2>Delete / Update Student</h2>
      <input
        className="input"
        placeholder="Search By Name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "300px", marginBottom: "20px" }}
      />

      <h2 style={{ marginTop: "20px" }}>Available Students</h2>

      <div className="coursebox">
        {filteredStudents.length > 0 ? (
          <table className="coursetable">
            <thead>
              <tr>
                <th>ID</th>
                <th>User Name</th>
                <th>Email</th>
                <th>Enrolled Courses</th>
                <th colSpan="2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.studentId}>
                  <td>{s.studentId}</td>
                  <td>{s.userName}</td>
                  <td>{s.emailId}</td>
                  <td>{s.enrolledCourses}</td>
                  <td>
                    <button
                      onClick={() => updateStudent(s)}
                      style={{
                        background: "#2d6cdf",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold"
                      }}
                    >
                      Update
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => deleteStudent(s)}
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold"
                      }}
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No students found</p>
        )}
      </div>
    </div>
  );
};

export default DeleteStudent;
