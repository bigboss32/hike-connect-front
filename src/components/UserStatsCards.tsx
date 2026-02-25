import { Mountain, Route, Users, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserCommunityStats } from "@/hooks/useCommunityMembers";
import { Link } from "react-router-dom";
import RouteHistoryDialog from "@/components/RouteHistoryDialog";
import MyCommunityDialog from "@/components/MyCommunityDialog";
import { useBookingHistory } from "@/hooks/useBookingHistory";

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
  delay: number;
  onClick?: () => void;
  className?: string;
}

const StatCard = ({ icon, value, label, color, delay, onClick, className = "" }: StatCardProps) => (
  <div 
    className={`bg-card rounded-2xl p-4 shadow-soft border border-border/50 text-center transition-all duration-200 ${onClick ? "cursor-pointer hover:shadow-elevated hover:-translate-y-0.5" : ""} ${className}`}
    style={{ animationDelay: `${delay}ms` }}
    onClick={onClick}
  >
    <div className={`w-10 h-10 rounded-xl ${color} mx-auto mb-2 flex items-center justify-center`}>
      {icon}
    </div>
    <p className="text-xl font-bold text-foreground">{value}</p>
    <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
  </div>
);

interface UserStatsCardsProps {
  hideGreeting?: boolean;
}

const UserStatsCards = ({ hideGreeting = false }: UserStatsCardsProps) => {
  const { user } = useAuth();
  const { data: communityStats } = useUserCommunityStats();
  const { data: bookingHistory } = useBookingHistory(1, 1);
  
  const stats = {
    routesCompleted: bookingHistory?.count || 0,
    kmTraveled: 87.5,
    communitiesJoined: communityStats?.total_communities || 0,
    achievements: 8,
  };

  return (
    <div className="space-y-3">
      {!hideGreeting && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            ¡Hola, {user?.name?.split(' ')[0] || 'Aventurero'}!
          </h2>
          <span className="text-xs text-muted-foreground">Tu progreso</span>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-3 stagger-fade-up">
        <RouteHistoryDialog>
          <StatCard
            icon={<Route className="w-5 h-5 text-white" />}
            value={stats.routesCompleted}
            label="Rutas completadas"
            color="bg-primary"
            delay={0}
            className="cursor-pointer hover:shadow-md transition-shadow"
          />
        </RouteHistoryDialog>
        <RouteHistoryDialog>
          <StatCard
            icon={<Mountain className="w-5 h-5 text-white" />}
            value={`${stats.kmTraveled} km`}
            label="Recorridos"
            color="bg-secondary"
            delay={100}
            className="cursor-pointer hover:shadow-md transition-shadow"
          />
        </RouteHistoryDialog>
        <MyCommunityDialog>
          <StatCard
            icon={<Users className="w-5 h-5 text-white" />}
            value={stats.communitiesJoined}
            label="Comunidades"
            color="bg-accent"
            delay={200}
            className="cursor-pointer hover:shadow-md transition-shadow"
          />
        </MyCommunityDialog>
        <Link to="/achievements">
          <StatCard
            icon={<Trophy className="w-5 h-5 text-white" />}
            value={stats.achievements}
            label="Logros"
            color="bg-gradient-to-br from-yellow-500 to-orange-500"
            delay={300}
            className="cursor-pointer hover:shadow-md transition-shadow"
          />
        </Link>
      </div>
    </div>
  );
};

export default UserStatsCards;
