import { useState } from "react";
import api from "../api/axios";
import { FaEdit } from "react-icons/fa";

export default function TaskList({ tasks, showActions, onChange }) {

  const [editingTask, setEditingTask] = useState(null);
  const [expanded, setExpanded] = useState({});

  const toggleDescription = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      onChange();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const updateTask = async (e) => {
    e.preventDefault();

    const title = e.target.title.value;
    const description = e.target.description.value;
    const progress = e.target.progress.value;

    try {
      await api.put(`/tasks/${editingTask.id}`, {
        title,
        description,
        progress
      });

      setEditingTask(null);
      onChange();

    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="space-y-4">

      {tasks.map((task) => {

        const isExpanded = expanded[task.id];
        const isLong = task.description?.length > 60;

        return (
          <div
            key={task.id}
            className="relative p-5 bg-white border shadow-md rounded-xl hover:shadow-lg"
          >

            {showActions && (
              <div className="absolute top-3 right-3 flex gap-2">

                <button
                  onClick={() => setEditingTask(task)}
                  className="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                >
                  <FaEdit /> Edit
                </button>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>

              </div>
            )}

            <p className="text-xs text-gray-500 mb-1">
              Due: {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "No date"}
            </p>

            <p className="font-semibold text-lg">
              {task.title}
            </p>

            <p className={`text-gray-700 ${!isExpanded ? "truncate max-w-[85%]" : ""}`}>
              {task.description}
            </p>

            {isLong && (
              <button
                onClick={() => toggleDescription(task.id)}
                className="text-indigo-600 text-xs mt-1"
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}

            <p className="mt-2 text-sm">
              Progress:
              <span
                className={`ml-2 px-2 py-1 rounded text-xs
                ${task.progress === "COMPLETED"
                  ? "bg-green-100 text-green-700"
                  : task.progress === "IN_PROGRESS"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-200 text-gray-700"}
                `}
              >
                {task.progress}
              </span>
            </p>

          </div>
        );
      })}

      {/* EDIT MODAL */}
      {editingTask && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/30">

          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">

            <h2 className="font-bold text-lg mb-3">Update Task</h2>

            <form onSubmit={updateTask} className="space-y-3">

              <input
                name="title"
                defaultValue={editingTask.title}
                className="w-full border p-2 rounded"
              />

              <textarea
                name="description"
                defaultValue={editingTask.description}
                rows="4"
                className="w-full border p-3 rounded resize-none"
              />

              <select
                name="progress"
                defaultValue={editingTask.progress}
                className="w-full border p-2 rounded"
              >
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>

              <div className="flex justify-end gap-2">

                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-3 py-1 bg-indigo-600 text-white rounded"
                >
                  Update
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}