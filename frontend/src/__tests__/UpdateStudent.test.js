import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UpdateStudent from "../Admin/UpdateStudent";
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

test("loads student and submits update", async () => {
  fetch
    .mockResolvedValueOnce({
      text: async () =>
        JSON.stringify([
          {
            studentId: 1,
            userName: "Rahul",
            emailId: "r@test.com",
            phone: "1234567890",
            address: "India",
            password: "123456",
          },
        ]),
    })
    .mockResolvedValueOnce({
      text: async () => "Updated successfully",
      ok: true,
    });

  render(
    <BrowserRouter>
      <UpdateStudent />
    </BrowserRouter>
  );

  expect(await screen.findByDisplayValue("Rahul")).toBeInTheDocument();

  fireEvent.change(screen.getByDisplayValue("Rahul"), {
    target: { value: "NewName" },
  });

  fireEvent.click(
    screen.getByRole("button", { name: "Update Student" })
  );

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
