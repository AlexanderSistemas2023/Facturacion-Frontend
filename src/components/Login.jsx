// src/components/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import "../assets/css/Login.css";

function Login({ setIsLoading }) {
  const [username, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await loginUser({ username, password });
      navigate("/dashboard");
    } catch (error) {
      alert("Login fallido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img src="/logo.png" alt="Logo" className="login-image" />
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsuario(e.target.value)}
          placeholder="Usuario"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}

export default Login;
