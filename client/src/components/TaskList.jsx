import { useState } from "react";
import api from "../api/axios";
import { FaEdit } from "react-icons/fa";

export default function TaskList({ tasks, showActions, onChange }) {

  const [editingTask, setEditingTask] = useState(null);

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      onChange();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // UPDATE TASK
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
    <div className="space-y-[15px]">

      {tasks.map((task) => (
        <div
          key={task.id}
          className="p-[18px] bg-white border shadow-md rounded-[16px]"
        >

          <p className="font-semibold text-[16px]">
            Title: <span className="font-normal">{task.title}</span>
          </p>

          <p className="text-gray-700">
            Description: {task.description}
          </p>

          <p className="text-gray-600">
            Progress: {task.progress}
          </p>

          {showActions && (
            <div className="flex gap-[10px] mt-[10px]">

              {/* UPDATE PROGRESS */}
              <select
                value={task.progress}
                onChange={async (e) => {
                  await api.put(`/tasks/${task.id}`, {
                    progress: e.target.value
                  });
                  onChange();
                }}
                className="border p-[5px] rounded"
              >
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>

              {/* EDIT BUTTON */}
              <button
                onClick={() => setEditingTask(task)}
                className="bg-blue-500 text-white px-[10px] py-[5px] rounded flex items-center gap-[5px]"
              >
                <FaEdit />
                Edit
              </button>

              {/* DELETE BUTTON */}
              <button
                onClick={() => deleteTask(task.id)}
                className="bg-red-500 text-white px-[12px] py-[5px] rounded"
              >
                Delete
              </button>

            </div>
          )}
        </div>
      ))}

      {/* EDIT MODAL */}
      {editingTask && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/30">

          <div className="bg-white p-[20px] rounded shadow-lg w-[350px]">

            <h2 className="font-bold text-[18px] mb-[10px]">
              Update Task
            </h2>

            <form onSubmit={updateTask} className="space-y-[10px]">

              <input
                name="title"
                defaultValue={editingTask.title}
                className="w-full border p-[8px] rounded"
              />

              <textarea
                name="description"
                defaultValue={editingTask.description}
                className="w-full border p-[8px] rounded"
              />

              <select
                name="progress"
                defaultValue={editingTask.progress}
                className="w-full border p-[8px] rounded"
              >
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>

              <div className="flex justify-end gap-[10px]">

                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-[10px] py-[6px] bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-[10px] py-[6px] bg-indigo-600 text-white rounded"
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