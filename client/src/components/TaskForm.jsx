import { useState } from "react";
import api from "../api/axios";

export default function TaskForm({ onSuccess, onCancel }) {

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    progress: "NOT_STARTED"
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date().toISOString().split("T")[0];

    if (form.dueDate < today) {
      alert("You cannot select an earlier date!");
      return;
    }

    try {
      await api.post("/tasks", form);
      onSuccess();
    } catch (err) {
      console.error("Task creation failed", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        name="title"
        placeholder="Title"
        required
        value={form.title}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-lg"
      />

      <textarea
        name="description"
        placeholder="Description"
        rows="5"
        value={form.description}
        onChange={handleChange}
        className="w-full p-4 border border-gray-300 rounded-lg resize-none"
      />

      <input
        name="dueDate"
        type="date"
        required
        value={form.dueDate}
        min={new Date().toISOString().split("T")[0]}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-lg"
      />

      <select
        name="progress"
        value={form.progress}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-lg"
      >
        <option value="NOT_STARTED">Not Started</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
      </select>

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
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Create
        </button>

      </div>

    </form>
  );
}