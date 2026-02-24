import { useState, useEffect, useCallback } from "react";
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
import { Moon, Sun, HelpCircle, MessageCircle, FileText, Shield, ChevronRight, Info, LogOut, CreditCard, Trash2, Loader2 } from "lucide-react";

interface SettingsDialogProps {
  children: React.ReactNode;
}

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

const SettingsDialog = ({ children }: SettingsDialogProps) => {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { logout, authFetch, user } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    publicProfile: true,
  });
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);

  const isDark = theme === "dark";

  const fetchCards = useCallback(async () => {
    if (!user) return;
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
  }, [authFetch, user]);

  useEffect(() => {
    if (open && user) fetchCards();
  }, [open, user, fetchCards]);

  const deleteCard = async (tokenId: string) => {
    setDeletingCardId(tokenId);
    try {
      const res = await authFetch(`${API_BASE_URL}/payments/cards/?token_id=${tokenId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSavedCards((prev) => prev.filter((c) => c.token_id !== tokenId));
        toast({ title: "Tarjeta eliminada", description: "La tarjeta ha sido desactivada correctamente." });
      } else {
        toast({ title: "Error", description: "No se pudo eliminar la tarjeta.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Error de conexión.", variant: "destructive" });
    } finally {
      setDeletingCardId(null);
    }
  };

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

          {/* Tarjetas guardadas */}
          {user && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Métodos de pago</p>
              {cardsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              ) : savedCards.length > 0 ? (
                <div className="space-y-2">
                  {savedCards.map((card) => (
                    <div key={card.token_id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{card.brand} •••• {card.last_four}</p>
                        <p className="text-xs text-muted-foreground">{card.card_holder} • {card.exp_month}/{card.exp_year}</p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            disabled={deletingCardId === card.token_id}
                          >
                            {deletingCardId === card.token_id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar tarjeta?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Se desactivará la tarjeta {card.brand} terminada en {card.last_four}. Para usarla nuevamente deberás registrarla de nuevo.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => deleteCard(card.token_id)}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-2">No tienes tarjetas guardadas.</p>
              )}
            </div>
          )}

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
