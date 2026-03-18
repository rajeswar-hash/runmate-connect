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

  if (["/login", "/running"].includes(location.pathname) || location.pathname.startsWith("/chat")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto px-4 pb-[env(safe-area-inset-bottom,0px)]">
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink
              key={path}
              to={path}
              className="flex flex-col items-center gap-0.5 min-w-[48px] min-h-[48px] justify-center btn-press"
            >
              <div className="relative">
                <Icon size={20} className={isActive ? "text-primary" : "text-muted-foreground"} />
                {isActive && (
                  <motion.div
                    layoutId="nav-dot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
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
