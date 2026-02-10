import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crown, Mountain, Flame, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Donor {
  rank: number;
  name: string;
  title: string;
  quote: string;
  amount: string;
}

const donors: Donor[] = [
  {
    rank: 1,
    name: "Carlos Méndez",
    title: "El Pionero de las Cumbres",
    quote: "Porque cada sendero merece ser contado.",
    amount: "Fundador",
  },
  {
    rank: 2,
    name: "Valentina Ríos",
    title: "Guardiana del Camino",
    quote: "Los caminos no se abren solos, se abren con voluntad.",
    amount: "Leyenda",
  },
  {
    rank: 3,
    name: "Andrés Herrera",
    title: "Forjador de Senderos",
    quote: "Donde otros ven montañas, yo veo historias por escribir.",
    amount: "Leyenda",
  },
  {
    rank: 4,
    name: "Camila Torres",
    title: "Estrella del Norte",
    quote: "Cada paso cuenta cuando el destino es la aventura.",
    amount: "Épico",
  },
  {
    rank: 5,
    name: "Santiago Muñoz",
    title: "Alma de la Montaña",
    quote: "La naturaleza habla, solo hay que saber escuchar.",
    amount: "Épico",
  },
  {
    rank: 6,
    name: "Isabella Vargas",
    title: "Voz del Viento",
    quote: "Las mejores vistas llegan después del esfuerzo.",
    amount: "Héroe",
  },
  {
    rank: 7,
    name: "Mateo Castillo",
    title: "Explorador Eterno",
    quote: "No necesitas un mapa cuando tienes propósito.",
    amount: "Héroe",
  },
  {
    rank: 8,
    name: "Luciana Peña",
    title: "Guardiana del Bosque",
    quote: "Proteger la tierra es proteger nuestra historia.",
    amount: "Héroe",
  },
  {
    rank: 9,
    name: "Diego Salazar",
    title: "Caminante Incansable",
    quote: "Mil kilómetros empiezan con una decisión.",
    amount: "Valiente",
  },
  {
    rank: 10,
    name: "Mariana López",
    title: "Luz del Sendero",
    quote: "Donar es sembrar senderos para los que vienen.",
    amount: "Valiente",
  },
];

const getRankStyle = (rank: number) => {
  if (rank === 1) return "from-amber-500/30 to-yellow-600/10 border-amber-500/40";
  if (rank === 2) return "from-slate-300/20 to-slate-400/5 border-slate-400/30";
  if (rank === 3) return "from-orange-700/20 to-orange-800/5 border-orange-700/30";
  return "from-primary/10 to-transparent border-primary/20";
};

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="w-6 h-6 text-amber-500" />;
  if (rank === 2) return <Star className="w-5 h-5 text-slate-400" />;
  if (rank === 3) return <Flame className="w-5 h-5 text-orange-700" />;
  return <Sparkles className="w-4 h-4 text-primary" />;
};

const getRankLabel = (rank: number) => {
  if (rank === 1) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  if (rank === 2) return "bg-slate-400/15 text-slate-300 border-slate-400/25";
  if (rank === 3) return "bg-orange-700/15 text-orange-400 border-orange-700/25";
  return "bg-primary/10 text-primary border-primary/20";
};

const Legends = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-8 pb-20">
        {/* Epic Title Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Mountain className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Salón de las Leyendas
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed text-sm sm:text-base">
            Gracias a ellos, se están escribiendo leyendas. Cada sendero que recorres, 
            cada cumbre que conquistas, existe porque alguien creyó en este sueño.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/40" />
            <Sparkles className="w-4 h-4 text-primary/60" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/40" />
          </div>
        </div>

        {/* Donors List */}
        <div className="space-y-4">
          {donors.map((donor, index) => (
            <div
              key={donor.rank}
              className={cn(
                "relative rounded-xl border bg-gradient-to-r p-5 transition-all duration-500 cursor-default",
                getRankStyle(donor.rank),
                hoveredIndex === index && "scale-[1.02] shadow-elevated",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-start gap-4">
                {/* Rank */}
                <div className="flex flex-col items-center gap-1 pt-1">
                  {getRankIcon(donor.rank)}
                  <span className="text-xs font-bold text-muted-foreground">
                    #{donor.rank}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-foreground text-lg">{donor.name}</h3>
                    <span
                      className={cn(
                        "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                        getRankLabel(donor.rank)
                      )}
                    >
                      {donor.amount}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-primary/80 mb-2">{donor.title}</p>
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    "{donor.quote}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Epic Footer */}
        <div className="mt-16 text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/30" />
            <Flame className="w-5 h-5 text-primary/40" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/30" />
          </div>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Las montañas recuerdan a quienes las honran. Tu nombre podría estar aquí.
          </p>
          <Button variant="outline" className="mt-4 border-primary/30 text-primary hover:bg-primary/10">
            Convertirme en Leyenda
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Legends;
