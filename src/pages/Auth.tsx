import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "passenger";
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSubmit = () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isLogin && !name) {
      toast.error("Please enter your name");
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
            <div className="text-5xl font-bold text-primary mx-auto">
              म <span className="font-normal">Yatri</span>
            </div>
            <div>
              <CardTitle className="text-2xl">{getRoleTitle()} {isLogin ? "Login" : "Sign Up"}</CardTitle>
              <CardDescription>
                {isLogin ? "Welcome back!" : "Create your account"}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {/* Name field for signup */}
              {!isLogin && (
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

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Action Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmit}
              >
                {isLogin ? "Login" : "Sign Up"}
              </Button>

              {/* Toggle Login/Signup */}
              <div className="text-center text-sm">
                {isLogin ? (
                  <p>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setIsLogin(false)}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign Up
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <button
                      onClick={() => setIsLogin(true)}
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
