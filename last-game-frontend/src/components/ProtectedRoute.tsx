import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" />;

  //return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;