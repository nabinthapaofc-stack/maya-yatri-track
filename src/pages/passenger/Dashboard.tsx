import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Clock, Users, Navigation, Menu, User, History, AlertCircle } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const PassengerDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock nearby buses
  const nearbyBuses = [
    { id: 1, route: "Ring Road - Chabahil", number: "001", eta: "3 min", distance: "0.5 km", occupancy: "medium", seats: 15 },
    { id: 2, route: "Ratna Park - Kalanki", number: "012", eta: "7 min", distance: "1.2 km", occupancy: "high", seats: 5 },
    { id: 3, route: "Koteshwor - Swayambhu", number: "024", eta: "12 min", distance: "2.1 km", occupancy: "low", seats: 28 },
  ];

  const getOccupancyColor = (occupancy: string) => {
    switch (occupancy) {
      case "low":
        return "bg-success text-success-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "high":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
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
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <User className="w-5 h-5" />
          </Button>
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
      <section className="relative h-64 bg-muted">
        {/* Placeholder for map */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/20 to-primary/10">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-primary mx-auto mb-2 animate-pulse" />
            <p className="text-muted-foreground">Live Map Coming Soon</p>
            <p className="text-sm text-muted-foreground">Real-time bus tracking will appear here</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-white text-primary hover:bg-white/90 shadow-lg"
            onClick={() => navigate("/passenger/trip-planner")}
          >
            <Navigation className="w-4 h-4 mr-2" />
            Plan Trip
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="shadow-lg"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            SOS
          </Button>
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
          {nearbyBuses.map((bus) => (
            <Card
              key={bus.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/passenger/bus/${bus.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="font-mono">
                      {bus.number}
                    </Badge>
                    <Badge className={getOccupancyColor(bus.occupancy)}>
                      {bus.occupancy}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-1">{bus.route}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {bus.eta}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {bus.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {bus.seats} seats
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">12</div>
            <div className="text-xs text-muted-foreground">Total Trips</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">Rs 450</div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">4.8⭐</div>
            <div className="text-xs text-muted-foreground">Avg Rating</div>
          </Card>
        </div>
      </section>

      {/* Bottom Navigation */}
      <BottomNav role="passenger" />
    </div>
  );
};

export default PassengerDashboard;
