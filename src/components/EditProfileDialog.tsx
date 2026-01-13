import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface EditProfileDialogProps {
  children: React.ReactNode;
  initialData?: {
    bio: string;
  };
}

const EditProfileDialog = ({ children, initialData }: EditProfileDialogProps) => {
  const { user, updateProfile } = useAuth();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: initialData?.bio || "",
  });

  useEffect(() => {
    if (user) {
      // Try to get first_name/last_name, or split the name if not available
      let firstName = user.first_name || "";
      let lastName = user.last_name || "";
      
      if (!firstName && !lastName && user.name) {
        const nameParts = user.name.split(" ");
        firstName = nameParts[0] || "";
        lastName = nameParts.slice(1).join(" ") || "";
      }
      
      setFormData((prev) => ({
        ...prev,
        firstName,
        lastName,
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    const result = await updateProfile({
      first_name: formData.firstName,
      last_name: formData.lastName,
      bio: formData.bio,
    });

    if (result.success) {
      toast({
        title: "¡Perfil actualizado!",
        description: "Tus cambios han sido guardados.",
      });
      setOpen(false);
    } else {
      toast({
        title: "Error",
        description: result.error || "No se pudo actualizar el perfil",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ""}
              disabled
              className="bg-muted text-muted-foreground cursor-not-allowed"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre *</Label>
              <Input
                id="firstName"
                placeholder="Tu nombre"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido *</Label>
              <Input
                id="lastName"
                placeholder="Tu apellido"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Biografía</Label>
            <Textarea
              id="bio"
              placeholder="Cuéntanos sobre ti..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full">
            Guardar Cambios
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
