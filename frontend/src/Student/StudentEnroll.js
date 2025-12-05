import React, { useState, useEffect } from "react";
import "./student.css";

const StudentEnroll = () => {
  const studentId = localStorage.getItem("studentId");

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    loadCourses();
    loadMyEnrollments();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await fetch("http://localhost:5284/api/Admin/all-courses");
      const data = await res.json();
      setCourses(data);
    } catch {
      setCourses([]);
    }
  };

  const loadMyEnrollments = async () => {
    try {
      const res = await fetch(
        `http://localhost:5284/api/Student/my-enrollments/${studentId}`
      );
      const text = await res.text();

      try {
        const data = JSON.parse(text);
        if (data?.enrolledCourses) {
          setEnrolledCourses(data.enrolledCourses.map((c) => c.courseId));
        } else {
          setEnrolledCourses([]);
        }
      } catch {
        setEnrolledCourses([]);
      }
    } catch {
      setEnrolledCourses([]);
    }
  };

  const enrollCourse = async (courseId) => {
    const course = courses.find(c => c.courseId === courseId); 
    const yes = window.confirm(`Are you sure you want to enroll in "${course.courseName}"?`);
    if (!yes) return;

    try {
      const res = await fetch("http://localhost:5284/api/Student/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: Number(studentId),
          courseId: Number(courseId),
        }),
      });

      alert(await res.text());

      loadCourses();
      loadMyEnrollments();
    } catch {
      alert("Error enrolling");
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.courseName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main">
      <h2 style={{ marginTop: "-50px" }}>Enroll in Course</h2>

      <input
        className="input"
        placeholder="Search Course by Name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "300px", marginBottom: "20px" }}
      />

      <h2>Available Courses</h2>

      <div className="studentbox">
        <table className="studenttable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Course Name</th>
              <th>Capacity</th>
              <th>Remaining Seats</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredCourses.map((c) => {
              const isEnrolled = enrolledCourses.includes(c.courseId);
              const isFull = c.remainingSeats === 0;

              return (
                <tr
                  key={c.courseId}
                  className={
                    isFull
                      ? "fullcourserow"
                      : isEnrolled
                      ? "enrolledrow"
                      : ""
                  }
                >
                  <td>{c.courseId}</td>
                  <td>{c.courseName}</td>
                  <td>{c.courseCapacity}</td>
                  <td>{c.remainingSeats}</td>

                 <td>
                    {isFull ? (
                      <button
                        disabled
                        style={{
                          background: "gray",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          fontWeight: "bold",
                          cursor: "not-allowed",
                        }}
                      >
                        Full
                      </button>
                    ) : isEnrolled ? (
                      <button
                        disabled
                        style={{
                          background: "orange",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          fontWeight: "bold",
                          cursor: "not-allowed",
                        }}
                      >
                        Enrolled
                      </button>
                    ) : (
                      <button
                        onClick={() => enrollCourse(c.courseId)}
                        style={{
                          background: "green",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Enroll
                      </button>
                    )}
                  </td>

                </tr>
              );
            })}

            {filteredCourses.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", color: "gray" }}>
                  No courses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentEnroll;
