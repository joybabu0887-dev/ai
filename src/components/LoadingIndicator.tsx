import { motion } from "motion/react";
import { Bot } from "lucide-react";

interface LoadingIndicatorProps {
  label: string;
}

export default function LoadingIndicator({ label }: LoadingIndicatorProps) {
  const dotTransition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut" as const,
  };

  return (
    <div id="loading-indicator-row" className="flex items-start gap-4 mb-4 select-none">
      <div id="loading-avatar" className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white shrink-0 shadow-xs">
        <Bot size={20} />
      </div>
      <div id="loading-bubble" className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-4 shadow-xs mr-auto flex flex-col gap-1.5 min-w-[120px]">
        <div id="loading-dots" className="flex items-center gap-1.5 h-4">
          <motion.div
            id="dot-1"
            className="w-2.5 h-2.5 bg-gray-400 rounded-full"
            animate={{ y: ["0%", "-40%", "0%"] }}
            transition={{ ...dotTransition, delay: 0 }}
          />
          <motion.div
            id="dot-2"
            className="w-2.5 h-2.5 bg-gray-400 rounded-full"
            animate={{ y: ["0%", "-40%", "0%"] }}
            transition={{ ...dotTransition, delay: 0.15 }}
          />
          <motion.div
            id="dot-3"
            className="w-2.5 h-2.5 bg-gray-400 rounded-full"
            animate={{ y: ["0%", "-40%", "0%"] }}
            transition={{ ...dotTransition, delay: 0.3 }}
          />
        </div>
        <span id="loading-label" className="text-[11px] text-gray-500 font-medium font-sans">
          {label}
        </span>
      </div>
    </div>
  );
}
