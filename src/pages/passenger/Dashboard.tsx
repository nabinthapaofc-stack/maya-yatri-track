import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { MapPin, Search, Clock, Users, Navigation, Menu, User, AlertCircle } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import PassengerMap from "@/components/PassengerMap";
import { cn } from "@/lib/utils";
import { recordPassengerRequest, BusSnapshot, busStore, fetchBuses, subscribeToPassengerStore } from "@/lib/passengerStore";
import { toast } from "@/components/ui/use-toast";
import ChatWidget from "@/components/ChatWidget";
import { signOut } from "@/services/authService";

const PassengerDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sendingBusId, setSendingBusId] = useState<number | null>(null);
  const [nearbyBuses, setNearbyBuses] = useState<BusSnapshot[]>(busStore.buses);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  useEffect(() => {
    fetchBuses();
    const unsubscribe = subscribeToPassengerStore(() => {
      setNearbyBuses(busStore.buses);
    });
    return unsubscribe;
  }, []);

  const mapCenter: [number, number] = [27.7172, 85.324];

  const mapBuses = nearbyBuses.map((bus) => ({
    id: bus.id,
    label: `Bus ${bus.number}`,
    route: bus.route,
    eta: bus.eta,
    position: bus.coordinates,
  }));

  type OccupancyLevel = "low" | "medium" | "high";

  const occupancyStyleMap: Record<OccupancyLevel, { badge: string; bar: string; percent: string }> = {
    low: {
      badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
      bar: "bg-emerald-500",
      percent: "35%",
    },
    medium: {
      badge: "bg-amber-100 text-amber-700 border-amber-200",
      bar: "bg-amber-500",
      percent: "65%",
    },
    high: {
      badge: "bg-rose-100 text-rose-700 border-rose-200",
      bar: "bg-rose-500",
      percent: "90%",
    },
  };

  const getOccupancyStyles = (occupancy: string) => {
    return occupancyStyleMap[(occupancy as OccupancyLevel) || "medium"] ?? occupancyStyleMap.medium;
  };

  const handleTellDriver = (bus: BusSnapshot) => {
    if (sendingBusId) return;

    setSendingBusId(bus.id);
    const snapshot: BusSnapshot = {
      id: bus.id,
      route: bus.route,
      number: bus.number,
      eta: bus.eta,
      distance: bus.distance,
      occupancy: bus.occupancy,
      seats: bus.seats,
      driverId: bus.driverId,
      driverName: bus.driverName,
      coordinates: bus.coordinates,
    };

    recordPassengerRequest(snapshot);
    toast({
      title: "Driver notified",
      description: `${bus.route} has received your ping. Please be ready at the stop.`,
    });

    setTimeout(() => setSendingBusId(null), 600);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="gradient-yatri text-white p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">म Yatri</h1>
              <p className="text-sm text-white/80">Welcome back!</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by route or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
      </header>

      {/* Map Section */}
      <section className="p-4">
        <div className="relative">
          <PassengerMap center={mapCenter} buses={mapBuses} />

          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Live buses</p>
            <p className="text-2xl font-semibold text-primary">{nearbyBuses.length}</p>
            <p className="text-xs text-muted-foreground">around Kathmandu right now</p>
          </div>

          <div className="absolute top-4 right-4 bg-primary text-white rounded-2xl p-4 shadow-lg">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">Next Arrival</p>
            <p className="text-xl font-semibold">{nearbyBuses.length > 0 ? nearbyBuses[0].eta : 'N/A'}</p>
            <p className="text-xs text-white/80">{nearbyBuses.length > 0 ? nearbyBuses[0].route : 'No buses nearby'}</p>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row gap-2">
            <Button
              size="sm"
              className="flex-1 bg-white text-primary hover:bg-white/90 shadow-lg"
              onClick={() => navigate("/passenger/trip-planner")}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Plan Trip
            </Button>
            <Button size="sm" variant="destructive" className="shadow-lg">
              <AlertCircle className="w-4 h-4 mr-2" />
              SOS
            </Button>
          </div>
        </div>
      </section>

      {/* Nearby Buses */}
      <section className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Nearby Buses</h2>
          <Button variant="link" size="sm" className="text-primary">
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {nearbyBuses.map((bus) => {
            const occupancyStyles = getOccupancyStyles(bus.occupancy);

            return (
              <Card
                key={bus.id}
                className="group relative overflow-hidden rounded-3xl border border-border/70 bg-white/80 p-5 shadow-sm backdrop-blur"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative space-y-5">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground/70">Route</p>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900">{bus.route}</h3>
                      <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {bus.distance} away
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 text-sm">
                      <Badge className="rounded-full border border-primary/30 bg-white/80 px-3 py-1 font-semibold text-primary shadow-sm">
                        #{bus.number}
                      </Badge>
                      <Badge className="rounded-full bg-primary text-white px-3 py-1 text-xs font-semibold tracking-wide shadow-sm">
                        ETA {bus.eta}
                      </Badge>
                      <Badge className={cn("rounded-full border px-3 py-1 text-xs font-semibold capitalize", occupancyStyles.badge)}>
                        {bus.occupancy}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-sm text-muted-foreground">
                    <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
                      <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground/70">Seats Left</p>
                      <p className="text-xl font-semibold text-gray-900">{bus.seats}</p>
                      <p className="text-xs">available now</p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
                      <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground/70">Next Stop</p>
                      <p className="text-xl font-semibold text-gray-900">{bus.eta}</p>
                      <p className="text-xs">ETA window</p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
                      <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground/70">Distance</p>
                      <p className="text-xl font-semibold text-gray-900">{bus.distance}</p>
                      <p className="text-xs">from you</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-muted-foreground/70">
                      <span>Occupancy</span>
                      <span className="tracking-normal text-sm font-semibold text-foreground capitalize">{bus.occupancy}</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted/70">
                      <div
                        className={cn("h-full rounded-full transition-all", occupancyStyles.bar)}
                        style={{ width: occupancyStyles.percent }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-primary/40 text-primary"
                      disabled={sendingBusId === bus.id}
                      onClick={() => handleTellDriver(bus)}
                    >
                      Tell the Driver
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground"
                      onClick={() => navigate(`/passenger/history`)}
                    >
                      View History
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">0</div>
            <div className="text-xs text-muted-foreground">Total Trips</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">Rs 0</div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">0⭐</div>
            <div className="text-xs text-muted-foreground">Avg Rating</div>
          </Card>
        </div>
      </section>

      {/* Bottom Navigation */}
      <BottomNav role="passenger" />
      <ChatWidget />
    </div>
  );
};

export default PassengerDashboard;