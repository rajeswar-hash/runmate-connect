import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

const mockRunners = [
  { id: 1, name: "Alex K.", distance: "0.8 km", pace: "4'52\"/km", x: 35, y: 30 },
  { id: 2, name: "Sarah M.", distance: "1.2 km", pace: "5'15\"/km", x: 65, y: 45 },
  { id: 3, name: "James L.", distance: "2.1 km", pace: "6'02\"/km", x: 50, y: 70 },
  { id: 4, name: "Nina R.", distance: "0.4 km", pace: "4'30\"/km", x: 25, y: 55 },
  { id: 5, name: "Tom W.", distance: "3.5 km", pace: "5'45\"/km", x: 75, y: 25 },
];

const NearbyScreen = () => {
  const [selectedRunner, setSelectedRunner] = useState<typeof mockRunners[0] | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-2xl font-bold text-foreground">Nearby Runners</h1>
        <p className="text-sm text-muted-foreground mt-1">5 runners within 10 km</p>
      </div>

      {/* Map */}
      <div className="flex-1 mx-5 rounded-lg bg-secondary relative min-h-[50vh] overflow-hidden">
        {/* Grid overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke="currentColor" className="text-foreground" />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`v${i}`} x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%" stroke="currentColor" className="text-foreground" />
          ))}
        </svg>

        {/* User dot */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-4 h-4 rounded-full bg-accent border-2 border-foreground" />
          <div className="absolute inset-0 w-4 h-4 rounded-full bg-accent animate-pulse-ring" />
        </div>

        {/* Runner markers */}
        {mockRunners.map((runner) => (
          <motion.button
            key={runner.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: runner.id * 0.1, type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => setSelectedRunner(runner)}
            className="absolute z-20 btn-press"
            style={{ left: `${runner.x}%`, top: `${runner.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <div className="w-3 h-3 rounded-full bg-primary" />
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-primary animate-pulse-ring" />
          </motion.button>
        ))}
      </div>

      {/* Runner Bottom Sheet */}
      {selectedRunner && (
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="mx-5 mt-4 glass-card rounded-lg p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">{selectedRunner.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedRunner.distance} away</p>
            </div>
            <div className="text-right">
              <span className="font-mono-stats text-primary text-lg">{selectedRunner.pace}</span>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="flex-1 h-12 rounded-lg bg-primary text-primary-foreground font-semibold btn-press flex items-center justify-center gap-2">
              <MessageCircle size={18} />
              Request Chat
            </button>
            <button
              onClick={() => setSelectedRunner(null)}
              className="h-12 px-4 rounded-lg bg-secondary text-secondary-foreground font-medium btn-press"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NearbyScreen;
