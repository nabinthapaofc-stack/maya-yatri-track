import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { MapPin, DollarSign, Clock, Users, TrendingUp, Menu, User, MessageSquare, CheckCircle2, XCircle } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import {
  DriverRequest,
  getDriverRequests,
  subscribeToPassengerStore,
  updateDriverRequestStatus,
} from "@/lib/passengerStore";
import { cn } from "@/lib/utils";
import { getAuthUser } from "@/lib/authSession";
import { fetchDriverProfile, registerDriverAndBus, DriverServiceError } from "@/services/driverService";
import type { DriverProfileResponse } from "@/services/driverService";
import { toast } from "@/components/ui/use-toast";
import { signOut } from "@/services/authService";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(() => getAuthUser());
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [driverRequests, setDriverRequests] = useState<DriverRequest[]>([]);
  const [profile, setProfile] = useState<DriverProfileResponse | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: authUser?.name ?? "",
    email: authUser?.email ?? "",
    phone: "",
    licenseNumber: "",
    busName: "",
    companyName: "",
    route: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  useEffect(() => {
    setDriverRequests(getDriverRequests());
    const unsubscribe = subscribeToPassengerStore(() => {
      setDriverRequests(getDriverRequests());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!authUser || authUser.role !== "driver") {
      setProfileLoading(false);
      return;
    }
    const loadProfile = async () => {
      setProfileLoading(true);
      setProfileError(null);
      try {
        const data = await fetchDriverProfile(authUser.id);
        setProfile(data);
      } catch (error) {
        const message = error instanceof DriverServiceError ? error.message : "Unable to load driver profile.";
        setProfileError(message);
      } finally {
        setProfileLoading(false);
      }
    };
    void loadProfile();
  }, [authUser]);

  useEffect(() => {
    if (!authUser) {
      setAuthUser(getAuthUser());
    }
  }, [authUser]);

  useEffect(() => {
    if (authUser) {
      setFormData((prev) => ({
        ...prev,
        name: authUser.name ?? prev.name,
        email: authUser.email ?? prev.email,
      }));
    }
  }, [authUser]);

  const todayStats = {
    trips: 0,
    earnings: 0,
    hours: 0,
    passengers: 0,
  };

  const handleRespond = (requestId: string, nextStatus: DriverRequest["status"]) => {
    updateDriverRequestStatus(requestId, nextStatus);
  };

  const primaryBus = profile?.buses?.[0] ?? null;
  const busStatus = primaryBus?.status ?? "pending";
  const isApproved = busStatus === "approved";
  const isRejected = busStatus === "rejected";

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegistration = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authUser) return;
    setSubmitting(true);
    try {
      await registerDriverAndBus({
        userId: authUser.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        licenseNumber: formData.licenseNumber,
        busName: formData.busName,
        companyName: formData.companyName,
        route: formData.route,
      });
      toast({ title: "Registration submitted", description: "Your details were sent for admin approval." });
      const refreshed = await fetchDriverProfile(authUser.id);
      setProfile(refreshed);
    } catch (error) {
      const message = error instanceof DriverServiceError ? error.message : "Unable to submit registration.";
      toast({ title: "Registration failed", description: message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const renderRegistrationForm = () => (
    <section className="p-4">
      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-primary/70">Driver onboarding</p>
          <h2 className="text-2xl font-semibold">Register your bus once</h2>
          <p className="text-muted-foreground text-sm">
            Provide your license and vehicle details. Admins will verify and notify you via email once approved.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleRegistration}>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="driver-name">Full Name</Label>
              <Input
                id="driver-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driver-email">Email</Label>
              <Input id="driver-email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driver-phone">Phone</Label>
              <Input id="driver-phone" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license-number">License Number</Label>
              <Input
                id="license-number"
                value={formData.licenseNumber}
                onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bus-name">Bus Name</Label>
              <Input id="bus-name" value={formData.busName} onChange={(e) => handleInputChange("busName", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="route">Route Description</Label>
            <Textarea
              id="route"
              value={formData.route}
              onChange={(e) => handleInputChange("route", e.target.value)}
              placeholder="e.g., Gongabu → Chabahil via Maharajgunj"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit for approval"}
          </Button>
        </form>
      </Card>
    </section>
  );

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <Card className="p-8 text-center space-y-4">
          <p className="text-lg font-semibold">Please log in as a driver to continue.</p>
          <Button onClick={() => navigate("/auth?role=driver")}>Go to Driver Login</Button>
        </Card>
      </div>
    );
  }

  if (authUser.role !== "driver") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <Card className="p-8 text-center space-y-2">
          <p className="text-lg font-semibold">This area is for driver accounts only.</p>
        </Card>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading your driver dashboard…</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="gradient-yatri text-white p-6 shadow-lg">
          <h1 className="text-2xl font-bold">Welcome, {formData.name || "Driver"}</h1>
          <p className="text-white/80">Complete your registration to start receiving passengers.</p>
        </header>
        {profileError && (
          <div className="px-4 pt-4">
            <Card className="border-red-200 bg-red-50 text-red-700 p-4 text-sm">{profileError}</Card>
          </div>
        )}
        {renderRegistrationForm()}
        <BottomNav role="driver" />
      </div>
    );
  }

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
              {primaryBus ? (
                <p className="text-sm text-white/80">
                  Bus {primaryBus.bus_name} · {primaryBus.route}
                </p>
              ) : (
                <p className="text-sm text-white/80">Registration submitted</p>
              )}
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

      <section className="p-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Bus status</p>
            <p className="text-2xl font-semibold capitalize">{busStatus}</p>
            {isApproved ? (
              <p className="text-sm text-muted-foreground">You are live on the passenger map.</p>
            ) : isRejected ? (
              <p className="text-sm text-muted-foreground">Please contact admin to update your documents.</p>
            ) : (
              <p className="text-sm text-muted-foreground">Admins will review your submission shortly.</p>
            )}
          </div>
          {isApproved ? (
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          ) : isRejected ? (
            <XCircle className="w-12 h-12 text-red-500" />
          ) : (
            <Clock className="w-12 h-12 text-amber-500" />
          )}
        </Card>
      </section>

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
      <section className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Passenger Requests</h2>
          {!isOnDuty && driverRequests.length > 0 && (
            <Badge className="bg-amber-100 text-amber-700 border-amber-200">Go on duty</Badge>
          )}
        </div>
        {!isApproved ? (
          <Card className="p-6 text-center text-muted-foreground border-dashed border-2 border-border/70">
            <User className="w-12 h-12 text-primary mx-auto mb-3" />
            <p>Passenger pings unlock once your bus is approved.</p>
          </Card>
        ) : driverRequests.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground border-dashed border-2 border-border/70">
            <User className="w-12 h-12 text-primary mx-auto mb-3" />
            <p>No passenger pings yet. Stay online to receive alerts.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {driverRequests.map((request) => (
              <Card key={request.requestId} className="p-4 border border-border/70 bg-white/90 backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground/70">Route</p>
                    <h3 className="text-lg font-semibold">{request.route}</h3>
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {request.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> ETA {request.eta}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" /> {request.seats} seats left
                      </span>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge className="rounded-full border border-primary/30 bg-primary/10 text-primary px-3 py-1 font-semibold">
                      Bus #{request.number}
                    </Badge>
                    <Badge
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold capitalize",
                        request.status === "pending" && "bg-amber-100 text-amber-700 border-amber-200",
                        request.status === "acknowledged" && "bg-emerald-100 text-emerald-700 border-emerald-200",
                        request.status === "completed" && "bg-slate-100 text-slate-700 border-slate-200",
                      )}
                    >
                      {request.status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={request.status !== "pending"}
                    onClick={() => handleRespond(request.requestId, "acknowledged")}
                  >
                    Acknowledge
                  </Button>
                  <Button
                    size="sm"
                    disabled={request.status === "completed"}
                    onClick={() => handleRespond(request.requestId, "completed")}
                  >
                    Mark Complete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

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
