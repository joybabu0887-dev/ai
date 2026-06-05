import { motion } from "motion/react";
import { Languages } from "lucide-react";
import { AppLanguage } from "../types";

interface LanguageToggleProps {
  language: AppLanguage;
  onChange: (lang: AppLanguage) => void;
}

export default function LanguageToggle({ language, onChange }: LanguageToggleProps) {
  return (
    <div id="language-toggle-container" className="flex items-center gap-2 bg-gray-100 p-1 rounded-full border border-gray-200">
      <div className="text-gray-500 pl-2 pr-1 hidden sm:block">
        <Languages id="lang-icon" size={16} />
      </div>
      <button
        id="btn-lang-bn"
        type="button"
        onClick={() => onChange("bn")}
        className={`relative px-3 py-1 text-xs font-medium cursor-pointer rounded-full transition-colors ${
          language === "bn" ? "text-white" : "text-gray-600 hover:text-gray-900"
        }`}
      >
        {language === "bn" && (
          <motion.div
            id="active-bg-bn"
            layoutId="activeLang"
            className="absolute inset-0 bg-gray-900 rounded-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <span className="relative z-10">বাংলা</span>
      </button>
      <button
        id="btn-lang-en"
        type="button"
        onClick={() => onChange("en")}
        className={`relative px-3 py-1 text-xs font-medium cursor-pointer rounded-full transition-colors ${
          language === "en" ? "text-white" : "text-gray-600 hover:text-gray-900"
        }`}
      >
        {language === "en" && (
          <motion.div
            id="active-bg-en"
            layoutId="activeLang"
            className="absolute inset-0 bg-gray-900 rounded-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <span className="relative z-10">English</span>
      </button>
    </div>
  );
}
