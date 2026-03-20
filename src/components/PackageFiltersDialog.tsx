import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface PackageFilters {
  location: string;
  price_min: string;
  price_max: string;
  min_people: string;
  package_type: string;
  available_date: string;
  component_type: string;
  component_name: string;
}

export const defaultPackageFilters: PackageFilters = {
  location: "",
  price_min: "",
  price_max: "",
  min_people: "",
  package_type: "todos",
  available_date: "",
  component_type: "",
  component_name: "",
};

const packageTypes = [
  { value: "todos", label: "Todos" },
  { value: "person_package", label: "Por persona" },
  { value: "room_package", label: "Por habitación" },
  { value: "group_package", label: "Grupal" },
  { value: "mixed_package", label: "Mixto" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: PackageFilters;
  onFiltersChange: (filters: PackageFilters) => void;
}

const PackageFiltersDialog = ({ open, onOpenChange, filters, onFiltersChange }: Props) => {
  const [local, setLocal] = useState<PackageFilters>(filters);

  useEffect(() => {
    if (open) setLocal(filters);
  }, [open, filters]);

  const apply = () => {
    onFiltersChange(local);
    onOpenChange(false);
  };

  const clear = () => {
    const cleared = { ...defaultPackageFilters };
    setLocal(cleared);
    onFiltersChange(cleared);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filtrar paquetes</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Package type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipo de paquete</Label>
            <div className="flex flex-wrap gap-2">
              {packageTypes.map((t) => (
                <Badge
                  key={t.value}
                  variant={local.package_type === t.value ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all",
                    local.package_type === t.value && "shadow-sm"
                  )}
                  onClick={() => setLocal({ ...local, package_type: t.value })}
                >
                  {t.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Ubicación</Label>
            <Input
              placeholder="Ej: Salento, Quindío"
              value={local.location}
              onChange={(e) => setLocal({ ...local, location: e.target.value })}
            />
          </div>

          {/* Price range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Rango de precio (COP)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Mínimo"
                value={local.price_min}
                onChange={(e) => setLocal({ ...local, price_min: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Máximo"
                value={local.price_max}
                onChange={(e) => setLocal({ ...local, price_max: e.target.value })}
              />
            </div>
          </div>

          {/* Min people */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Mínimo de personas</Label>
            <Input
              type="number"
              placeholder="Ej: 2"
              value={local.min_people}
              onChange={(e) => setLocal({ ...local, min_people: e.target.value })}
            />
          </div>

          {/* Available date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Fecha disponible</Label>
            <Input
              type="date"
              value={local.available_date}
              onChange={(e) => setLocal({ ...local, available_date: e.target.value })}
            />
          </div>

          {/* Component type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipo de componente</Label>
            <Input
              placeholder="Ej: habitacion, camping"
              value={local.component_type}
              onChange={(e) => setLocal({ ...local, component_type: e.target.value })}
            />
          </div>

          {/* Component name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Nombre del componente</Label>
            <Input
              placeholder="Ej: Habitación Estándar"
              value={local.component_name}
              onChange={(e) => setLocal({ ...local, component_name: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1" onClick={clear}>
            <X className="w-4 h-4 mr-1" />
            Limpiar
          </Button>
          <Button className="flex-1" onClick={apply}>
            Aplicar filtros
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PackageFiltersDialog;
