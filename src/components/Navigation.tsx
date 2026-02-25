import { useState, useRef } from "react";
import { Home, Map, Users, User, LogIn, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import SettingsDialog from "@/components/SettingsDialog";

const Navigation = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bouncingPath, setBouncingPath] = useState<string | null>(null);

  const handleNavClick = (path: string) => {
    setBouncingPath(path);
    setTimeout(() => setBouncingPath(null), 400);
  };

  const navItems = [
    { icon: Home, label: "Inicio", path: "/" },
    { icon: Map, label: "Rutas", path: "/routes" },
    { icon: Users, label: "Comunidad", path: "/communities" },
    { icon: user ? User : LogIn, label: user ? "Perfil" : "Entrar", path: user ? "/profile" : "/auth" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-elevated safe-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => handleNavClick(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all relative",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-transform",
                isActive && "scale-110",
                bouncingPath === item.path && "nav-bounce"
              )} />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary nav-active-dot" />
              )}
            </Link>
          );
        })}
        <SettingsDialog>
          <button
            className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all text-muted-foreground hover:text-foreground"
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs font-medium">Ajustes</span>
          </button>
        </SettingsDialog>
      </div>
    </nav>
  );
};

export default Navigation;
