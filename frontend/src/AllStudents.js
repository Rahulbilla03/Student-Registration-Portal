import React, { useState, useEffect } from "react";

const AllStudents = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [search, setSearch] = useState("");

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:5284/api/Admin/all-students");
      if (!response.ok) throw new Error("Error Fetching Students");

      const data = await response.json();
      setAllStudents(data);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = allStudents.filter((student) =>
    student.userName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="course">
      <h2>All Students</h2>

      <input
        className="input"
        placeholder="Search By Student Name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="coursebox">
        <table className="coursetable">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>User Name</th>
              <th>Password</th>
              <th>Address</th>
              <th>Enrolled Courses</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((item) => (
              <tr key={item.studentId}>
                <td>{item.studentId}</td>
                <td>{item.userName}</td>
                <td>{item.password}</td>
                <td>{item.address}</td>
                <td>{item.enrolledCourses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AllStudents;
