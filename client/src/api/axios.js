import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true
})


// Add token to request
api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config

})


// Handle expired token
api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true

      try {

        const res = await api.post("/auth/refresh")

        const newToken = res.data.accessToken

        localStorage.setItem("token", newToken)

        originalRequest.headers.Authorization = `Bearer ${newToken}`

        return api(originalRequest)

      } catch {

        localStorage.removeItem("token")
        window.location.href = "/login"

      }

    }

    return Promise.reject(error)

  }

)

export default api