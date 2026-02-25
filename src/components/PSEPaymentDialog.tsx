import { useState, useEffect, useRef, useCallback } from "react";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  Building2,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const API_BASE_URL = "https://hike-connect-back.onrender.com/api/v1";

const openBankUrl = async (url: string) => {
  if (Capacitor.isNativePlatform()) {
    await Browser.open({ url, presentationStyle: "fullscreen" });
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

interface Bank {
  code: string;
  name: string;
}

const ID_TYPES = [
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "NIT", label: "NIT" },
  { value: "PP", label: "Pasaporte" },
  { value: "TI", label: "Tarjeta de Identidad" },
];

type PaymentStatus = "idle" | "submitting" | "redirecting" | "polling" | "approved" | "declined" | "error" | "timeout";

export interface PaymentParticipant {
  full_name: string;
  phone: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
}

interface PSEPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routeId: string;
  routeTitle: string;
  bookingDate: string;
  participants: PaymentParticipant[];
  pricePerPerson?: number;
  onPaymentComplete: (status: "approved" | "declined" | "error") => void;
}

const PSEPaymentDialog = ({
  open,
  onOpenChange,
  routeId,
  routeTitle,
  bookingDate,
  participants,
  pricePerPerson,
  onPaymentComplete,
}: PSEPaymentDialogProps) => {
  const { authFetch, user } = useAuth();
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [banks, setBanks] = useState<Bank[]>([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const [formData, setFormData] = useState({
    userLegalId: "",
    userLegalIdType: "CC",
    financialInstitutionCode: "",
    userType: "0",
  });
  const [redirectUrl, setRedirectUrl] = useState("");
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [confirmedAmount, setConfirmedAmount] = useState<number | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (!open || banks.length > 0) return;
    const fetchBanks = async () => {
      setBanksLoading(true);
      try {
        const res = await authFetch(`${API_BASE_URL}/payments/`);
        if (res.ok) {
          const json = await res.json();
          const list = (json.data || []).map((b: any) => ({
            code: b.financial_institution_code,
            name: b.financial_institution_name,
          }));
          setBanks(list);
        }
      } catch {
        // silent
      } finally {
        setBanksLoading(false);
      }
    };
    fetchBanks();
  }, [open, authFetch, banks.length]);

  const estimatedTotal = pricePerPerson ? pricePerPerson * participants.length : null;

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  useEffect(() => {
    if (!open) {
      stopPolling();
      setStatus("idle");
      setRedirectUrl("");
      setPaymentId(null);
      setConfirmedAmount(null);
      redirectedRef.current = false;
    }
  }, [open, stopPolling]);

  const startPolling = useCallback(
    (pId: string) => {
      pollingRef.current = setInterval(async () => {
        try {
          const res = await authFetch(`${API_BASE_URL}/payments/${pId}/status/`);
          if (!res.ok) return;
          const data = await res.json();
          const s = data.status?.toUpperCase();

          if (data.amount) {
            setConfirmedAmount(parseFloat(data.amount));
          }

          if (data.redirect_url && !redirectedRef.current) {
            redirectedRef.current = true;
            setRedirectUrl(data.redirect_url);
            openBankUrl(data.redirect_url);
          }

          if (s === "APPROVED") {
            stopPolling();
            setStatus("approved");
            onPaymentComplete("approved");
          } else if (s === "DECLINED") {
            stopPolling();
            setStatus("declined");
            onPaymentComplete("declined");
          } else if (s === "ERROR") {
            stopPolling();
            setStatus("error");
            onPaymentComplete("error");
          }
        } catch {
          // Keep polling on network errors
        }
      }, 4000);

      timeoutRef.current = setTimeout(() => {
        stopPolling();
        setStatus("timeout");
      }, 5 * 60 * 1000);
    },
    [authFetch, stopPolling, onPaymentComplete]
  );

  const handleSubmit = async () => {
    if (!formData.userLegalId || !formData.financialInstitutionCode) {
      toast({
        title: "Campos requeridos",
        description: "Completa documento y banco.",
        variant: "destructive",
      });
      return;
    }

    setStatus("submitting");

    try {
      const res = await authFetch(`${API_BASE_URL}/payments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruta_id: routeId,
          booking_date: bookingDate,
          participants: participants,
          user_legal_id: formData.userLegalId,
          user_legal_id_type: formData.userLegalIdType,
          financial_institution_code: formData.financialInstitutionCode,
          user_type: parseInt(formData.userType),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || err.message || "Error al crear el pago");
      }

      const data = await res.json();
      setPaymentId(data.payment_id);
      setRedirectUrl(data.redirect_url || "");

      if (data.amount) {
        setConfirmedAmount(parseFloat(data.amount));
      }

      if (data.redirect_url) {
        setStatus("redirecting");
        redirectedRef.current = true;
        openBankUrl(data.redirect_url);
      }

      setTimeout(() => {
        setStatus("polling");
        startPolling(data.payment_id);
      }, data.redirect_url ? 2000 : 500);
    } catch (err: any) {
      setStatus("error");
      toast({
        title: "Error en el pago",
        description: err.message || "No se pudo procesar el pago",
        variant: "destructive",
      });
    }
  };

  const displayAmount = confirmedAmount ?? estimatedTotal;
  const formatAmount = (amount: number) => `$${amount.toLocaleString("es-CO")} COP`;

  const renderStatusContent = () => {
    switch (status) {
      case "submitting":
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 flex items-center justify-center text-primary">
              <svg width="48" height="48" viewBox="0 0 20 20" fill="none" className="text-primary">
                <circle cx="10" cy="3.5" r="2.2" fill="currentColor" opacity="0.9"/>
                <ellipse cx="10" cy="2.2" rx="3.2" ry="0.7" fill="currentColor" opacity="0.6"/>
                <path d="M7.5 2.2 Q10 -0.2 12.5 2.2" fill="currentColor" opacity="0.7"/>
                <rect x="9" y="5.5" width="2.2" height="5.5" rx="1.1" fill="currentColor" opacity="0.85"/>
                <rect x="6.5" y="5.5" width="2.8" height="4.2" rx="1" fill="currentColor" opacity="0.4"/>
                <g className="animate-legSwing" style={{ transformOrigin: '9.5px 11px' }}>
                  <rect x="8.5" y="11" width="1.8" height="5" rx="0.9" fill="currentColor" opacity="0.8"/>
                  <ellipse cx="9.5" cy="16.5" rx="1.6" ry="0.7" fill="currentColor" opacity="0.6"/>
                </g>
                <g className="animate-legSwing" style={{ transformOrigin: '11px 11px', animationDelay: '0.25s' }}>
                  <rect x="10.2" y="11" width="1.8" height="5" rx="0.9" fill="currentColor" opacity="0.8"/>
                  <ellipse cx="11.2" cy="16.5" rx="1.6" ry="0.7" fill="currentColor" opacity="0.6"/>
                </g>
                <g className="animate-stickSwing" style={{ transformOrigin: '13px 6px' }}>
                  <line x1="12.5" y1="6" x2="15" y2="16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.45"/>
                </g>
              </svg>
            </div>
            <p className="text-lg font-semibold">Creando transacción...</p>
            <p className="text-sm text-muted-foreground">Validando disponibilidad y calculando monto...</p>
          </div>
        );
      case "redirecting":
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <ExternalLink className="w-12 h-12 text-primary" />
            <p className="text-lg font-semibold">Redirigiendo a tu banco...</p>
            <p className="text-sm text-muted-foreground text-center">
              Se abrió una pestaña con tu banco. Completa el pago allí.
            </p>
            {redirectUrl && (
              <Button variant="outline" size="sm" onClick={() => openBankUrl(redirectUrl)}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir enlace del banco
              </Button>
            )}
          </div>
        );
      case "polling":
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="relative">
              <Clock className="w-12 h-12 text-primary" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full animate-pulse" />
            </div>
            <p className="text-lg font-semibold">Esperando confirmación...</p>
            <p className="text-sm text-muted-foreground text-center">
              Completa el pago en la pestaña de tu banco. Verificamos automáticamente.
            </p>
            {redirectUrl && (
              <Button variant="outline" size="sm" onClick={() => openBankUrl(redirectUrl)}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Volver al banco
              </Button>
            )}
          </div>
        );
      case "approved":
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <p className="text-lg font-bold text-green-600">¡Pago Aprobado!</p>
            <p className="text-sm text-muted-foreground text-center">
              {displayAmount && (
                <>Tu pago de <span className="font-semibold text-foreground">{formatAmount(displayAmount)}</span> ha sido procesado exitosamente.</>
              )}
              {!displayAmount && "Tu pago ha sido procesado exitosamente."}
            </p>
            <p className="text-xs text-muted-foreground">
              {participants.length} {participants.length === 1 ? "participante" : "participantes"} • {new Date(bookingDate).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            {redirectUrl && (
              <Button variant="outline" size="sm" onClick={() => openBankUrl(redirectUrl)}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver comprobante
              </Button>
            )}
            <Button onClick={() => onOpenChange(false)} className="mt-2">
              Continuar
            </Button>
          </div>
        );
      case "declined":
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
            <p className="text-lg font-bold text-destructive">Pago Rechazado</p>
            <p className="text-sm text-muted-foreground text-center">
              La transacción fue rechazada por tu banco.
            </p>
            {redirectUrl && (
              <Button variant="outline" size="sm" onClick={() => openBankUrl(redirectUrl)}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver comprobante
              </Button>
            )}
            <Button variant="outline" onClick={() => setStatus("idle")} className="mt-2">
              Reintentar
            </Button>
          </div>
        );
      case "error":
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
            <p className="text-lg font-bold text-destructive">Error en el pago</p>
            <p className="text-sm text-muted-foreground text-center">
              Ocurrió un error procesando tu pago.
            </p>
            {redirectUrl && (
              <Button variant="outline" size="sm" onClick={() => openBankUrl(redirectUrl)}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver comprobante
              </Button>
            )}
            <Button variant="outline" onClick={() => setStatus("idle")} className="mt-2">
              Reintentar
            </Button>
          </div>
        );
      case "timeout":
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Clock className="w-10 h-10 text-amber-500" />
            </div>
            <p className="text-lg font-bold">Tiempo agotado</p>
            <p className="text-sm text-muted-foreground text-center">
              No recibimos confirmación de tu banco.
            </p>
            {redirectUrl && (
              <Button variant="outline" size="sm" onClick={() => openBankUrl(redirectUrl)}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver comprobante
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)} className="mt-2">
              Cerrar
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  if (status !== "idle") {
    return (
      <Dialog open={open} onOpenChange={(v) => { if (!v) { stopPolling(); onOpenChange(false); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Pago PSE
            </DialogTitle>
          </DialogHeader>
          {renderStatusContent()}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Pago PSE
          </DialogTitle>
        </DialogHeader>

        {/* Summary */}
        <div className="p-4 rounded-xl bg-muted/50 space-y-1">
          <p className="text-sm text-muted-foreground">Ruta: <span className="font-medium text-foreground">{routeTitle}</span></p>
          <p className="text-sm text-muted-foreground">Fecha: <span className="font-medium text-foreground">
            {new Date(bookingDate).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
          </span></p>
          <p className="text-sm text-muted-foreground">Participantes: <span className="font-medium text-foreground">{participants.length}</span></p>
          {estimatedTotal && (
            <p className="text-lg font-bold text-primary">{formatAmount(estimatedTotal)}</p>
          )}
          {estimatedTotal && participants.length > 1 && pricePerPerson && (
            <p className="text-xs text-muted-foreground">({participants.length} × {formatAmount(pricePerPerson)})</p>
          )}
        </div>

        <div className="space-y-4">
          {/* Document */}
          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-2 space-y-2">
              <Label>Tipo doc *</Label>
              <Select
                value={formData.userLegalIdType}
                onValueChange={(v) => setFormData({ ...formData, userLegalIdType: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ID_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-3 space-y-2">
              <Label>Nro. documento *</Label>
              <Input
                placeholder="1099888777"
                value={formData.userLegalId}
                onChange={(e) => setFormData({ ...formData, userLegalId: e.target.value })}
              />
            </div>
          </div>

          {/* Bank */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              Banco *
            </Label>
            <Select
              value={formData.financialInstitutionCode}
              onValueChange={(v) => setFormData({ ...formData, financialInstitutionCode: v })}
            >
              <SelectTrigger disabled={banksLoading}>
                <SelectValue placeholder={banksLoading ? "Cargando bancos..." : "Selecciona tu banco"} />
              </SelectTrigger>
              <SelectContent>
                {banks.map((b) => (
                  <SelectItem key={b.code} value={b.code}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* User type */}
          <div className="space-y-2">
            <Label>Tipo de persona</Label>
            <Select
              value={formData.userType}
              onValueChange={(v) => setFormData({ ...formData, userType: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Persona Natural</SelectItem>
                <SelectItem value="1">Persona Jurídica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSubmit} className="w-full h-12 font-semibold">
            <CreditCard className="w-5 h-5 mr-2" />
            Pagar con PSE
            {estimatedTotal && (
              <span className="ml-2 opacity-80">• {formatAmount(estimatedTotal)}</span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PSEPaymentDialog;
