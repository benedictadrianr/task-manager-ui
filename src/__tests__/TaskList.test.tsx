import type React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskList from "@/components/TaskList";
import { TaskProvider } from "@/contexts/TaskContext";

const renderWithProvider = (component: React.ReactElement) => {
  return render(<TaskProvider>{component}</TaskProvider>);
};

describe("TaskList", () => {
  test("renders task list with initial tasks", () => {
    renderWithProvider(<TaskList />);

    expect(
      screen.getByText(/complete project documentation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/review code changes/i)).toBeInTheDocument();
    expect(screen.getByText(/update dependencies/i)).toBeInTheDocument();
  });

  test("separates completed and pending tasks", () => {
    renderWithProvider(<TaskList />);

    expect(screen.getByText(/pending tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/completed tasks/i)).toBeInTheDocument();
  });

  test("shows correct task cou nts", () => {
    renderWithProvider(<TaskList />);

    expect(screen.getByText(/pending tasks $$2$$/i)).toBeInTheDocument();
    expect(screen.getByText(/completed tasks $$1$$/i)).toBeInTheDocument();
  });
});
