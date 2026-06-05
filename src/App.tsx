import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, 
  Trash2, 
  AlertCircle, 
  Bot, 
  Sparkles, 
  RefreshCw,
  CornerDownLeft,
  XCircle
} from "lucide-react";
import { ChatMessage, AppLanguage } from "./types";
import { DICTIONARY } from "./constants";
import LanguageToggle from "./components/LanguageToggle";
import SuggestionPrompt from "./components/SuggestionPrompt";
import ChatBubble from "./components/ChatBubble";
import LoadingIndicator from "./components/LoadingIndicator";

export default function App() {
  // Translate system default
  const [language, setLanguage] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem("app_lang");
    return (saved === "en" || saved === "bn" ? saved : "bn") as AppLanguage;
  });

  const t = DICTIONARY[language];

  // Conversation history
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("chat_history");
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [errorHeader, setErrorHeader] = useState<string | null>(null);
  const [errorBody, setErrorBody] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync back to local storage
  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("app_lang", language);
  }, [language]);

  // Handle scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Auto-adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [inputText]);

  // Build the message sending trigger
  const handleSendMessage = async (overrideText?: string) => {
    const textToSend = (overrideText || inputText).trim();
    if (!textToSend || isThinking) return;

    // Reset values
    setInputText("");
    setErrorHeader(null);
    setErrorBody(null);

    // Create current time string
    const currentTimeString = new Date().toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit" 
    });

    const userMessage: ChatMessage = {
      id: `m-${Date.now()}-user`,
      role: "user",
      parts: [{ text: textToSend }],
      timestamp: currentTimeString,
    };

    // Update conversation states
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsThinking(true);

    try {
      // Map structures properly for backend Gemini endpoint
      const contentsPayload = updatedMessages.map((msg) => ({
        role: msg.role,
        parts: msg.parts.map((p) => ({ text: p.text })),
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: contentsPayload }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "API_KEY_MISSING") {
          setErrorHeader(t.apiKeyMissing);
          setErrorBody(t.apiKeyInstruction);
        } else {
          setErrorHeader(t.errorTitle);
          setErrorBody(data.message || "An error occurred on the server.");
        }
        setIsThinking(false);
        return;
      }

      const botMessage: ChatMessage = {
        id: `m-${Date.now()}-model`,
        role: "model",
        parts: [{ text: data.text }],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error(err);
      setErrorHeader(t.errorTitle);
      setErrorBody(err?.message || "Check your internet connection and try again.");
    } finally {
      setIsThinking(false);
    }
  };

  // Keyboard controls
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Reset thread completely
  const handleResetChat = () => {
    if (messages.length === 0) return;
    const confirmMessage = language === "bn" 
      ? "আপনি কি সম্পূর্ণ চ্যাট ডিলিট করতে চান?" 
      : "Are you sure you want to clear the entire chat history?";
    if (window.confirm(confirmMessage)) {
      setMessages([]);
      setErrorHeader(null);
      setErrorBody(null);
      setInputText("");
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  // Helpers to calculate length
  const charCount = inputText.length;
  const wordCount = inputText.trim() === "" ? 0 : inputText.trim().split(/\s+/).length;

  return (
    <div id="main-app-container" className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-3 sm:p-6 font-sans antialiased text-gray-800 selection:bg-gray-200 selection:text-gray-900">
      <div id="central-layout-card" className="w-full max-w-4xl bg-white rounded-3xl border border-gray-200/80 shadow-xl flex flex-col overflow-hidden h-[92vh] sm:h-[88vh]">
        
        {/* Header Ribbon bar */}
        <header id="chat-header-bar" className="shrink-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div id="header-brand-section" className="flex items-center gap-3">
            <div id="brand-logo-frame" className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-white shadow-xs">
              <Bot size={22} className="animate-spin-slow text-white" />
            </div>
            <div>
              <h1 id="app-heading-title" className="text-base sm:text-lg font-bold text-gray-900 tracking-tight leading-tight select-none">
                {t.title}
              </h1>
              <p id="app-heading-subtitle" className="text-[10px] sm:text-xs text-gray-500 font-medium select-none truncate max-w-[200px] sm:max-w-md">
                {t.subtitle}
              </p>
            </div>
          </div>

          <div id="header-actions-panel" className="flex items-center gap-2">
            <LanguageToggle language={language} onChange={setLanguage} />
            
            {messages.length > 0 && (
              <button
                id="reset-chat-button"
                type="button"
                onClick={handleResetChat}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                title={t.clearChat}
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </header>

        {/* Content Scrolling Board */}
        <main id="chat-board-scrolling" className="flex-1 overflow-y-auto bg-gray-50/50 p-4 sm:p-6 flex flex-col">
          {messages.length === 0 ? (
            /* Welcome / Initial Blank State Workspace */
            <div id="empty-state-welcome" className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full py-6 select-none">
              <motion.div
                id="empty-badge"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-16 h-16 rounded-2xl bg-gray-900 text-white flex items-center justify-center mb-5 shadow-lg shadow-gray-200"
              >
                <Sparkles size={28} className="text-amber-400 animate-pulse" />
              </motion.div>

              <motion.h2
                id="empty-welcome-title"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-xl sm:text-2xl font-black text-gray-900 text-center tracking-tight mb-2"
              >
                {language === "bn" ? "স্বাগতম! আমি আপনার কপিরাইট-মুক্ত চ্যাট বট" : "Welcome! I am your Copyright-Free AI Chat Bot"}
              </motion.h2>

              <motion.p
                id="empty-welcome-p"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-xs sm:text-sm text-gray-500 text-center max-w-md mb-8 leading-relaxed font-medium"
              >
                {language === "bn" 
                  ? "আমি সম্পূর্ণ সুরক্ষিত উপায়ে আপনার প্রশ্নের উত্তর দিতে বা কোডিং, অনুবাদ এবং যেকোনো সৃজনশীল কাজে সাহায্য করতে প্রস্তুত।" 
                  : "I am ready to help you search information, write safe code, draft stories, translate, or handle general creative work securely."}
              </motion.p>

              <motion.div
                id="empty-suggestions-panel"
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="w-full bg-white border border-gray-100 p-5 rounded-2xl shadow-xs"
              >
                <h3 id="suggestions-title" className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4 font-sans flex items-center gap-2">
                  <Bot size={14} className="text-gray-500" />
                  {t.suggestionTitle}
                </h3>
                <SuggestionPrompt language={language} onClick={(text) => handleSendMessage(text)} />
              </motion.div>
            </div>
          ) : (
            /* Traditional Active Message Listing */
            <div id="messages-listing" className="w-full max-w-3xl mx-auto flex-1">
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} language={language} />
              ))}
              
              {isThinking && (
                <LoadingIndicator label={t.thinking} />
              )}
            </div>
          )}
          <div id="chat-scroller-anchor" ref={messagesEndRef} />
        </main>

        {/* Global Error Notice Board */}
        <AnimatePresence>
          {errorHeader && (
            <motion.div
              id="error-notification-banner"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-red-50 border-t border-b border-red-200 px-4 py-3 shrink-0"
            >
              <div id="error-inner-layout" className="max-w-3xl mx-auto flex gap-3 items-start">
                <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
                <div id="error-content" className="flex-1">
                  <h4 id="error-header-title" className="text-sm font-bold text-red-900 leading-tight">
                    {errorHeader}
                  </h4>
                  <p id="error-body-text" className="text-xs text-red-700 leading-relaxed mt-1">
                    {errorBody}
                  </p>
                </div>
                <button
                  id="dismiss-error-button"
                  type="button"
                  onClick={() => {
                    setErrorHeader(null);
                    setErrorBody(null);
                  }}
                  className="p-1 text-red-400 hover:text-red-700 rounded-lg shrink-0 cursor-pointer"
                  title="Close"
                >
                  <XCircle size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Input Command Section */}
        <footer id="chat-input-controls-footer" className="bg-white border-t border-gray-100 p-4 shrink-0">
          <div id="controls-workspace-box" className="max-w-3xl mx-auto flex flex-col gap-2">
            
            <form
              id="chat-send-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-end gap-2 bg-gray-50 border border-gray-200 hover:border-gray-300 focus-within:border-gray-500 focus-within:bg-white rounded-2xl px-4 py-2.5 transition-all shadow-xs"
            >
              <textarea
                id="message-textarea-field"
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.inputPlaceholder}
                disabled={isThinking}
                rows={1}
                className="flex-1 bg-transparent border-0 outline-hidden font-sans text-sm text-gray-800 placeholder-gray-400/90 resize-none min-h-[22px] max-h-[140px] focus:ring-0 py-0.5 leading-relaxed"
                style={{ scrollbarWidth: "thin" }}
              />

              <div id="form-action-buttons" className="flex items-center gap-1 shrink-0 select-none pb-0.5">
                {/* Clear local input */}
                {inputText.trim() && (
                  <button
                    id="clear-input-pill"
                    type="button"
                    onClick={() => setInputText("")}
                    className="p-1 px-1.5 text-xs font-mono font-bold bg-gray-200/60 hover:bg-gray-200 text-gray-500 hover:text-gray-800 rounded-md transition-all cursor-pointer"
                    title="clear draft"
                  >
                    Esc
                  </button>
                )}

                <button
                  id="send-submit-button"
                  type="submit"
                  disabled={!inputText.trim() || isThinking}
                  className={`p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    inputText.trim() && !isThinking
                      ? "bg-gray-900 hover:bg-gray-800 text-white shadow-xs scale-100 hover:scale-105 active:scale-95"
                      : "bg-gray-100 text-gray-300 cursor-not-allowed"
                  }`}
                  title={t.send}
                >
                  <Send size={16} />
                </button>
              </div>
            </form>

            {/* Bottom metadata indicators counters */}
            <div id="footer-metadata-bar" className="flex items-center justify-between text-[11px] font-mono text-gray-400 px-1 select-none">
              <span id="instruction-hint" className="hidden sm:inline">
                Shift + Enter for new lines. Enter to send.
              </span>
              <div id="character-word-pills" className="flex gap-2.5 ml-auto">
                <span id="word-pill-counter">
                  {wordCount} {t.wordCount}
                </span>
                <span id="char-pill-counter">
                  {charCount} {t.charCount}
                </span>
              </div>
            </div>

          </div>
        </footer>

      </div>
    </div>
  );
}
