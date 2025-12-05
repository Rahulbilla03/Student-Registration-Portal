import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateCourse = () => {

  const [courseName, setCourseName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [courseId, setCourseId] = useState(null);
  const [topicName, setTopicName] = useState("");
  const [topics, setTopics] = useState([]);

  const navigate = useNavigate();

  const createCourse = async () => {
    if (!courseName || !capacity) {
      alert("Enter course name and capacity");
      return;
    }

    if (isNaN(capacity)) {
      alert("Capacity must be a number");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5284/api/Course/CreateCourse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("adminToken"),
          },
          body: JSON.stringify({
            courseName,
            courseCapacity: Number(capacity),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);
      setCourseId(data.courseId);

    } catch {
      alert("Error creating course");
    }
  };

  const addTopic = async () => {
    if (!topicName) {
      alert("Enter topic name");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5284/api/course/add-topic?courseId=${courseId}&topicName=${topicName}`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("adminToken"),
          },
        }
      );

      if (!res.ok) {
        alert("Error adding topic");
        return;
      }

      setTopics(prev => [...prev, topicName]);
      setTopicName("");

    } catch {
      alert("Error adding topic");
    }
  };

  return (
    <div className="course">

      <h2>Create Course</h2>

      <input
        className="input"
        placeholder="Course Name"
        value={courseName}
        onChange={e => setCourseName(e.target.value)}
        disabled={courseId !== null}
      /><br/>

      <input
        className="input"
        placeholder="Capacity"
        value={capacity}
        onChange={e => setCapacity(e.target.value)}
        disabled={courseId !== null}
      /><br/>

      {!courseId && (
        <button className="coursesearch" onClick={createCourse}>
          Create Course
        </button>
      )}

      {courseId && (
        <>
          <h3>Add Topics</h3>

          <input
            className="input"
            placeholder="Topic Name"
            value={topicName}
            onChange={e => setTopicName(e.target.value)}
          /><br/>

          <button className="coursesearch" onClick={addTopic}>
            Add Topic
          </button>

          <ul>
            {topics.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>

          <button
            className="coursesearch"
            style={{ marginTop: "10px" }}
            onClick={() => navigate("/admin/courses")}
          >
            Finish
          </button>
        </>
      )}

    </div>
  );
};

export default CreateCourse;
