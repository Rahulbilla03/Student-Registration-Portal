import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminProgress from "../Admin/AdminProgress";

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn()
}));

beforeEach(() => {
  global.fetch = jest.fn();
  window.alert = jest.fn();
});

test("loads courses + progress", async () => {
  fetch
    .mockResolvedValueOnce({
      json: async () => [{ courseId: 1, courseName: "React" }]
    })
    .mockResolvedValueOnce({
      json: async () => [
        {
          studentName: "Rahul",
          completedTopics: 2,
          totalTopics: 4,
          progress: 50
        }
      ]
    });

  render(<AdminProgress />);

  // ✅ WAIT for course option to exist
  await screen.findByText("React");

  // ✅ THEN change dropdown value
  fireEvent.change(screen.getByRole("combobox"), {
    target: { value: "1" }
  });

  // ✅ NOW the progress API runs
  expect(await screen.findByText("Rahul")).toBeInTheDocument();
});

test("load failure", async () => {
  fetch.mockRejectedValueOnce(new Error("fail"));

  render(<AdminProgress />);

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalled();
  });
});
