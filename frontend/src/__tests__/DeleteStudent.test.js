import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteStudent from "../Admin/DeleteStudent";

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn()
}));

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    text: async () =>
      JSON.stringify([
        {
          studentId: 1,
          userName: "Rahul",
          emailId: "r@test.com",
          enrolledCourses: 2
        }
      ])
  });

  window.confirm = jest.fn(() => true);
  window.alert = jest.fn();
});

test("renders students", async () => {
  render(<DeleteStudent />);
  expect(await screen.findByText("Rahul")).toBeInTheDocument();
});

test("update navigation", async () => {
  render(<DeleteStudent />);
  fireEvent.click(await screen.findByText("Update"));
});

test("delete flow", async () => {
  render(<DeleteStudent />);
  fireEvent.click(await screen.findByText("Delete"));
  expect(window.confirm).toHaveBeenCalled();
});
