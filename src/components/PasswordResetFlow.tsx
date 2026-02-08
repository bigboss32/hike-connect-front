import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, KeyRound, Mail, RefreshCw, Eye, EyeOff, CheckCircle2, ShieldCheck } from "lucide-react";

interface PasswordResetFlowProps {
  onBack: () => void;
  onComplete: () => void;
}

type Step = "request" | "verify" | "confirm";

const PasswordResetFlow = ({ onBack, onComplete }: PasswordResetFlowProps) => {
  const { requestPasswordReset, verifyPasswordReset, confirmPasswordReset } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !validateEmail(email)) {
      toast({ title: "Error", description: "Ingresa un correo válido", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const result = await requestPasswordReset(email);
    setIsLoading(false);

    if (result.success) {
      toast({ title: "Código enviado", description: result.message || "Revisa tu correo electrónico" });
      setStep("verify");
    } else {
      toast({ title: "Error", description: result.error || "Error al enviar código", variant: "destructive" });
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      toast({ title: "Error", description: "Ingresa el código completo", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const result = await verifyPasswordReset(email, code);
    setIsLoading(false);

    if (result.success) {
      toast({ title: "Código verificado", description: result.message || "Ahora ingresa tu nueva contraseña" });
      setStep("confirm");
    } else {
      toast({ title: "Error", description: result.error || "Código inválido", variant: "destructive" });
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({ title: "Error", description: "La contraseña debe tener al menos 6 caracteres", variant: "destructive" });
      return;
    }

    if (password !== passwordConfirm) {
      toast({ title: "Error", description: "Las contraseñas no coinciden", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const result = await confirmPasswordReset(email, code, password, passwordConfirm);
    setIsLoading(false);

    if (result.success) {
      toast({ title: "¡Contraseña actualizada!", description: result.message || "Ya puedes iniciar sesión con tu nueva contraseña" });
      onComplete();
    } else {
      toast({ title: "Error", description: result.error || "Error al actualizar la contraseña", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={step === "request" ? onBack : () => setStep(step === "confirm" ? "verify" : "request")} className="text-muted-foreground -ml-2">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Volver
      </Button>

      {step === "request" && (
        <>
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <KeyRound className="h-7 w-7 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-semibold">Recuperar contraseña</h2>
            <p className="text-sm text-muted-foreground">
              Ingresa tu correo y te enviaremos un código de verificación
            </p>
          </div>

          <form onSubmit={handleRequestReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Correo electrónico</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Enviando...</>
              ) : (
                <><Mail className="h-4 w-4 mr-2" />Enviar código</>
              )}
            </Button>
          </form>
        </>
      )}

      {step === "verify" && (
        <>
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-7 w-7 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-semibold">Verificar código</h2>
            <p className="text-sm text-muted-foreground">
              Ingresa el código de 6 dígitos enviado a{" "}
              <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          <div className="flex justify-center">
            <InputOTP maxLength={6} value={code} onChange={setCode}>
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

          <Button className="w-full" onClick={handleVerifyCode} disabled={isLoading || code.length !== 6}>
            {isLoading ? (
              <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Verificando...</>
            ) : (
              <><CheckCircle2 className="h-4 w-4 mr-2" />Verificar código</>
            )}
          </Button>
        </>
      )}

      {step === "confirm" && (
        <>
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <KeyRound className="h-7 w-7 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-semibold">Nueva contraseña</h2>
            <p className="text-sm text-muted-foreground">
              Ingresa tu nueva contraseña
            </p>
          </div>

          <form onSubmit={handleConfirmReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-new-password">Confirmar contraseña</Label>
              <Input
                id="confirm-new-password"
                type="password"
                placeholder="Repite tu contraseña"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                disabled={isLoading}
                className={passwordConfirm && password !== passwordConfirm ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {passwordConfirm && password !== passwordConfirm && (
                <p className="text-sm text-destructive">Las contraseñas no coinciden</p>
              )}
              {passwordConfirm && password === passwordConfirm && password.length >= 6 && (
                <p className="text-sm text-green-600">Las contraseñas coinciden ✓</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Actualizando...</>
              ) : (
                "Actualizar contraseña"
              )}
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default PasswordResetFlow;
