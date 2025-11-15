import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, BusFront, AlertCircle } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import {
  PassengerHistoryEntry,
  getPassengerHistory,
  subscribeToPassengerStore,
  clearPassengerData,
} from "@/lib/passengerStore";
import { toast } from "@/components/ui/use-toast";

const statusConfig: Record<PassengerHistoryEntry["status"], { label: string; badge: string }> = {
  pending: {
    label: "Awaiting driver",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
  },
  acknowledged: {
    label: "Driver acknowledged",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  completed: {
    label: "Trip completed",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    month: "short",
    day: "numeric",
  });
};

const PassengerHistory = () => {
  const [history, setHistory] = useState<PassengerHistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getPassengerHistory());
    const unsubscribe = subscribeToPassengerStore(() => {
      setHistory(getPassengerHistory());
    });
    return unsubscribe;
  }, []);

  const handleClearHistory = () => {
    clearPassengerData();
    toast({
      title: "History cleared",
      description: "Your previous driver requests have been removed.",
    });
  };

  const hasHistory = history.length > 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-primary/70">Passenger timeline</p>
            <h1 className="text-2xl font-bold text-foreground">Recent driver pings</h1>
          </div>
          {hasHistory && (
            <Button variant="ghost" onClick={handleClearHistory} className="text-sm">
              Clear
            </Button>
          )}
        </div>

        {!hasHistory ? (
          <Card className="p-8 text-center border-dashed border-2 border-border/70 bg-muted/40">
            <BusFront className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-lg font-semibold">No requests yet</p>
            <p className="text-sm text-muted-foreground">
              Tap “Tell the Driver” from any bus card to let the crew know you are waiting.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((entry) => {
              const status = statusConfig[entry.status];
              return (
                <Card key={entry.requestId} className="relative overflow-hidden border border-border/70 bg-card/90 backdrop-blur">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent" />
                  <div className="relative p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">Route</p>
                        <h2 className="text-xl font-semibold text-foreground">{entry.route}</h2>
                        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" /> {entry.distance} from you
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge className="rounded-full border border-primary/20 bg-primary/10 text-primary font-semibold px-3 py-1">
                          Bus #{entry.number}
                        </Badge>
                        <Badge className={`rounded-full border capitalize px-3 py-1 text-xs font-semibold ${status.badge}`}>
                          {status.label}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-sm text-muted-foreground">
                      <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
                        <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground/70">Seats</p>
                        <p className="text-lg font-semibold text-foreground">{entry.seats}</p>
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
                        <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground/70">ETA</p>
                        <p className="text-lg font-semibold text-foreground">{entry.eta}</p>
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
                        <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground/70">Occupancy</p>
                        <p className="text-lg font-semibold text-foreground capitalize">{entry.occupancy}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Notified at {formatTime(entry.requestedAt)}
                      </span>
                      {entry.status === "pending" && (
                        <span className="flex items-center gap-1 text-amber-600">
                          <AlertCircle className="w-4 h-4" /> Waiting for driver
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <BottomNav role="passenger" />
    </div>
  );
};

export default PassengerHistory;
