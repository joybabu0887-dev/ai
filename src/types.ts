export type Role = "user" | "model";

export interface MessagePart {
  text: string;
}

export interface ChatMessage {
  id: string;
  role: Role;
  parts: MessagePart[];
  timestamp: string;
}

export type AppLanguage = "bn" | "en";

export interface LocalizedContent {
  title: string;
  subtitle: string;
  inputPlaceholder: string;
  charCount: string;
  wordCount: string;
  send: string;
  clearChat: string;
  clearConfirm: string;
  thinking: string;
  copySuccess: string;
  copyText: string;
  errorTitle: string;
  suggestionTitle: string;
  apiKeyMissing: string;
  apiKeyInstruction: string;
}
