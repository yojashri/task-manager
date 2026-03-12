import { useState, useEffect, useContext, useCallback } from "react"
import api from "../api/axios"
import { AuthContext } from "../context/AuthContext"
import TaskList from "../components/TaskList"
import TaskForm from "../components/TaskForm"
import Header from "../components/Header"

export default function Dashboard() {

  const { user } = useContext(AuthContext)

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [showModal, setShowModal] = useState(false)

  const limit = 8


  // ===============================
  // LOAD TASKS
  // ===============================
  const loadTasks = useCallback(async () => {

    try {

      setLoading(true)
      setError(null)

      const res = await api.get(`/tasks/my?page=${page}&limit=${limit}`)

      const tasks = res?.data?.tasks || []
      const total = res?.data?.total || 0

      setTasks(tasks)

      setTotalPages(Math.max(1, Math.ceil(total / limit)))

    } catch (err) {

      console.error(err)
      setError("Failed to load tasks")

    } finally {

      setLoading(false)

    }

  }, [page])


  // ===============================
  // LOAD TASKS
  // ===============================
  useEffect(() => {

    if (user) loadTasks()

  }, [user, page, loadTasks])


  // ===============================
  // PAGINATION
  // ===============================
  const prevPage = () => {

    if (page > 1) setPage(page - 1)

  }

  const nextPage = () => {

    if (page < totalPages) setPage(page + 1)

  }

  const goToPage = (p) => {

    setPage(p)

  }


  return (

    <div className="min-h-screen bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF]">

      {/* HEADER */}
      <Header />

      <div className="max-w-6xl mx-auto p-6 flex flex-col min-h-[75vh]">

        {/* TASK HEADER */}
        <div className="flex justify-between items-center mb-4">

          <h2 className="text-xl font-bold text-gray-800">
            My Tasks
          </h2>

          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
          >
            + New Task
          </button>

        </div>


        {/* ERROR */}
        {error && (

          <p className="text-red-500 mb-3">
            {error}
          </p>

        )}


        {/* TASK LIST */}
        <div className="bg-white p-6 rounded-xl shadow flex-grow">

          {loading ? (

            <p className="text-gray-500">
              Loading tasks...
            </p>

          ) : (

            <TaskList
              tasks={tasks}
              showActions
              onChange={loadTasks}
            />

          )}

        </div>


        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-2 mt-6">

          <button
            disabled={page === 1}
            onClick={prevPage}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => {

            const pageNumber = i + 1

            return (

              <button
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                className={`px-3 py-1 rounded ${
                  page === pageNumber
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {pageNumber}
              </button>

            )

          })}

          <button
            disabled={page === totalPages}
            onClick={nextPage}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>

      </div>


      {/* CREATE TASK MODAL */}
      {showModal && (

        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm"></div>

          <div className="fixed inset-0 flex justify-center items-center">

            <div className="bg-white p-10 w-[650px] rounded-2xl shadow-xl">

              <h2 className="text-xl font-bold mb-5">
                Create New Task
              </h2>

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