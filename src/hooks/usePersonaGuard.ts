import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSuperadminAuth } from "@/contexts/SuperadminAuthContext";
import { canAccess } from "@/lib/superadminScope";
import { toast } from "sonner";

export function usePersonaGuard(section: Parameters<typeof canAccess>[0]) {
  const { session } = useSuperadminAuth();
  const navigate = useNavigate();
  const ok = canAccess(section, session?.persona);
  useEffect(() => {
    if (!ok) {
      toast.error("You don't have access to this section in your workspace.");
      navigate("/superadmin", { replace: true });
    }
  }, [ok, navigate]);
  return ok;
}
