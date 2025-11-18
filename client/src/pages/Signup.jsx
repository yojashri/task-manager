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

  const container = {
    maxWidth: "420px",
    margin: "60px auto",
    padding: "30px",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    textAlign: "center"
  };

  const input = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    marginBottom: "15px",
    background: "#f1f5f9",
    fontSize: "15px"
  };

  const btn = {
    width: "100%",
    padding: "12px",
    background: "green",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600"
  };

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
    <div style={container}>
      <h2 style={{ marginBottom: "20px" }}>Register</h2>

      <form onSubmit={submit}>
        <input
          style={input}
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          style={input}
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          style={input}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        {/* STUDENT MUST ENTER TEACHER ID MANUALLY */}
        {form.role === "student" && (
          <input
            style={input}
            placeholder="Enter teacher ID manually"
            onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
          />
        )}

        <button style={btn}>Signup</button>
      </form>

      <div style={{ marginTop: "10px" }}>
        <Link to="/login">Already registered? Login</Link>
      </div>
    </div>
  );
}
