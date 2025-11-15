type ChatSender = "passenger" | "driver";

export type ChatMessage = {
  id: string;
  driverId: string;
  driverName: string;
  sender: ChatSender;
  text: string;
  timestamp: string;
};

export type ChatThread = {
  driverId: string;
  driverName: string;
  messages: ChatMessage[];
};

const CHAT_KEY = "myatri:chat-threads";

const listeners = new Set<() => void>();

const isBrowser = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn("Unable to parse chat store", error);
    return fallback;
  }
};

const readThreads = (): Record<string, ChatThread> => {
  if (!isBrowser()) return {};
  return safeParse<Record<string, ChatThread>>(window.localStorage.getItem(CHAT_KEY), {});
};

const writeThreads = (threads: Record<string, ChatThread>) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(CHAT_KEY, JSON.stringify(threads));
  listeners.forEach((listener) => listener());
};

export const getChatThreads = (): ChatThread[] => {
  return Object.values(readThreads());
};

export const getChatThread = (driverId: string): ChatThread | null => {
  const threads = readThreads();
  return threads[driverId] ?? null;
};

export const sendChatMessage = (params: { driverId: string; driverName: string; sender: ChatSender; text: string }) => {
  const threads = readThreads();
  const now = new Date().toISOString();
  const message: ChatMessage = {
    id: `${params.driverId}-${Date.now()}`,
    driverId: params.driverId,
    driverName: params.driverName,
    sender: params.sender,
    text: params.text,
    timestamp: now,
  };

  const thread = threads[params.driverId] ?? { driverId: params.driverId, driverName: params.driverName, messages: [] };
  thread.driverName = params.driverName;
  thread.messages = [...thread.messages, message];
  threads[params.driverId] = thread;

  writeThreads(threads);
  return message;
};

export const subscribeToChatStore = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const clearChatStore = () => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(CHAT_KEY);
  listeners.forEach((listener) => listener());
};
