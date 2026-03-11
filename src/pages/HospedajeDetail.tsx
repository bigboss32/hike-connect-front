import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, MessageCircle, Image, Users, DollarSign, Clock, CheckCircle2, AlertCircle, Shield, Wifi, Car, Waves, Info, MessageSquare, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useHospedajeById } from "@/hooks/useHospedajes";
import RouteMap from "@/components/RouteMap";
import HospedajeAvailabilityCalendar from "@/components/HospedajeAvailabilityCalendar";
import Navigation from "@/components/Navigation";

const tipoLabels: Record<string, string> = {
  hotel: "Hotel",
  cabaña: "Cabaña",
  finca: "Finca",
  ecolodge: "Ecolodge",
  camping: "Camping",
  otro: "Otro",
};

const amenityIcons: Record<string, typeof Wifi> = {
  wifi: Wifi,
  piscina: Waves,
  parqueadero: Car,
};

const HospedajeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: hospedaje, isLoading, error } = useHospedajeById(id);
  const [selectedDate, setSelectedDate] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-8">
        <Skeleton className="h-56 w-full" />
        <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error || !hospedaje) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Hospedaje no encontrado</h1>
          <Button onClick={() => navigate("/routes")}>Volver</Button>
        </div>
      </div>
    );
  }

  const hospedajeImages = hospedaje.images?.length
    ? [...hospedaje.images].sort((a, b) => a.order - b.order).map((img) => img.image_url)
    : hospedaje.image
      ? [hospedaje.image]
      : [];

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (isNaN(num)) return price;
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Image */}
      <div className="relative h-56">
        <img
          src={hospedajeImages[0] || hospedaje.image}
          alt={hospedaje.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex gap-2 mb-2">
            <Badge className="bg-accent text-accent-foreground">
              {tipoLabels[hospedaje.tipo] || hospedaje.tipo}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-white">{hospedaje.title}</h1>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Info básica */}
        <div className="flex items-center flex-wrap gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span>{hospedaje.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>Máx {hospedaje.max_guests} huéspedes</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>Check-in {hospedaje.check_in_time} · Check-out {hospedaje.check_out_time}</span>
          </div>
        </div>

        {hospedaje.company && (
          <p className="text-sm text-muted-foreground">
            Ofrecido por <span className="font-medium text-foreground">{hospedaje.company}</span>
          </p>
        )}

        {/* Tabs */}
        <Tabs defaultValue="detalles" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="detalles" className="flex items-center gap-1.5">
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">Detalles</span>
            </TabsTrigger>
            <TabsTrigger value="fotos" className="flex items-center gap-1.5">
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">Fotos</span>
            </TabsTrigger>
            <TabsTrigger value="disponibilidad" className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Disponibilidad</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Detalles */}
          <TabsContent value="detalles" className="mt-4 space-y-6">
            <section>
              <h2 className="text-lg font-bold mb-3">Descripción</h2>
              <p className="text-muted-foreground leading-relaxed">{hospedaje.description}</p>
            </section>

            {/* Precio y capacidad */}
            {(hospedaje.base_price || hospedaje.max_guests) && (
              <section>
                <h2 className="text-lg font-bold mb-3">Información de reserva</h2>
                <Card>
                  <CardContent className="p-4 space-y-3">
                    {hospedaje.base_price && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="w-5 h-5" />
                          <span>Precio base</span>
                        </div>
                        <span className="text-xl font-bold text-primary">{formatPrice(hospedaje.base_price)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-5 h-5" />
                        <span>Capacidad máxima</span>
                      </div>
                      <span className="font-semibold text-foreground">{hospedaje.max_guests} huéspedes</span>
                    </div>
                    {hospedaje.max_guests_per_booking > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-5 h-5" />
                          <span>Máx. por reserva</span>
                        </div>
                        <span className="font-semibold text-foreground">{hospedaje.max_guests_per_booking}</span>
                      </div>
                    )}
                    {hospedaje.requires_payment && (
                      <Badge variant="secondary" className="mt-2">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Requiere pago anticipado
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Amenities */}
            {hospedaje.amenities && hospedaje.amenities.length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-3">Amenidades</h2>
                <div className="flex flex-wrap gap-2">
                  {hospedaje.amenities.map((amenity) => (
                    <Badge key={amenity} variant="outline" className="capitalize py-1.5 px-3">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {/* Servicios incluidos */}
            {hospedaje.included_services && hospedaje.included_services.trim() !== "" && (
              <section>
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Servicios incluidos
                </h2>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{hospedaje.included_services}</p>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Servicios adicionales */}
            {hospedaje.additional_services && Object.keys(hospedaje.additional_services).length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-3">Servicios adicionales</h2>
                <Card>
                  <CardContent className="p-4 space-y-2">
                    {Object.entries(hospedaje.additional_services).map(([service, price]) => (
                      <div key={service} className="flex items-center justify-between">
                        <span className="text-muted-foreground capitalize">{service.replace(/_/g, " ")}</span>
                        <span className="font-semibold text-foreground">{formatPrice(String(price))}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Políticas */}
            {hospedaje.policies && hospedaje.policies.trim() !== "" && (
              <section>
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-secondary" />
                  Políticas
                </h2>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{hospedaje.policies}</p>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Requisitos */}
            {hospedaje.requirements && hospedaje.requirements.trim() !== "" && (
              <section>
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-secondary" />
                  Requisitos
                </h2>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{hospedaje.requirements}</p>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Mapa */}
            <section>
              <h2 className="text-lg font-bold mb-3">Ubicación</h2>
              <RouteMap coordinates={hospedaje.coordinates} title={hospedaje.title} />
              {hospedaje.address && (
                <p className="text-sm text-muted-foreground mt-2">{hospedaje.address}</p>
              )}
            </section>

            {/* Contacto */}
            {(hospedaje.phone || hospedaje.email || hospedaje.whatsapp) && (
              <section>
                <h2 className="text-lg font-bold mb-3">Contactar</h2>
                <Card>
                  <CardContent className="p-4 space-y-3">
                    {hospedaje.phone && (
                      <a href={`tel:${hospedaje.phone}`} className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                        <Phone className="w-5 h-5" />
                        <span>{hospedaje.phone}</span>
                      </a>
                    )}
                    {hospedaje.email && (
                      <a href={`mailto:${hospedaje.email}`} className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                        <Mail className="w-5 h-5" />
                        <span>{hospedaje.email}</span>
                      </a>
                    )}
                    {hospedaje.whatsapp && (
                      <a
                        href={`https://wa.me/${hospedaje.whatsapp}?text=${encodeURIComponent(`Hola, me interesa el hospedaje "${hospedaje.title}"`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </CardContent>
                </Card>
              </section>
            )}

            {/* WhatsApp CTA */}
            {hospedaje.whatsapp && (
              <Button variant="outline" className="w-full" size="lg" asChild>
                <a
                  href={`https://wa.me/${hospedaje.whatsapp}?text=${encodeURIComponent(`Hola, me interesa el hospedaje "${hospedaje.title}"`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Consultar por WhatsApp
                </a>
              </Button>
            )}
          </TabsContent>

          {/* Tab Fotos */}
          <TabsContent value="fotos" className="mt-4">
            {hospedajeImages.length > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {hospedajeImages.map((photo, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                      <img src={photo} alt={`Foto ${index + 1} de ${hospedaje.title}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  {hospedajeImages.length} {hospedajeImages.length === 1 ? "foto" : "fotos"}
                </p>
              </>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Image className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Aún no hay fotos para este hospedaje</p>
              </div>
            )}
          </TabsContent>

          {/* Tab Disponibilidad */}
          <TabsContent value="disponibilidad" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <HospedajeAvailabilityCalendar
                  hospedajeId={hospedaje.id}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Navigation />
    </div>
  );
};

export default HospedajeDetail;
