import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminProgress = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [students, setStudents] = useState([]);

  const navigate = useNavigate();

  const loadCourses = async () => {
    try {
      const response = await fetch(
        "http://localhost:5284/api/Admin/all-courses",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("adminToken"),
          },
        }
      );
      const data = await response.json();
      setCourses(data);
    } catch {
      alert("Error loading courses");
      navigate("/admin/courses");
    }
  };

  const loadProgress = async (courseId) => {
    try {
      const response = await fetch(
        `http://localhost:5284/api/admin/course-progress/${courseId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("adminToken"),
          },
        }
      );

      const data = await response.json();
      setStudents(data);
    } catch {
      alert("Failed loading progress");
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCourseChange = (e) => {
    const id = e.target.value;
    setSelectedCourseId(id);

    if (id) {
      loadProgress(id);
    } else {
      setStudents([]);
    }
  };

  return (
    <div className="course">
      <h2>Student Progress</h2>

      <select
        className="input"
        value={selectedCourseId}
        onChange={handleCourseChange}
      >
        <option value="">-- Select Course --</option>
        {courses.map((c) => (
          <option key={c.courseId} value={c.courseId}>
            {c.courseName}
          </option>
        ))}
      </select>

      <br />
      <br />

      {selectedCourseId && (
        <table border="1" cellPadding={10}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Completed</th>
              <th>Progress</th>
            </tr>
          </thead>

          <tbody>
            {students.length > 0 ? (
              students.map((s) => (
                <tr key={s.studentId}>
                  <td>{s.studentName}</td>
                  <td>
                    {s.completedTopics}/{s.totalTopics}
                  </td>
                  <td>{s.progress}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No students enrolled
                </td>
              </tr> 
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminProgress;
