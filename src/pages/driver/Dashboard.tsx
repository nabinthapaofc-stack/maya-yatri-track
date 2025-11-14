import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { MapPin, DollarSign, Clock, Users, TrendingUp, Menu, User, MessageSquare } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [isOnDuty, setIsOnDuty] = useState(false);

  const todayStats = {
    trips: 8,
    earnings: 2400,
    hours: 6.5,
    passengers: 142,
  };

  const pendingRequests = [
    { id: 1, name: "Ramesh K.", pickup: "Chabahil", time: "2 min ago" },
    { id: 2, name: "Sita M.", pickup: "Koteshwor", time: "5 min ago" },
  ];

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
              <h1 className="text-xl font-bold">Driver Panel</h1>
              <p className="text-sm text-white/80">Bus #001 - Ring Road</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <User className="w-5 h-5" />
          </Button>
        </div>

        {/* Duty Status Toggle */}
        <Card className="bg-white/10 backdrop-blur border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Service Status</p>
              <p className="text-sm text-white/80">
                {isOnDuty ? "You are currently on duty" : "You are offline"}
              </p>
            </div>
            <Switch
              checked={isOnDuty}
              onCheckedChange={setIsOnDuty}
              className="data-[state=checked]:bg-white"
            />
          </div>
        </Card>
      </header>

      {/* Today's Stats */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-3">Today's Performance</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{todayStats.trips}</div>
                <div className="text-xs text-muted-foreground">Trips</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">Rs {todayStats.earnings}</div>
                <div className="text-xs text-muted-foreground">Earnings</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold">{todayStats.hours}h</div>
                <div className="text-xs text-muted-foreground">Hours</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">{todayStats.passengers}</div>
                <div className="text-xs text-muted-foreground">Passengers</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Passenger Join Requests */}
      {isOnDuty && pendingRequests.length > 0 && (
        <section className="px-4 pb-4">
          <h2 className="text-lg font-semibold mb-3">Passenger Requests</h2>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <Card key={request.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{request.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{request.pickup}</span>
                        <span>•</span>
                        <span>{request.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Decline
                    </Button>
                    <Button size="sm">Accept</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="px-4 pb-4">
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => navigate("/driver/earnings")}
          >
            <TrendingUp className="w-5 h-5" />
            <span>View Earnings</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => navigate("/driver/messages")}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Messages</span>
          </Button>
        </div>
      </section>

      {/* Current Route Map Placeholder */}
      {isOnDuty && (
        <section className="px-4 pb-4">
          <h2 className="text-lg font-semibold mb-3">Your Route</h2>
          <Card className="h-48 flex items-center justify-center bg-gradient-to-br from-accent/20 to-primary/10">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-2 animate-pulse" />
              <p className="text-muted-foreground">Live route tracking</p>
            </div>
          </Card>
        </section>
      )}

      {/* Bottom Navigation */}
      <BottomNav role="driver" />
    </div>
  );
};

export default DriverDashboard;
