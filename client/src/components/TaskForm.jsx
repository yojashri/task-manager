import { useState } from "react"
import api from "../api/axios"

export default function TaskForm({ onSuccess, onCancel }) {

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    progress: "NOT_STARTED"
  })

  const [loading, setLoading] = useState(false)



  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {

    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value
    }))

  }



  // =========================
  // FORM SUBMIT
  // =========================
  const handleSubmit = async (e) => {

    e.preventDefault()

    const today = new Date().toISOString().split("T")[0]

    if (form.dueDate < today) {

      alert("You cannot select a past date!")

      return
    }

    try {

      setLoading(true)

      await api.post("/tasks", {

        title: form.title.trim(),

        description: form.description.trim(),

        // convert to ISO format for backend validation
        dueDate: form.dueDate
          ? new Date(form.dueDate).toISOString()
          : null,

        progress: form.progress

      })

      onSuccess()

    } catch (err) {

      console.error("Task creation failed", err)

      alert(
        err.response?.data?.message ||
        "Task creation failed"
      )

    } finally {

      setLoading(false)

    }

  }



  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      {/* TITLE */}
      <input
        name="title"
        placeholder="Task title"
        required
        value={form.title}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-lg"
      />


      {/* DESCRIPTION */}
      <textarea
        name="description"
        placeholder="Task description"
        rows="5"
        value={form.description}
        onChange={handleChange}
        className="w-full p-4 border border-gray-300 rounded-lg resize-none"
      />


      {/* DUE DATE */}
      <input
        name="dueDate"
        type="date"
        required
        value={form.dueDate}
        min={new Date().toISOString().split("T")[0]}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-lg"
      />


      {/* PROGRESS */}
      <select
        name="progress"
        value={form.progress}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-lg"
      >

        <option value="NOT_STARTED">
          Not Started
        </option>

        <option value="IN_PROGRESS">
          In Progress
        </option>

        <option value="DONE">
          Done
        </option>

      </select>


      {/* BUTTONS */}
      <div className="flex justify-end gap-3">

        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded-lg"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >

          {loading ? "Creating..." : "Create"}

        </button>

      </div>

    </form>

  )

}