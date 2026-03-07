import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true   // important for cookies
})

/* Attach access token */
api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/* Handle expired token */
api.interceptors.response.use(
  (response) => response,

  async (error) => {

    if (error.response?.status === 401) {

      try {

        // refresh token will be sent automatically via cookie
        const res = await axios.post(
          "http://localhost:3000/auth/refresh",
          {},
          { withCredentials: true }
        )

        const newToken = res.data.accessToken

        localStorage.setItem("token", newToken)

        error.config.headers.Authorization = `Bearer ${newToken}`

        return axios(error.config)

      } catch {

        localStorage.removeItem("token")
        window.location.href = "/login"

      }

    }

    return Promise.reject(error)
  }
)

export default api