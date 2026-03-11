import { useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Signup() {

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "student",
    teacherId: ""
  });

  const submit = async (e) => {
    e.preventDefault();

    try {

      await api.post("/auth/signup", form);

      alert("Signup successful!");
      window.location.href = "/login";

    } catch (err) {

      alert(err.response?.data?.message || "Signup failed");

    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#cfe0ff]">

      <div className="w-full max-w-[430px] bg-white rounded-2xl p-8 shadow-lg border">

        <h2 className="text-3xl font-bold text-center mb-2">
          Register Account
        </h2>

        <p className="text-center text-gray-600 mb-6">
          Create your EdTech account
        </p>

        <form onSubmit={submit} className="space-y-4">

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          {/* ROLE */}
          <select
            value={form.role}
            className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
            onChange={(e) =>
              setForm({
                ...form,
                role: e.target.value,
                teacherId: ""
              })
            }
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          {/* TEACHER ID (ONLY FOR STUDENT) */}
          {form.role === "student" && (
            <input
              placeholder="Enter teacher ID"
              value={form.teacherId}
              className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
              onChange={(e) =>
                setForm({ ...form, teacherId: e.target.value })
              }
            />
          )}

          {/* BUTTON */}
          <button
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition"
          >
            Signup
          </button>

        </form>

        <p className="text-center text-sm mt-5 text-gray-600">
          Already registered?{" "}
          <Link to="/login" className="font-semibold underline">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}