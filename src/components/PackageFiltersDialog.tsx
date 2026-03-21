import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Loader2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { usePackageFilters } from "@/hooks/usePackageFilters";

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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: PackageFilters;
  onFiltersChange: (filters: PackageFilters) => void;
}

const formatCOP = (val: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(val);

const PackageFiltersDialog = ({ open, onOpenChange, filters, onFiltersChange }: Props) => {
  const [local, setLocal] = useState<PackageFilters>(filters);
  const { data: filtersData, isLoading } = usePackageFilters();

  useEffect(() => {
    if (open) setLocal(filters);
  }, [open, filters]);

  const priceMin = Number(filtersData?.price_range?.min ?? 0);
  const priceMax = Number(filtersData?.price_range?.max ?? 1000000);
  const peopleMin = filtersData?.people_range?.min ?? 1;
  const peopleMax = filtersData?.people_range?.max ?? 20;

  const priceValue = useMemo(() => [
    Number(local.price_min) || priceMin,
    Number(local.price_max) || priceMax,
  ], [local.price_min, local.price_max, priceMin, priceMax]);

  const peopleValue = Number(local.min_people) || peopleMin;

  const packageTypes = useMemo(() => {
    const base = [{ value: "todos", label: "Todos", count: 0 }];
    return [...base, ...(filtersData?.package_types?.map(t => ({ value: t.value, label: t.label || t.value, count: t.count })) ?? [])];
  }, [filtersData]);

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

        {isLoading ? (
          <div className="space-y-4 py-4">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : (
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
                    {t.count > 0 && <span className="ml-1 opacity-60">({t.count})</span>}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Ubicación</Label>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={!local.location ? "default" : "outline"}
                  className="cursor-pointer transition-all"
                  onClick={() => setLocal({ ...local, location: "" })}
                >
                  Todas
                </Badge>
                {filtersData?.locations?.map((loc) => (
                  <Badge
                    key={loc.value}
                    variant={local.location === loc.value ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-all",
                      local.location === loc.value && "shadow-sm"
                    )}
                    onClick={() => setLocal({ ...local, location: loc.value })}
                  >
                    {loc.value.trim()} <span className="ml-1 opacity-60">({loc.count})</span>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Price range slider */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Rango de precio</Label>
              <Slider
                min={priceMin}
                max={priceMax}
                step={10000}
                value={priceValue}
                onValueChange={([min, max]) =>
                  setLocal({ ...local, price_min: String(min), price_max: String(max) })
                }
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatCOP(priceValue[0])}</span>
                <span>{formatCOP(priceValue[1])}</span>
              </div>
            </div>

            {/* Min people slider */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Mínimo de personas: {peopleValue}</Label>
              <Slider
                min={peopleMin}
                max={peopleMax}
                step={1}
                value={[peopleValue]}
                onValueChange={([v]) => setLocal({ ...local, min_people: String(v) })}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{peopleMin}</span>
                <span>{peopleMax}</span>
              </div>
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
            {filtersData?.component_types && filtersData.component_types.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tipo de componente</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={!local.component_type ? "default" : "outline"}
                    className="cursor-pointer transition-all"
                    onClick={() => setLocal({ ...local, component_type: "" })}
                  >
                    Todos
                  </Badge>
                  {filtersData.component_types.map((ct) => (
                    <Badge
                      key={ct.value}
                      variant={local.component_type === ct.value ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-all capitalize",
                        local.component_type === ct.value && "shadow-sm"
                      )}
                      onClick={() => setLocal({ ...local, component_type: ct.value })}
                    >
                      {ct.value} <span className="ml-1 opacity-60">({ct.count})</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

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
        )}

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
