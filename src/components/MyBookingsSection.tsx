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
  <div className="relative w-full h-10 overflow-hidden my-1">
    {/* Ground line */}
    <div className="absolute bottom-1 left-0 right-0 h-px bg-border" />
    {/* Dotted trail */}
    <div className="absolute bottom-[5px] left-0 right-0 h-px border-b border-dashed border-primary/20" />
    {/* Animated hiker */}
    <div className="absolute bottom-1 animate-walk">
      <svg width="24" height="32" viewBox="0 0 24 32" fill="none" className="text-primary">
        {/* Head */}
        <circle cx="12" cy="5" r="3.5" fill="currentColor" opacity="0.9"/>
        {/* Hat brim */}
        <ellipse cx="12" cy="3" rx="5" ry="1.2" fill="currentColor" opacity="0.7"/>
        {/* Hat top */}
        <rect x="9" y="0" width="6" height="3.5" rx="2" fill="currentColor" opacity="0.8"/>
        {/* Body */}
        <rect x="10.5" y="8" width="3" height="9" rx="1.5" fill="currentColor" opacity="0.85"/>
        {/* Backpack */}
        <rect x="13" y="8" width="4" height="7" rx="1.5" fill="currentColor" opacity="0.5"/>
        {/* Left leg */}
        <g className="animate-legSwing origin-center" style={{ transformOrigin: '11px 17px' }}>
          <rect x="9.5" y="17" width="2.5" height="8" rx="1.2" fill="currentColor" opacity="0.8"/>
          <rect x="8.5" y="24" width="4" height="2" rx="1" fill="currentColor" opacity="0.7"/>
        </g>
        {/* Right leg */}
        <g className="animate-legSwing origin-center" style={{ transformOrigin: '13px 17px', animationDelay: '0.3s' }}>
          <rect x="12" y="17" width="2.5" height="8" rx="1.2" fill="currentColor" opacity="0.8"/>
          <rect x="11.5" y="24" width="4" height="2" rx="1" fill="currentColor" opacity="0.7"/>
        </g>
        {/* Walking stick */}
        <line x1="7" y1="10" x2="5" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" className="animate-stickSwing" style={{ transformOrigin: '7px 10px' }}/>
      </svg>
    </div>
    {/* Small mountains in background */}
    <svg className="absolute bottom-1 right-2 opacity-10" width="60" height="20" viewBox="0 0 60 20">
      <polygon points="0,20 15,4 30,20" fill="currentColor" className="text-primary"/>
      <polygon points="20,20 40,2 60,20" fill="currentColor" className="text-primary"/>
    </svg>
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
