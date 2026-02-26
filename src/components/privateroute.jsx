import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../services/auth";

export default function PrivateRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
}