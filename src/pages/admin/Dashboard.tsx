import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { 
  Bus, Users, TrendingUp, AlertCircle, CheckCircle, Clock, 
  Shield, MapPin, Menu, User, FileCheck, XCircle, MailCheck, RefreshCw 
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { getAuthUser } from "@/lib/authSession";
import { cn } from "@/lib/utils";
import { signOut } from "@/services/authService";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const [authUser] = useState(() => getAuthUser());
  const [pendingRequests, setPendingRequests] = useState<PendingBusRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [actingOn, setActingOn] = useState<string | null>(null);

  const stats = {
    totalBuses: 0,
    activeBuses: 0,
    totalDrivers: 0,
    verifiedDrivers: 0,
    pendingVerifications: pendingRequests.length,
    todayTrips: 0,
    activePassengers: 0,
    emergencyAlerts: 0,
  };

  const loadRequests = async () => {
    setLoadingRequests(true);
    setRequestError(null);
    try {
      const data = await fetchPendingBusRequests();
      setPendingRequests(data);
    } catch (error) {
      const message = error instanceof BusServiceError ? error.message : "Unable to load verification requests.";
      setRequestError(message);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    void loadRequests();
  }, []);

  const handleBusDecision = async (busId: string, status: "approved" | "rejected") => {
    setActingOn(busId + status);
    try {
      await updateBusStatus(busId, status);
      toast({
        title: `Bus ${status}`,
        description: status === "approved" ? "Driver will be notified via upcoming email hook." : "Request rejected",
      });
      await loadRequests();
    } catch (error) {
      const message = error instanceof BusServiceError ? error.message : "Unable to update status.";
      toast({ title: "Action failed", description: message, variant: "destructive" });
    } finally {
      setActingOn(null);
    }
  };

  const formattedRequests = useMemo(() => pendingRequests, [pendingRequests]);

  const recentAlerts: { id: number; type: string; bus: string; location: string; time: string; severity: string; }[] = [];

  if (!authUser || authUser.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center space-y-4">
          <p className="text-lg font-semibold">Admin access required.</p>
          <Button onClick={() => navigate("/auth?role=admin")}>Go to Admin Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-yatri text-white p-6 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Admin Control Panel</h1>
                <p className="text-sm text-white/80">म Yatri Transport Management</p>
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

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white/10 backdrop-blur border-white/20 p-4 text-white">
              <div className="flex items-center gap-3">
                <Bus className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">{stats.activeBuses}</div>
                  <div className="text-sm text-white/80">Active Buses</div>
                </div>
              </div>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 p-4 text-white">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">{stats.activePassengers}</div>
                  <div className="text-sm text-white/80">Active Users</div>
                </div>
              </div>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 p-4 text-white">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">{stats.todayTrips}</div>
                  <div className="text-sm text-white/80">Today's Trips</div>
                </div>
              </div>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 p-4 text-white">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">{stats.emergencyAlerts}</div>
                  <div className="text-sm text-white/80">Active Alerts</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="verification">
              Verification
              {stats.pendingVerifications > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {stats.pendingVerifications}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="fleet">Fleet</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Emergency Alerts */}
            {recentAlerts.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Emergency Alerts</h2>
                <div className="space-y-3">
                  {recentAlerts.map((alert) => (
                    <Card key={alert.id} className="p-4 border-l-4 border-l-destructive">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <AlertCircle className="w-6 h-6 text-destructive" />
                          <div>
                            <h3 className="font-semibold">{alert.type}</h3>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span>Bus #{alert.bus}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {alert.location}
                              </span>
                              <span>•</span>
                              <span>{alert.time}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="destructive">Respond</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Live Map Placeholder */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Live Fleet Tracking</h2>
              <Card className="h-96 flex items-center justify-center bg-gradient-to-br from-accent/20 to-primary/10">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-primary mx-auto mb-3 animate-pulse" />
                  <p className="text-lg font-medium text-muted-foreground">Real-time Fleet Map</p>
                  <p className="text-sm text-muted-foreground">All active buses will appear here</p>
                </div>
              </Card>
            </section>
          </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verification" className="space-y-6">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Pending Bus Registrations</h2>
                <div className="flex items-center gap-3">
                  {requestError && <Badge variant="destructive">{requestError}</Badge>}
                  <Badge variant="outline">{stats.pendingVerifications} Pending</Badge>
                  <Button variant="outline" size="icon" onClick={() => void loadRequests()} disabled={loadingRequests}>
                    <RefreshCw className={cn("w-4 h-4", loadingRequests && "animate-spin")} />
                  </Button>
                </div>
              </div>

              {loadingRequests ? (
                <Card className="p-6 text-center text-muted-foreground">Loading requests…</Card>
              ) : formattedRequests.length === 0 ? (
                <Card className="p-6 text-center text-muted-foreground">No pending requests.</Card>
              ) : (
                <div className="space-y-3">
                  {formattedRequests.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <FileCheck className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{item.bus_name}</h3>
                              <p className="text-sm text-muted-foreground">{item.company_name}</p>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                            <p>
                              <strong>Driver:</strong> {item.driver?.name ?? "Unknown"} ({item.driver?.email})
                            </p>
                            <p>
                              <strong>License:</strong> {item.driver?.license_number ?? "-"}
                            </p>
                            <p>
                              <strong>Route:</strong> {item.route}
                            </p>
                            <p>
                              <strong>Submitted:</strong> {new Date(item.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="justify-start"
                            onClick={() => toast({ title: "Driver contact", description: `${item.driver?.email ?? item.driver?.phone ?? "No contact"}` })}
                          >
                            <MailCheck className="w-4 h-4 mr-2" />
                            Contact
                          </Button>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={actingOn === item.id + "rejected"}
                              onClick={() => handleBusDecision(item.id, "rejected")}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              className="bg-success hover:bg-success/90"
                              disabled={actingOn === item.id + "approved"}
                              onClick={() => handleBusDecision(item.id, "approved")}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Driver Statistics */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Driver Statistics</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stats.totalDrivers}</div>
                  <div className="text-muted-foreground">Total Drivers</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-success mb-2">{stats.verifiedDrivers}</div>
                  <div className="text-muted-foreground">Verified Drivers</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-warning mb-2">{stats.pendingVerifications}</div>
                  <div className="text-muted-foreground">Pending Reviews</div>
                </Card>
              </div>
            </section>
          </TabsContent>

          {/* Fleet Tab */}
          <TabsContent value="fleet" className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">Fleet Overview</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Bus Status</h3>
                    <Bus className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Active</span>
                      <span className="font-semibold text-success">{stats.activeBuses}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Idle</span>
                      <span className="font-semibold text-warning">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Offline</span>
                      <span className="font-semibold text-muted-foreground">0</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Route Coverage</h3>
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Routes</span>
                      <span className="font-semibold">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Active Routes</span>
                      <span className="font-semibold text-success">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Coverage</span>
                      <span className="font-semibold text-primary">0%</span>
                    </div>
                  </div>
                </Card>
              </div>
            </section>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
              <Card className="p-6 h-64 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-primary mx-auto mb-3" />
                  <p className="text-muted-foreground">Advanced analytics coming soon</p>
                  <p className="text-sm text-muted-foreground">Passenger heatmaps, demand prediction, and more</p>
                </div>
              </Card>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
