import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AllCourses from "../AllCourses";

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn()
}));

beforeEach(() => {
  global.fetch = jest.fn();
});

test("renders courses", async () => {
  fetch.mockResolvedValue({
    text: async () =>
      JSON.stringify([
        {
          courseId: 1,
          courseName: "React",
          courseCapacity: 10,
          remainingSeats: 5
        }
      ])
  });

  render(<AllCourses />);

  expect(await screen.findByText("React")).toBeInTheDocument();
});
