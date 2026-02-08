import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Mail, RefreshCw, CheckCircle2 } from "lucide-react";

interface EmailVerificationFormProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}

const EmailVerificationForm = ({ email, onVerified, onBack }: EmailVerificationFormProps) => {
  const { verifyEmail, resendVerification } = useAuth();
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (code.length !== 6) {
      toast({
        title: "Error",
        description: "Ingresa el código completo de 6 dígitos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const result = await verifyEmail(email, code);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "¡Correo verificado!",
        description: result.message || "Tu cuenta ha sido verificada correctamente",
      });
      onVerified();
    } else {
      toast({
        title: "Error",
        description: result.error || "Código inválido",
        variant: "destructive",
      });
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    const result = await resendVerification(email);
    setIsResending(false);

    if (result.success) {
      toast({
        title: "Código reenviado",
        description: result.message || "Revisa tu correo electrónico",
      });
      setCountdown(60);
      setCanResend(false);
      setCode("");
    } else {
      toast({
        title: "Error",
        description: result.error || "No se pudo reenviar el código",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="h-8 w-8 text-primary" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Verifica tu correo</h2>
        <p className="text-sm text-muted-foreground">
          Enviamos un código de 6 dígitos a{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          El código expira en 10 minutos
        </p>
      </div>

      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={setCode}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <Button
        className="w-full"
        onClick={handleVerify}
        disabled={isLoading || code.length !== 6}
      >
        {isLoading ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Verificando...
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Verificar código
          </>
        )}
      </Button>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          ¿No recibiste el código?
        </p>
        {canResend ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? (
              <>
                <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                Reenviando...
              </>
            ) : (
              "Reenviar código"
            )}
          </Button>
        ) : (
          <p className="text-xs text-muted-foreground">
            Reenviar en {countdown}s
          </p>
        )}
      </div>

      <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground">
        Volver al inicio de sesión
      </Button>
    </div>
  );
};

export default EmailVerificationForm;
