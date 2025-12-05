import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import CourseEnrollments from "../Admin/CourseEnrollments";

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    text: async () =>
      JSON.stringify([
        { studentId: 1, studentName: "Rahul", courseName: "React" },
        { studentId: 1, studentName: "Rahul", courseName: "DotNet" }
      ])
  });

  window.alert = jest.fn();
});

test("renders grouped enrollments", async () => {
  render(<CourseEnrollments />);
  expect(await screen.findByText("React")).toBeInTheDocument();
});

test("search by student id", async () => {
  render(<CourseEnrollments />);

  fireEvent.change(
    await screen.findByPlaceholderText(/enter student id/i),
    { target: { value: "1" } }
  );

  fireEvent.click(screen.getByText("Search"));

  expect(await screen.findByText(/total courses/i)).toBeInTheDocument();
});

test("empty id validation", async () => {
  render(<CourseEnrollments />);

  fireEvent.click(screen.getByText("Search"));

  expect(window.alert).toHaveBeenCalled();
});
