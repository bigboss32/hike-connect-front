import { useState, useEffect } from "react";
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
  ChevronUp, 
  User, 
  Phone, 
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Loader2,
  Sparkles,
  MapPin,
  CreditCard,
  ArrowLeft
} from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
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

type ReservationStep = "form" | "confirm" | "success";

const RouteReservationSection = ({ routeId, routeTitle, price }: RouteReservationSectionProps) => {
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(false);
  const [participants, setParticipants, clearParticipants] = useFormPersist<Participant[]>(`reservation_${routeId}_participants`, [createEmptyParticipant(1)]);
  const [selectedDate, setSelectedDate, clearDate] = useFormPersist(`reservation_${routeId}_date`, "");
  const [expandedParticipant, setExpandedParticipant] = useState<number | null>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<ReservationStep>("form");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showCardPaymentDialog, setShowCardPaymentDialog] = useState(false);

  const addParticipant = () => {
    const newId = Math.max(...participants.map(p => p.id)) + 1;
    setParticipants([...participants, createEmptyParticipant(newId)]);
    setExpandedParticipant(newId);
  };

  const removeParticipant = (id: number) => {
    if (participants.length > 1) {
      const newParticipants = participants.filter(p => p.id !== id);
      setParticipants(newParticipants);
      if (expandedParticipant === id) {
        setExpandedParticipant(newParticipants[0]?.id || null);
      }
    }
  };

  const updateParticipant = (id: number, field: keyof Participant, value: string) => {
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const isParticipantComplete = (participant: Participant) => {
    return (
      participant.fullName.trim() !== "" &&
      participant.phone.trim() !== "" &&
      participant.emergencyContactName.trim() !== "" &&
      participant.emergencyContactPhone.trim() !== ""
    );
  };

  const getCompletionPercentage = (participant: Participant) => {
    const fields = [
      participant.fullName,
      participant.phone,
      participant.emergencyContactName,
      participant.emergencyContactPhone
    ];
    const completed = fields.filter(f => f.trim() !== "").length;
    return (completed / fields.length) * 100;
  };

  const allParticipantsComplete = participants.every(isParticipantComplete);
  const canSubmit = allParticipantsComplete && selectedDate !== "";

  const handleConfirmParticipants = () => {
    if (!canSubmit) return;
    setStep("confirm");
  };

  const totalAmount = price ? price * participants.length : 0;

  const buildPaymentParticipants = (): PaymentParticipant[] => {
    return participants.map(p => ({
      full_name: p.fullName,
      phone: p.phone,
      emergency_contact_name: p.emergencyContactName,
      emergency_contact_phone: p.emergencyContactPhone,
    }));
  };

  const handlePaymentComplete = (status: "approved" | "declined" | "error") => {
    if (status === "approved") {
      // Invalidate availability cache so calendar refreshes with updated slots
      queryClient.invalidateQueries({ queryKey: ["routeAvailability", routeId] });
      setStep("success");
      setShowPaymentDialog(false);
      toast({
        title: "¡Reserva confirmada!",
        description: `Tu reserva para ${participants.length} persona(s) ha sido pagada exitosamente.`,
      });
    }
  };

  // Success state
  if (step === "success") {
    return (
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
        <CardContent className="p-8 text-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.1),transparent_50%)]" />
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">¡Reserva Confirmada!</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Has reservado para <span className="font-semibold text-foreground">{participants.length} persona(s)</span> el{" "}
              <span className="font-semibold text-foreground">
                {new Date(selectedDate).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
              <MapPin className="w-4 h-4" />
              <span>{routeTitle}</span>
            </div>
            <Button variant="outline" onClick={() => {
              setStep("form");
              clearParticipants();
              clearDate();
              setExpandedParticipant(1);
            }}>
              Hacer otra reserva
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Confirmation step - review participants + enter amount + pay
  if (step === "confirm") {
    return (
      <Card className="border-primary/20 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setStep("form")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-lg">Confirmar Reserva</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Fecha:</span>
            <span className="font-semibold">
              {new Date(selectedDate).toLocaleDateString('es-ES', { 
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
              })}
            </span>
          </div>

          {/* Participant list */}
          <div className="space-y-2">
            <p className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              {participants.length} {participants.length === 1 ? "Participante" : "Participantes"}
            </p>
            <div className="space-y-2">
              {participants.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{p.fullName}</p>
                    <p className="text-xs text-muted-foreground">{p.phone}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Total amount */}
          {price && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
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
              {totalAmount > 0 && (
                <span className="ml-2 opacity-80">
                  • ${totalAmount.toLocaleString("es-CO")}
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full h-14 rounded-xl text-base font-semibold"
              onClick={() => setShowCardPaymentDialog(true)}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Pagar con Tarjeta Crédito/Débito
            </Button>
          </div>

          {/* PSE Payment Dialog */}
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

          {/* Card Payment Dialog */}
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
        </CardContent>
      </Card>
    );
  }

  // Form step (original)
  return (
    <Card className="border-primary/20 overflow-hidden">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                  isExpanded 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                    : "bg-primary/10 text-primary group-hover:bg-primary/20"
                )}>
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">Reservar Aventura</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {price ? `Desde $${price.toLocaleString()} por persona` : "Consultar disponibilidad"}
                  </p>
                </div>
              </div>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                isExpanded ? "bg-primary/10 rotate-180" : "bg-muted"
              )}>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-6">
            {/* Fecha con calendario de disponibilidad */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="w-4 h-4 text-primary" />
                Fecha de la Excursión
              </Label>
              <div className="rounded-2xl border-2 border-muted p-3">
                <AvailabilityCalendar
                  routeId={routeId}
                  selectedDate={selectedDate}
                  onSelectDate={(date) => setSelectedDate(date)}
                />
              </div>
            </div>

            {/* Resumen de participantes */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shadow-sm">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="font-semibold">{participants.length}</span>
                  <span className="text-muted-foreground ml-1">
                    {participants.length === 1 ? "Participante" : "Participantes"}
                  </span>
                </div>
              </div>
              {price && (
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total estimado</p>
                  <p className="text-lg font-bold text-primary">
                    ${(price * participants.length).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Lista de participantes */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <User className="w-4 h-4 text-primary" />
                Datos de Participantes
              </Label>
              
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
                      {/* Header del participante */}
                      <div 
                        className={cn(
                          "flex items-center justify-between p-4 cursor-pointer transition-colors",
                          isOpen ? "bg-primary/5" : "hover:bg-muted/50"
                        )}
                        onClick={() => setExpandedParticipant(isOpen ? null : participant.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all",
                              isComplete 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-muted text-muted-foreground"
                            )}>
                              {isComplete ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : (
                                index + 1
                              )}
                            </div>
                            {!isComplete && completionPercent > 0 && (
                              <svg className="absolute inset-0 w-10 h-10 -rotate-90">
                                <circle
                                  cx="20"
                                  cy="20"
                                  r="18"
                                  fill="none"
                                  stroke="hsl(var(--primary))"
                                  strokeWidth="2"
                                  strokeDasharray={`${(completionPercent / 100) * 113} 113`}
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
                              {index === 0 ? "Titular de la reserva" : isComplete ? "Datos completos" : "Pendiente de completar"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {participants.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeParticipant(participant.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                          <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300",
                            isOpen && "rotate-180"
                          )}>
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>

                      {/* Formulario expandible */}
                      {isOpen && (
                        <div className="p-4 pt-0 space-y-4 animate-in slide-in-from-top-2 duration-200">
                          <div className="h-px bg-border mb-4" />
                          
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor={`name-${participant.id}`} className="text-xs text-muted-foreground uppercase tracking-wide">
                                Nombre Completo
                              </Label>
                              <Input
                                id={`name-${participant.id}`}
                                placeholder="Juan Pérez García"
                                value={participant.fullName}
                                onChange={(e) => updateParticipant(participant.id, "fullName", e.target.value)}
                                className="h-11 rounded-xl"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`phone-${participant.id}`} className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                Teléfono
                              </Label>
                              <Input
                                id={`phone-${participant.id}`}
                                type="tel"
                                placeholder="+57 300 123 4567"
                                value={participant.phone}
                                onChange={(e) => updateParticipant(participant.id, "phone", e.target.value)}
                                className="h-11 rounded-xl"
                              />
                            </div>
                          </div>

                          <div className="pt-2">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                              </div>
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Contacto de Emergencia
                              </span>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor={`emergency-name-${participant.id}`} className="text-xs text-muted-foreground">
                                  Nombre del contacto
                                </Label>
                                <Input
                                  id={`emergency-name-${participant.id}`}
                                  placeholder="María López"
                                  value={participant.emergencyContactName}
                                  onChange={(e) => updateParticipant(participant.id, "emergencyContactName", e.target.value)}
                                  className="h-11 rounded-xl"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`emergency-phone-${participant.id}`} className="text-xs text-muted-foreground">
                                  Teléfono de emergencia
                                </Label>
                                <Input
                                  id={`emergency-phone-${participant.id}`}
                                  type="tel"
                                  placeholder="+57 300 765 4321"
                                  value={participant.emergencyContactPhone}
                                  onChange={(e) => updateParticipant(participant.id, "emergencyContactPhone", e.target.value)}
                                  className="h-11 rounded-xl"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Botón agregar */}
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all"
                onClick={addParticipant}
              >
                <Plus className="w-5 h-5 mr-2" />
                Agregar Participante
              </Button>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t space-y-4">
              {!canSubmit && (
                <div className={cn(
                  "flex items-center gap-3 p-3 rounded-xl text-sm",
                  !selectedDate ? "bg-amber-500/10 text-amber-700" : "bg-muted text-muted-foreground"
                )}>
                  <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
                    {!selectedDate ? (
                      <Calendar className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <span>
                    {!selectedDate 
                      ? "Selecciona una fecha para continuar" 
                      : `Completa los datos de ${participants.filter(p => !isParticipantComplete(p)).length} participante(s)`
                    }
                  </span>
                </div>
              )}

              <Button 
                className="w-full h-14 rounded-xl text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:shadow-none" 
                disabled={!canSubmit}
                onClick={handleConfirmParticipants}
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Confirmar Participantes
                {price && (
                  <span className="ml-2 opacity-80">
                    • ${(price * participants.length).toLocaleString()}
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default RouteReservationSection;
