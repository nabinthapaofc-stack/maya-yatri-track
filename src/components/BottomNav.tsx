import { useNavigate, useLocation } from "react-router-dom";
import { Home, Search, History, MessageSquare, User, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  role: "passenger" | "driver";
}

const BottomNav = ({ role }: BottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const passengerNavItems = [
    { icon: Home, label: "Home", path: "/passenger/dashboard" },
    { icon: Search, label: "Search", path: "/passenger/search" },
    { icon: History, label: "History", path: "/passenger/history" },
    { icon: MessageSquare, label: "Messages", path: "/passenger/messages" },
    { icon: User, label: "Profile", path: "/passenger/profile" },
  ];

  const driverNavItems = [
    { icon: Home, label: "Home", path: "/driver/dashboard" },
    { icon: Users, label: "Passengers", path: "/driver/passengers" },
    { icon: TrendingUp, label: "Earnings", path: "/driver/earnings" },
    { icon: MessageSquare, label: "Messages", path: "/driver/messages" },
    { icon: User, label: "Profile", path: "/driver/profile" },
  ];

  const navItems = role === "passenger" ? passengerNavItems : driverNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "fill-current")} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
