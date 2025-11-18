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
      alert("Signup successful! Please login.");
      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#e9f1ff] to-[#cfe0ff]">
      
      {/* CARD */}
      <div className="w-full max-w-[430px] bg-white rounded-[20px] p-[34px] shadow-[0_10px_35px_rgba(0,0,0,0.10)] border border-[#e2e8f0]">

        {/* TITLE */}
        <h2 className="text-[30px] font-extrabold text-center text-[#1e3a8a] mb-[6px]">
          Register Account
        </h2>

        <p className="text-center text-[#64748b] mb-[26px] text-[15px]">
          Create your EdTech account
        </p>

        {/* FORM */}
        <form onSubmit={submit} className="space-y-[18px]">

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-[14px] rounded-[12px] border border-[#cbd5e1] text-[15px]
                       bg-[#f8fafc] outline-none shadow-[0_2px_4px_rgba(0,0,0,0.05)]
                       focus:shadow-[0_0_0_2px_#3b82f6] transition-all duration-200"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-[14px] rounded-[12px] border border-[#cbd5e1] text-[15px]
                       bg-[#f8fafc] outline-none shadow-[0_2px_4px_rgba(0,0,0,0.05)]
                       focus:shadow-[0_0_0_2px_#3b82f6] transition-all duration-200"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {/* ROLE SELECT */}
          <select
            className="w-full p-[14px] rounded-[12px] border border-[#cbd5e1] bg-[#f8fafc] text-[15px]
                       shadow-[0_2px_4px_rgba(0,0,0,0.05)] outline-none
                       focus:shadow-[0_0_0_2px_#3b82f6] transition-all duration-200"
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          {/* TEACHER ID FIELD ONLY IF STUDENT */}
          {form.role === "student" && (
            <input
              placeholder="Enter teacher ID manually"
              className="w-full p-[14px] rounded-[12px] border border-[#cbd5e1] bg-[#f8fafc] text-[15px]
                         shadow-[0_2px_4px_rgba(0,0,0,0.05)] outline-none
                         focus:shadow-[0_0_0_2px_#3b82f6] transition-all duration-200"
              onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
            />
          )}

          {/* SIGNUP BUTTON */}
          <button
            className="w-full py-[14px] rounded-[12px] bg-[#16a34a] hover:bg-[#15803d] text-white
                       text-[16px] font-semibold shadow-[0_6px_16px_rgba(22,163,74,0.35)] transition"
          >
            Signup
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="text-center text-[14px] mt-[22px] text-[#475569]">
          Already registered?{" "}
          <Link to="/login" className="text-[#2563eb] font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
