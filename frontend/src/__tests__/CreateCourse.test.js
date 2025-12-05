import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateCourse from "../Admin/CreateCourse";

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn()
}));

beforeEach(()=>{
  global.fetch = jest.fn();
  window.alert = jest.fn();
});

test("empty input validation", () => {
  render(<CreateCourse />);
  fireEvent.click(screen.getByRole("button",{name:/create/i}));
  expect(window.alert).toHaveBeenCalled();
});

test("successful create + topic add", async () => {
  fetch
   .mockResolvedValueOnce({
     ok:true,
     json:async()=>({message:"Created",courseId:10})
   })
   .mockResolvedValueOnce({ ok:true });

  render(<CreateCourse />);
  
  fireEvent.change(screen.getByPlaceholderText("Course Name"),{target:{value:"React"}})
  fireEvent.change(screen.getByPlaceholderText("Capacity"),{target:{value:"20"}})

  fireEvent.click(screen.getByRole("button",{name:/create/i}));

  expect(await screen.findByText("Add Topics")).toBeInTheDocument();
});

test("api failure", async () => {
  fetch.mockResolvedValueOnce({
    ok:false,
    json:async()=>({message:"fail"})
  });

  render(<CreateCourse />);
  fireEvent.change(screen.getByPlaceholderText("Course Name"),{target:{value:"React"}})
  fireEvent.change(screen.getByPlaceholderText("Capacity"),{target:{value:"20"}})
  fireEvent.click(screen.getByRole("button",{name:/create/i}));

  await waitFor(()=> expect(window.alert).toHaveBeenCalled());
});
