import routeForest from "@/assets/route-forest.jpg";
import routeCoast from "@/assets/route-coast.jpg";

export interface RouteData {
  id: string;
  title: string;
  location: string;
  distance: string;
  duration: string;
  difficulty: "Fácil" | "Medio" | "Difícil";
  image: string;
  type: "pública" | "privada" | "agroturismo";
  company?: string;
  category: "senderismo" | "agroturismo";
  description: string;
  coordinates: { lat: number; lng: number };
  contact?: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
}

export const allRoutes: RouteData[] = [
  {
    id: "bosque-encantado",
    title: "Sendero del Bosque Encantado",
    location: "Sierra de Madrid",
    distance: "8.5 km",
    duration: "3h 30min",
    difficulty: "Medio",
    image: routeForest,
    type: "pública",
    category: "senderismo",
    description: "Un sendero mágico que atraviesa uno de los bosques más antiguos de la Sierra de Madrid. Ideal para los amantes de la naturaleza que buscan conectar con el entorno natural mientras disfrutan de vistas panorámicas impresionantes. El recorrido incluye varios miradores y zonas de descanso.",
    coordinates: { lat: 40.7128, lng: -3.8644 },
  },
  {
    id: "picos-europa-premium",
    title: "Ruta Premium Picos de Europa",
    location: "Picos de Europa",
    distance: "15 km",
    duration: "5h",
    difficulty: "Difícil",
    image: routeCoast,
    type: "privada",
    company: "Montaña Aventura Pro",
    category: "senderismo",
    description: "Experiencia guiada exclusiva por los Picos de Europa con guías expertos certificados. Incluye equipo profesional, seguro de montaña y almuerzo gourmet en refugio de alta montaña. Vistas espectaculares garantizadas.",
    coordinates: { lat: 43.1889, lng: -4.8378 },
    contact: {
      phone: "+34 985 123 456",
      email: "info@montanaaventura.com",
      whatsapp: "+34985123456",
    },
  },
  {
    id: "finca-esperanza",
    title: "Finca La Esperanza",
    location: "Valle del Cauca",
    distance: "3 km",
    duration: "2h",
    difficulty: "Fácil",
    image: routeForest,
    type: "agroturismo",
    company: "Finca La Esperanza",
    category: "agroturismo",
    description: "Descubre los secretos de la agricultura tradicional en nuestra finca familiar. Recorrido por cultivos orgánicos, huerta medicinal y granja de animales. Incluye degustación de productos frescos y taller de elaboración de quesos artesanales.",
    coordinates: { lat: 3.4516, lng: -76.5320 },
    contact: {
      phone: "+57 315 789 1234",
      whatsapp: "+573157891234",
    },
  },
  {
    id: "ruta-cafe",
    title: "Ruta del Café",
    location: "Eje Cafetero",
    distance: "4 km",
    duration: "3h",
    difficulty: "Fácil",
    image: routeCoast,
    type: "agroturismo",
    company: "Hacienda El Roble",
    category: "agroturismo",
    description: "Vive la experiencia cafetera completa: desde la siembra hasta la taza. Caminarás entre cafetales centenarios, aprenderás el proceso de beneficio del café y disfrutarás de una cata profesional. Almuerzo típico campesino incluido.",
    coordinates: { lat: 4.5339, lng: -75.6811 },
    contact: {
      phone: "+57 310 456 7890",
      email: "reservas@haciendaelroble.com",
      whatsapp: "+573104567890",
    },
  },
  {
    id: "costera-atlantico",
    title: "Ruta Costera del Atlántico",
    location: "Costa de Galicia",
    distance: "12 km",
    duration: "4h 15min",
    difficulty: "Difícil",
    image: routeCoast,
    type: "pública",
    category: "senderismo",
    description: "Espectacular ruta costera que recorre los acantilados más impresionantes de Galicia. El sendero serpentea entre playas vírgenes, calas escondidas y formaciones rocosas únicas. Recomendado para senderistas experimentados.",
    coordinates: { lat: 43.3623, lng: -8.4115 },
  },
  {
    id: "ordesa-guiada",
    title: "Experiencia Guiada Ordesa",
    location: "Parque Nacional Ordesa",
    distance: "10 km",
    duration: "4h",
    difficulty: "Medio",
    image: routeForest,
    type: "privada",
    company: "Guías de Aragón",
    category: "senderismo",
    description: "Adéntrate en uno de los parques nacionales más espectaculares de España con guías locales expertos. Conocerás la flora y fauna autóctona, historias locales y los mejores rincones escondidos del valle.",
    coordinates: { lat: 42.6401, lng: -0.0550 },
    contact: {
      phone: "+34 974 234 567",
      email: "reservas@guiasdearagon.es",
    },
  },
  {
    id: "granja-pinos",
    title: "Granja Orgánica Los Pinos",
    location: "Boyacá",
    distance: "2.5 km",
    duration: "1h 30min",
    difficulty: "Fácil",
    image: routeForest,
    type: "agroturismo",
    company: "Granja Los Pinos",
    category: "agroturismo",
    description: "Experiencia familiar en nuestra granja orgánica certificada. Alimenta a los animales, cosecha vegetales frescos y participa en talleres de agricultura sostenible. Ideal para niños y familias.",
    coordinates: { lat: 5.5353, lng: -73.3678 },
    contact: {
      phone: "+57 320 123 4567",
      whatsapp: "+573201234567",
    },
  },
  {
    id: "valle-verde",
    title: "Camino del Valle Verde",
    location: "Pirineo Aragonés",
    distance: "5.2 km",
    duration: "2h",
    difficulty: "Fácil",
    image: routeForest,
    type: "pública",
    category: "senderismo",
    description: "Ruta familiar perfecta para iniciarse en el senderismo. Transcurre por un valle verde con arroyos cristalinos, prados floridos y bosques de hayas. Cuenta con áreas de picnic y zonas de juego para niños.",
    coordinates: { lat: 42.7731, lng: -0.3254 },
  },
];
