import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import yatriLogo from "@/assets/yatri-logo.png";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "passenger";
  
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [name, setName] = useState("");

  const getRoleTitle = () => {
    switch (role) {
      case "passenger":
        return "Passenger";
      case "driver":
        return "Driver";
      case "admin":
        return "Admin";
      default:
        return "User";
    }
  };

  const handleSendOTP = () => {
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    // Simulate OTP send
    setShowOtp(true);
    toast.success("OTP sent to your phone!");
  };

  const handleVerifyOTP = () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    // Simulate successful login/signup
    toast.success(`Welcome to म Yatri!`);
    
    // Navigate based on role
    switch (role) {
      case "passenger":
        navigate("/passenger/dashboard");
        break;
      case "driver":
        navigate("/driver/dashboard");
        break;
      case "admin":
        navigate("/admin/dashboard");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-yatri-subtle">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-lg">
          <CardHeader className="space-y-4 text-center pb-4">
            <img
              src={yatriLogo}
              alt="म Yatri"
              className="w-20 h-20 mx-auto"
            />
            <div>
              <CardTitle className="text-2xl">{getRoleTitle()} {isLogin ? "Login" : "Sign Up"}</CardTitle>
              <CardDescription>
                {isLogin ? "Welcome back!" : "Create your account"} Enter your phone number to continue
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {/* Name field for signup */}
              {!isLogin && !showOtp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              {/* Phone Input */}
              {!showOtp && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="98XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10}
                  />
                </div>
              )}

              {/* OTP Input */}
              {showOtp && (
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                  <p className="text-sm text-muted-foreground">
                    OTP sent to +977 {phone}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={showOtp ? handleVerifyOTP : handleSendOTP}
              >
                {showOtp ? "Verify OTP" : "Send OTP"}
              </Button>

              {/* Toggle Login/Signup */}
              <div className="text-center text-sm">
                {isLogin ? (
                  <p>
                    Don't have an account?{" "}
                    <button
                      onClick={() => {
                        setIsLogin(false);
                        setShowOtp(false);
                      }}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign Up
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <button
                      onClick={() => {
                        setIsLogin(true);
                        setShowOtp(false);
                      }}
                      className="text-primary hover:underline font-medium"
                    >
                      Login
                    </button>
                  </p>
                )}
              </div>

              {/* Driver/Admin Additional Info */}
              {role !== "passenger" && !isLogin && (
                <div className="mt-4 p-4 bg-accent/20 rounded-lg border border-accent">
                  <p className="text-sm text-accent-foreground">
                    <strong>Note:</strong> {role === "driver" ? "Driver accounts require document verification before activation." : "Admin access requires authorization from transport authorities."}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
