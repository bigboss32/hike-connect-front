import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket, CalendarDays, Users, ChevronRight, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const API_BASE_URL = "https://hike-connect-back.onrender.com/api/v1";

interface Booking {
  payment_id: string;
  status: string;
  amount: string;
  booking_date: string;
  total_participants: number;
  ruta_id: string;
  ruta_title: string;
  ruta_image: string;
  created_at: string;
}

const formatCOP = (amount: string) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(num);
};

/**
 * Simplified WalkingHiker — just hiker, campfire, footprints on transparent ground.
 * No separate landscape — the hero scenery behind the card provides the backdrop.
 */
const WalkingHiker = () => (
  <div className="relative w-full h-10 overflow-hidden my-1.5 rounded-lg">
    {/* Subtle ground line */}
    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/10 via-primary/25 to-primary/10" />

    {/* Campfire at the end */}
    <div className="absolute bottom-[1px] right-[5%]">
      <svg width="12" height="16" viewBox="0 0 16 20" fill="none">
        <rect x="3" y="16" width="10" height="2" rx="1" fill="currentColor" className="text-primary" opacity="0.3" />
        <path d="M8 5 Q10 8 9 11 Q8.5 13 8 14 Q7.5 13 7 11 Q6 8 8 5Z" className="animate-fireFlicker" fill="#F59E0B" opacity="0.85" />
        <path d="M8 7 Q9 9.5 8.5 12 Q8.2 13 8 13.2 Q7.8 13 7.5 12 Q7 9.5 8 7Z" className="animate-fireFlicker" fill="#EF4444" opacity="0.55" style={{ animationDelay: "0.15s" }} />
        <circle cx="7.5" cy="3.5" r="0.8" fill="currentColor" className="text-muted-foreground animate-smokeRise" opacity="0.12" />
      </svg>
    </div>

    {/* Footprints */}
    <div className="absolute bottom-[2px] left-0 right-0 flex gap-2.5 animate-walk opacity-15">
      {[...Array(14)].map((_, i) => (
        <div key={i} className="w-1 h-0.5 rounded-full bg-primary shrink-0" style={{ opacity: 1 - i * 0.06 }} />
      ))}
    </div>

    {/* Hiker */}
    <div className="absolute bottom-[2px] animate-walk">
      <svg width="16" height="22" viewBox="0 0 20 28" fill="none" className="text-primary">
        <circle cx="10" cy="4.5" r="3" fill="currentColor" opacity="0.9" />
        <ellipse cx="10" cy="2.8" rx="4.5" ry="1" fill="currentColor" opacity="0.7" />
        <path d="M7 2.8 Q10 -0.5 13 2.8" fill="currentColor" opacity="0.8" />
        <rect x="8.5" y="7.5" width="3" height="8" rx="1.5" fill="currentColor" opacity="0.85" />
        <rect x="5.5" y="7.5" width="3.5" height="6" rx="1.5" fill="currentColor" opacity="0.45" />
        <g className="animate-stickSwing" style={{ transformOrigin: "13px 8px" }}>
          <line x1="13" y1="8" x2="17" y2="22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
          <line x1="11.5" y1="8" x2="14" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
        </g>
        <g className="animate-legSwing" style={{ transformOrigin: "9.5px 15px" }}>
          <rect x="8" y="15" width="2.2" height="7" rx="1.1" fill="currentColor" opacity="0.8" />
          <ellipse cx="9.5" cy="22.5" rx="2.2" ry="1" fill="currentColor" opacity="0.7" />
        </g>
        <g className="animate-legSwing" style={{ transformOrigin: "11px 15px", animationDelay: "0.3s" }}>
          <rect x="10" y="15" width="2.2" height="7" rx="1.1" fill="currentColor" opacity="0.8" />
          <ellipse cx="11.5" cy="22.5" rx="2.2" ry="1" fill="currentColor" opacity="0.7" />
        </g>
      </svg>
    </div>
  </div>
);

const MyBookingsSection = () => {
  const { authFetch } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await authFetch(`${API_BASE_URL}/payments/my-bookings/`);
        if (res.ok) {
          const json = await res.json();
          setBookings(json.results || json.data || json || []);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [authFetch]);

  if (loading) {
    return (
      <Card className="shadow-soft backdrop-blur-md bg-card/70 border-border/50">
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (bookings.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-soft overflow-hidden backdrop-blur-md bg-card/75 border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg text-foreground">Próximas Reservas</h3>
          </div>
          <Badge variant="secondary">{bookings.length}</Badge>
        </div>
        
        <WalkingHiker />

        <div className="space-y-3">
          {bookings.slice(0, 3).map((b) => (
            <div
              key={b.payment_id}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors"
            >
              <Link to={`/routes/${b.ruta_id}`} className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  {b.ruta_image ? (
                    <img
                      src={b.ruta_image.startsWith("http") ? b.ruta_image : `https://hike-connect-back.onrender.com${b.ruta_image}`}
                      alt={b.ruta_title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <CalendarDays className="w-5 h-5 text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {b.ruta_title || "Ruta"}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {new Date(b.booking_date).toLocaleDateString("es-CO", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {b.total_participants}
                    </span>
                    <span>{formatCOP(b.amount)}</span>
                  </div>
                </div>
              </Link>
              <Link
                to={`/booking-chat/${b.payment_id}`}
                className="shrink-0 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle className="w-4 h-4 text-primary" />
              </Link>
              <Link to={`/routes/${b.ruta_id}`} className="shrink-0">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            </div>
          ))}
        </div>
        {bookings.length > 3 && (
          <p className="text-xs text-center text-muted-foreground mt-3">
            +{bookings.length - 3} reservas más
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MyBookingsSection;
