import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("");

  const loadTasks = async () => {
    const res = await api.get("/tasks", {
      params: filter ? { progress: filter } : {}
    });
    setTasks(res.data.tasks);
  };

  useEffect(() => {
    loadTasks();
  }, [filter]);

  const box = {
    padding: "20px",
    background: "#ffffff",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)"
  };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto" }}>
      <div style={box}>
        <h2>Hello, {user.email}</h2>
        <p>Role: {user.role}</p>

        {user.role === "student" && (
          <p>Your Teacher ID: {user.teacherId}</p>
        )}

        <button onClick={logout}
          style={{ padding: "8px 16px", marginTop: "10px" }}>
          Logout
        </button>
      </div>

      <div style={box}>
        <select
          style={{
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "8px",
            width: "200px"
          }}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <TaskList tasks={tasks} onChange={loadTasks} />
      </div>

      {user.role === "student" && (
        <div style={box}>
          <TaskForm onCreated={loadTasks} />
        </div>
      )}
    </div>
  );
}
