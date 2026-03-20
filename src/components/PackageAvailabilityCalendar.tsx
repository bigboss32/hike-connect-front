import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Loader2, Users, CalendarCheck, CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { usePackageAvailability } from "@/hooks/usePackageAvailability";

interface Props {
  packageId: string;
}

const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const PackageAvailabilityCalendar = ({ packageId }: Props) => {
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1);
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  const { data: availability, isLoading: isLoadingAvailability } = usePackageAvailability(packageId, selectedDate);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth - 1, 1);
    let startWeekday = firstDay.getDay() - 1;
    if (startWeekday < 0) startWeekday = 6;
    const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
    const cells: (null | number)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [viewMonth, viewYear]);

  const goToPrevMonth = () => {
    const isCurrentMonth = viewMonth === now.getMonth() + 1 && viewYear === now.getFullYear();
    if (isCurrentMonth) return;
    if (viewMonth === 1) { setViewMonth(12); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };

  const goToNextMonth = () => {
    if (viewMonth === 12) { setViewMonth(1); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const formatDateStr = (day: number) => {
    const m = String(viewMonth).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${viewYear}-${m}-${d}`;
  };

  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const handleSelectDay = (day: number) => {
    const dateStr = formatDateStr(day);
    if (dateStr < todayStr) return;
    setSelectedDate(dateStr);
  };

  return (
    <div className="space-y-4">
      {/* Month navigator */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={goToPrevMonth} className="h-8 w-8">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm font-semibold text-foreground">
          {MONTH_NAMES[viewMonth - 1]} {viewYear}
        </span>
        <Button variant="ghost" size="icon" onClick={goToNextMonth} className="h-8 w-8">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="text-center text-xs font-medium text-muted-foreground py-1">
            {label}
          </div>
        ))}

        {/* Day cells */}
        {calendarDays.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const dateStr = formatDateStr(day);
          const isPast = dateStr < todayStr;
          const isSelected = dateStr === selectedDate;

          return (
            <button
              key={dateStr}
              disabled={isPast}
              onClick={() => handleSelectDay(day)}
              className={cn(
                "aspect-square rounded-lg text-sm font-medium transition-all flex items-center justify-center",
                isPast && "text-muted-foreground/40 cursor-not-allowed",
                !isPast && !isSelected && "text-foreground hover:bg-primary/10 cursor-pointer",
                isSelected && "bg-primary text-primary-foreground shadow-sm",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Availability result */}
      {selectedDate && (
        <Card className={cn(
          "transition-all animate-fade-in",
          availability?.is_available
            ? "border-green-500/30 bg-green-500/5"
            : availability && !availability.is_available
            ? "border-destructive/30 bg-destructive/5"
            : ""
        )}>
          <CardContent className="p-4">
            {isLoadingAvailability ? (
              <div className="flex items-center gap-2 text-muted-foreground justify-center py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Consultando disponibilidad...</span>
              </div>
            ) : availability ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {availability.is_available ? (
                    <CalendarCheck className="w-5 h-5 text-green-600" />
                  ) : (
                    <CalendarX className="w-5 h-5 text-destructive" />
                  )}
                  <span className={cn(
                    "font-semibold text-sm",
                    availability.is_available ? "text-green-700 dark:text-green-400" : "text-destructive"
                  )}>
                    {availability.is_available ? "Disponible" : "No disponible"}
                  </span>
                </div>

                {availability.is_day_available && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>
                        {availability.available_guests} cupo{availability.available_guests !== 1 ? "s" : ""} disponible{availability.available_guests !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {availability.booked_count > 0 && (
                      <span className="text-xs">
                        ({availability.booked_count} reserva{availability.booked_count !== 1 ? "s" : ""})
                      </span>
                    )}
                  </div>
                )}

                {!availability.is_day_available && (
                  <p className="text-xs text-muted-foreground">
                    Este día no está habilitado para este paquete.
                  </p>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PackageAvailabilityCalendar;
