import type React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import TaskForm from "@/components/TaskForm"
import { TaskProvider } from "@/contexts/TaskContext"

const renderWithProvider = (component: React.ReactElement) => {
  return render(<TaskProvider>{component}</TaskProvider>)
}

describe("TaskForm", () => {
  test("renders form fields correctly", () => {
    renderWithProvider(<TaskForm />)

    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /create task/i })).toBeInTheDocument()
  })

  test("shows validation error for empty title", async () => {
    const user = userEvent.setup()
    renderWithProvider(<TaskForm />)

    const submitButton = screen.getByRole("button", { name: /create task/i })
    await user.click(submitButton)

    expect(screen.getByText(/task title is required/i)).toBeInTheDocument()
  })

  test("creates task with valid input", async () => {
    const user = userEvent.setup()
    renderWithProvider(<TaskForm />)

    const titleInput = screen.getByLabelText(/task title/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    const submitButton = screen.getByRole("button", { name: /create task/i })

    await user.type(titleInput, "Test Task")
    await user.type(descriptionInput, "Test Description")
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/task created successfully/i)).toBeInTheDocument()
    })
  })

  test("clears form after successful submission", async () => {
    const user = userEvent.setup()
    renderWithProvider(<TaskForm />)

    const titleInput = screen.getByLabelText(/task title/i) as HTMLInputElement
    const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement
    const submitButton = screen.getByRole("button", { name: /create task/i })

    await user.type(titleInput, "Test Task")
    await user.type(descriptionInput, "Test Description")
    await user.click(submitButton)

    await waitFor(() => {
      expect(titleInput.value).toBe("")
      expect(descriptionInput.value).toBe("")
    })
  })
})
