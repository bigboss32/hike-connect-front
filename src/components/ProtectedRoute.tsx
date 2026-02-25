import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <svg width="32" height="32" viewBox="0 0 20 20" fill="none" className="text-primary mx-auto mb-4">
            <circle cx="10" cy="3.5" r="2.2" fill="currentColor" opacity="0.9"/>
            <ellipse cx="10" cy="2.2" rx="3.2" ry="0.7" fill="currentColor" opacity="0.6"/>
            <path d="M7.5 2.2 Q10 -0.2 12.5 2.2" fill="currentColor" opacity="0.7"/>
            <rect x="9" y="5.5" width="2.2" height="5.5" rx="1.1" fill="currentColor" opacity="0.85"/>
            <rect x="6.5" y="5.5" width="2.8" height="4.2" rx="1" fill="currentColor" opacity="0.4"/>
            <g className="animate-legSwing" style={{ transformOrigin: '9.5px 11px' }}>
              <rect x="8.5" y="11" width="1.8" height="5" rx="0.9" fill="currentColor" opacity="0.8"/>
            </g>
            <g className="animate-legSwing" style={{ transformOrigin: '11px 11px', animationDelay: '0.25s' }}>
              <rect x="10.2" y="11" width="1.8" height="5" rx="0.9" fill="currentColor" opacity="0.8"/>
            </g>
            <g className="animate-stickSwing" style={{ transformOrigin: '13px 6px' }}>
              <line x1="12.5" y1="6" x2="15" y2="16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.45"/>
            </g>
          </svg>
          <p className="text-muted-foreground text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
