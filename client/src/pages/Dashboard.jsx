import { useState, useEffect, useContext, useMemo, useCallback } from "react"
import api from "../api/axios"
import { AuthContext } from "../context/AuthContext"
import TaskList from "../components/TaskList"
import TaskForm from "../components/TaskForm"

export default function Dashboard() {

  const { user, logout } = useContext(AuthContext)

  const [myTasks, setMyTasks] = useState([])
  const [studentTasks, setStudentTasks] = useState([])
  const [usersMap, setUsersMap] = useState({})

  const [showModal, setShowModal] = useState(false)
  const [openStudent, setOpenStudent] = useState(null)
  const [activeTab, setActiveTab] = useState("mytasks")
  const [expandedDesc, setExpandedDesc] = useState({})

  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)

  const limit = 8

  // ================================
  // Toggle description
  // ================================
  const toggleDesc = useCallback((id) => {
    setExpandedDesc(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }, [])

  // ================================
  // Open student accordion
  // ================================
  const toggleStudent = useCallback((email) => {
    setOpenStudent(prev => prev === email ? null : email)
  }, [])

  // ================================
  // Group student tasks by email
  // ================================
  const groupedStudentTasks = useMemo(() => {

    const grouped = {}

    studentTasks.forEach(task => {

      const email = usersMap[task.userId] || "Unknown Student"

      if (!grouped[email]) grouped[email] = []

      grouped[email].push(task)

    })

    return grouped

  }, [studentTasks, usersMap])

  // ================================
  // Load users for email mapping
  // ================================
  const loadUsers = async () => {

    try {

      const res = await api.get("/auth/users")
      const users = res.data || []

      const map = {}

      users.forEach(u => {
        map[u.id] = u.email
      })

      setUsersMap(map)

    } catch (err) {
      console.error("Failed loading users", err)
    }

  }

  // ================================
  // Load tasks with pagination
  // ================================
  const loadTasks = async () => {

    try {

      setLoading(true)

      const res = await api.get(`/tasks?page=${page}&limit=${limit}`)

      const tasks = res.data.tasks || []
      const total = res.data.total || 0

      // // teacher tasks
      // const my = tasks.filter(t => t.userId === user.id)

      // // student tasks
      // const students = tasks.filter(t => t.userId !== user.id)
      let my = []
let students = []

tasks.forEach(task => {
  if (task.userId === user.id) {
    my.push(task)
  } else {
    students.push(task)
  }
})

      setMyTasks(my)
      setStudentTasks(students)

      setTotalPages(Math.ceil(total / limit))

    } catch (err) {

      console.error("Failed loading tasks", err)

    } finally {

      setLoading(false)

    }

  }

  // ================================
  // Load users first
  // ================================
  useEffect(() => {
    if (user) loadUsers()
  }, [user])

  // ================================
  // Load tasks
  // ================================
  useEffect(() => {
    if (user) loadTasks()
  }, [user, page])

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] p-6">

      {/* HEADER */}
      <div className="bg-white border-b shadow-sm w-full px-10 py-5">

        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold">EdTech Task Manager</h1>

            <div className="flex items-center gap-3 mt-2 text-gray-600">
              <span>👤 {user.email}</span>

              <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                {user.role}
              </span>
            </div>

          </div>

          <button
            onClick={logout}
            className="border px-5 py-2 rounded-lg hover:bg-gray-100"
          >
            Logout
          </button>

        </div>

      </div>

      <div className="max-w-6xl mx-auto">

        {/* TABS */}
        <div className="flex gap-6 mt-6 mb-4">

          <button
            onClick={() => setActiveTab("mytasks")}
            className={`font-semibold ${
              activeTab === "mytasks"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600"
            }`}
          >
            My Tasks
          </button>

          {user.role === "teacher" && (

            <button
              onClick={() => setActiveTab("students")}
              className={`font-semibold ${
                activeTab === "students"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600"
              }`}
            >
              Assigned Students
            </button>

          )}

        </div>

        {/* MY TASKS */}
        {activeTab === "mytasks" && (

          <div className="bg-white p-6 rounded-xl shadow-md mb-6 relative">

            <h3 className="text-lg font-bold mb-4 text-gray-800">
              My Tasks
            </h3>

            {loading
              ? <p className="text-gray-500">Loading tasks...</p>
              : <TaskList tasks={myTasks} showActions onChange={loadTasks} />
            }

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-6">

              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (

                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    page === i + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>

              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Next
              </button>

            </div>

            {/* Floating button */}
            <button
              onClick={() => setShowModal(true)}
              className="absolute right-6 bottom-6 bg-indigo-600 text-white w-14 h-14 rounded-full text-3xl shadow-lg flex items-center justify-center"
            >
              +
            </button>

          </div>

        )}

        {/* STUDENT TASKS */}
        {user.role === "teacher" && activeTab === "students" && (

          <div className="bg-white p-6 rounded-xl shadow-md">

            <h3 className="text-lg font-bold mb-6 text-gray-800">
              Assigned Student Tasks
            </h3>

            {Object.keys(groupedStudentTasks).length === 0 && (
              <p className="text-gray-500">No student tasks found</p>
            )}

            {Object.keys(groupedStudentTasks).map(email => (

              <div key={email} className="mb-4 border rounded-xl">

                <div
                  onClick={() => toggleStudent(email)}
                  className="flex justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
                >

                  <p className="font-semibold text-indigo-600">
                    👤 {email}
                  </p>

                  <span>{openStudent === email ? "▲" : "▼"}</span>

                </div>

                {openStudent === email && (

                  <div className="px-4 pb-4">

                    {groupedStudentTasks[email].map(task => {

                      const isExpanded = expandedDesc[task.id]
                      const longDesc = task.description?.length > 80

                      return (

                        <div
                          key={task.id}
                          className="p-4 bg-white border rounded-lg mb-3"
                        >

                          <p className="text-xs text-gray-500 mb-1">
                            Due: {task.dueDate
                              ? new Date(task.dueDate).toLocaleDateString()
                              : "No Date"}
                          </p>

                          <p className="font-semibold">{task.title}</p>

                          <p className="text-sm text-gray-600 mt-1">
                            {isExpanded
                              ? task.description
                              : task.description?.slice(0, 80)}
                          </p>

                          {longDesc && (

                            <button
                              onClick={() => toggleDesc(task.id)}
                              className="text-indigo-600 text-xs mt-1"
                            >
                              {isExpanded ? "Show less" : "Read more"}
                            </button>

                          )}

                        </div>

                      )

                    })}

                  </div>

                )}

              </div>

            ))}

          </div>

        )}

      </div>

      {/* CREATE TASK MODAL */}
      {showModal && (

        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm"></div>

          <div className="fixed inset-0 flex justify-center items-center">

            <div className="bg-white p-10 w-[650px] rounded-2xl shadow-xl">

              <h2 className="text-xl font-bold mb-5">Create New Task</h2>

              <TaskForm
                onSuccess={() => {
                  setShowModal(false)
                  loadTasks()
                }}
                onCancel={() => setShowModal(false)}
              />

            </div>

          </div>
        </>
      )}

    </div>

  )
}