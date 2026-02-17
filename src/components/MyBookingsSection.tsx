import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ticket, CalendarDays, Users, ChevronRight, Compass } from "lucide-react";
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
  created_at: string;
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  APPROVED: { label: "Aprobado", variant: "default" },
  PENDING: { label: "Pendiente", variant: "secondary" },
  DECLINED: { label: "Rechazado", variant: "destructive" },
  VOIDED: { label: "Anulado", variant: "outline" },
  ERROR: { label: "Error", variant: "destructive" },
};

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
        const res = await authFetch(`${API_BASE_URL}/payments/history/`);
        if (res.ok) {
          const json = await res.json();
          setBookings(json.data || json.results || json || []);
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

  if (bookings.length === 0) {
    return (
      <Card className="shadow-soft border-dashed border-2 border-primary/20">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center">
            <Compass className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-bold text-foreground mb-1">¡Aún no tienes reservas!</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Explora nuestras rutas y empieza tu próxima aventura.
          </p>
          <Link to="/routes">
            <Button className="w-full">
              Explorar Rutas
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg text-foreground">Mis Reservas</h3>
          </div>
          <Badge variant="secondary">{bookings.length}</Badge>
        </div>
        <div className="space-y-3">
          {bookings.slice(0, 3).map((b) => {
            const st = statusMap[b.status] || { label: b.status, variant: "outline" as const };
            return (
              <div
                key={b.payment_id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-foreground truncate">
                      {new Date(b.booking_date).toLocaleDateString("es-CO", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <Badge variant={st.variant} className="text-[10px] px-1.5 py-0">
                      {st.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {b.total_participants} participante{b.total_participants !== 1 ? "s" : ""}
                    </span>
                    <span>{formatCOP(b.amount)}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            );
          })}
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
