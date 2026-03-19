import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";

const AVATAR_EMOJIS = [
  "🏃", "🏃‍♀️", "🏃‍♂️", "⚡", "🔥", "🌟", "🦁", "🐺",
  "🦅", "🐆", "🎯", "💪", "🏅", "🏆", "👟", "🌈",
  "🚀", "🎽", "💎", "🌊", "🏔️", "🌿", "🐻", "🦊",
];

const AVATAR_COLORS = [
  "72 100% 50%",   // volt/primary
  "210 100% 50%",  // blue
  "0 84% 60%",     // red
  "150 60% 40%",   // green
  "280 80% 55%",   // purple
  "30 100% 50%",   // orange
  "340 80% 55%",   // pink
  "180 60% 40%",   // teal
];

interface AvatarPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (emoji: string, color: string) => void;
  currentEmoji?: string;
  currentColor?: string;
}

const AvatarPicker = ({ open, onClose, onSelect, currentEmoji, currentColor }: AvatarPickerProps) => {
  const [selectedEmoji, setSelectedEmoji] = useState(currentEmoji || "🏃");
  const [selectedColor, setSelectedColor] = useState(currentColor || "72 100% 50%");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="w-full max-w-lg bg-card border-t border-border rounded-t-2xl p-5 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-foreground">Choose Avatar</h3>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center btn-press">
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>

            {/* Preview */}
            <div className="flex justify-center mb-5">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl border-2 transition-colors"
                style={{
                  backgroundColor: `hsl(${selectedColor} / 0.2)`,
                  borderColor: `hsl(${selectedColor})`,
                }}
              >
                {selectedEmoji}
              </div>
            </div>

            {/* Color picker */}
            <span className="font-label text-muted-foreground block mb-2">Color</span>
            <div className="flex gap-2 mb-4">
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className="w-8 h-8 rounded-full btn-press flex items-center justify-center transition-transform"
                  style={{ backgroundColor: `hsl(${c})` }}
                >
                  {c === selectedColor && <Check size={14} className="text-background" />}
                </button>
              ))}
            </div>

            {/* Emoji grid */}
            <span className="font-label text-muted-foreground block mb-2">Icon</span>
            <div className="grid grid-cols-8 gap-2 mb-5">
              {AVATAR_EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setSelectedEmoji(e)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg btn-press transition-colors ${
                    e === selectedEmoji ? "bg-primary/20 ring-1 ring-primary" : "bg-secondary"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>

            <button
              onClick={() => { onSelect(selectedEmoji, selectedColor); onClose(); }}
              className="w-full h-12 rounded-full bg-primary text-primary-foreground font-bold text-sm btn-press active-pulse"
            >
              Save Avatar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AvatarPicker;
