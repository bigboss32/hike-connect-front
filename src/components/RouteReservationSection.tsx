import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useFormPersist } from "@/hooks/useFormPersist";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users,
  Plus,
  Trash2,
  ChevronDown,
  User,
  Phone,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Sparkles,
  MapPin,
  CreditCard,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import PSEPaymentDialog, { type PaymentParticipant } from "@/components/PSEPaymentDialog";
import CardPaymentDialog from "@/components/CardPaymentDialog";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";

interface Participant {
  id: number;
  fullName: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

interface RouteReservationSectionProps {
  routeId: string;
  routeTitle: string;
  price?: number;
}

const createEmptyParticipant = (id: number): Participant => ({
  id,
  fullName: "",
  phone: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
});

type WizardStep = "date" | "participants" | "confirm" | "success";

const STEP_ORDER: WizardStep[] = ["date", "participants", "confirm"];

const RouteReservationSection = ({ routeId, routeTitle, price }: RouteReservationSectionProps) => {
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(false);
  const [participants, setParticipants, clearParticipants] = useFormPersist<Participant[]>(
    `reservation_${routeId}_participants`,
    [createEmptyParticipant(1)]
  );
  const [selectedDate, setSelectedDate, clearDate] = useFormPersist(`reservation_${routeId}_date`, "");
  const [expandedParticipant, setExpandedParticipant] = useState<number | null>(1);
  const [step, setStep] = useState<WizardStep>("date");
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showCardPaymentDialog, setShowCardPaymentDialog] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const goToStep = (target: WizardStep) => {
    const currentIdx = STEP_ORDER.indexOf(step);
    const targetIdx = STEP_ORDER.indexOf(target);
    setSlideDirection(targetIdx > currentIdx ? "left" : "right");
    setIsAnimating(true);
    setTimeout(() => {
      setStep(target);
      setIsAnimating(false);
    }, 200);
  };

  const addParticipant = () => {
    const newId = Math.max(...participants.map((p) => p.id)) + 1;
    setParticipants([...participants, createEmptyParticipant(newId)]);
    setExpandedParticipant(newId);
  };

  const removeParticipant = (id: number) => {
    if (participants.length > 1) {
      const newParticipants = participants.filter((p) => p.id !== id);
      setParticipants(newParticipants);
      if (expandedParticipant === id) {
        setExpandedParticipant(newParticipants[0]?.id || null);
      }
    }
  };

  const updateParticipant = (id: number, field: keyof Participant, value: string) => {
    setParticipants(participants.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const isParticipantComplete = (participant: Participant) =>
    participant.fullName.trim() !== "" &&
    participant.phone.trim() !== "" &&
    participant.emergencyContactName.trim() !== "" &&
    participant.emergencyContactPhone.trim() !== "";

  const getCompletionPercentage = (participant: Participant) => {
    const fields = [participant.fullName, participant.phone, participant.emergencyContactName, participant.emergencyContactPhone];
    return (fields.filter((f) => f.trim() !== "").length / fields.length) * 100;
  };

  const allParticipantsComplete = participants.every(isParticipantComplete);
  const totalAmount = price ? price * participants.length : 0;

  const buildPaymentParticipants = (): PaymentParticipant[] =>
    participants.map((p) => ({
      full_name: p.fullName,
      phone: p.phone,
      emergency_contact_name: p.emergencyContactName,
      emergency_contact_phone: p.emergencyContactPhone,
    }));

  const handlePaymentComplete = (status: "approved" | "declined" | "error") => {
    if (status === "approved") {
      queryClient.invalidateQueries({ queryKey: ["routeAvailability", routeId] });
      setStep("success");
      setShowPaymentDialog(false);
      setShowCardPaymentDialog(false);
      toast({
        title: "¡Reserva confirmada!",
        description: `Tu reserva para ${participants.length} persona(s) ha sido pagada exitosamente.`,
      });
    }
  };

  const handleReset = () => {
    setStep("date");
    clearParticipants();
    clearDate();
    setExpandedParticipant(1);
  };

  // Animation classes
  const getSlideClass = () => {
    if (isAnimating) {
      return slideDirection === "left"
        ? "translate-x-[-100%] opacity-0"
        : "translate-x-[100%] opacity-0";
    }
    return "translate-x-0 opacity-100";
  };

  const stepIndex = STEP_ORDER.indexOf(step);

  // ─── SUCCESS ───
  if (step === "success") {
    return (
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
        <CardContent className="p-8 text-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.1),transparent_50%)]" />
          <div className="relative animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">¡Reserva Confirmada!</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Has reservado para{" "}
              <span className="font-semibold text-foreground">{participants.length} persona(s)</span> el{" "}
              <span className="font-semibold text-foreground">
                {new Date(selectedDate + "T12:00:00").toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
              <MapPin className="w-4 h-4" />
              <span>{routeTitle}</span>
            </div>
            <Button variant="outline" onClick={handleReset}>
              Hacer otra reserva
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ─── WIZARD ───
  return (
    <Card className="border-primary/20 overflow-hidden">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                    isExpanded
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-primary/10 text-primary group-hover:bg-primary/20"
                  )}
                >
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">Reservar Aventura</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {price ? `Desde $${price.toLocaleString()} por persona` : "Consultar disponibilidad"}
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                  isExpanded ? "bg-primary/10 rotate-180" : "bg-muted"
                )}
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-5">
            {/* ── Step indicator ── */}
            <div className="flex items-center justify-center gap-0">
              {STEP_ORDER.map((s, i) => {
                const isActive = i === stepIndex;
                const isDone = i < stepIndex;
                return (
                  <div key={s} className="flex items-center">
                    <button
                      onClick={() => {
                        if (isDone) goToStep(s);
                      }}
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shrink-0",
                        isActive && "bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30",
                        isDone && "bg-primary/20 text-primary cursor-pointer hover:bg-primary/30",
                        !isActive && !isDone && "bg-muted text-muted-foreground"
                      )}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </button>
                    {i < STEP_ORDER.length - 1 && (
                      <div
                        className={cn(
                          "h-0.5 w-16 rounded-full transition-all duration-500 mx-2",
                          isDone ? "bg-primary/40" : "bg-muted"
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Animated step content ── */}
            <div className="overflow-hidden relative min-h-[280px]" ref={contentRef}>
              <div
                className={cn(
                  "transition-all duration-300 ease-out",
                  getSlideClass()
                )}
              >
                {/* ═══ STEP 1: DATE ═══ */}
                {step === "date" && (
                  <div className="space-y-4">
                    <div className="text-center space-y-1">
                      <h3 className="font-bold text-foreground flex items-center justify-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Elige tu fecha
                      </h3>
                      <p className="text-sm text-muted-foreground">Selecciona el día de tu aventura</p>
                    </div>

                    <div className="rounded-2xl border-2 border-muted p-3">
                      <AvailabilityCalendar
                        routeId={routeId}
                        selectedDate={selectedDate}
                        onSelectDate={(date) => setSelectedDate(date)}
                      />
                    </div>

                    <Button
                      className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/25"
                      disabled={!selectedDate}
                      onClick={() => goToStep("participants")}
                    >
                      Continuar
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                )}

                {/* ═══ STEP 2: PARTICIPANTS ═══ */}
                {step === "participants" && (
                  <div className="space-y-4">
                    <div className="text-center space-y-1">
                      <h3 className="font-bold text-foreground flex items-center justify-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        ¿Quiénes van?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedDate + "T12:00:00").toLocaleDateString("es-ES", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </p>
                    </div>

                    {/* Participant list */}
                    <div className="space-y-2">
                      {participants.map((participant, index) => {
                        const isComplete = isParticipantComplete(participant);
                        const completionPercent = getCompletionPercentage(participant);
                        const isOpen = expandedParticipant === participant.id;

                        return (
                          <div
                            key={participant.id}
                            className={cn(
                              "rounded-2xl border-2 overflow-hidden transition-all duration-300",
                              isOpen ? "border-primary/30 shadow-lg shadow-primary/5" : "border-transparent bg-muted/30",
                              isComplete && !isOpen && "border-primary/20 bg-primary/5"
                            )}
                          >
                            {/* Participant header */}
                            <div
                              className={cn(
                                "flex items-center justify-between p-3 cursor-pointer transition-colors",
                                isOpen ? "bg-primary/5" : "hover:bg-muted/50"
                              )}
                              onClick={() => setExpandedParticipant(isOpen ? null : participant.id)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <div
                                    className={cn(
                                      "w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all",
                                      isComplete
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                    )}
                                  >
                                    {isComplete ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                                  </div>
                                  {!isComplete && completionPercent > 0 && (
                                    <svg className="absolute inset-0 w-9 h-9 -rotate-90">
                                      <circle
                                        cx="18"
                                        cy="18"
                                        r="16"
                                        fill="none"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth="2"
                                        strokeDasharray={`${(completionPercent / 100) * 100} 100`}
                                        className="opacity-50"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-sm">
                                    {participant.fullName || `Participante ${index + 1}`}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {index === 0 ? "Titular" : isComplete ? "Completo ✓" : "Pendiente"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {participants.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeParticipant(participant.id);
                                    }}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                )}
                                <div
                                  className={cn(
                                    "w-5 h-5 rounded-full flex items-center justify-center transition-transform duration-300",
                                    isOpen && "rotate-180"
                                  )}
                                >
                                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                                </div>
                              </div>
                            </div>

                            {/* Expandable form */}
                            {isOpen && (
                              <div className="p-3 pt-0 space-y-3 animate-fade-in">
                                <div className="h-px bg-border mb-2" />
                                <div className="grid gap-3 sm:grid-cols-2">
                                  <div className="space-y-1.5">
                                    <Label htmlFor={`name-${participant.id}`} className="text-xs text-muted-foreground">
                                      Nombre Completo
                                    </Label>
                                    <Input
                                      id={`name-${participant.id}`}
                                      placeholder="Juan Pérez"
                                      value={participant.fullName}
                                      onChange={(e) => updateParticipant(participant.id, "fullName", e.target.value)}
                                      className="h-10 rounded-xl"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <Label htmlFor={`phone-${participant.id}`} className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Phone className="w-3 h-3" />
                                      Teléfono
                                    </Label>
                                    <Input
                                      id={`phone-${participant.id}`}
                                      type="tel"
                                      placeholder="+57 300 123 4567"
                                      value={participant.phone}
                                      onChange={(e) => updateParticipant(participant.id, "phone", e.target.value)}
                                      className="h-10 rounded-xl"
                                    />
                                  </div>
                                </div>
                                <div className="pt-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
                                    <span className="text-xs font-medium text-muted-foreground">Contacto de Emergencia</span>
                                  </div>
                                  <div className="grid gap-3 sm:grid-cols-2">
                                    <Input
                                      placeholder="Nombre contacto"
                                      value={participant.emergencyContactName}
                                      onChange={(e) => updateParticipant(participant.id, "emergencyContactName", e.target.value)}
                                      className="h-10 rounded-xl"
                                    />
                                    <Input
                                      type="tel"
                                      placeholder="Teléfono emergencia"
                                      value={participant.emergencyContactPhone}
                                      onChange={(e) => updateParticipant(participant.id, "emergencyContactPhone", e.target.value)}
                                      className="h-10 rounded-xl"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      className="w-full h-10 rounded-xl border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all"
                      onClick={addParticipant}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Participante
                    </Button>

                    {/* Navigation */}
                    <div className="flex gap-3 pt-2">
                      <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => goToStep("date")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Fecha
                      </Button>
                      <Button
                        className="flex-1 h-12 rounded-xl font-semibold shadow-lg shadow-primary/25"
                        disabled={!allParticipantsComplete}
                        onClick={() => goToStep("confirm")}
                      >
                        Confirmar
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* ═══ STEP 3: CONFIRM & PAY ═══ */}
                {step === "confirm" && (
                  <div className="space-y-4">
                    <div className="text-center space-y-1">
                      <h3 className="font-bold text-foreground flex items-center justify-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary" />
                        Confirmar y Pagar
                      </h3>
                    </div>

                    {/* Summary */}
                    <div className="p-4 rounded-2xl bg-muted/30 space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">Fecha:</span>
                        <span className="font-semibold">
                          {new Date(selectedDate + "T12:00:00").toLocaleDateString("es-ES", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <p className="text-sm font-medium flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          {participants.length} {participants.length === 1 ? "Participante" : "Participantes"}
                        </p>
                        {participants.map((p, i) => (
                          <div key={p.id} className="flex items-center gap-2 pl-6 text-sm text-muted-foreground">
                            <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                              {i + 1}
                            </div>
                            <span className="truncate">{p.fullName}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    {price && (
                      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total a pagar</span>
                          <span className="text-xl font-bold text-primary">${totalAmount.toLocaleString("es-CO")} COP</span>
                        </div>
                        {participants.length > 1 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {participants.length} × ${price.toLocaleString("es-CO")} COP
                          </p>
                        )}
                      </div>
                    )}

                    {/* Payment buttons */}
                    <div className="space-y-3">
                      <Button
                        className="w-full h-14 rounded-xl text-base font-semibold shadow-lg shadow-primary/25"
                        onClick={() => setShowPaymentDialog(true)}
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        Pagar con PSE
                        {totalAmount > 0 && <span className="ml-2 opacity-80">• ${totalAmount.toLocaleString("es-CO")}</span>}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full h-14 rounded-xl text-base font-semibold"
                        onClick={() => setShowCardPaymentDialog(true)}
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        Pagar con Tarjeta
                      </Button>
                    </div>

                    <Button variant="ghost" className="w-full rounded-xl" onClick={() => goToStep("participants")}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Editar participantes
                    </Button>

                    {/* Payment dialogs */}
                    <PSEPaymentDialog
                      open={showPaymentDialog}
                      onOpenChange={setShowPaymentDialog}
                      routeId={routeId}
                      routeTitle={routeTitle}
                      bookingDate={selectedDate}
                      participants={buildPaymentParticipants()}
                      pricePerPerson={price}
                      onPaymentComplete={handlePaymentComplete}
                    />
                    <CardPaymentDialog
                      open={showCardPaymentDialog}
                      onOpenChange={setShowCardPaymentDialog}
                      routeId={routeId}
                      routeTitle={routeTitle}
                      bookingDate={selectedDate}
                      participants={buildPaymentParticipants()}
                      pricePerPerson={price}
                      onPaymentComplete={handlePaymentComplete}
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default RouteReservationSection;
