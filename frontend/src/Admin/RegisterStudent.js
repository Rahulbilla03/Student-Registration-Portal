import React, { useState } from "react";

const RegisterStudent = () => {
  const [student, setStudent] = useState({
    userName: "",
    address: "",
    emailId: "",
    phone: "",
    dob: "",
    password: "",
  });

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const res = await fetch("http://localhost:5284/api/Admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("adminToken"),
        },
        body: JSON.stringify(student),
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      if (!res.ok) {
        const message = data?.errors
          ? Object.values(data.errors).flat().join("\n")
          : data;

        alert(message);
        return;
      }

      alert(data);

      setStudent({
        userName: "",
        address: "",
        emailId: "",
        phone: "",
        dob: "",
        password: "",
      });

    } catch {
      alert("Something went wrong");
    }
  };

  return (
    <div className="course">
      <h2>Register Student</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="input"
          name="userName"
          placeholder="Username"
          value={student.userName}
          onChange={handleChange}
          required
        /><br />

        <textarea
          className="input"
          name="address"
          placeholder="Address"
          value={student.address}
          onChange={handleChange}
          required
        /><br />

        <input
          className="input"
          name="emailId"
          type="email"
          placeholder="Email"
          value={student.emailId}
          onChange={handleChange}
          required
        /><br />

        <input
          className="input"
          name="phone"
          placeholder="Phone (max 10 digits)"
          maxLength={10}
          value={student.phone}
          onChange={handleChange}
          required
        /><br />

        <input
          className="input"
          name="dob"
          type="date"
          value={student.dob}
          onChange={handleChange}
          required
        /><br />

        <input
          className="input"
          name="password"
          type="password"
          placeholder="Password (6–20 characters)"
          value={student.password}
          minLength={6}
          maxLength={20}
          onChange={handleChange}
          required
        />

        {student.password.length > 0 && student.password.length < 6 && (
          <p style={{ color: "red" }}>Password must be at least 6 characters</p>
        )}

        {student.password.length > 20 && (
          <p style={{ color: "red" }}>Password cannot exceed 20 characters</p>
        )}
        <br />

        <button type="submit" className="coursesearch">
          Register
        </button>
      </form>

    
    </div>
  );
};

export default RegisterStudent;
