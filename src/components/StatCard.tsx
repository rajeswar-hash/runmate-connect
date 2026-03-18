import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
}

const StatCard = ({ label, value, unit }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card rounded-lg p-4 flex flex-col gap-1"
  >
    <span className="font-label text-muted-foreground">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className="font-mono-stats text-3xl text-foreground">{value}</span>
      {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
    </div>
  </motion.div>
);

export default StatCard;
