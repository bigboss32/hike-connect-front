import { Mountain, Route, Users, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
  delay: number;
}

const StatCard = ({ icon, value, label, color, delay }: StatCardProps) => (
  <div 
    className="bg-card rounded-xl p-4 shadow-elevated text-center animate-fade-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`w-10 h-10 rounded-full ${color} mx-auto mb-2 flex items-center justify-center`}>
      {icon}
    </div>
    <p className="text-xl font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

const UserStatsCards = () => {
  const { user } = useAuth();
  
  // Simulated stats - in production these would come from the backend
  const stats = {
    routesCompleted: 12,
    kmTraveled: 87.5,
    communitiesJoined: 3,
    achievements: 8,
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">
          ¡Hola, {user?.name?.split(' ')[0] || 'Aventurero'}!
        </h2>
        <span className="text-xs text-muted-foreground">Tu progreso</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Route className="w-5 h-5 text-white" />}
          value={stats.routesCompleted}
          label="Rutas completadas"
          color="bg-primary"
          delay={0}
        />
        <StatCard
          icon={<Mountain className="w-5 h-5 text-white" />}
          value={`${stats.kmTraveled} km`}
          label="Recorridos"
          color="bg-secondary"
          delay={100}
        />
        <StatCard
          icon={<Users className="w-5 h-5 text-white" />}
          value={stats.communitiesJoined}
          label="Comunidades"
          color="bg-accent"
          delay={200}
        />
        <StatCard
          icon={<Trophy className="w-5 h-5 text-white" />}
          value={stats.achievements}
          label="Logros"
          color="bg-gradient-to-br from-yellow-500 to-orange-500"
          delay={300}
        />
      </div>
    </div>
  );
};

export default UserStatsCards;
