import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bus, Users, Shield, TrendingUp } from "lucide-react";
import yatriLogo from "@/assets/yatri-logo.png";
import heroBg from "@/assets/hero-bg.png";

const Index = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Logo animation delay
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 800);
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
            <div className="mb-8 animate-scale-in">
              <img
                src={yatriLogo}
                alt="म Yatri"
                className="w-32 h-32 md:w-40 md:h-40 drop-shadow-lg"
              />
            </div>

            {showContent && (
              <>
                {/* Title */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 animate-slide-up">
                  म Yatri
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                  मेरो यात्रा, सजिलो यात्रा
                </p>
                <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl animate-slide-up" style={{ animationDelay: "0.2s" }}>
                  Smart, Safe & Real-time Public Transportation for Nepal
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 shadow-lg text-lg px-8 py-6"
                    onClick={() => navigate("/auth?role=passenger")}
                  >
                    I'm a Passenger
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                    onClick={() => navigate("/auth?role=driver")}
                  >
                    I'm a Driver
                  </Button>
                </div>

                {/* Admin Link */}
                <button
                  onClick={() => navigate("/auth?role=admin")}
                  className="text-white/70 hover:text-white underline text-sm animate-fade-in"
                  style={{ animationDelay: "0.4s" }}
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

      {/* Stats Section */}
      <section className="py-20 gradient-yatri-subtle">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Active Buses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Happy Passengers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Real-time Support</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Driver Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 म Yatri. Making Nepal's transportation smarter, safer, and more reliable.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
