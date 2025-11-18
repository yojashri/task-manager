import api from "../api/axios";

export default function TaskList({ tasks, showActions, onChange, usersMap }) {
  const updateProgress = async (taskId, value) => {
    await api.put(`/tasks/${taskId}`, { progress: value });
    onChange();
  };

  const deleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    onChange();
  };

  return (
    <div>
      {tasks.length === 0 && (
        <p className="text-gray-500 text-sm">No tasks found.</p>
      )}

      {tasks.map((task) => (
        <div
          key={task._id}
          className="mb-[18px] p-[18px] rounded-[14px]
                     border border-[#e5e9f2]
                     bg-gradient-to-br from-[#ffffff] to-[#f7faff]
                     shadow-[0_4px_15px_rgba(0,0,0,0.06)]"
        >
          {/* Title */}
          <p className="text-[15px] font-semibold text-[#1E1B4B] mb-[6px]">
            <span className="font-bold text-[#475569]">Title:</span> {task.title}
          </p>

          {/* Description */}
          <p className="text-[14px] text-[#475569] mb-[6px]">
            <span className="font-bold text-[#475569]">Description:</span>{" "}
            {task.description}
          </p>

          {/* Email for student tasks */}
          {usersMap && usersMap[task.userId] && (
            <p className="text-[13px] mt-[4px] text-[#444]">
              <span className="font-bold text-[#475569]">Student:</span>{" "}
              {usersMap[task.userId]}
            </p>
          )}

          {/* Progress */}
          <p className="text-[13px] text-[#374151] mt-[6px]">
            <span className="font-bold text-[#475569]">Progress:</span>{" "}
            {task.progress}
          </p>

          {/* ACTION BUTTONS */}
          {showActions && (
            <div className="flex items-center justify-between mt-[12px]">
              
              {/* PROGRESS DROPDOWN */}
              <select
                defaultValue={task.progress}
                onChange={(e) => updateProgress(task._id, e.target.value)}
                className="p-[8px] rounded-[10px] border border-[#cbd5e1] bg-white
                           shadow-sm text-[13px] outline-none"
              >
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              {/* DELETE BUTTON */}
              <button
                onClick={() => deleteTask(task._id)}
                className="px-[14px] py-[8px] bg-[#ef4444] text-white rounded-[10px]
                           shadow-[0_4px_10px_rgba(239,68,68,0.4)] hover:bg-[#dc2626]
                           text-[13px] font-medium"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
