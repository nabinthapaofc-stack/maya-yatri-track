import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bus, Users, Shield, TrendingUp, MessageCircle, MapPin } from "lucide-react";
import heroBg from "@/assets/hero-bg.png";





const Index = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Nepal Transportation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 gradient-yatri opacity-90" />
          
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
          <div className="flex flex-col items-center text-center">
            {/* Logo Animation */}
              <div className="mb-16 animate-scale-in">
              <div className="text-7xl md:text-9xl font-bold text-white drop-shadow-2xl flex items-center gap-3">
                <span>म</span>
                <span className="inline-flex items-center px-4 py-1 rounded-lg bg-yatri-blue text-white shadow-blue text-3xl md:text-5xl">
                  Yatri
                </span>
              </div>
              <p className="text-white/80 text-sm md:text-base mt-4 tracking-widest">
                मेरो यात्रा, सजिलो यात्रा
              </p>
            </div>

            {showContent && (
              <>
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  <Button
                    size="lg"
                    className="bg-yatri-blue text-white hover:bg-yatri-blue-dark shadow-lg text-lg px-8 py-6"
                    onClick={() => navigate("/auth?role=passenger")}
                  >
                    I'm a Passenger
                  </Button>
                  <Button
                    size="lg"
                    className="bg-white text-yatri-blue border border-yatri-blue/20 hover:bg-white/90 text-lg px-8 py-6"
                    onClick={() => navigate("/auth?role=driver")}
                  >
                    I'm a Driver
                  </Button>
                </div>

                {/* Admin Link */}
                <button
                  onClick={() => navigate("/auth?role=admin")}
                  className="text-white/70 hover:text-white underline text-sm animate-fade-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  Admin Login
                </button>
              </>
            )}
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <p className="text-sm uppercase tracking-[0.35em] text-primary font-semibold">
                About म Yatri
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                Building trustful journeys for everyone riding Nepal's public transport
              </h2>
              <p className="text-lg text-muted-foreground">
                म Yatri is a collaborative mobility platform designed for passengers, drivers, and regulators.
                We blend real-time intelligence with community-first design so every ride feels transparent,
                safe, and reliably on-time.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "One-tap updates on arrivals and congestion",
                  "Verified drivers with digital identity",
                  "Connected help desk for emergency escalation",
                  "Insights that help cities plan smarter routes",
                ].map((item) => (
                  <div
                    key={item}
                    className="p-4 rounded-2xl border border-border/60 bg-card/40 backdrop-blur hover:border-primary/50 transition"
                  >
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="relative p-8 rounded-[32px] bg-gradient-to-br from-primary/90 via-primary to-primary/70 text-white shadow-2xl overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -top-6 -left-6 w-32 h-32 border border-white/20 rounded-full" />
                <p className="text-lg leading-relaxed">
                  "When every commuter carries a different story, the technology guiding them has to be as humane
                  as it is smart. म Yatri celebrates local travel culture while simplifying every interaction."
                </p>
                <div className="mt-8">
                  <p className="text-sm uppercase tracking-[0.3em] text-white/70">Mission Statement</p>
                  <p className="text-2xl font-semibold">Simple, safe, and spoken in every route.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-white">
        <div className="absolute inset-0 opacity-40 bg-grid-white/[0.2]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.35em] text-primary font-semibold">
                Why म Yatri was created
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Born from daily commutes, crafted to bridge every communication barrier
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Thousands of Nepalis depend on public buses and vans. Yet, riders rarely know when a vehicle
                will arrive, drivers struggle to relay updates, and complaints vanish inside confusing processes.
                म Yatri emerged to dissolve that silence—bringing passengers, operators, and authorities into one
                synchronized conversation.
              </p>
              <div className="grid gap-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white shadow-sm border border-border/60">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Breaking the communication wall</h3>
                    <p className="text-muted-foreground text-sm">
                      Live announcements, multilingual alerts, and two-way feedback keep every seat in the loop.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white shadow-sm border border-border/60">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Guiding every route with context</h3>
                    <p className="text-muted-foreground text-sm">
                      Smart dispatching and route storytelling ensure public transport feels intuitive, even on the
                      busiest days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[32px] bg-white shadow-2xl border border-border/40 p-8 space-y-6">
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-sm uppercase tracking-[0.4em] text-primary/80">The Origin Moment</p>
                <p className="text-2xl font-semibold text-gray-900 mt-3">
                  "We stood in crowded bus stops, hearing the same question—Where is my ride?"
                </p>
                <p className="text-muted-foreground mt-4">
                  म Yatri was envisioned as the digital conductor that listens, speaks, and guides, so no traveler feels
                  lost between stops again.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-card border border-border/60">
                  <p className="text-sm text-muted-foreground">Community-Coded</p>
                  <p className="text-3xl font-bold text-primary mt-2">Local First</p>
                </div>
                <div className="p-5 rounded-2xl bg-card border border-border/60">
                  <p className="text-sm text-muted-foreground">Future Ready</p>
                  <p className="text-3xl font-bold text-primary mt-2">Scalable</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why Choose म Yatri?
          </h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            Transforming Nepal's public transportation with technology, transparency, and trust
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full gradient-yatri flex items-center justify-center mb-4">
                <Bus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Live Tracking</h3>
              <p className="text-muted-foreground">
                Track buses in real-time with accurate ETAs and route information
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full gradient-yatri flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
              <p className="text-muted-foreground">
                Smart route suggestions and demand predictions for optimal travel
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full gradient-yatri flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe & Verified</h3>
              <p className="text-muted-foreground">
                All drivers verified with license and documents. SOS features for emergencies
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full gradient-yatri flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connected</h3>
              <p className="text-muted-foreground">
                Direct communication between passengers, drivers, and authorities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p> 2024 म Yatri. Making Nepal's transportation smarter, safer, and more reliable.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
