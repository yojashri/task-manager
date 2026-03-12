import { useParams } from "react-router-dom"
import { useEffect, useState, useCallback } from "react"
import api from "../api/axios"
import TaskList from "../components/TaskList"
import Header from "../components/Header"

export default function StudentTasks() {

  const { id } = useParams()

  const [tasks, setTasks] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [studentEmail, setStudentEmail] = useState("")

  const limit = 8

  const isMobile = window.innerWidth < 768


  // ===============================
  // LOAD STUDENT EMAIL
  // ===============================
  const loadStudent = useCallback(async () => {

    try {

      const res = await api.get("/students")

      const student = res.data.find(s => s.id === id)

      if (student) {
        setStudentEmail(student.email)
      }

    } catch (err) {

      console.error("Failed loading student")

    }

  }, [id])


  // ===============================
  // LOAD TASKS
  // ===============================
  const loadTasks = useCallback(async () => {

    try {

      setLoading(true)
      setError(null)

      const res = await api.get(`/tasks/student/${id}?page=${page}&limit=${limit}`)

      const newTasks = res?.data?.tasks || []
      const total = res?.data?.total || 0

      if (isMobile) {

        // mobile → append
        setTasks(prev => [...prev, ...newTasks])

      } else {

        // desktop → replace
        setTasks(newTasks)

      }

      setTotalPages(Math.max(1, Math.ceil(total / limit)))

    } catch (err) {

      console.error(err)
      setError("Failed to load tasks")

    } finally {

      setLoading(false)

    }

  }, [id, page, isMobile])


  // ===============================
  // INITIAL LOAD
  // ===============================
  useEffect(() => {

    loadStudent()

  }, [loadStudent])


  useEffect(() => {

    loadTasks()

  }, [loadTasks])


  // ===============================
  // MOBILE INFINITE SCROLL
  // ===============================
  useEffect(() => {

    if (!isMobile) return

    const handleScroll = () => {

      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {

        setPage(prev => {

          if (prev < totalPages) return prev + 1

          return prev

        })

      }

    }

    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)

  }, [isMobile, totalPages])


  // ===============================
  // DESKTOP PAGINATION
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

      <Header />

      <div className="max-w-6xl mx-auto p-6">

        {/* STUDENT HEADER */}
        <div className="mb-6">

          <h2 className="text-2xl font-bold">
            Student Tasks
          </h2>

          <p className="text-gray-500 text-sm">
            Tasks created by {studentEmail || "Student"}
          </p>

        </div>


        {/* ERROR */}
        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}


        {/* TASK LIST */}
        <div className="bg-white p-6 rounded-xl shadow">

          {loading && tasks.length === 0 ? (

            <p className="text-gray-500">Loading tasks...</p>

          ) : (

            <TaskList tasks={tasks} />

          )}

        </div>


        {/* DESKTOP PAGINATION */}
        {!isMobile && (

          <div className="flex justify-center items-center gap-2 mt-6">

            <button
              disabled={page === 1}
              onClick={prevPage}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => {

              const p = i + 1

              return (

                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`px-3 py-1 rounded ${
                    page === p
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {p}
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

        )}

      </div>

    </div>

  )

}