import { useState, useEffect } from "react";
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
      <div className="space-y-3">
        <Skeleton className="h-5 w-32 bg-foreground/10" />
        <Skeleton className="h-14 w-full bg-foreground/10 rounded-xl" />
        <Skeleton className="h-14 w-full bg-foreground/10 rounded-xl" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Header — floats directly on the hero */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground/90">Próximas Reservas</h3>
        </div>
        <Badge variant="secondary" className="bg-primary/20 text-primary border-0 text-xs px-2 py-0.5">
          {bookings.length}
        </Badge>
      </div>

      {/* Booking items — glass pills that blend with the scenery */}
      <div className="space-y-2">
        {bookings.slice(0, 3).map((b) => (
          <div
            key={b.payment_id}
            className="flex items-center gap-3 p-2.5 rounded-2xl backdrop-blur-sm bg-foreground/[0.06] border border-foreground/[0.08] hover:bg-foreground/[0.1] transition-all duration-200"
          >
            <Link to={`/routes/${b.ruta_id}`} className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 ring-1 ring-foreground/10">
                {b.ruta_image ? (
                  <img
                    src={b.ruta_image.startsWith("http") ? b.ruta_image : `https://hike-connect-back.onrender.com${b.ruta_image}`}
                    alt={b.ruta_title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <CalendarDays className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">
                  {b.ruta_title || "Ruta"}
                </p>
                <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground mt-0.5">
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
              className="shrink-0 p-1.5 rounded-full bg-primary/15 hover:bg-primary/25 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="w-3.5 h-3.5 text-primary" />
            </Link>
            <Link to={`/routes/${b.ruta_id}`} className="shrink-0">
              <ChevronRight className="w-4 h-4 text-muted-foreground/60" />
            </Link>
          </div>
        ))}
      </div>
      {bookings.length > 3 && (
        <p className="text-[11px] text-center text-muted-foreground/70 mt-2">
          +{bookings.length - 3} reservas más
        </p>
      )}
    </div>
  );
};

export default MyBookingsSection;
