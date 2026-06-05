import { LocalizedContent, AppLanguage } from "./types";

export const DICTIONARY: Record<AppLanguage, LocalizedContent> = {
  bn: {
    title: "কপিরাইট-মুক্ত চ্যাট বট",
    subtitle: "সম্পূর্ণ উন্মুক্ত, সুরক্ষিত এবং কপিরাইট-মুক্ত এআই সহযোগী বোতাম",
    inputPlaceholder: "এখানে টাইপ করুন (যেমন: আমার লালনগীতি কী?)...",
    charCount: "টি অক্ষর",
    wordCount: "টি শব্দ",
    send: "পাঠান",
    clearChat: "নতুন বার্তা",
    clearConfirm: "সব মুছুন",
    thinking: "এআই চিন্তা করছে...",
    copySuccess: "কপি হয়েছে!",
    copyText: "কপি করুন",
    errorTitle: "দুঃখিত, সমস্যা হয়েছে!",
    suggestionTitle: "নিচের যেকোনো পরামর্শ দিয়ে সরাসরি চ্যাট শুরু করতে পারেন:",
    apiKeyMissing: "জেমিনি এআই কাজের চাবি (API Key) পাওয়া যায়নি!",
    apiKeyInstruction: "অনুগ্রহ করে গুগল এআই স্টুডিওর ডানদিকের Settings > Secrets প্যানেলে 'GEMINI_API_KEY' যুক্ত করুন এবং ব্রাউজার ট্যাব রিফ্রেশ বা পুনরায় সাবমিট করুন।"
  },
  en: {
    title: "Copyright-Free AI Chat Bot",
    subtitle: "An open, lightweight, and completely license-free AI conversational companion",
    inputPlaceholder: "Type your query here (e.g., Write a quick story for me)...",
    charCount: "chars",
    wordCount: "words",
    send: "Send",
    clearChat: "New Chat",
    clearConfirm: "Clear All",
    thinking: "AI is thinking...",
    copySuccess: "Copied!",
    copyText: "Copy",
    errorTitle: "Oops, an error occurred!",
    suggestionTitle: "Or choose one of these starters to start chatting instantly:",
    apiKeyMissing: "Gemini API Key is missing!",
    apiKeyInstruction: "Please configure 'GEMINI_API_KEY' in the Secrets panel on the top-right in AI Studio and refresh to try again."
  }
};

export interface SuggestionPrompt {
  id: string;
  bnPrompt: string;
  enPrompt: string;
  categoryBn: string;
  categoryEn: string;
}

export const SUGGESTIONS: SuggestionPrompt[] = [
  {
    id: "s1",
    bnPrompt: "কপিরাইট আইন কী? কপিরাইট-মুক্ত কন্টেন্ট বা সফটওয়্যার বলতে কী বোঝায়?",
    enPrompt: "What is copyright law? What does license-free or copyright-free software mean?",
    categoryBn: "আইন ও লাইসেন্স",
    categoryEn: "Law & Licensing"
  },
  {
    id: "s2",
    bnPrompt: "রবীন্দ্রনাথ ঠাকুরের বিখ্যাত পাঁচটি কবিতা এবং সাহিত্যকর্মের একটি তালিকা দাও।",
    enPrompt: "Provide a list of Rabindranath Tagore's five most famous poems and literary works.",
    categoryBn: "সাহিত্য",
    categoryEn: "Literature"
  },
  {
    id: "s3",
    bnPrompt: "একটি নোড.জেএস (Node.js) প্রজেক্টে এক্সপ্রেস সার্ভার স্ক্রিপ্টের উদাহরণ তৈরি করে দেখাও।",
    enPrompt: "Create a basic setup example for a Node.js Express web server application.",
    categoryBn: "কোডিং",
    categoryEn: "Coding"
  },
  {
    id: "s4",
    bnPrompt: "আমাদের প্রতিদিনের খাদ্য তালিকায় প্রোটিন ও কার্বোহাইড্রেটের উপযোগিতা বুঝিয়ে লেখো।",
    enPrompt: "Explain the nutritional benefits and roles of protein and carbohydrates in our daily diet.",
    categoryBn: "স্বাস্থ্য ও খাদ্য",
    categoryEn: "Health & Nutrition"
  }
];
