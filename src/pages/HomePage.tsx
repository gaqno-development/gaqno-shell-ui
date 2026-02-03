import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authStorage } from "@/utils/auth-storage";

export default function HomePage() {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const authState = authStorage.get();

        if (!isMounted) return;

        if (!authState?.user || !authState?.session?.access_token) {
          setIsRedirecting(true);
          navigate("/login");
          return;
        }

        setIsRedirecting(true);
        navigate("/dashboard");
      } catch {
        if (!isMounted) return;
        setIsRedirecting(true);
        navigate("/login");
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

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
