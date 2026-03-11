import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {

  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const res = await api.post("/auth/login", form);

      login(res.data.user, res.data.accessToken);

      window.location.href = "/";

    } catch (err) {

      setError(err.response?.data?.message || "Login failed");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#cfe0ff]">

      <div className="w-full max-w-[430px] bg-white rounded-2xl p-8 shadow-lg border">

        <h2 className="text-center text-black text-3xl font-bold mb-2">
          EdTech Task Manager
        </h2>

        <p className="text-center text-gray-600 mb-6">
          Login to continue
        </p>

        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="space-y-4">

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
          />

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          New user?{" "}
          <Link to="/signup" className="font-semibold underline">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}