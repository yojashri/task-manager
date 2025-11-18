import { useState } from "react";
import api from "../api/axios";

export default function TaskForm({ onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: ""
  });

  const container = {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  };

  const input = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1"
  };

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/tasks", form);
    onCreated();
  };

  return (
    <form onSubmit={submit} style={container}>
      <h3>Create New Task</h3>

      <input style={input} placeholder="Title"
        onChange={(e) => setForm({ ...form, title: e.target.value })} />

      <input style={input} placeholder="Description"
        onChange={(e) => setForm({ ...form, description: e.target.value })} />

      <input style={input} type="date"
        onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />

      <button
        style={{ padding: "10px", background: "blue", color: "white", borderRadius: "8px" }}
      >
        Create Task
      </button>
    </form>
  );
}
