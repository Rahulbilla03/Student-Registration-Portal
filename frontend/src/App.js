import { Routes, Route } from "react-router-dom";

import AdminLayout from "./Admin/AdminLayout";
import AdminDashboard from "./Admin/AdminDashboard";
import RegisterStudent from "./Admin/RegisterStudent";
import CreateCourse from "./Admin/CreateCourse";
import UpdateCourse from "./Admin/UpdateCourse";
import DeleteCourse from "./Admin/DeleteCourse";
import DeleteStudent from "./Admin/DeleteStudent";
import CourseEnrollments from "./Admin/CourseEnrollments";
import UpdateStudent from "./Admin/UpdateStudent";
import AdminProgress from "./Admin/AdminProgress";

import AllCourses from "./AllCourses";
import AllStudents from "./AllStudents";

import LoginPage from "./LoginPage";

import StudentLayout from "./Student/StudentLayout";
import StudentDashboard from "./Student/StudentDashboard";
import StudentEnroll from "./Student/StudentEnroll";
import StudentTopics from "./Student/StudentTopics";

import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="register" element={<RegisterStudent />} />
        <Route path="courses" element={<AllCourses />} />
        <Route path="students" element={<AllStudents />} />
        <Route path="course-enrollments" element={<CourseEnrollments />} />
        <Route path="create-course" element={<CreateCourse />} />
        <Route path="update-course/:id" element={<UpdateCourse />} />
        <Route path="delete-course" element={<DeleteCourse />} />
        <Route path="delete-student" element={<DeleteStudent />} />
        <Route path="update-student/:id" element={<UpdateStudent />} />
        <Route path="progress" element={<AdminProgress />} />
      </Route>

      <Route
        path="/student/:studentId"
        element={
          <ProtectedRoute>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="all-courses" element={<AllCourses />} />
        <Route path="enroll" element={<StudentEnroll />} />
        <Route path="topics/:courseId" element={<StudentTopics />} />
      </Route>

    </Routes>
  );
}
