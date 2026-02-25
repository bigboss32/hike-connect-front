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
    <Card className="shadow-soft">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg text-foreground">Próximas Reservas</h3>
          </div>
          <Badge variant="secondary">{bookings.length}</Badge>
        </div>
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
