import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: number;
  text: string;
  sender: "me" | "them";
  time: string;
}

const mockMessages: Message[] = [
  { id: 1, text: "Hey! Saw you running near the park 🏃", sender: "them", time: "9:41" },
  { id: 2, text: "Yeah! I do my morning runs there. Great route!", sender: "me", time: "9:42" },
  { id: 3, text: "What's your usual pace?", sender: "them", time: "9:42" },
  { id: 4, text: "Around 5'10\"/km, trying to get under 5 min", sender: "me", time: "9:43" },
  { id: 5, text: "Nice! Want to do a run together sometime?", sender: "them", time: "9:44" },
];

const ChatScreen = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      { id: Date.now(), text: input, sender: "me", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);
    setInput("");
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-[max(env(safe-area-inset-top,12px),12px)] pb-3 border-b border-border shrink-0">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full glass-card flex items-center justify-center btn-press">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary flex items-center justify-center shrink-0">
          <span className="font-mono-stats text-xs text-primary">AK</span>
        </div>
        <div>
          <h2 className="font-semibold text-foreground text-sm">Alex K.</h2>
          <span className="text-xs text-primary">● Running now</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 min-h-0">
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 ${
              msg.sender === "me"
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "glass-card text-foreground rounded-bl-sm"
            }`}>
              <p className="text-sm">{msg.text}</p>
              <span className={`text-[10px] mt-0.5 block ${msg.sender === "me" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                {msg.time}
              </span>
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-[max(env(safe-area-inset-bottom,12px),12px)] pt-2 border-t border-border shrink-0">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Message..."
            className="flex-1 h-11 rounded-full bg-secondary px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage}
            className="w-11 h-11 rounded-full bg-primary flex items-center justify-center btn-press shrink-0"
          >
            <Send size={16} className="text-primary-foreground" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
