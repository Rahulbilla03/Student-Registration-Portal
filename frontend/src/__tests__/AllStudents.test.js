import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AllStudents from "../AllStudents";

beforeEach(() => {
  global.fetch = jest.fn();
});

test("renders students", async () => {
  fetch.mockResolvedValue({
    ok: true,
    json: async () => [
      {
        studentId: 1,
        userName: "Rahul",
        password: "123",
        address: "India",
        enrolledCourses: 2
      }
    ]
  });

  render(<AllStudents />);

  expect(await screen.findByText("Rahul")).toBeInTheDocument();
});

test("api error", async () => {
  fetch.mockRejectedValue(new Error("network"));
  window.alert = jest.fn();

  render(<AllStudents />);

  await screen.findByText("All Students");

  expect(window.alert).toHaveBeenCalled();
});
