import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, HelpCircle, MessageCircle, FileText, Shield, ChevronRight, Info, LogOut } from "lucide-react";

interface SettingsDialogProps {
  children: React.ReactNode;
}

const SettingsDialog = ({ children }: SettingsDialogProps) => {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    publicProfile: true,
  });

  const isDark = theme === "dark";

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  const handleSave = () => {
    toast({
      title: "Configuración guardada",
      description: "Tus preferencias han sido actualizadas.",
    });
    setOpen(false);
  };

  const helpItems = [
    {
      icon: HelpCircle,
      label: "Preguntas frecuentes",
      description: "Respuestas a las dudas más comunes",
    },
    {
      icon: MessageCircle,
      label: "Contactar soporte",
      description: "Escríbenos si necesitas ayuda",
    },
    {
      icon: FileText,
      label: "Términos y condiciones",
      description: "Lee nuestros términos de uso",
    },
    {
      icon: Shield,
      label: "Política de privacidad",
      description: "Cómo protegemos tus datos",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configuración</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Preferencias */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Preferencias</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  <div>
                    <Label htmlFor="darkMode">Modo oscuro</Label>
                    <p className="text-sm text-muted-foreground">Cambia la apariencia de la app</p>
                  </div>
                </div>
                <Switch
                  id="darkMode"
                  checked={isDark}
                  onCheckedChange={handleThemeToggle}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Notificaciones</Label>
                  <p className="text-sm text-muted-foreground">Recibe alertas de eventos y mensajes</p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailUpdates">Actualizaciones por email</Label>
                  <p className="text-sm text-muted-foreground">Recibe noticias y novedades</p>
                </div>
                <Switch
                  id="emailUpdates"
                  checked={settings.emailUpdates}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailUpdates: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="publicProfile">Perfil público</Label>
                  <p className="text-sm text-muted-foreground">Otros usuarios pueden ver tu perfil</p>
                </div>
                <Switch
                  id="publicProfile"
                  checked={settings.publicProfile}
                  onCheckedChange={(checked) => setSettings({ ...settings, publicProfile: checked })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Ayuda y soporte */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Ayuda y soporte</p>
            <div className="space-y-1">
              {helpItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors text-left group"
                    onClick={() =>
                      toast({
                        title: item.label,
                        description: "Esta sección estará disponible pronto.",
                      })
                    }
                  >
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Cerrar sesión */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tendrás que volver a iniciar sesión para acceder a tu cuenta.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => {
                    logout();
                    toast({ title: "Sesión cerrada", description: "Has cerrado sesión correctamente" });
                    setOpen(false);
                    navigate("/auth", { replace: true });
                  }}
                >
                  Cerrar sesión
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Info de la app */}
          <div className="flex items-center gap-3 px-3">
            <Info className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Maroá v1.0.0</p>
              <p className="text-xs text-muted-foreground">© 2026 Maroá. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
        <Button onClick={handleSave} className="w-full">
          Guardar
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
