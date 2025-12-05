import React, { useState, useEffect } from "react";

const CourseEnrollments = () => {
  const [allEnrollments, setAllEnrollments] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [studentCourses, setStudentCourses] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:5284/api/Admin/getallenrollments");
        const text = await res.text();
        try {
          setAllEnrollments(JSON.parse(text));
        } catch {
          alert(text);
          setAllEnrollments([]);
        }
      } catch {
        alert("Error loading enrollments");
      }
    };
    load();
  }, []);

  const searchById = () => {
    if (!studentId) {
      alert("Enter Student ID");
      return;
    }

    const result = allEnrollments.filter(
      (e) => e.studentId.toString() === studentId
    );

    if (result.length === 0) {
      alert("No enrollments found for this student");
      setStudentCourses([]);
      return;
    }

    setStudentCourses(result);
  };

  const grouped = {};
  allEnrollments.forEach((e) => {
    if (!grouped[e.courseName]) grouped[e.courseName] = [];
    grouped[e.courseName].push(e);
  });

  return (
    <div className="course">
      <h2>Enrollments</h2>

      <input
        className="input"
        placeholder="Enter Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />

      <button className="coursesearch" onClick={searchById}>
        Search
      </button>

      {studentCourses.length > 0 && (
        <>
          <h3>
            {studentCourses[0].studentName} Enrolled Courses
            <br /><br />
            Total Courses: {studentCourses.length}
          </h3>

          <div className="coursebox">
            <table className="coursetable">
              <thead>
                <tr>
                  <th>Course Name</th>
                </tr>
              </thead>
              <tbody>
                {studentCourses.map((c, i) => (
                  <tr key={i}>
                    <td>{c.courseName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h2 style={{ marginTop: "20px" }}>All Enrollments (By Course)</h2>

      <div className="coursebox scroll-container">
        <table className="coursetable">
          <thead>
            <tr>
              <th>Course</th>
              <th>Student ID</th>
              <th>Student Name</th>
            </tr>
          </thead>

          <tbody>
            {Object.keys(grouped).map((course) =>
              grouped[course].map((e, index) => (
                <tr key={`${course}-${index}`}>
                  {index === 0 && (
                    <td rowSpan={grouped[course].length}>
                      <b>{course}</b>
                    </td>
                  )}
                  <td>{e.studentId}</td>
                  <td>{e.studentName}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseEnrollments;
