import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon?: ReactNode;
}

const StatCard = ({ label, value, unit, icon }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card rounded-lg p-3 flex flex-col gap-0.5"
  >
    <div className="flex items-center gap-1">
      {icon}
      <span className="font-label text-muted-foreground">{label}</span>
    </div>
    <div className="flex items-baseline gap-0.5">
      <span className="font-mono-stats text-xl sm:text-2xl text-foreground">{value}</span>
      {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
    </div>
  </motion.div>
);

export default StatCard;
