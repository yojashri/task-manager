import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function TaskList({ tasks, onChange }) {
  const { user } = useContext(AuthContext);

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    onChange();
  };

  const updateProgress = async (id, progress) => {
    await api.put(`/tasks/${id}`, { progress });
    onChange();
  };

  const card = {
    padding: "15px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    marginBottom: "14px"
  };

  return (
    <>
      {tasks.map((t) => {
        const isOwner = t.userId === user.id;
        return (
          <div key={t._id} style={card}>
            <h3>{t.title}</h3>
            <p>{t.description}</p>
            <p>Progress: {t.progress}</p>

            {isOwner && (
              <>
                <select
                  style={{ padding: "6px", marginBottom: "10px" }}
                  onChange={(e) => updateProgress(t._id, e.target.value)}
                >
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>

                <br />

                <button
                  onClick={() => deleteTask(t._id)}
                  style={{ padding: "6px 10px", background: "red", color: "white" }}
                >
                  Delete
                </button>
              </>
            )}

            {!isOwner && (
              <p style={{ color: "gray", fontSize: "13px" }}>
                (Student task — read-only)
              </p>
            )}
          </div>
        );
      })}
    </>
  );
}
