import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    userName: "",
    emailId: "",
    phone: "",
    address: "",
    password: ""
  });

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!id) {
      alert("Invalid student");
      navigate("/admin/delete-student");
      return;
    }
    loadStudent();
  }, [id]);

  const loadStudent = async () => {
    try {
      const res = await fetch("http://localhost:5284/api/Admin/all-students");
      const text = await res.text();

      let students = [];
      try {
        students = JSON.parse(text);
      } catch {
        alert("Error loading student list");
        return;
      }

      const found = students.find((s) => s.studentId === Number(id));

      if (!found) {
        alert("Student not found");
        navigate("/admin/delete-student");
        return;
      }

      setStudent({
        userName: found.userName,
        emailId: found.emailId,
        phone: found.phone,
        address: found.address,
        password: found.password
      });

      setLoaded(true);
    } catch {
      alert("Error loading student");
    }
  };

  const updateStudent = async () => {
    try {
      const res = await fetch(
        `http://localhost:5284/api/Admin/update/student/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("adminToken")
          },
          body: JSON.stringify(student)
        }
      );

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      if (!res.ok) {
        if (data?.errors) {
          const message = Object.values(data.errors).flat().join("\n");
          alert(message);
        } else {
          alert(data);
        }
        return;
      }

      alert(data);
      navigate("/admin/delete-student");

    } catch {
      alert("Error updating student");
    }
  };

  const handleChange = (e) =>
    setStudent({ ...student, [e.target.name]: e.target.value });

  return (
    <div className="course">
      <h2>Update Student</h2>

      {loaded ? (
        <>
          <label>Enter New Username</label><br />
          <input
            className="input"
            name="userName"
            value={student.userName}
            onChange={handleChange}
          /><br />

          <label>Enter New Email</label><br />
          <input
            className="input"
            name="emailId"
            value={student.emailId}
            onChange={handleChange}
          /><br />

          <label>Enter New Phone Number</label><br />
          <input
            className="input"
            name="phone"
            value={student.phone}
            maxLength={10}
            onChange={handleChange}
          /><br />

          <label>Enter New Address</label><br />
          <textarea
            className="input"
            name="address"
            value={student.address}
            onChange={handleChange}
            style={{ height: "70px" }}
          /><br />

          <label>Enter New Password</label><br />
          <input
            className="input"
            name="password"
            type="password"
            value={student.password}
            onChange={handleChange}
          /><br />

          <button className="coursesearch" onClick={updateStudent}>
            Update Student
          </button>
        </>
      ) : (
        <p>Error Occured</p>
      )}
    </div>
  );
};

export default UpdateStudent;
