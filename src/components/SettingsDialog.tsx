import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";

interface SettingsDialogProps {
  children: React.ReactNode;
}

const SettingsDialog = ({ children }: SettingsDialogProps) => {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configuración</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
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
        <Button onClick={handleSave} className="w-full">
          Guardar
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
