import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./student.css";

const StudentTopics = () => {

  const { studentId, courseId } = useParams();

  const [topics, setTopics] = useState([]);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const loadTopics = async () => {
    try {
      const response = await fetch(
        `http://localhost:5284/api/student/topics/${studentId}/${courseId}`
      );

      if (!response.ok) {
        setError("Failed to load topics");
        return;
      }

      const data = await response.json();

      setTopics(data.allTopics || []);
      setCompletedTopics(data.completedTopics || []);
      setProgress(data.progressPercentage || 0);

    } catch (err) {
      console.error("Error:", err);
      setError("Error loading topics");
    }
  };

  useEffect(() => {
    loadTopics();
  }, [studentId, courseId]);

  const completeTopic = async (topicId) => {
    try {
      await fetch(
        `http://localhost:5284/api/student/complete-topic?studentId=${studentId}&topicId=${topicId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        }
      );

      loadTopics();

    } catch {
      alert("Error updating completion");
    }
  };

  return (
    <div className="course">

      <h2>Course Topics</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table className="studenttable">

        <thead>
          <tr>
            <th>Topic ID</th>
            <th>Topic Name</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {topics.length > 0 ? (
            topics.map(topic => (
              <tr key={topic.topicId}>
                <td>{topic.topicId}</td>
                <td>{topic.topicName}</td>
                <td style={{ textAlign: "center" }}>

                  <input
                    type="checkbox"
                    checked={completedTopics.includes(topic.topicId)}
                    onChange={() => completeTopic(topic.topicId)}
                  />

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No topics found
              </td>
            </tr>
          )}
        </tbody>

      </table>

      <br />

      <p><strong>{progress}% Completed</strong></p>

    </div>
  );
};

export default StudentTopics;
