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
    <div className="login-container  justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-md max-w-md animate-fade-in">
        <img src="/logo.png" alt="Logo" className="mx-auto mb-4 w-a h-20" />
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Usuario"
            required
            className="w-full py-2.5 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            className="w-full py-2.5 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition"
          >
            Iniciar sesión
          </button>

          <div className="flex flex-col space-y-2 mt-3">
            <button
              type="button"
              className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition"
              onClick={() => navigate("/registro")}
            >
              Registrarse
            </button>

            <button
              type="button"
              className="w-full text-blue-600 hover:underline"
              onClick={() => navigate("/olvide-contraseña")}
            >
              Olvidé mi contraseña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
