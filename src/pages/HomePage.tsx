import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authStorage } from "@/utils/auth-storage";
import { useUserPermissions } from "@gaqno-development/frontcore/hooks/useUserPermissions";
import { getFirstAvailableRoute } from "@/utils/route-utils";

export default function HomePage() {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { permissions, isLoading: permissionsLoading } = useUserPermissions();

  useEffect(() => {
    try {
      const state = authStorage.get();
      if (!state?.user || !state?.session?.access_token) {
        setIsRedirecting(true);
        navigate("/login");
        return;
      }
      if (permissionsLoading) return;
      setIsRedirecting(true);
      const target = getFirstAvailableRoute(permissions ?? []) ?? "/dashboard";
      navigate(target);
    } catch {
      setIsRedirecting(true);
      navigate("/login");
    }
  }, [permissions, permissionsLoading, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-center">
        <p className="text-muted-foreground">
          {isRedirecting ? "Redirecionando..." : "Carregando..."}
        </p>
      </div>
    </div>
  );
}
