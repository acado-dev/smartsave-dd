import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSuperadminAuth } from "@/contexts/SuperadminAuthContext";

export function RequireSuperadminAuth() {
  const { session } = useSuperadminAuth();
  const location = useLocation();
  if (!session) {
    return <Navigate to="/superadmin/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
