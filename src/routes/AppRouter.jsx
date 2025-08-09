import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";

const isAuthenticated = () => {
  const token = sessionStorage.getItem("client-token");
  return !!token; // true si hay token
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
