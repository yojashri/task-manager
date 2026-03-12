import { useContext } from "react"
import { Link, useLocation } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

export default function Header() {

  const { user, logout } = useContext(AuthContext)
  const location = useLocation()

  return (

    <div className="w-full bg-white border-b shadow-sm">

      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">

        {/* LEFT */}
        <div>

          <h1 className="text-2xl font-bold">
            EdTech Task Manager
          </h1>

          <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">

            <span>👤 {user.email}</span>

            <span className="bg-gray-200 px-3 py-1 rounded-full">
              {user.role}
            </span>

          </div>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6">

          {location.pathname !== "/" && (

            <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600"
            >
              Dashboard
            </Link>

          )}

          {user.role === "teacher" && location.pathname !== "/students" && (

            <Link
              to="/students"
              className="text-gray-700 hover:text-indigo-600"
            >
              Students
            </Link>

          )}

          <button
            onClick={logout}
            className="border px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Logout
          </button>

        </div>

      </div>

    </div>

  )

}