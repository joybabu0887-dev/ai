import { useState } from "react";
import Markdown from "react-markdown";
import { Copy, Check, Bot, User } from "lucide-react";
import { ChatMessage } from "../types";

interface ChatBubbleProps {
  message: ChatMessage;
  language: "bn" | "en";
}

export default function ChatBubble({ message, language }: ChatBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";
  const rawText = message.parts.map((p) => p.text).join("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div
      id={`message-row-${message.id}`}
      className={`flex items-start gap-3 w-full mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* Icon */}
      {!isUser && (
        <div
          id={`avatar-model-${message.id}`}
          className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-white shrink-0 shadow-xs"
        >
          <Bot size={20} />
        </div>
      )}

      {/* Bubble */}
      <div
        id={`bubble-container-${message.id}`}
        className={`relative group max-w-[85%] rounded-2xl p-4 shadow-xs border ${
          isUser
            ? "bg-gray-100 border-gray-200 text-gray-800 rounded-tr-none ml-auto"
            : "bg-white border-gray-200 text-gray-800 rounded-tl-none mr-auto"
        }`}
      >
        {/* Copy button for model responses */}
        {!isUser && (
          <button
            id={`copy-btn-${message.id}`}
            type="button"
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-gray-50 border border-gray-100 text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
            title={language === "bn" ? "কপি করুন" : "Copy to Clipboard"}
          >
            {copied ? (
              <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 font-sans">
                <Check size={12} />
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-medium font-sans">
                <Copy size={12} />
              </span>
            )}
          </button>
        )}

        {/* Text Content */}
        <div id={`bubble-text-${message.id}`} className="leading-relaxed break-words font-sans text-sm pr-6">
          {isUser ? (
            <p className="whitespace-pre-wrap">{rawText}</p>
          ) : (
            <div className="markdown-body prose max-w-none text-gray-800">
              <Markdown
                components={{
                  // Style code blocks beautifully in a dark box
                  pre({ children }) {
                    return (
                      <pre className="my-3 p-4 bg-gray-900 text-gray-100 rounded-xl overflow-x-auto text-xs font-mono border border-gray-800 font-medium whitespace-pre-wrap select-text">
                        {children}
                      </pre>
                    );
                  },
                  code({ className, children, ...props }) {
                    return (
                      <code
                        className="px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded-md font-mono text-[13px] font-semibold border border-gray-200"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  p({ children }) {
                    return <p className="mb-2 last:mb-0 text-[14px] leading-relaxed">{children}</p>;
                  },
                  ul({ children }) {
                    return <ul className="list-disc pl-5 mb-2 mt-1 space-y-1 text-[14px]">{children}</ul>;
                  },
                  ol({ children }) {
                    return <ol className="list-decimal pl-5 mb-2 mt-1 space-y-1 text-[14px]">{children}</ol>;
                  },
                  li({ children }) {
                    return <li className="pl-1 text-[14px]">{children}</li>;
                  },
                  h1({ children }) {
                    return <h1 className="text-lg font-bold text-gray-900 mt-3 mb-1.5 leading-tight">{children}</h1>;
                  },
                  h2({ children }) {
                    return <h2 className="text-base font-bold text-gray-900 mt-2.5 mb-1 leading-tight">{children}</h2>;
                  },
                  h3({ children }) {
                    return <h3 className="text-sm font-bold text-gray-900 mt-2 mb-1 leading-tight">{children}</h3>;
                  },
                  strong({ children }) {
                    return <strong className="font-semibold text-gray-900">{children}</strong>;
                  },
                  a({ href, children }) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="text-amber-800 underline hover:text-amber-900 transition-colors"
                      >
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {rawText}
              </Markdown>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div id={`bubble-timestamp-${message.id}`} className="mt-1 text-[10px] text-gray-400 font-mono text-right select-none">
          {message.timestamp}
        </div>
      </div>

      {isUser && (
        <div
          id={`avatar-user-${message.id}`}
          className="w-10 h-10 rounded-xl bg-gray-200 text-gray-600 flex items-center justify-center shrink-0 shadow-xs"
        >
          <User size={20} />
        </div>
      )}
    </div>
  );
}
