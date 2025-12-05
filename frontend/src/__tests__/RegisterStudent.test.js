import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterStudent from "../Admin/RegisterStudent";

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    text: async () => "Registered successfully",
  });

  window.alert = jest.fn();
});

test("fills form and submits registration", async () => {
  render(<RegisterStudent />);

  fireEvent.change(screen.getByPlaceholderText("Username"), {
    target: { value: "Rahul" },
  });

  fireEvent.change(screen.getByPlaceholderText("Address"), {
    target: { value: "India" },
  });

  fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "r@test.com" },
  });

  fireEvent.change(
    screen.getByPlaceholderText("Phone (max 10 digits)"),
    { target: { value: "1234567890" } }
  );

  const dateInput = document.querySelector(`input[type="date"]`);
  fireEvent.change(dateInput, {
    target: { value: "2000-01-01" },
  });

  fireEvent.change(
    screen.getByPlaceholderText("Password (6–20 characters)"),
    { target: { value: "123456" } }
  );

  fireEvent.click(screen.getByRole("button", { name: "Register" }));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
