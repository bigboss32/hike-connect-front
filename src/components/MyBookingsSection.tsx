import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ticket, CalendarDays, Users, ChevronRight } from "lucide-react";
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

const WalkingHiker = () => (
  <div className="relative w-full h-14 overflow-hidden my-2 rounded-xl bg-gradient-to-r from-accent/5 via-primary/5 to-accent/5">
    {/* Sky gradient that shifts with day/night cycle */}
    <div className="absolute inset-0 animate-dayNight rounded-xl z-0" />

    {/* Stars - appear at night (behind everything) */}
    <div className="absolute inset-0 animate-starsAppear z-[1]">
      <div className="absolute top-1 left-[15%] w-1 h-1 bg-foreground/30 rounded-full" />
      <div className="absolute top-2 left-[35%] w-0.5 h-0.5 bg-foreground/20 rounded-full" />
      <div className="absolute top-1.5 right-[25%] w-1 h-1 bg-foreground/25 rounded-full" />
      <div className="absolute top-3 right-[40%] w-0.5 h-0.5 bg-foreground/20 rounded-full" />
    </div>

    {/* Sun - BEHIND mountains (z-[2]) */}
    <div className="absolute animate-celestial z-[2]">
      <svg width="16" height="16" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="5" fill="#F59E0B" opacity="0.9"/>
        <g opacity="0.5" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round">
          <line x1="8" y1="0" x2="8" y2="2"/>
          <line x1="8" y1="14" x2="8" y2="16"/>
          <line x1="0" y1="8" x2="2" y2="8"/>
          <line x1="14" y1="8" x2="16" y2="8"/>
          <line x1="2.3" y1="2.3" x2="3.7" y2="3.7"/>
          <line x1="12.3" y1="12.3" x2="13.7" y2="13.7"/>
          <line x1="2.3" y1="13.7" x2="3.7" y2="12.3"/>
          <line x1="12.3" y1="3.7" x2="13.7" y2="2.3"/>
        </g>
      </svg>
    </div>

    {/* Moon - BEHIND mountains (z-[2]) */}
    <div className="absolute animate-celestialMoon z-[2]">
      <svg width="14" height="14" viewBox="0 0 14 14">
        <path d="M10 1a6 6 0 1 0 0 12 5 5 0 0 1 0-12z" fill="#CBD5E1" opacity="0.9"/>
        <circle cx="6" cy="4" r="0.6" fill="#94A3B8" opacity="0.5"/>
        <circle cx="8.5" cy="7" r="0.8" fill="#94A3B8" opacity="0.4"/>
        <circle cx="5" cy="8" r="0.5" fill="#94A3B8" opacity="0.3"/>
      </svg>
    </div>

    {/* Mountains - IN FRONT of sun/moon (z-[3]) */}
    <svg className="absolute bottom-0 left-0 right-0 z-[3]" viewBox="0 0 320 30" preserveAspectRatio="none" style={{ height: '60%' }}>
      <polygon points="0,30 20,10 45,20 70,5 100,18 130,8 160,22 190,6 220,15 250,3 280,18 310,8 320,30" className="fill-card"/>
      <polygon points="0,30 20,10 45,20 70,5 100,18 130,8 160,22 190,6 220,15 250,3 280,18 310,8 320,30" fill="currentColor" className="text-primary" opacity="0.15"/>
      <polygon points="0,30 30,15 60,25 90,12 120,20 150,10 180,24 210,14 240,22 270,8 300,20 320,30" fill="currentColor" className="text-accent" opacity="0.1"/>
    </svg>

    {/* Trees - IN FRONT of mountains (z-[4]) */}
    <svg className="absolute bottom-0 left-[10%] opacity-20 z-[4]" width="12" height="18" viewBox="0 0 12 18">
      <polygon points="6,0 12,14 0,14" fill="currentColor" className="text-primary"/>
      <rect x="5" y="14" width="2" height="4" fill="currentColor" className="text-primary" opacity="0.7"/>
    </svg>
    <svg className="absolute bottom-0 left-[50%] opacity-15 z-[4]" width="10" height="14" viewBox="0 0 10 14">
      <polygon points="5,0 10,11 0,11" fill="currentColor" className="text-primary"/>
      <rect x="4" y="11" width="2" height="3" fill="currentColor" className="text-primary" opacity="0.7"/>
    </svg>
    <svg className="absolute bottom-0 right-[15%] opacity-20 z-[4]" width="14" height="20" viewBox="0 0 14 20">
      <polygon points="7,0 14,16 0,16" fill="currentColor" className="text-primary"/>
      <rect x="6" y="16" width="2" height="4" fill="currentColor" className="text-primary" opacity="0.7"/>
    </svg>

    {/* Ground - topmost layer (z-[5]) */}
    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 z-[5]" />

    {/* Footprints trail */}
    <div className="absolute bottom-[2px] left-0 right-0 flex gap-3 animate-walk opacity-20">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="w-1.5 h-0.5 rounded-full bg-primary shrink-0" style={{ opacity: 1 - i * 0.07 }} />
      ))}
    </div>

    {/* Animated hiker - facing RIGHT */}
    <div className="absolute bottom-[3px] animate-walk">
      <svg width="20" height="28" viewBox="0 0 20 28" fill="none" className="text-primary">
        {/* Head */}
        <circle cx="10" cy="4.5" r="3" fill="currentColor" opacity="0.9"/>
        {/* Hat */}
        <ellipse cx="10" cy="2.8" rx="4.5" ry="1" fill="currentColor" opacity="0.7"/>
        <path d="M7 2.8 Q10 -0.5 13 2.8" fill="currentColor" opacity="0.8"/>
        {/* Body */}
        <rect x="8.5" y="7.5" width="3" height="8" rx="1.5" fill="currentColor" opacity="0.85"/>
        {/* Backpack - on the back (left side since facing right) */}
        <rect x="5.5" y="7.5" width="3.5" height="6" rx="1.5" fill="currentColor" opacity="0.45"/>
        <rect x="6" y="6.5" width="2.5" height="1.5" rx="0.75" fill="currentColor" opacity="0.35"/>
        {/* Left arm with stick */}
        <g className="animate-stickSwing" style={{ transformOrigin: '13px 8px' }}>
          <line x1="13" y1="8" x2="17" y2="22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
          <line x1="11.5" y1="8" x2="14" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
        </g>
        {/* Left leg */}
        <g className="animate-legSwing" style={{ transformOrigin: '9.5px 15px' }}>
          <rect x="8" y="15" width="2.2" height="7" rx="1.1" fill="currentColor" opacity="0.8"/>
          <ellipse cx="9.5" cy="22.5" rx="2.2" ry="1" fill="currentColor" opacity="0.7"/>
        </g>
        {/* Right leg */}
        <g className="animate-legSwing" style={{ transformOrigin: '11px 15px', animationDelay: '0.3s' }}>
          <rect x="10" y="15" width="2.2" height="7" rx="1.1" fill="currentColor" opacity="0.8"/>
          <ellipse cx="11.5" cy="22.5" rx="2.2" ry="1" fill="currentColor" opacity="0.7"/>
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
      <Card className="shadow-soft">
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  // No mostrar nada si no hay reservas
  if (bookings.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-soft overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg text-foreground">Próximas Reservas</h3>
          </div>
          <Badge variant="secondary">{bookings.length}</Badge>
        </div>
        
        {/* Walking hiker animation */}
        <WalkingHiker />

        <div className="space-y-3">
          {bookings.slice(0, 3).map((b) => (
            <Link
              key={b.payment_id}
              to={`/routes/${b.ruta_id}`}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
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
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </Link>
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
