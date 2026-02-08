import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import maroaIcon from "@/assets/maroa-icon.svg";
import EmailVerificationForm from "@/components/EmailVerificationForm";
import PasswordResetFlow from "@/components/PasswordResetFlow";

type AuthView = "main" | "verify-email" | "password-reset";

const Auth = () => {
  const navigate = useNavigate();
  const { login, register, user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [view, setView] = useState<AuthView>("main");
  const [pendingEmail, setPendingEmail] = useState("");
  
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast({ title: "Error", description: "Por favor completa todos los campos", variant: "destructive" });
      return;
    }
    
    if (!validateEmail(loginEmail)) {
      toast({ title: "Error", description: "Por favor ingresa un correo válido", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);
    const result = await login(loginEmail, loginPassword);
    setIsLoading(false);
    
    if (result.success) {
      toast({ title: "¡Bienvenido!", description: "Has iniciado sesión correctamente" });
      navigate("/");
    } else {
      // Check if backend says email not verified
      const errorMsg = result.error || "";
      if (errorMsg.toLowerCase().includes("verific") || errorMsg.toLowerCase().includes("confirm")) {
        setPendingEmail(loginEmail);
        setView("verify-email");
        toast({ title: "Verificación pendiente", description: result.error, variant: "destructive" });
      } else {
        toast({ title: "Error", description: result.error || "Error al iniciar sesión", variant: "destructive" });
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerFirstName || !registerLastName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      toast({ title: "Error", description: "Por favor completa todos los campos", variant: "destructive" });
      return;
    }
    
    if (!validateEmail(registerEmail)) {
      toast({ title: "Error", description: "Por favor ingresa un correo válido", variant: "destructive" });
      return;
    }
    
    if (registerPassword.length < 6) {
      toast({ title: "Error", description: "La contraseña debe tener al menos 6 caracteres", variant: "destructive" });
      return;
    }
    
    if (registerPassword !== registerConfirmPassword) {
      toast({ title: "Error", description: "Las contraseñas no coinciden", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);
    const result = await register(registerEmail, registerPassword, registerConfirmPassword, registerFirstName, registerLastName);
    setIsLoading(false);
    
    if (result.success) {
      toast({ title: "¡Cuenta creada!", description: result.message || "Revisa tu correo para verificar tu cuenta" });
      setPendingEmail(registerEmail);
      setView("verify-email");
    } else {
      toast({ title: "Error", description: result.error || "Error al registrarse", variant: "destructive" });
    }
  };

  const handleVerified = () => {
    setView("main");
    toast({ title: "¡Listo!", description: "Ahora puedes iniciar sesión" });
  };

  const handlePasswordResetComplete = () => {
    setView("main");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src={maroaIcon} alt="MAROÁ" className="w-56 h-56 mx-auto" />
        </div>

        <Card>
          <CardHeader className="pb-4">
            {view === "verify-email" && (
              <CardContent className="pt-2 px-0">
                <EmailVerificationForm
                  email={pendingEmail}
                  onVerified={handleVerified}
                  onBack={() => setView("main")}
                />
              </CardContent>
            )}

            {view === "password-reset" && (
              <CardContent className="pt-2 px-0">
                <PasswordResetFlow
                  onBack={() => setView("main")}
                  onComplete={handlePasswordResetComplete}
                />
              </CardContent>
            )}

            {view === "main" && (
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                  <TabsTrigger value="register">Registrarse</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="mt-6">
                  <CardTitle className="text-xl">¡Bienvenido de nuevo!</CardTitle>
                  <CardDescription className="mt-1">
                    Ingresa tus credenciales para continuar
                  </CardDescription>
                  
                  <form onSubmit={handleLogin} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Correo electrónico</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="tu@correo.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Contraseña</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>

                    <Button
                      type="button"
                      variant="link"
                      className="w-full text-sm text-muted-foreground"
                      onClick={() => setView("password-reset")}
                    >
                      ¿Olvidaste tu contraseña?
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register" className="mt-6">
                  <CardTitle className="text-xl">Crear cuenta</CardTitle>
                  <CardDescription className="mt-1">
                    Únete a la comunidad de senderistas
                  </CardDescription>
                  
                  <form onSubmit={handleRegister} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="register-firstname">Nombre</Label>
                        <Input
                          id="register-firstname"
                          type="text"
                          placeholder="Juan"
                          value={registerFirstName}
                          onChange={(e) => setRegisterFirstName(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-lastname">Apellido</Label>
                        <Input
                          id="register-lastname"
                          type="text"
                          placeholder="Pérez"
                          value={registerLastName}
                          onChange={(e) => setRegisterLastName(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Correo electrónico</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="tu@correo.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        disabled={isLoading}
                        className={registerEmail && !validateEmail(registerEmail) ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {registerEmail && !validateEmail(registerEmail) && (
                        <p className="text-sm text-destructive">Ingresa un correo válido</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Contraseña</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 6 caracteres"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm">Confirmar contraseña</Label>
                      <Input
                        id="register-confirm"
                        type="password"
                        placeholder="Repite tu contraseña"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        className={registerConfirmPassword && registerPassword !== registerConfirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {registerConfirmPassword && registerPassword !== registerConfirmPassword && (
                        <p className="text-sm text-destructive">Las contraseñas no coinciden</p>
                      )}
                      {registerConfirmPassword && registerPassword === registerConfirmPassword && registerPassword.length >= 6 && (
                        <p className="text-sm text-green-600">Las contraseñas coinciden ✓</p>
                      )}
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </CardHeader>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground mt-6">
          Al continuar, aceptas nuestros términos de servicio y política de privacidad.
        </p>
      </div>
    </div>
  );
};

export default Auth;
