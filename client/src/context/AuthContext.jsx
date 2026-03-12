import { createContext, useState, useEffect } from "react"
import api from "../api/axios"

export const AuthContext = createContext()

export default function AuthProvider({ children }) {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)



  // =========================
  // LOAD USER FROM STORAGE
  // =========================
  useEffect(() => {

    try {

      const storedUser = localStorage.getItem("user")

      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }

    } catch (err) {

      console.error("Failed to load user", err)

      localStorage.removeItem("user")

    }

    setLoading(false)

  }, [])



  // =========================
  // LOGIN FUNCTION
  // =========================
  const login = (userData, accessToken) => {

    try {

      localStorage.setItem("token", accessToken)

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      )

      setUser(userData)

    } catch (err) {

      console.error("Login storage error", err)

    }
  }



  // =========================
  // LOGOUT FUNCTION
  // =========================
  const logout = async () => {

    try {

      await api.post("/auth/logout")

    } catch (err) {

      console.error("Logout request failed", err)

    }

    // Clear storage
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    setUser(null)

    window.location.href = "/login"
  }



  // =========================
  // PREVENT APP LOAD BEFORE AUTH
  // =========================
  if (loading) {

    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Loading...
      </div>
    )

  }



  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>

  )

}