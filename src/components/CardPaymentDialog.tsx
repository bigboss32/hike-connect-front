import { useState, useEffect, useCallback, useRef } from "react";
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
  CreditCard,
  Plus,
  ChevronLeft,
  Clock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { PaymentParticipant } from "@/components/PSEPaymentDialog";

const BrandIcon = ({ brand }: { brand: string }) => {
  const b = brand?.toLowerCase() || "";
  if (b.includes("visa")) {
    return (
      <svg viewBox="0 0 48 32" className="w-8 h-5" fill="none">
        <rect width="48" height="32" rx="4" fill="#1A1F71" />
        <text x="24" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="sans-serif">VISA</text>
      </svg>
    );
  }
  if (b.includes("master")) {
    return (
      <svg viewBox="0 0 48 32" className="w-8 h-5" fill="none">
        <rect width="48" height="32" rx="4" fill="#252525" />
        <circle cx="19" cy="16" r="9" fill="#EB001B" />
        <circle cx="29" cy="16" r="9" fill="#F79E1B" />
        <path d="M24 9.5a9 9 0 0 1 0 13" fill="#FF5F00" />
        <path d="M24 22.5a9 9 0 0 1 0-13" fill="#FF5F00" />
      </svg>
    );
  }
  if (b.includes("amex") || b.includes("american")) {
    return (
      <svg viewBox="0 0 48 32" className="w-8 h-5" fill="none">
        <rect width="48" height="32" rx="4" fill="#006FCF" />
        <text x="24" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="sans-serif">AMEX</text>
      </svg>
    );
  }
  if (b.includes("diners")) {
    return (
      <svg viewBox="0 0 48 32" className="w-8 h-5" fill="none">
        <rect width="48" height="32" rx="4" fill="#0079BE" />
        <text x="24" y="20" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">DINERS</text>
      </svg>
    );
  }
  return <CreditCard className="w-5 h-5 text-primary" />;
};

const API_BASE_URL = "https://hike-connect-back.onrender.com/api/v1";

interface SavedCard {
  token_id: string;
  last_four: string;
  card_holder: string;
  exp_month: string;
  exp_year: string;
  brand: string;
  is_active: boolean;
}

type CardStep = "select" | "new" | "processing" | "polling" | "result";
type PaymentResult = "approved" | "declined" | "error" | null;

interface CardPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routeId: string;
  routeTitle: string;
  bookingDate: string;
  participants: PaymentParticipant[];
  pricePerPerson?: number;
  onPaymentComplete: (status: "approved" | "declined" | "error") => void;
}

const CardPaymentDialog = ({
  open,
  onOpenChange,
  routeId,
  routeTitle,
  bookingDate,
  participants,
  pricePerPerson,
  onPaymentComplete,
}: CardPaymentDialogProps) => {
  const { authFetch } = useAuth();
  const [step, setStep] = useState<CardStep>("select");
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [installments, setInstallments] = useState("1");
  const [paymentResult, setPaymentResult] = useState<PaymentResult>(null);
  const [resultMessage, setResultMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // New card form
  const [cardForm, setCardForm] = useState({
    card_number: "",
    cvc: "",
    exp_month: "",
    exp_year: "",
    card_holder: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markTouched = (field: string) => setTouched((t) => ({ ...t, [field]: true }));

  const cardValidation = {
    card_holder: cardForm.card_holder.trim().length >= 3,
    card_number: /^\d{13,19}$/.test(cardForm.card_number),
    exp_month: /^(0[1-9]|1[0-2])$/.test(cardForm.exp_month),
    exp_year: /^\d{4}$/.test(cardForm.exp_year) && parseInt(cardForm.exp_year) >= new Date().getFullYear(),
    cvc: /^\d{3,4}$/.test(cardForm.cvc),
  };

  const isCardFormValid = Object.values(cardValidation).every(Boolean);

  const fieldClass = (field: keyof typeof cardValidation) => {
    if (!touched[field]) return "h-11 rounded-xl";
    return cardValidation[field]
      ? "h-11 rounded-xl border-green-500/50 focus-visible:ring-green-500/30"
      : "h-11 rounded-xl border-destructive focus-visible:ring-destructive/30";
  };

  const estimatedTotal = pricePerPerson ? pricePerPerson * participants.length : null;
  const formatAmount = (amount: number) => `$${amount.toLocaleString("es-CO")} COP`;

  const stopPolling = useCallback(() => {
    if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
  }, []);

  const startPolling = useCallback((paymentId: string) => {
    pollingRef.current = setInterval(async () => {
      try {
        const res = await authFetch(`${API_BASE_URL}/payments/${paymentId}/status/`);
        if (!res.ok) return;
        const data = await res.json();
        const s = (data.status || "").toUpperCase();
        if (s === "APPROVED") {
          stopPolling();
          setPaymentResult("approved");
          setResultMessage(data.amount ? formatAmount(parseFloat(data.amount)) : "");
          setStep("result");
          onPaymentComplete("approved");
        } else if (s === "DECLINED") {
          stopPolling();
          setPaymentResult("declined");
          setResultMessage("La transacción fue rechazada por el banco.");
          setStep("result");
          onPaymentComplete("declined");
        } else if (s === "ERROR") {
          stopPolling();
          setPaymentResult("error");
          setResultMessage("Ocurrió un error procesando el pago.");
          setStep("result");
          onPaymentComplete("error");
        }
      } catch { /* keep polling */ }
    }, 4000);

    timeoutRef.current = setTimeout(() => {
      stopPolling();
      setPaymentResult("error");
      setResultMessage("Tiempo de espera agotado. Verifica el estado en tu historial.");
      setStep("result");
    }, 5 * 60 * 1000);
  }, [authFetch, stopPolling, onPaymentComplete]);

  useEffect(() => () => stopPolling(), [stopPolling]);

  const fetchSavedCards = useCallback(async () => {
    setCardsLoading(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/payments/cards/`);
      if (res.ok) {
        const data = await res.json();
        setSavedCards((data.cards || []).filter((c: SavedCard) => c.is_active));
      }
    } catch {
      // silent
    } finally {
      setCardsLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    if (open) {
      fetchSavedCards();
      setStep("select");
      setSelectedCardId(null);
      setPaymentResult(null);
      setInstallments("1");
      setCardForm({ card_number: "", cvc: "", exp_month: "", exp_year: "", card_holder: "" });
      setTouched({});
    } else {
      stopPolling();
    }
  }, [open, fetchSavedCards, stopPolling]);

  const tokenizeCard = async (): Promise<string | null> => {
    try {
      const res = await authFetch(`${API_BASE_URL}/payments/card/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardForm),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Error al tokenizar la tarjeta");
      }
      const data = await res.json();
      return data.wompi_token;
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      return null;
    }
  };

  const processPayment = async (cardToken?: string, savedCardTokenId?: string) => {
    setStep("processing");
    setIsProcessing(true);

    try {
      const body: any = {
        ruta_id: routeId,
        booking_date: bookingDate,
        participants,
        installments: parseInt(installments),
      };

      if (cardToken) body.card_token = cardToken;
      if (savedCardTokenId) body.saved_card_token_id = savedCardTokenId;

      const res = await authFetch(`${API_BASE_URL}/payments/card/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.detail || data.message || "Error al procesar el pago");
      }

      const status = data.status?.toUpperCase();
      if (status === "APPROVED") {
        setPaymentResult("approved");
        setResultMessage(data.amount ? formatAmount(parseFloat(data.amount)) : "");
        setStep("result");
        onPaymentComplete("approved");
      } else if (status === "DECLINED") {
        setPaymentResult("declined");
        setResultMessage("La transacción fue rechazada por el banco.");
        setStep("result");
        onPaymentComplete("declined");
      } else if (status === "PENDING") {
        setStep("polling");
        startPolling(data.payment_id);
      } else {
        setPaymentResult("error");
        setResultMessage("Ocurrió un error procesando el pago.");
        setStep("result");
        onPaymentComplete("error");
      }
    } catch (err: any) {
      setPaymentResult("error");
      setResultMessage(err.message || "Error al procesar el pago");
      setStep("result");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayWithSavedCard = async () => {
    if (!selectedCardId) return;
    await processPayment(undefined, selectedCardId);
  };

  const handlePayWithNewCard = async () => {
    if (!cardForm.card_number || !cardForm.cvc || !cardForm.exp_month || !cardForm.exp_year || !cardForm.card_holder) {
      toast({ title: "Campos requeridos", description: "Completa todos los datos de la tarjeta.", variant: "destructive" });
      return;
    }
    const token = await tokenizeCard();
    if (token) {
      await processPayment(token);
    }
  };

  const renderSelect = () => (
    <div className="space-y-4">
      {/* Summary */}
      <div className="p-4 rounded-xl bg-muted/50 space-y-1">
        <p className="text-sm text-muted-foreground">Ruta: <span className="font-medium text-foreground">{routeTitle}</span></p>
        <p className="text-sm text-muted-foreground">
          Fecha: <span className="font-medium text-foreground">
            {new Date(bookingDate).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </p>
        <p className="text-sm text-muted-foreground">Participantes: <span className="font-medium text-foreground">{participants.length}</span></p>
        {estimatedTotal && <p className="text-lg font-bold text-primary">{formatAmount(estimatedTotal)}</p>}
      </div>

      {/* Saved cards */}
      {cardsLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : savedCards.length > 0 ? (
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Tarjetas guardadas</Label>
          {savedCards.map((card) => (
            <button
              key={card.token_id}
              onClick={() => setSelectedCardId(card.token_id === selectedCardId ? null : card.token_id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left",
                selectedCardId === card.token_id
                  ? "border-primary bg-primary/5"
                  : "border-transparent bg-muted/30 hover:bg-muted/50"
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shadow-sm">
                <BrandIcon brand={card.brand} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{card.brand} •••• {card.last_four}</p>
                <p className="text-xs text-muted-foreground">{card.card_holder} • {card.exp_month}/{card.exp_year}</p>
              </div>
              {selectedCardId === card.token_id && (
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              )}
            </button>
          ))}
        </div>
      ) : null}

      {/* Installments - only show if there are saved cards */}
      {savedCards.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Cuotas</Label>
          <Select value={installments} onValueChange={setInstallments}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 6, 12, 24, 36].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n === 1 ? "1 cuota (sin intereses)" : `${n} cuotas`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2 pt-2">
        {selectedCardId && (
          <Button className="w-full h-12 rounded-xl font-semibold" onClick={handlePayWithSavedCard} disabled={isProcessing}>
            {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
            {isProcessing ? "Procesando..." : "Pagar con tarjeta seleccionada"}
          </Button>
        )}
        <Button
          variant={selectedCardId ? "outline" : "default"}
          className="w-full h-12 rounded-xl font-semibold"
          onClick={() => setStep("new")}
          disabled={isProcessing}
        >
          <Plus className="w-4 h-4 mr-2" />
          Usar nueva tarjeta
        </Button>
      </div>
    </div>
  );

  const renderNewCard = () => (
    <div className="space-y-4">
      <button
        onClick={() => setStep("select")}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Volver
      </button>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label>Titular de la tarjeta</Label>
          <Input
            placeholder="Juan Perez"
            value={cardForm.card_holder}
            onChange={(e) => setCardForm({ ...cardForm, card_holder: e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "") })}
            onBlur={() => markTouched("card_holder")}
            className={fieldClass("card_holder")}
          />
          {touched.card_holder && !cardValidation.card_holder && (
            <p className="text-xs text-destructive">Mínimo 3 caracteres</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Número de tarjeta</Label>
          <Input
            placeholder="4242424242424242"
            value={cardForm.card_number}
            onChange={(e) => setCardForm({ ...cardForm, card_number: e.target.value.replace(/\D/g, "").slice(0, 19) })}
            onBlur={() => markTouched("card_number")}
            maxLength={19}
            inputMode="numeric"
            className={fieldClass("card_number")}
          />
          {touched.card_number && !cardValidation.card_number && (
            <p className="text-xs text-destructive">Número inválido (13-19 dígitos)</p>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-2">
            <Label>Mes</Label>
            <Input
              placeholder="12"
              value={cardForm.exp_month}
              onChange={(e) => setCardForm({ ...cardForm, exp_month: e.target.value.replace(/\D/g, "").slice(0, 2) })}
              onBlur={() => markTouched("exp_month")}
              maxLength={2}
              inputMode="numeric"
              className={fieldClass("exp_month")}
            />
            {touched.exp_month && !cardValidation.exp_month && (
              <p className="text-xs text-destructive">01-12</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Año</Label>
            <Input
              placeholder="2029"
              value={cardForm.exp_year}
              onChange={(e) => setCardForm({ ...cardForm, exp_year: e.target.value.replace(/\D/g, "").slice(0, 4) })}
              onBlur={() => markTouched("exp_year")}
              maxLength={4}
              inputMode="numeric"
              className={fieldClass("exp_year")}
            />
            {touched.exp_year && !cardValidation.exp_year && (
              <p className="text-xs text-destructive">Año inválido</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>CVC</Label>
            <Input
              placeholder="123"
              type="password"
              value={cardForm.cvc}
              onChange={(e) => setCardForm({ ...cardForm, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
              onBlur={() => markTouched("cvc")}
              maxLength={4}
              inputMode="numeric"
              className={fieldClass("cvc")}
            />
            {touched.cvc && !cardValidation.cvc && (
              <p className="text-xs text-destructive">3-4 dígitos</p>
            )}
          </div>
        </div>
      </div>

      {/* Installments */}
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Cuotas</Label>
        <Select value={installments} onValueChange={setInstallments}>
          <SelectTrigger className="rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 6, 12, 24, 36].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n === 1 ? "1 cuota (sin intereses)" : `${n} cuotas`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        className="w-full h-12 rounded-xl font-semibold"
        onClick={handlePayWithNewCard}
        disabled={isProcessing || !isCardFormValid}
      >
        {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
        {isProcessing ? "Procesando..." : `Pagar ${estimatedTotal ? formatAmount(estimatedTotal) : ""}`}
      </Button>
    </div>
  );

  const renderProcessing = () => (
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
      <p className="text-lg font-semibold">Procesando pago...</p>
      <p className="text-sm text-muted-foreground">Validando tu tarjeta con el banco...</p>
    </div>
  );

  const renderPolling = () => (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="relative">
        <Clock className="w-12 h-12 text-primary" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full animate-pulse" />
      </div>
      <p className="text-lg font-semibold">Esperando confirmación...</p>
      <p className="text-sm text-muted-foreground text-center">
        Tu pago está siendo procesado por el banco. Verificamos automáticamente.
      </p>
    </div>
  );

  const renderResult = () => (
    <div className="flex flex-col items-center gap-4 py-8">
      {paymentResult === "approved" ? (
        <>
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <p className="text-lg font-bold text-green-600">¡Pago Aprobado!</p>
          {resultMessage && (
            <p className="text-sm text-muted-foreground">
              Pago de <span className="font-semibold text-foreground">{resultMessage}</span> procesado exitosamente.
            </p>
          )}
          <Button onClick={() => onOpenChange(false)} className="mt-2">Continuar</Button>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
            <XCircle className="w-10 h-10 text-destructive" />
          </div>
          <p className="text-lg font-bold text-destructive">
            {paymentResult === "declined" ? "Pago Rechazado" : "Error en el pago"}
          </p>
          <p className="text-sm text-muted-foreground text-center">{resultMessage}</p>
          <Button variant="outline" onClick={() => setStep("select")} className="mt-2">Reintentar</Button>
        </>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!isProcessing && step !== "polling") onOpenChange(v); }}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Pago con Tarjeta
          </DialogTitle>
        </DialogHeader>
        {step === "select" && renderSelect()}
        {step === "new" && renderNewCard()}
        {step === "processing" && renderProcessing()}
        {step === "polling" && renderPolling()}
        {step === "result" && renderResult()}
      </DialogContent>
    </Dialog>
  );
};

export default CardPaymentDialog;
