import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteCourse from "../Admin/DeleteCourse";

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn()
}));

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: async () => [
      { courseId: 1, courseName: "React", courseCapacity: 10 }
    ]
  });

  window.confirm = jest.fn(() => true);
  window.alert = jest.fn();
});

test("renders courses", async () => {
  render(<DeleteCourse />);
  expect(await screen.findByText("React")).toBeInTheDocument();
});

test("delete flow", async () => {
  render(<DeleteCourse />);

  fireEvent.click(await screen.findByText("Delete"));

  expect(window.confirm).toHaveBeenCalled();
});
