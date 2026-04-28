import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Send,
  MoreVertical,
  MapPin,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { usePaymentChat } from "@/hooks/usePaymentChat";

const formatTime = (date: Date) =>
  date.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

const initialsOf = (name: string) =>
  name
    .split(/\s|_/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("") || "?";

const BookingChat = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { messages, loading, isConnected, sendMessage, currentUserId } =
    usePaymentChat({ paymentId: bookingId });

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const ok = sendMessage(text);
    if (ok) setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Identify the "other" participant for header (first sender that isn't me)
  const otherParticipant = messages.find(
    (m) => String(m.sender_id) !== String(currentUserId ?? user?.id)
  );
  const headerName = otherParticipant?.sender_username || "Conversación";
  const headerAvatar = otherParticipant?.sender_avatar || "";

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-3 py-2.5 border-b border-border bg-card shadow-sm safe-top shrink-0">
        <Button variant="ghost" size="icon" className="shrink-0" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={headerAvatar} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
            {initialsOf(headerName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{headerName}</p>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isConnected ? "bg-primary" : "bg-muted-foreground/40"
              }`}
            />
            <span className="text-xs text-muted-foreground">
              {isConnected ? "En línea" : "Conectando..."}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </header>

      {/* Booking context banner */}
      <div className="px-4 py-2 bg-primary/5 border-b border-border flex items-center gap-2 shrink-0">
        <MapPin className="w-4 h-4 text-primary shrink-0" />
        <p className="text-xs text-muted-foreground truncate">
          Reserva <span className="font-medium text-foreground">#{bookingId?.slice(0, 8)}</span> — Coordina los detalles
        </p>
        <Badge variant="outline" className="text-[10px] ml-auto shrink-0 border-primary/30 text-primary">
          {isConnected ? "Activa" : "Offline"}
        </Badge>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-2/3 rounded-2xl" />
            <Skeleton className="h-12 w-1/2 rounded-2xl ml-auto" />
            <Skeleton className="h-12 w-3/5 rounded-2xl" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-2 py-12">
            <MapPin className="w-8 h-8 opacity-40" />
            <p className="text-sm">Inicia la conversación con tu ofertante</p>
            <p className="text-xs opacity-70">Coordina punto de encuentro, dudas y logística.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <span className="text-[11px] text-muted-foreground bg-muted/60 px-3 py-1 rounded-full">
                Conversación
              </span>
            </div>
            {messages.map((msg) => {
              const isUser = String(msg.sender_id) === String(currentUserId ?? user?.id);
              const ts = new Date(msg.created_at);
              return (
                <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
                      isUser
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    {!isUser && (
                      <p className="text-[11px] font-semibold text-primary mb-0.5">
                        {msg.sender_username}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.message}
                    </p>
                    <div
                      className={`flex items-center gap-1 mt-1 ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span
                        className={`text-[10px] ${
                          isUser ? "text-primary-foreground/60" : "text-muted-foreground"
                        }`}
                      >
                        {formatTime(ts)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Input bar */}
      <div className="px-3 py-2.5 border-t border-border bg-card safe-bottom shrink-0">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground"
            disabled
          >
            <ImageIcon className="w-5 h-5" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isConnected ? "Escribe un mensaje..." : "Conectando al chat..."}
            disabled={!isConnected}
            className="flex-1 rounded-full bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/30"
          />
          <Button
            size="icon"
            className="shrink-0 rounded-full"
            disabled={!input.trim() || !isConnected}
            onClick={handleSend}
          >
            {isConnected ? <Send className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingChat;
