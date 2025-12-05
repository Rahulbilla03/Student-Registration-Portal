import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StudentDashboard from "../Student/StudentDashboard";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  localStorage.setItem("studentId", "1");
  localStorage.setItem("studentname", "Rahul");

  global.fetch = jest.fn().mockResolvedValue({
    json: async () => ({
      enrolledCourses: [{ courseId: 10, courseName: "React" }]
    })
  });

  window.alert = jest.fn();
});

test("renders student & enrollments", async () => {
  render(<StudentDashboard />);

  expect(await screen.findByText("Rahul")).toBeInTheDocument();
  expect(await screen.findByText("React")).toBeInTheDocument();
});

test("navigates to topics page", async () => {
  render(<StudentDashboard />);

  const btn = await screen.findByText("Topics");
  fireEvent.click(btn);

  expect(mockNavigate).toHaveBeenCalledWith("/student/1/topics/10");
});

test("unenroll workflow", async () => {
  window.confirm = jest.fn().mockReturnValue(true);

  global.fetch
    .mockResolvedValueOnce({ json: async () => ({ enrolledCourses: [{ courseId: 10, courseName: "React" }] }) })
    .mockResolvedValueOnce({ text: async () => "Success" })
    .mockResolvedValueOnce({ json: async () => ({ enrolledCourses: [] }) });

  render(<StudentDashboard />);

  fireEvent.click(await screen.findByText("Unenroll"));

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalled();
  });
});
