import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./student.css";

const StudentDashboard = () => {

  const studentId = localStorage.getItem("studentId");
  const studentName = localStorage.getItem("studentname");

  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      const response = await fetch(
        `http://localhost:5284/api/Student/my-enrollments/${studentId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("adminToken")
          }
        }
      );

      const data = await response.json();
      setEnrollments(data?.enrolledCourses || []);

    } catch {
      alert("Error loading enrollments");
    }
  };

  const unenrollCourse = async (courseId) => {
    const confirmUnenroll = window.confirm("Are you sure you want to unenroll?");
    if (!confirmUnenroll) return;

    try {
      const response = await fetch(
        `http://localhost:5284/api/Student/unenroll/${studentId}/${courseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("adminToken"),
          },
        }
      );

      const text = await response.text();
      alert(text);

      loadEnrollments();

    } catch {
      alert("Error unenrolling from course");
    }
  };

  return (
    <div className="main">

      <h2 style={{ marginTop: "-50px" }}>Student Details</h2>

      <div className="studentbox">
        <table className="studenttable">
          <tbody>
            <tr>
              <th>ID</th>
              <td>{studentId}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{studentName}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 style={{ marginTop: "20px" }}>My Enrollments</h2>

      <div className="studentbox">
        <table className="studenttable">
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {enrollments.length > 0 ? (
              enrollments.map((course) => (
                <tr key={course.courseId}>
                  <td>{course.courseId}</td>
                  <td>{course.courseName}</td>
                  <td>
                    <button
                      style={{
                        background: "#0066ff",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        marginRight: "6px"
                      }}
                      onClick={() =>
                        navigate(`/student/${studentId}/topics/${course.courseId}`)
                      }
                    >
                      Topics
                    </button>

                    <button
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                      onClick={() => unenrollCourse(course.courseId)}
                    >
                      Unenroll
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", color: "gray" }}>
                  No enrollments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default StudentDashboard;
