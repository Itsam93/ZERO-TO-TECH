import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

const ProtectedRoute = ({
  children,
  role, // "admin" | "user" | optional
  redirectTo = "/login",
}) => {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  /* ================= NOT AUTHENTICATED ================= */
  if (!token || !user) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location }}
        replace
      />
    );
  }

  /* ================= ROLE CHECK ================= */
  if (role && user.role !== role) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;