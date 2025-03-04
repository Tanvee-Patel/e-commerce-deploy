import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children, isLoading }) {
  const location = useLocation();

  if(location.pathname === '/') {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />
    }
    else{
      if (user?.role === "admin"){
        return <Navigate to="/admin/dashboard" />
      }
      else {
        return <Navigate to="/user/home" />
      }
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    if (location.pathname.includes("/login") || location.pathname.includes("/register")) {
      return <>{children}</>;
    }
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  if (isAuthenticated) {
    if (location.pathname.includes("/auth/login") || location.pathname.includes("/auth/register")) {
      return <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/user/home"} replace />;
    }

    if (user?.role === "admin" && location.pathname.startsWith("/user")) {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user?.role !== "admin" && location.pathname.startsWith("/admin")) {
      return <Navigate to="/user/home" replace />;
    }
  }

  return <>{children}</>;
}

export default CheckAuth;