import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Login />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}
