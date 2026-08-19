import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext.tsx";

interface ProtectedRouteProps {
  children: React.ReactNode;
  publicRoutes?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  publicRoutes = ["/share"],
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  const isPublicRoute = publicRoutes.some(
    (route) =>
      location.pathname === route || location.pathname.startsWith(`${route}/`),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs font-medium">
        Session wird geladen...
      </div>
    );
  }

  if (isPublicRoute || isAuthenticated) {
    return <>{children}</>;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};
