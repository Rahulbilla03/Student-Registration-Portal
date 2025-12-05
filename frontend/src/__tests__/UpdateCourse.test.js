import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UpdateCourse from "../Admin/UpdateCourse";
import { BrowserRouter } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "1" }),
  useNavigate: () => jest.fn(),
}));

beforeEach(() => {
  global.fetch = jest.fn();
  window.alert = jest.fn();
});

test("loads course and submits update", async () => {
  fetch
    .mockResolvedValueOnce({
      json: async () => [
        { courseId: 1, courseName: "React", courseCapacity: 10 },
      ],
    })
    .mockResolvedValueOnce({
      text: async () => "Updated successfully",
    });

  render(
    <BrowserRouter>
      <UpdateCourse />
    </BrowserRouter>
  );

  expect(await screen.findByDisplayValue("React")).toBeInTheDocument();

  fireEvent.change(screen.getByDisplayValue("React"), {
    target: { value: "Advanced React" },
  });

  fireEvent.click(
    screen.getByRole("button", { name: "Update Course" })
  );

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
