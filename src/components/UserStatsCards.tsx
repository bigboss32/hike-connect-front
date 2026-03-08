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
    className={`backdrop-blur-sm bg-foreground/[0.06] border border-foreground/[0.08] rounded-2xl p-4 text-center transition-all duration-200 ${onClick ? "cursor-pointer hover:bg-foreground/[0.1] hover:-translate-y-0.5" : ""} ${className}`}
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

/* ── Hiker Trail Banner ── */
const HikerTrailBanner = () => (
  <div className="relative h-14 rounded-2xl overflow-hidden backdrop-blur-sm bg-foreground/[0.06] border border-foreground/[0.08] col-span-2">
    {/* Terrain */}
    <svg className="absolute bottom-0 left-0 right-0 w-full h-5 text-primary/10" viewBox="0 0 400 20" preserveAspectRatio="none" fill="currentColor">
      <path d="M0,15 Q50,6 100,13 Q150,18 200,10 Q250,4 300,13 Q350,18 400,8 L400,20 L0,20Z" opacity="0.7" />
      <path d="M0,17 Q60,12 120,16 Q180,20 240,12 Q300,6 360,15 Q380,18 400,11 L400,20 L0,20Z" opacity="0.4" />
    </svg>

    {/* Trail line */}
    <div className="absolute bottom-[10px] left-[4%] right-[4%] h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

    {/* Trees */}
    {[
      { x: "10%", h: 14 }, { x: "25%", h: 10 }, { x: "48%", h: 16 }, { x: "72%", h: 12 },
    ].map((tree, i) => (
      <div key={i} className="absolute bottom-[10px]" style={{ left: tree.x }}>
        <svg width="7" height={tree.h} viewBox={`0 0 10 ${tree.h}`} className="text-primary" opacity="0.2">
          <rect x="4" y={tree.h * 0.55} width="2" height={tree.h * 0.45} fill="currentColor" rx="1" />
          <path d={`M5,0 L0,${tree.h * 0.6} L10,${tree.h * 0.6}Z`} fill="currentColor" />
        </svg>
      </div>
    ))}

    {/* Footprints */}
    <div className="absolute bottom-[11px] left-0 right-0 flex gap-2.5 opacity-10" style={{ animation: "hikerWalk 12s linear infinite" }}>
      {[...Array(18)].map((_, i) => (
        <div key={i} className="w-1 h-0.5 rounded-full bg-primary shrink-0" style={{ opacity: 1 - i * 0.04 }} />
      ))}
    </div>

    {/* Walking Hiker */}
    <div className="absolute bottom-[6px]" style={{ animation: "hikerWalk 12s linear infinite" }}>
      <svg width="18" height="24" viewBox="0 0 20 28" fill="none" className="text-primary">
        <circle cx="10" cy="4.5" r="3" fill="currentColor" opacity="0.9" />
        <ellipse cx="10" cy="2.8" rx="4.5" ry="1" fill="currentColor" opacity="0.7" />
        <path d="M7 2.8 Q10 -0.5 13 2.8" fill="currentColor" opacity="0.8" />
        <rect x="8.5" y="7.5" width="3" height="8" rx="1.5" fill="currentColor" opacity="0.85" />
        <rect x="5.5" y="7.5" width="3.5" height="6" rx="1.5" fill="currentColor" opacity="0.45" />
        <g style={{ transformOrigin: "13px 8px", animation: "stickSwing 1.2s ease-in-out infinite" }}>
          <line x1="13" y1="8" x2="17" y2="22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
          <line x1="11.5" y1="8" x2="14" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
        </g>
        <g style={{ transformOrigin: "9.5px 15px", animation: "legSwing 0.8s ease-in-out infinite" }}>
          <rect x="8" y="15" width="2.2" height="7" rx="1.1" fill="currentColor" opacity="0.8" />
          <ellipse cx="9.5" cy="22.5" rx="2.2" ry="1" fill="currentColor" opacity="0.7" />
        </g>
        <g style={{ transformOrigin: "11px 15px", animation: "legSwing 0.8s ease-in-out 0.4s infinite" }}>
          <rect x="10" y="15" width="2.2" height="7" rx="1.1" fill="currentColor" opacity="0.8" />
          <ellipse cx="11.5" cy="22.5" rx="2.2" ry="1" fill="currentColor" opacity="0.7" />
        </g>
      </svg>
    </div>

    {/* Campfire */}
    <div className="absolute bottom-[6px] right-[7%]">
      <svg width="12" height="16" viewBox="0 0 16 20" fill="none">
        <rect x="3" y="16" width="10" height="2" rx="1" fill="currentColor" className="text-primary" opacity="0.3" />
        <path d="M8 5 Q10 8 9 11 Q8.5 13 8 14 Q7.5 13 7 11 Q6 8 8 5Z" fill="#F59E0B" opacity="0.85" style={{ animation: "fireFlicker 0.6s ease-in-out infinite alternate" }} />
        <path d="M8 7 Q9 9.5 8.5 12 Q8.2 13 8 13.2 Q7.8 13 7.5 12 Q7 9.5 8 7Z" fill="#EF4444" opacity="0.55" style={{ animation: "fireFlicker 0.6s ease-in-out 0.15s infinite alternate" }} />
        <circle cx="7.5" cy="3.5" r="0.8" fill="currentColor" className="text-muted-foreground" opacity="0.12" style={{ animation: "smokeRise 2s ease-out infinite" }} />
      </svg>
    </div>

    {/* Keyframes for hiker animations */}
    <style>{`
      @keyframes hikerWalk { 0% { left: -5%; } 100% { left: 88%; } }
      @keyframes legSwing { 0%, 100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }
      @keyframes stickSwing { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
      @keyframes fireFlicker { 0% { transform: scaleY(1) scaleX(1); } 100% { transform: scaleY(1.15) scaleX(0.9); } }
      @keyframes smokeRise { 0% { transform: translateY(0); opacity: 0.12; } 100% { transform: translateY(-6px); opacity: 0; } }
    `}</style>
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
        {/* Hiker trail as first row spanning both columns */}
        <HikerTrailBanner />

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
