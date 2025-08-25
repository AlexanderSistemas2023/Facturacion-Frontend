// src/components/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import "../assets/css/Login.css";


function Login({ setIsLoading }) {
  const [username, setUsuario] = useState(() => localStorage.getItem("rememberedUser") || "");
  const [password, setPassword] = useState(() => localStorage.getItem("rememberedPass") || "");
  const [id_sucursal, setidSucursal] = useState(null);
  const [sucursales, setSucursales] = useState([]);
  const [showSucursalSelect, setShowSucursalSelect] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [rememberUser, setRememberUser] = useState(!!localStorage.getItem("rememberedUser") && !!localStorage.getItem("rememberedPass"));
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");
    try {
      const res = await loginUser({ username, password, id_sucursal });
      // Si el backend devuelve sucursales para seleccionar
      if (res && res.estado === 1 && Array.isArray(res.data) && res.data.length > 0) {
        setSucursales(res.data);
        setShowSucursalSelect(true);
        setLoginError(res.msg || "Seleccione una sucursal");
      } else {
        if (rememberUser) {
          localStorage.setItem("rememberedUser", username);
          localStorage.setItem("rememberedPass", password);
        } else {
          localStorage.removeItem("rememberedUser");
          localStorage.removeItem("rememberedPass");
        }
        navigate("/dashboard");
      }
    } catch (error) {
      setLoginError("Login fallido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="relative bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md border border-blue-100 animate-fade-in">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg p-2 border border-blue-200">
          <img src="/logo.png" alt="Logo" className="mx-auto w-20 h-20 object-contain" />
        </div>
        <h2 className="text-2xl font-bold text-center text-blue-700 mt-16 mb-2 tracking-tight">Bienvenido</h2>
        <p className="text-center text-gray-500 mb-6">Inicia sesión para continuar</p>
        {loginError && (
          <div className="text-red-600 text-center mb-2 text-sm font-medium">{loginError}</div>
        )}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              type="text"
              value={username}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ingresa tu usuario"
              required
              className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50 transition"
              autoComplete="username"
              disabled={showSucursalSelect}
            />
           
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
              className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50 transition"
              autoComplete="current-password"
              disabled={showSucursalSelect}
            />
           <div className="flex items-center mt-2">
              <input
                id="rememberUser"
                type="checkbox"
                checked={rememberUser}
                onChange={() => setRememberUser(!rememberUser)}
                className="mr-2 accent-blue-600"
                disabled={showSucursalSelect}
              />
              <label htmlFor="rememberUser" className="text-xs text-gray-600 select-none cursor-pointer">
                Recordar usuario y contraseña
              </label>
            </div>
            
          </div>
          {showSucursalSelect && (
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="sucursal">Seleccione una sucursal</label>
              <select
                id="sucursal"
                className="w-full py-3 px-4 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 transition"
                value={id_sucursal || ""}
                onChange={e => setidSucursal(e.target.value)}
                required
              >
                <option value="" disabled>Seleccione una sucursal</option>
                {sucursales.map((s) => (
                  <option key={s.Permiso.Sucursale.id} value={s.Permiso.Sucursale.id}>
                    {s.Permiso.Sucursale.nombre} ({s.Permiso.permiso})
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl font-semibold shadow-md hover:from-blue-700 hover:to-blue-600 transition-all duration-200"
              >
                Ingresar con sucursal seleccionada
              </button>
            </div>
          )}
          {!showSucursalSelect && (
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl font-semibold shadow-md hover:from-blue-700 hover:to-blue-600 transition-all duration-200"
            >
              Iniciar sesión
            </button>
          )}
          <div className="flex flex-col space-y-2 mt-4">
            <button
              type="button"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 rounded-xl font-semibold shadow hover:from-green-600 hover:to-green-700 transition-all duration-200"
              onClick={() => navigate("/registro")}
              disabled={showSucursalSelect}
            >
              Registrarse
            </button>
            <button
              type="button"
              className="w-full text-blue-600 hover:underline text-sm font-medium"
              onClick={() => navigate("/olvide-contraseña")}
              disabled={showSucursalSelect}
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
