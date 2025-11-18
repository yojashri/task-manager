import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const container = {
    maxWidth: "420px",
    margin: "80px auto",
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
    fontSize: "15px",
    background: "#f1f5f9"
  };

  const btn = {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "white",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600"
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.message || "Invalid login");
    }
  };

  return (
    <div style={container}>
      <h2 style={{ fontWeight: "700", marginBottom: "10px" }}>
        Welcome to EdTech Task Manager
      </h2>

      <form onSubmit={submit}>
        <input style={input} placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <input style={input} type="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} />

        <button style={btn}>Login</button>
      </form>

      <div style={{ marginTop: "14px" }}>
        <Link to="/signup">New user? Register</Link>
      </div>
    </div>
  );
}
