import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  X,
  CornerDownLeft,
  ArrowLeft,
  User,
  Info,
  AlertTriangle,
} from "lucide-react";
import {
  getPassengerHistory,
  subscribeToPassengerStore,
  type PassengerHistoryEntry,
} from "@/lib/passengerStore";
import {
  getChatThreads,
  subscribeToChatStore,
  sendChatMessage,
  type ChatThread,
} from "@/lib/chatStore";
import { DRIVER_DIRECTORY } from "@/data/driverDirectory";
import { cn } from "@/lib/utils";

const COMPLAINT_URL = "https://moha.gov.np/en/complaint";

const emptyMessages: ChatThread["messages"] = [];

interface ChatWidgetProps {
  variant?: "floating" | "page";
}

const ChatWidget = ({ variant = "floating" }: ChatWidgetProps) => {
  const isFloating = variant === "floating";
  const [isOpen, setIsOpen] = useState(variant === "page");
  const [activeDriverId, setActiveDriverId] = useState<string | null>(null);
  const [history, setHistory] = useState<PassengerHistoryEntry[]>([]);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [messageDraft, setMessageDraft] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    setHistory(getPassengerHistory());
    const unsubscribe = subscribeToPassengerStore(() => {
      setHistory(getPassengerHistory());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    setThreads(getChatThreads());
    const unsubscribe = subscribeToChatStore(() => {
      setThreads(getChatThreads());
    });
    return unsubscribe;
  }, []);

  const eligibleDrivers = useMemo(() => {
    const map = new Map<string, { driverId: string; driverName: string; busNumber: string }>();
    history.forEach((entry) => {
      if (entry.driverId && entry.driverName) {
        if (!map.has(entry.driverId)) {
          map.set(entry.driverId, {
            driverId: entry.driverId,
            driverName: entry.driverName,
            busNumber: entry.number,
          });
        }
      }
    });
    return Array.from(map.values());
  }, [history]);

  const activeDriver = activeDriverId
    ? eligibleDrivers.find((driver) => driver.driverId === activeDriverId) ?? null
    : null;

  const driverProfile = activeDriver ? DRIVER_DIRECTORY[activeDriver.driverId] : null;

  const activeThread = activeDriver
    ? threads.find((thread) => thread.driverId === activeDriver.driverId) ?? {
        driverId: activeDriver.driverId,
        driverName: activeDriver.driverName,
        messages: emptyMessages,
      }
    : null;

  const handleSend = () => {
    if (!activeDriver || !messageDraft.trim()) return;
    sendChatMessage({
      driverId: activeDriver.driverId,
      driverName: activeDriver.driverName,
      sender: "passenger",
      text: messageDraft.trim(),
    });
    setMessageDraft("");
  };

  const ComplaintButton = (
    <a
      href={COMPLAINT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 block rounded-xl bg-red-600 text-white text-center font-semibold text-sm py-2 animate-pulse shadow-lg"
    >
      COMPLAIN NOW
    </a>
  );

  if (eligibleDrivers.length === 0) {
    return null;
  }

  return (
    <div className={cn(isFloating ? "fixed bottom-24 right-4 z-50" : "relative w-full") }>
      {isFloating && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 rounded-full bg-primary text-white shadow-blue px-4 py-3"
        >
          <span className="relative">
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400" />
          </span>
          <div className="text-left">
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">Chat</p>
            <p className="text-sm font-semibold">Drivers ({eligibleDrivers.length})</p>
          </div>
        </button>
      )}

      {(isFloating ? isOpen : true) && (
        <div
          className={cn(
            "rounded-3xl bg-white shadow-2xl border border-border/80 overflow-hidden",
            isFloating ? "w-[320px] sm:w-[360px]" : "w-full max-w-xl mx-auto",
          )}
        >
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/70">Direct line</p>
              <p className="text-lg font-semibold">Your Drivers</p>
            </div>
            {isFloating && (
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-white/20">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {!activeDriver && (
            <div className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                Messenger-style chat is available only for buses you've recently ridden.
              </p>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {eligibleDrivers.map((driver) => (
                  <button
                    key={driver.driverId}
                    onClick={() => setActiveDriverId(driver.driverId)}
                    className="w-full flex items-center gap-3 rounded-2xl border border-border/70 p-3 text-left hover:border-primary/40"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                        {driver.driverName.split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{driver.driverName}</p>
                      <p className="text-xs text-muted-foreground">Bus #{driver.busNumber}</p>
                    </div>
                    <MessageCircle className="w-4 h-4 text-primary" />
                  </button>
                ))}
              </div>
              {ComplaintButton}
            </div>
          )}

          {activeDriver && (
            <div className="flex flex-col h-[420px]">
              <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
                <button onClick={() => setActiveDriverId(null)} className="p-2 rounded-full hover:bg-muted">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowProfile(true)}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center">
                    {activeDriver.driverName.split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{activeDriver.driverName}</p>
                    <p className="text-xs text-muted-foreground">Bus #{activeDriver.busNumber}</p>
                  </div>
                </button>
                <button onClick={() => setShowProfile(true)} className="p-2 rounded-full hover:bg-muted">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-muted/30">
                {(activeThread?.messages ?? emptyMessages).length === 0 && (
                  <div className="text-center text-xs text-muted-foreground py-6">
                    Start the conversation with {activeDriver.driverName}.
                  </div>
                )}
                {activeThread?.messages.map((message) => (
                  <div key={message.id} className="flex flex-col">
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                        message.sender === "passenger"
                          ? "self-end bg-primary text-white"
                          : "self-start bg-white border"
                      }`}
                    >
                      {message.text}
                    </div>
                    <span
                      className={cn(
                        "text-[10px] text-muted-foreground mt-1",
                        message.sender === "passenger" ? "self-end text-right" : "self-start text-left",
                      )}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/60 p-3 space-y-2 bg-white">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Write a message…"
                    value={messageDraft}
                    onChange={(e) => setMessageDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <Button onClick={handleSend} size="icon" disabled={!messageDraft.trim()}>
                    <CornerDownLeft className="w-4 h-4" />
                  </Button>
                </div>
                {ComplaintButton}
              </div>
            </div>
          )}
        </div>
      )}

      {showProfile && activeDriver && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-border/60 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">Driver profile</p>
              <button onClick={() => setShowProfile(false)} className="p-2 rounded-full hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl text-white flex items-center justify-center text-xl font-semibold ${
                  driverProfile?.avatarColor ?? "bg-primary"
                }`}
              >
                {activeDriver.driverName.split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <p className="text-xl font-semibold">{driverProfile?.name ?? activeDriver.driverName}</p>
                <p className="text-sm text-muted-foreground">Bus #{driverProfile?.busNumber ?? activeDriver.busNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {driverProfile?.busType ?? "City Service"} · ⭐ {driverProfile?.rating?.toFixed(1) ?? "4.5"}
                </p>
              </div>
            </div>
            <div className="border rounded-2xl p-4 space-y-3 bg-muted/40">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Recent movement</p>
                <div className="mt-2 space-y-2">
                  {(
                    driverProfile?.recentRoutes?.length
                      ? driverProfile.recentRoutes
                      : history
                          .filter((entry) => entry.driverId === activeDriver.driverId)
                          .slice(0, 2)
                          .map((entry) => ({
                            label: entry.route,
                            timestamp: new Date(entry.requestedAt).toLocaleString(),
                          }))
                  ).map((route, index) => (
                    <div key={`${route.label}-${index}`} className="flex items-center justify-between text-sm">
                      <span>{route.label}</span>
                      <span className="text-xs text-muted-foreground">{route.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-primary" />
                <span>
                  Last seen at {driverProfile?.recentLocation ?? "on route"}
                </span>
              </div>
            </div>
            <Button variant="outline" asChild className="w-full">
              <a href={COMPLAINT_URL} target="_blank" rel="noopener noreferrer">
                <AlertTriangle className="w-4 h-4 mr-2" /> Lodge a complaint
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
