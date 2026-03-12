import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../api/axios"
import Header from "../components/Header"

export default function Students() {

  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const loadStudents = async () => {

      try {

        const res = await api.get("/students")

        setStudents(res.data || [])

      } catch (err) {

        console.error("Failed to load students", err)

      } finally {

        setLoading(false)

      }

    }

    loadStudents()

  }, [])

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF]">

     <Header />
    <div className="max-w-6xl mx-auto p-6">
      {/* STUDENT LIST */}
      <div className="bg-white rounded-xl shadow-sm border">

        {loading && (
          <p className="p-6 text-gray-500">
            Loading students...
          </p>
        )}

        {!loading && students.length === 0 && (
          <p className="p-6 text-gray-500">
            No students assigned yet
          </p>
        )}

        {students.map(student => (

          <Link
            key={student.id}
            to={`/students/${student.id}/tasks`}
            className="flex justify-between items-center p-4 border-b last:border-b-0 hover:bg-gray-50 transition"
          >

            {/* Email */}
            <div className="flex items-center gap-3">

              <span className="text-indigo-600 text-lg">👤</span>

              <span className="font-medium text-gray-800">
                {student.email}
              </span>

            </div>


            {/* Arrow */}
            <span className="text-gray-400 text-xl">
              →
            </span>

          </Link>

        ))}

      </div>
    </div>
    </div>

  )

}