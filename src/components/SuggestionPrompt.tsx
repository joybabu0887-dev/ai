import { SUGGESTIONS } from "../constants";
import { AppLanguage } from "../types";
import { MessageSquare } from "lucide-react";

interface SuggestionPromptProps {
  language: AppLanguage;
  onClick: (promptText: string) => void;
}

export default function SuggestionPrompt({ language, onClick }: SuggestionPromptProps) {
  return (
    <div id="suggestions-wrapper" className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
      {SUGGESTIONS.map((s) => {
        const promptText = language === "bn" ? s.bnPrompt : s.enPrompt;
        const category = language === "bn" ? s.categoryBn : s.categoryEn;
        
        return (
          <button
            id={`suggestion-card-${s.id}`}
            key={s.id}
            type="button"
            onClick={() => onClick(promptText)}
            className="flex flex-col items-start text-left p-4 bg-white border border-gray-200 hover:border-gray-400 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all shadow-xs group"
          >
            <div id={`suggest-category-${s.id}`} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium text-gray-500 bg-gray-100 uppercase tracking-wider mb-2">
              <MessageSquare size={10} className="text-gray-400" />
              {category}
            </div>
            <p id={`suggest-prompt-${s.id}`} className="text-xs text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
              {promptText}
            </p>
          </button>
        );
      })}
    </div>
  );
}
