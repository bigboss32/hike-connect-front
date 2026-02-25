import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Clock,
  Mountain,
  Star,
  CalendarDays,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Users,
  DollarSign,
} from "lucide-react";
import { useBookingHistory, BookingHistoryItem } from "@/hooks/useBookingHistory";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatAmount = (amount: string) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(parseFloat(amount));
};

type SortBy = "date-desc" | "date-asc";

interface RouteHistoryDialogProps {
  children: React.ReactNode;
}

const RouteHistoryDialog = ({ children }: RouteHistoryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("date-desc");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useBookingHistory(page);

  const sortOptions: { value: SortBy; label: string }[] = [
    { value: "date-desc", label: "Más recientes" },
    { value: "date-asc", label: "Más antiguas" },
  ];

  const hasActiveFilters = sortBy !== "date-desc";

  const handleReset = () => {
    setSortBy("date-desc");
  };

  const sortedResults = [...(data?.results || [])].sort((a, b) => {
    if (sortBy === "date-asc") {
      return new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime();
    }
    return new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime();
  });

  const totalCount = data?.count || 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] p-0">
        <DialogHeader className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Mountain className="w-5 h-5 text-primary" />
              Historial de Rutas
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`relative ${hasActiveFilters ? "border-primary text-primary" : ""}`}
            >
              <SlidersHorizontal className="w-4 h-4 mr-1.5" />
              Filtros
              {showFilters ? (
                <ChevronUp className="w-3.5 h-3.5 ml-1" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {totalCount} rutas completadas
          </p>
        </DialogHeader>

        {showFilters && (
          <div className="px-5 pb-3 space-y-4 animate-fade-in">
            <div className="space-y-2.5">
              <p className="text-sm font-medium flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-primary" />
                Ordenar por
              </p>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((s) => {
                  const isActive = sortBy === s.value;
                  return (
                    <Badge
                      key={s.value}
                      variant={isActive ? "default" : "outline"}
                      className={`cursor-pointer px-3 py-2 text-xs transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => setSortBy(s.value)}
                    >
                      {s.label}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {hasActiveFilters && (
              <>
                <Separator />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="w-full text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="w-4 h-4 mr-1.5" />
                  Limpiar filtros
                </Button>
              </>
            )}
            <Separator />
          </div>
        )}

        <ScrollArea className="max-h-[55vh] px-5 pb-5">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-muted/30">
                  <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedResults.length === 0 ? (
            <div className="text-center py-10">
              <Mountain className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                No hay rutas completadas aún
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedResults.map((booking) => (
                <BookingHistoryCard
                  key={booking.payment_id}
                  booking={booking}
                  onClose={() => setOpen(false)}
                />
              ))}

              {data && data.total_pages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Anterior
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {page} / {data.total_pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= data.total_pages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const BookingHistoryCard = ({
  booking,
  onClose,
}: {
  booking: BookingHistoryItem;
  onClose: () => void;
}) => {
  const imgSrc = booking.ruta_image?.startsWith("http")
    ? booking.ruta_image
    : `https://hike-connect-back.onrender.com${booking.ruta_image}`;

  return (
    <Link
      to={`/routes/${booking.ruta_id}`}
      onClick={onClose}
      className="flex gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors group"
    >
      <img
        src={imgSrc}
        alt={booking.ruta_title}
        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <h4 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {booking.ruta_title}
          </h4>
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
        </div>

        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
            <Users className="w-3 h-3" />
            {booking.total_participants} participante{booking.total_participants > 1 ? "s" : ""}
          </span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
            <DollarSign className="w-3 h-3" />
            {formatAmount(booking.amount)}
          </span>
        </div>

        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
            <CalendarDays className="w-3 h-3" />
            {formatDate(booking.booking_date)}
          </span>
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 h-5 bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
          >
            Completada
          </Badge>
        </div>
      </div>
    </Link>
  );
};

export default RouteHistoryDialog;
