import { NavLink, useLocation } from "react-router-dom";
import { Home, MapPin, Activity, User } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/nearby", icon: MapPin, label: "Nearby" },
  { path: "/activity", icon: Activity, label: "Activity" },
  { path: "/profile", icon: User, label: "Profile" },
];

const BottomNav = () => {
  const location = useLocation();
  
  // Hide nav on login and running screens
  if (["/login", "/running"].includes(location.pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur-lg safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-5">
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink
              key={path}
              to={path}
              className="flex flex-col items-center gap-1 min-w-[48px] min-h-[48px] justify-center btn-press"
            >
              <div className="relative">
                <Icon
                  size={22}
                  className={isActive ? "text-primary" : "text-muted-foreground"}
                />
                {isActive && (
                  <motion.div
                    layoutId="nav-dot"
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
