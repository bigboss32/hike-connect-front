import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Plus, 
  Minus, 
  ChevronDown, 
  ChevronUp, 
  User, 
  Phone, 
  AlertCircle,
  Calendar,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";

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

const RouteReservationSection = ({ routeId, routeTitle, price }: RouteReservationSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([createEmptyParticipant(1)]);
  const [selectedDate, setSelectedDate] = useState("");
  const [expandedParticipant, setExpandedParticipant] = useState<number | null>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReserved, setIsReserved] = useState(false);

  const addParticipant = () => {
    const newId = participants.length + 1;
    setParticipants([...participants, createEmptyParticipant(newId)]);
    setExpandedParticipant(newId);
  };

  const removeParticipant = (id: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter(p => p.id !== id));
      if (expandedParticipant === id) {
        setExpandedParticipant(participants[0].id === id ? participants[1]?.id : participants[0].id);
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

  const allParticipantsComplete = participants.every(isParticipantComplete);
  const canSubmit = allParticipantsComplete && selectedDate !== "";

  const handleSubmit = async () => {
    if (!canSubmit) return;
    
    setIsSubmitting(true);
    
    // Simulación de envío - aquí iría la llamada al API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsReserved(true);
    
    toast({
      title: "¡Reserva confirmada!",
      description: `Tu reserva para ${participants.length} persona(s) ha sido registrada.`,
    });
  };

  if (isReserved) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6 text-center">
          <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
          <h3 className="text-lg font-bold text-foreground mb-2">¡Reserva Confirmada!</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Has reservado para {participants.length} persona(s) el {new Date(selectedDate).toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <Button variant="outline" onClick={() => setIsReserved(false)}>
            Hacer otra reserva
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Reservar esta ruta</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {price ? `Desde $${price.toLocaleString()} por persona` : "Consultar disponibilidad"}
                  </p>
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-6">
            {/* Selector de fecha */}
            <div className="space-y-2">
              <Label htmlFor="reservation-date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Fecha de la excursión
              </Label>
              <Input
                id="reservation-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full"
              />
            </div>

            {/* Contador de participantes */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Participantes</span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeParticipant(participants[participants.length - 1].id)}
                  disabled={participants.length <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-bold text-lg">{participants.length}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={addParticipant}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Formularios de participantes */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base">
                <User className="w-4 h-4" />
                Datos de los participantes
              </Label>
              
              {participants.map((participant, index) => (
                <Collapsible 
                  key={participant.id}
                  open={expandedParticipant === participant.id}
                  onOpenChange={(open) => setExpandedParticipant(open ? participant.id : null)}
                >
                  <div className="border rounded-lg overflow-hidden">
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-3 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            isParticipantComplete(participant) 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {isParticipantComplete(participant) ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div>
                            <span className="font-medium">
                              {participant.fullName || `Participante ${index + 1}`}
                            </span>
                            {index === 0 && (
                              <span className="ml-2 text-xs text-primary">(Titular)</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {participants.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeParticipant(participant.id);
                              }}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          )}
                          {expandedParticipant === participant.id ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="p-4 space-y-4 border-t">
                        {/* Datos personales */}
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`name-${participant.id}`}>
                              Nombre completo *
                            </Label>
                            <Input
                              id={`name-${participant.id}`}
                              placeholder="Ej: Juan Pérez García"
                              value={participant.fullName}
                              onChange={(e) => updateParticipant(participant.id, "fullName", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`phone-${participant.id}`} className="flex items-center gap-2">
                              <Phone className="w-3 h-3" />
                              Teléfono *
                            </Label>
                            <Input
                              id={`phone-${participant.id}`}
                              type="tel"
                              placeholder="Ej: +57 300 123 4567"
                              value={participant.phone}
                              onChange={(e) => updateParticipant(participant.id, "phone", e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Contacto de emergencia */}
                        <div className="pt-2 border-t">
                          <Label className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <AlertCircle className="w-4 h-4" />
                            Contacto de emergencia
                          </Label>
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`emergency-name-${participant.id}`}>
                                Nombre del contacto *
                              </Label>
                              <Input
                                id={`emergency-name-${participant.id}`}
                                placeholder="Ej: María López"
                                value={participant.emergencyContactName}
                                onChange={(e) => updateParticipant(participant.id, "emergencyContactName", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`emergency-phone-${participant.id}`}>
                                Teléfono de emergencia *
                              </Label>
                              <Input
                                id={`emergency-phone-${participant.id}`}
                                type="tel"
                                placeholder="Ej: +57 300 765 4321"
                                value={participant.emergencyContactPhone}
                                onChange={(e) => updateParticipant(participant.id, "emergencyContactPhone", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}

              {/* Botón agregar participante */}
              <Button
                variant="outline"
                className="w-full"
                onClick={addParticipant}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar otro participante
              </Button>
            </div>

            {/* Resumen y botón de confirmación */}
            <div className="pt-4 border-t space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total participantes:</span>
                <span className="font-bold">{participants.length} persona(s)</span>
              </div>
              
              {price && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Precio estimado:</span>
                  <span className="text-xl font-bold text-primary">
                    ${(price * participants.length).toLocaleString()}
                  </span>
                </div>
              )}

              {!canSubmit && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {!selectedDate 
                    ? "Selecciona una fecha para continuar" 
                    : "Completa todos los campos de los participantes"
                  }
                </p>
              )}

              <Button 
                className="w-full" 
                size="lg"
                disabled={!canSubmit || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Confirmar Reserva
                  </>
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
