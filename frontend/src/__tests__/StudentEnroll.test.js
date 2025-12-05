import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StudentEnroll from "../Student/StudentEnroll";

beforeEach(() => {
  global.fetch = jest.fn();
  window.confirm = jest.fn(() => true);
  window.alert = jest.fn();
  localStorage.setItem("studentId", "1");
});

afterEach(() => {
  jest.clearAllMocks();
});

/* ✅ ONE AVAILABLE COURSE FOR ENROLL */
const mockCourses = [
  {
    courseId: 1,
    courseName: "React",
    courseCapacity: 20,
    remainingSeats: 5
  },
  {
    courseId: 2,
    courseName: "DotNet",
    courseCapacity: 15,
    remainingSeats: 0
  }
];

/* ✅ USER IS NOT ENROLLED IN ANY COURSE */
const mockEnrollmentsResponse = {
  enrolledCourses: []
};

test("loads and displays courses", async () => {
  fetch
    .mockResolvedValueOnce({ json: async () => mockCourses })
    .mockResolvedValueOnce({
      text: async () => JSON.stringify(mockEnrollmentsResponse),
    });

  render(<StudentEnroll />);

  expect(await screen.findByText("React")).toBeInTheDocument();
  expect(await screen.findByText("DotNet")).toBeInTheDocument();
});

test("filters courses when searching", async () => {
  fetch
    .mockResolvedValueOnce({ json: async () => mockCourses })
    .mockResolvedValueOnce({
      text: async () => JSON.stringify(mockEnrollmentsResponse),
    });

  render(<StudentEnroll />);

  fireEvent.change(
    await screen.findByPlaceholderText("Search Course by Name"),
    { target: { value: "React" } }
  );

  expect(await screen.findByText("React")).toBeInTheDocument();
  expect(screen.queryByText("DotNet")).not.toBeInTheDocument();
});

test("prevents enrolling if user cancels confirm", async () => {
  window.confirm.mockReturnValueOnce(false);

  fetch
    .mockResolvedValueOnce({ json: async () => mockCourses })
    .mockResolvedValueOnce({
      text: async () => JSON.stringify(mockEnrollmentsResponse),
    });

  render(<StudentEnroll />);

  fireEvent.click(await screen.findByText("Enroll"));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});

test("calls enroll API when Enroll is clicked", async () => {
  fetch
    .mockResolvedValueOnce({ json: async () => mockCourses })
    .mockResolvedValueOnce({
      text: async () => JSON.stringify(mockEnrollmentsResponse),
    })
    .mockResolvedValueOnce({ text: async () => "Enrolled successfully" })
    .mockResolvedValueOnce({ json: async () => mockCourses })
    .mockResolvedValueOnce({
      text: async () => JSON.stringify(mockEnrollmentsResponse),
    });

  render(<StudentEnroll />);

  fireEvent.click(await screen.findByText("Enroll"));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:5284/api/Student/enroll",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
  });

  expect(window.alert).toHaveBeenCalled();
});

test("handles API error when enrolling", async () => {
  fetch
    .mockResolvedValueOnce({ json: async () => mockCourses })
    .mockResolvedValueOnce({
      text: async () => JSON.stringify(mockEnrollmentsResponse),
    })
    .mockRejectedValueOnce(new Error("Network Error"));

  render(<StudentEnroll />);

  fireEvent.click(await screen.findByText("Enroll"));

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith("Error enrolling");
  });
});
