import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StudentTopics from "../Student/StudentTopics";

jest.mock("react-router-dom", () => ({
  useParams: () => ({ studentId: "1", courseId: "10" })
}));

beforeEach(() => {
  global.fetch = jest.fn();
  window.alert = jest.fn();
});

const mockData = {
  allTopics: [
    { topicId: 1, topicName: "Intro" },
    { topicId: 2, topicName: "Hooks" }
  ],
  completedTopics: [1],
  progressPercentage: 50
};

test("renders topics", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockData
  });

  render(<StudentTopics />);

  expect(await screen.findByText("Intro")).toBeInTheDocument();
  expect(screen.getByText("50% Completed")).toBeInTheDocument();
});

test("handles API failure", async () => {
  fetch.mockResolvedValueOnce({ ok: false });

  render(<StudentTopics />);

  expect(await screen.findByText(/failed/i)).toBeInTheDocument();
});

test("complete topic flow", async () => {
  fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    })
    .mockResolvedValueOnce({ ok: true });

  render(<StudentTopics />);

  const boxes = await screen.findAllByRole("checkbox");
  fireEvent.click(boxes[boxes.length - 1]);

  await waitFor(() =>
    expect(fetch).toHaveBeenCalledTimes(2)
  );
});
