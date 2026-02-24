import { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { PaymentParticipant } from "@/components/PSEPaymentDialog";

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

type CardStep = "select" | "new" | "processing" | "result";
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

  // New card form
  const [cardForm, setCardForm] = useState({
    card_number: "",
    cvc: "",
    exp_month: "",
    exp_year: "",
    card_holder: "",
  });

  const estimatedTotal = pricePerPerson ? pricePerPerson * participants.length : null;
  const formatAmount = (amount: number) => `$${amount.toLocaleString("es-CO")} COP`;

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
    }
  }, [open, fetchSavedCards]);

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
        onPaymentComplete("approved");
      } else if (status === "DECLINED") {
        setPaymentResult("declined");
        setResultMessage("La transacción fue rechazada por el banco.");
        onPaymentComplete("declined");
      } else {
        setPaymentResult("error");
        setResultMessage("Ocurrió un error procesando el pago.");
        onPaymentComplete("error");
      }
      setStep("result");
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
                <CreditCard className="w-5 h-5 text-primary" />
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

      {/* Actions */}
      <div className="space-y-2 pt-2">
        {selectedCardId && (
          <Button className="w-full h-12 rounded-xl font-semibold" onClick={handlePayWithSavedCard}>
            <CreditCard className="w-4 h-4 mr-2" />
            Pagar con tarjeta seleccionada
          </Button>
        )}
        <Button
          variant={selectedCardId ? "outline" : "default"}
          className="w-full h-12 rounded-xl font-semibold"
          onClick={() => setStep("new")}
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
            onChange={(e) => setCardForm({ ...cardForm, card_holder: e.target.value })}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label>Número de tarjeta</Label>
          <Input
            placeholder="4242 4242 4242 4242"
            value={cardForm.card_number}
            onChange={(e) => setCardForm({ ...cardForm, card_number: e.target.value.replace(/\s/g, "") })}
            maxLength={19}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-2">
            <Label>Mes</Label>
            <Input
              placeholder="12"
              value={cardForm.exp_month}
              onChange={(e) => setCardForm({ ...cardForm, exp_month: e.target.value })}
              maxLength={2}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label>Año</Label>
            <Input
              placeholder="2029"
              value={cardForm.exp_year}
              onChange={(e) => setCardForm({ ...cardForm, exp_year: e.target.value })}
              maxLength={4}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label>CVC</Label>
            <Input
              placeholder="123"
              type="password"
              value={cardForm.cvc}
              onChange={(e) => setCardForm({ ...cardForm, cvc: e.target.value })}
              maxLength={4}
              className="h-11 rounded-xl"
            />
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
      >
        <CreditCard className="w-4 h-4 mr-2" />
        Pagar {estimatedTotal ? formatAmount(estimatedTotal) : ""}
      </Button>
    </div>
  );

  const renderProcessing = () => (
    <div className="flex flex-col items-center gap-4 py-8">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="text-lg font-semibold">Procesando pago...</p>
      <p className="text-sm text-muted-foreground">Validando tu tarjeta con el banco...</p>
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
    <Dialog open={open} onOpenChange={(v) => { if (!isProcessing) onOpenChange(v); }}>
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
        {step === "result" && renderResult()}
      </DialogContent>
    </Dialog>
  );
};

export default CardPaymentDialog;
