import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

const ProtectedRoute = ({
  children,
  role,
  redirectTo = "/login",
}) => {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token || !user) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location }}
        replace
      />
    );
  }

  if (role) {
    const userRole = user?.role;

    if (!userRole || userRole !== role) {
      return (
        <Navigate
          to="/unauthorized"
          replace
        />
      );
    }
  }

  return children;
};

export default ProtectedRoute;