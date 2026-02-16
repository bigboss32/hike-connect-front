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
    window.location.href = url;
  }
};

const BANKS = [
  { code: "1007", name: "Bancolombia" },
  { code: "1019", name: "Scotiabank Colpatria" },
  { code: "1040", name: "Banco Agrario" },
  { code: "1052", name: "Banco AV Villas" },
  { code: "1001", name: "Banco de Bogotá" },
  { code: "1002", name: "Banco Popular" },
];

const ID_TYPES = [
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "NIT", label: "NIT" },
  { value: "PP", label: "Pasaporte" },
  { value: "TI", label: "Tarjeta de Identidad" },
];

type PaymentStatus = "idle" | "submitting" | "redirecting" | "polling" | "approved" | "declined" | "error" | "timeout";

interface PSEPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amountPesos: number;
  routeTitle: string;
  participantCount: number;
  onPaymentComplete: (status: "approved" | "declined" | "error") => void;
}

const PSEPaymentDialog = ({
  open,
  onOpenChange,
  amountPesos,
  routeTitle,
  participantCount,
  onPaymentComplete,
}: PSEPaymentDialogProps) => {
  const { authFetch, user } = useAuth();
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    userLegalId: "",
    userLegalIdType: "CC",
    financialInstitutionCode: "",
    phoneNumber: "",
    userType: "0",
  });
  const [redirectUrl, setRedirectUrl] = useState("");
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const amountInCents = amountPesos * 100;

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
    }
  }, [open, stopPolling]);

  const startPolling = useCallback(
    (pId: number) => {
      // Poll every 4 seconds
      pollingRef.current = setInterval(async () => {
        try {
          const res = await authFetch(
            `${API_BASE_URL}/payments/${pId}/status/`
          );
          if (!res.ok) return;
          const data = await res.json();
          const s = data.status?.toUpperCase();

          // Always redirect if there's a URL and we haven't opened it yet
          if (data.redirect_url && data.redirect_url !== redirectUrl) {
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
          }
          // Any other status (PENDING, ERROR, etc.) → keep polling
        } catch {
          // Keep polling on network errors
        }
      }, 4000);

      // 5 minute timeout
      timeoutRef.current = setTimeout(() => {
        stopPolling();
        setStatus("timeout");
      }, 5 * 60 * 1000);
    },
    [authFetch, stopPolling, onPaymentComplete]
  );

  const handleSubmit = async () => {
    if (
      !formData.fullName ||
      !formData.userLegalId ||
      !formData.financialInstitutionCode
    ) {
      toast({
        title: "Campos requeridos",
        description: "Completa nombre, documento y banco.",
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
          amount_in_cents: amountInCents,
          user_legal_id: formData.userLegalId,
          user_legal_id_type: formData.userLegalIdType,
          financial_institution_code: formData.financialInstitutionCode,
          user_type: parseInt(formData.userType),
          phone_number: formData.phoneNumber || undefined,
          full_name: formData.fullName,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || err.message || "Error al crear el pago");
      }

      const data = await res.json();
      setPaymentId(data.payment_id);
      setRedirectUrl(data.redirect_url);

      // Redirect if URL exists
      if (data.redirect_url) {
        setStatus("redirecting");
        openBankUrl(data.redirect_url);
      }

      // Always start polling regardless of redirect_url or status
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

  const renderStatusContent = () => {
    switch (status) {
      case "submitting":
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-lg font-semibold">Creando transacción...</p>
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
              Tu pago de <span className="font-semibold text-foreground">${amountPesos.toLocaleString("es-CO")} COP</span> ha sido procesado exitosamente.
            </p>
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
              La transacción fue rechazada por tu banco. Intenta con otro medio de pago.
            </p>
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
              Ocurrió un error procesando tu pago. Inténtalo de nuevo.
            </p>
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
              No recibimos confirmación de tu banco. Si completaste el pago, tu reserva se actualizará automáticamente.
            </p>
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
      <Dialog open={open} onOpenChange={status === "polling" || status === "submitting" || status === "redirecting" ? undefined : onOpenChange}>
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
          <p className="text-sm text-muted-foreground">Participantes: <span className="font-medium text-foreground">{participantCount}</span></p>
          <p className="text-lg font-bold text-primary">${amountPesos.toLocaleString("es-CO")} COP</p>
        </div>

        <div className="space-y-4">
          {/* Full name */}
          <div className="space-y-2">
            <Label>Nombre completo *</Label>
            <Input
              placeholder="Miguel Garzon"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

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
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu banco" />
              </SelectTrigger>
              <SelectContent>
                {BANKS.map((b) => (
                  <SelectItem key={b.code} value={b.code}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label>Teléfono</Label>
            <Input
              type="tel"
              placeholder="573107650926"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
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
            Pagar ${amountPesos.toLocaleString("es-CO")} COP
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PSEPaymentDialog;
