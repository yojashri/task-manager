import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#eef5ff] to-[#c9dfff]">

      {/* CARD */}
      <div className="w-full max-w-[430px] bg-white rounded-[20px] p-[34px] shadow-[0_10px_35px_rgba(0,0,0,0.10)] border border-[#e1e5ec]">

        {/* TITLE */}
        <h2 className="text-center text-[#1d3aa9] text-[32px] font-extrabold tracking-[-0.5px] mb-[6px]">
          EdTech Task Manager
        </h2>

        {/* SUBTEXT */}
        <p className="text-center text-[#5f6c85] text-[15px] mb-[30px]">
          Login to continue
        </p>

        {/* FORM */}
        <form onSubmit={submit} className="space-y-[18px]">

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-[15px] rounded-[12px] border border-[#ccd3e0] text-[15px]
                       outline-none bg-[#f6f8fc]
                       shadow-[0_2px_4px_rgba(0,0,0,0.05)]
                       focus:shadow-[0_0_0_2px_#3b82f6]
                       transition-all duration-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-[15px] rounded-[12px] border border-[#ccd3e0] text-[15px]
                       outline-none bg-[#f6f8fc]
                       shadow-[0_2px_4px_rgba(0,0,0,0.05)]
                       focus:shadow-[0_0_0_2px_#3b82f6]
                       transition-all duration-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* LOGIN BUTTON */}
          <button
            className="w-full py-[14px] rounded-[12px] text-white text-[16px] font-semibold
                       bg-[#2563eb] hover:bg-[#1d4ed8] transition
                       shadow-[0_6px_16px_rgba(37,99,235,0.35)]"
          >
            Login
          </button>
        </form>

        {/* LINK */}
        <p className="text-center text-[#475569] text-[14px] mt-[22px]">
          New user?{" "}
          <Link to="/signup" className="text-[#2563eb] font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
