import { createContext, useState } from "react"
import api from "../api/axios"
export const AuthContext = createContext()

export default function AuthProvider({ children }) {

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  )

  const login = (user, accessToken) => {

  localStorage.setItem("token", accessToken)
  localStorage.setItem("user", JSON.stringify(user))

  setUser(user)

}
 const logout = async () => {
try{
  await api.post("/auth/logout")

  localStorage.removeItem("token")
  localStorage.removeItem("user")

  setUser(null)

  window.location.href = "/login"
}catch(err){
  console.error("Logout failed", err)
  alert("Logout failed")
}}

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}