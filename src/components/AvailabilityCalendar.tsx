import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouteAvailability, type DayAvailability } from "@/hooks/useRouteAvailability";

interface AvailabilityCalendarProps {
  routeId: string;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const AvailabilityCalendar = ({ routeId, selectedDate, onSelectDate }: AvailabilityCalendarProps) => {
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1);
  const [viewYear, setViewYear] = useState(now.getFullYear());

  const { data: availability, isLoading } = useRouteAvailability(routeId, viewMonth, viewYear);

  const dayMap = useMemo(() => {
    const map = new Map<string, DayAvailability>();
    availability?.days.forEach((d) => map.set(d.date, d));
    return map;
  }, [availability]);

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth - 1, 1);
    // JS getDay: 0=Sun, we want 0=Mon
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
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const monthLabel = new Date(viewYear, viewMonth - 1).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const isPrevDisabled = viewMonth === now.getMonth() + 1 && viewYear === now.getFullYear();

  const todayStr = now.toISOString().split("T")[0];

  const getSlotColor = (day: DayAvailability) => {
    if (!day.is_available) return "bg-destructive/15 text-destructive";
    const ratio = day.available_slots / day.max_capacity;
    if (ratio <= 0.25) return "bg-orange-500/15 text-orange-600 dark:text-orange-400";
    return "bg-primary/15 text-primary";
  };

  return (
    <div className="space-y-3">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={goToPrevMonth}
          disabled={isPrevDisabled}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm font-semibold capitalize">{monthLabel}</span>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goToNextMonth}>
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
      </div>

      {/* Days grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dayNum, i) => {
            if (dayNum === null) {
              return <div key={`empty-${i}`} className="aspect-square" />;
            }

            const dateStr = `${viewYear}-${String(viewMonth).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
            const dayData = dayMap.get(dateStr);
            const isPast = dateStr < todayStr;
            const isSelected = dateStr === selectedDate;
            const isAvailable = dayData?.is_available ?? false;
            const isDisabled = isPast || !isAvailable;

            return (
              <button
                key={dateStr}
                disabled={isDisabled}
                onClick={() => onSelectDate(dateStr)}
                className={cn(
                  "aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-sm transition-all relative",
                  isSelected
                    ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg"
                    : isDisabled
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:bg-accent cursor-pointer",
                )}
              >
                <span className={cn("font-medium leading-none", isSelected && "font-bold")}>
                  {dayNum}
                </span>
                {dayData && !isPast && (
                  <span
                    className={cn(
                      "text-[9px] font-semibold leading-none rounded-full px-1",
                      isSelected
                        ? "text-primary-foreground/80"
                        : getSlotColor(dayData)
                    )}
                  >
                    {dayData.is_available ? dayData.available_slots : "Lleno"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 pt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-primary/40" />
          <span className="text-[10px] text-muted-foreground">Disponible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500/40" />
          <span className="text-[10px] text-muted-foreground">Pocos cupos</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-destructive/40" />
          <span className="text-[10px] text-muted-foreground">Lleno</span>
        </div>
      </div>

      {/* Selected date info */}
      {selectedDate && dayMap.get(selectedDate) && (
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-center">
          <p className="text-xs text-muted-foreground">
            {new Date(selectedDate + "T12:00:00").toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          <p className="text-sm font-semibold text-primary mt-0.5">
            {dayMap.get(selectedDate)!.available_slots} cupos disponibles de {dayMap.get(selectedDate)!.max_capacity}
          </p>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
