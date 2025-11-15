import { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, Signal, Wifi, Users, Navigation, Search as SearchIcon } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { busStore, fetchBuses, subscribeToPassengerStore, BusSnapshot } from "@/lib/passengerStore";

const trendingStops = ["Ratna Park", "Koteshwor", "Kalanki", "Gongabu", "Chabahil"];

const occupancyColors: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-700 border-emerald-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  high: "bg-rose-100 text-rose-700 border-rose-200",
};

const PassengerSearch = () => {
  const [query, setQuery] = useState("");
  const [allBuses, setAllBuses] = useState<BusSnapshot[]>(busStore.buses);

  useEffect(() => {
    fetchBuses();
    const unsubscribe = subscribeToPassengerStore(() => {
      setAllBuses(busStore.buses);
    });
    return unsubscribe;
  }, []);

  const filteredBuses = useMemo(() => {
    return allBuses
      .filter((bus) => {
        if (!query.trim()) return true;
        const term = query.toLowerCase();
        return (
          bus.route.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  }, [query, allBuses]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="gradient-yatri text-white p-6 shadow-lg">
        <div className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-white/70">Smart search</p>
            <h1 className="text-3xl font-semibold">Find buses running near you</h1>
            <p className="text-white/80 text-sm">Filtered by live status, proximity, and amenities.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
                <Input
                  placeholder="Search by route, stop, or destination"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 bg-white/90 text-foreground"
                />
              </div>
              <Button className="bg-white text-primary hover:bg-white/90">Nearby buses</Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {trendingStops.map((stop) => (
                <button
                  key={stop}
                  onClick={() => setQuery(stop)}
                  className="text-xs uppercase tracking-[0.35em] px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20"
                >
                  {stop}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Available nearby</h2>
            <p className="text-sm text-muted-foreground">
              {filteredBuses.length} {filteredBuses.length === 1 ? "bus" : "buses"} online within 3 km radius.
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Navigation className="w-4 h-4" /> Map view
          </Button>
        </div>

        {filteredBuses.length === 0 ? (
          <Card className="p-8 text-center">
            <SearchIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold">No buses match “{query}”.</p>
            <p className="text-sm text-muted-foreground">Try a different stop or clear the filters.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredBuses.map((bus) => (
              <Card key={bus.id} className="p-4 border border-border/70 bg-card/90 backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">{bus.route}</h3>
                      <Badge className="rounded-full bg-primary/10 text-primary border-primary/30">#{bus.number}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" /> {bus.route}
                    </p>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> ETA {bus.eta}
                      </span>
                      <span className="flex items-center gap-1">
                        <Navigation className="w-4 h-4" /> {bus.distance} away
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" /> {bus.seats} seats left
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`rounded-full text-xs ${occupancyColors[bus.occupancy]}`}>
                      {bus.occupancy} occupancy
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button variant="outline" className="text-primary border-primary/40">
                    Notify driver
                  </Button>
                  <Button>
                    View live map
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <BottomNav role="passenger" />
    </div>
  );
};

export default PassengerSearch;
