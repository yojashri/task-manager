import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import TaskList from "../components/TaskList";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  const [allTasks, setAllTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [studentTasks, setStudentTasks] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [showModal, setShowModal] = useState(false);

  // ---------------- LOAD USERS ----------------
  const loadUsers = async () => {
    const res = await api.get("/auth/users");

    let map = {};
    let assigned = [];

    res.data.users.forEach((u) => {
      map[u._id] = u.email;
      if (u.role === "student" && u.teacherId === user.id) {
        assigned.push(u._id);
      }
    });

    setUsersMap(map);
    setAssignedStudents(assigned);
  };

  // ---------------- LOAD TASKS ----------------
  const loadTasks = async () => {
    const res = await api.get("/tasks");
    const tasks = res.data.tasks;

    setMyTasks(tasks.filter((t) => t.userId === user.id));
    setStudentTasks(tasks.filter((t) => assignedStudents.includes(t.userId)));
  };

  useEffect(() => { loadUsers(); }, []);
  useEffect(() => { loadTasks(); }, [assignedStudents]);

  // ---------------- CREATE TASK ----------------
  const createTask = async (e) => {
    e.preventDefault();

    const today = new Date().toISOString().split("T")[0];
    const title = e.target.title.value;
    const description = e.target.description.value;
    const dueDate = e.target.dueDate.value;

    if (dueDate < today) {
      alert("You cannot select an earlier date!");
      return;
    }

    await api.post("/tasks", { title, description, dueDate });
    setShowModal(false);
    loadTasks();
  };

  // Group student tasks by email
  const grouped = {};
  studentTasks.forEach((t) => {
    const email = usersMap[t.userId];
    if (!grouped[email]) grouped[email] = [];
    grouped[email].push(t);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] p-[22px]">

      {/* HEADER */}
      <div className="flex items-center justify-between
                      bg-white/70 backdrop-blur-md
                      shadow-[0_8px_30px_rgba(0,0,0,0.12)]
                      rounded-[20px] border border-white/50
                      px-[26px] py-[16px] mb-[28px]">

        <h1 className="text-[30px] font-extrabold text-[#1E1B4B] tracking-wide">
          EduTech
        </h1>

        <h2 className="text-[22px] font-bold text-[#4338CA]">
          Dashboard
        </h2>

        <button
          onClick={logout}
          className="px-[18px] py-[10px] rounded-[12px]
                     bg-red-500 text-white shadow-lg
                     hover:bg-red-600 transition-all">
          Logout
        </button>
      </div>

      {/* ---------------- STUDENT VIEW ---------------- */}
      {user.role === "student" && (
        <div className="bg-white/80 backdrop-blur-lg p-[25px]
                        rounded-[20px] shadow-xl border border-white/50">

          <h3 className="text-[22px] font-bold mb-[15px] text-[#1E1B4B]">
            My Tasks
          </h3>

          <TaskList
            tasks={myTasks}
            showActions={true}
            onChange={loadTasks}
            usersMap={usersMap}
          />

          {/* Floating Add Button */}
          <button
            onClick={() => setShowModal(true)}
            className="fixed bottom-[30px] right-[30px]
                       bg-[#4F46E5] hover:bg-[#4338CA] text-white
                       w-[60px] h-[60px] rounded-full text-[35px]
                       shadow-xl flex items-center justify-center">
            +
          </button>
        </div>
      )}

      {/* ---------------- TEACHER VIEW ---------------- */}
      {user.role === "teacher" && (
        <>
          {/* My Tasks Card */}
          <div className="bg-white/80 backdrop-blur-lg p-[25px]
                          rounded-[20px] shadow-xl border border-white/50
                          mb-[28px] relative">

            <h3 className="text-[22px] font-bold mb-[15px] text-[#1E1B4B]">
              My Tasks (Teacher)
            </h3>

            <TaskList
              tasks={myTasks}
              showActions={true}
              onChange={loadTasks}
              usersMap={usersMap}
            />

            <button
              onClick={() => setShowModal(true)}
              className="absolute right-[20px] bottom-[20px]
                         bg-[#4F46E5] hover:bg-[#4338CA] text-white
                         w-[60px] h-[60px] rounded-full text-[35px]
                         shadow-xl flex items-center justify-center">
              +
            </button>
          </div>

          {/* Student Tasks — Grouped */}
          <div className="bg-white/80 backdrop-blur-lg p-[25px]
                          rounded-[20px] shadow-xl border border-white/50">

            <h3 className="text-[22px] font-bold mb-[20px] text-[#1E1B4B]">
              Assigned Student Tasks
            </h3>

            {Object.keys(grouped).map((email) => (
              <div key={email} className="mb-[28px]">
                <p className="text-[18px] font-semibold text-[#4338CA] mb-[10px]">
                  👤 {email}
                </p>

                {grouped[email].map((task) => (
                  <div
                    key={task._id}
                    className="p-[18px] bg-white/90 backdrop-blur-sm
                               border border-indigo-100 shadow-md rounded-[16px] mb-[12px]">
                    
                    <p className="text-[17px] font-semibold text-[#1E1B4B]">
                      Title: <span className="font-normal">{task.title}</span>
                    </p>

                    <p className="text-[14px] text-gray-700 mt-[4px]">
                      Description: {task.description}
                    </p>

                    <p className="text-[13px] text-gray-600 mt-[4px]">
                      Progress: {task.progress}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ---------------- MODAL ---------------- */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm"></div>

          <div className="fixed inset-0 flex justify-center items-center">
            <div className="bg-white/95 p-[25px] w-[360px]
                            rounded-[20px] shadow-2xl border border-gray-200">

              <h2 className="text-[20px] font-bold text-[#1E1B4B] mb-[15px]">
                Create New Task
              </h2>

              <form onSubmit={createTask} className="space-y-[12px]">
                <input name="title" placeholder="Title"
                  className="w-full p-[12px] border rounded-[12px] bg-white/80" />

                <textarea name="description" placeholder="Description"
                  className="w-full p-[12px] border rounded-[12px] bg-white/80" />

                <input name="dueDate" type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-[12px] border rounded-[12px] bg-white/80" />

                <div className="flex justify-end gap-[10px]">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-[14px] py-[8px] bg-gray-300 rounded-[10px]">
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-[14px] py-[8px] bg-[#4F46E5] text-white rounded-[10px]
                               hover:bg-[#4338CA] shadow">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
