import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Send,
  Phone,
  MoreVertical,
  MapPin,
  CheckCheck,
  Clock,
  Image as ImageIcon,
} from "lucide-react";

// Mock data — will be replaced by real API
const MOCK_PROVIDER = {
  name: "Carlos Montoya",
  avatar: "",
  role: "Guía Certificado",
  online: true,
};

const MOCK_MESSAGES = [
  {
    id: "1",
    content: "¡Hola! Gracias por reservar la ruta. ¿Tienes alguna pregunta sobre el recorrido?",
    sender: "provider",
    timestamp: new Date(Date.now() - 3600000 * 2),
    read: true,
  },
  {
    id: "2",
    content: "Hola Carlos! Sí, quería saber si necesito llevar botas especiales o con unas de trekking normales está bien",
    sender: "user",
    timestamp: new Date(Date.now() - 3600000 * 1.5),
    read: true,
  },
  {
    id: "3",
    content: "Con botas de trekking normales estás perfecto. Eso sí, asegúrate de que tengan buen agarre porque hay tramos con piedra húmeda 🥾",
    sender: "provider",
    timestamp: new Date(Date.now() - 3600000),
    read: true,
  },
  {
    id: "4",
    content: "¡Genial! ¿Y el punto de encuentro exacto?",
    sender: "user",
    timestamp: new Date(Date.now() - 1800000),
    read: true,
  },
  {
    id: "5",
    content: "Nos vemos en la entrada principal del parque, junto a la caseta de guardabosques. Llegaré 15 minutos antes para recibirlos 📍",
    sender: "provider",
    timestamp: new Date(Date.now() - 900000),
    read: false,
  },
];

const formatTime = (date: Date) =>
  date.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

const BookingChat = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: text,
        sender: "user",
        timestamp: new Date(),
        read: false,
      },
    ]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-3 py-2.5 border-b border-border bg-card shadow-sm safe-top shrink-0">
        <Button variant="ghost" size="icon" className="shrink-0" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={MOCK_PROVIDER.avatar} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
            {MOCK_PROVIDER.name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{MOCK_PROVIDER.name}</p>
          <div className="flex items-center gap-1.5">
            {MOCK_PROVIDER.online && (
              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
            )}
            <span className="text-xs text-muted-foreground">{MOCK_PROVIDER.role}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0 text-primary">
          <Phone className="w-4.5 h-4.5" />
        </Button>
        <Button variant="ghost" size="icon" className="shrink-0">
          <MoreVertical className="w-4.5 h-4.5" />
        </Button>
      </header>

      {/* Booking context banner */}
      <div className="px-4 py-2 bg-primary/5 border-b border-border flex items-center gap-2 shrink-0">
        <MapPin className="w-4 h-4 text-primary shrink-0" />
        <p className="text-xs text-muted-foreground truncate">
          Reserva <span className="font-medium text-foreground">#{bookingId?.slice(0, 8)}</span> — Conversación con tu guía
        </p>
        <Badge variant="outline" className="text-[10px] ml-auto shrink-0 border-primary/30 text-primary">
          Activa
        </Badge>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Date separator */}
        <div className="flex justify-center">
          <span className="text-[11px] text-muted-foreground bg-muted/60 px-3 py-1 rounded-full">
            Hoy
          </span>
        </div>

        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
                  isUser
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <div className={`flex items-center gap-1 mt-1 ${isUser ? "justify-end" : "justify-start"}`}>
                  <span className={`text-[10px] ${isUser ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {formatTime(msg.timestamp)}
                  </span>
                  {isUser && (
                    msg.read
                      ? <CheckCheck className="w-3.5 h-3.5 text-primary-foreground/60" />
                      : <Clock className="w-3 h-3 text-primary-foreground/40" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input bar */}
      <div className="px-3 py-2.5 border-t border-border bg-card safe-bottom shrink-0">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground">
            <ImageIcon className="w-5 h-5" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            className="flex-1 rounded-full bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/30"
          />
          <Button
            size="icon"
            className="shrink-0 rounded-full"
            disabled={!input.trim()}
            onClick={handleSend}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingChat;
