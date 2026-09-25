import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Bot, User, Settings2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Message = { role: "user" | "model"; content: string };

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content:
        "Hello. I am your project assistant. You can ask me questions about specific parcels, risk factors, or predicted acquisition delays.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modelType, setModelType] = useState("general");
  const [useSearch, setUseSearch] = useState(false);
  const [systemInstruction, setSystemInstruction] = useState(
    "You are an expert land acquisition and delay risk assistant for Bro Foresee. Provide clear, direct answers without unnecessary filler."
  );
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          modelType,
          useSearch,
          systemInstruction,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [...prev, { role: "model", content: data.text }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "model", content: `Error: ${data.error}` },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "Failed to connect to the assistant service." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open Assistant"
        className={`fixed bottom-5 right-5 p-3 rounded-full bg-[#1f4230] hover:bg-[#163324] text-white shadow-lg transition-transform duration-150 z-40 ${
          isOpen ? "scale-0" : "scale-100"
        }`}
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="fixed bottom-5 right-5 w-88 sm:w-96 h-[520px] max-h-[82vh] bg-white dark:bg-[#141d17] border border-[#e5e2da] dark:border-[#28372d] rounded-xl flex flex-col z-50 overflow-hidden shadow-xl"
          >
            {/* Header */}
            <div className="flex flex-col border-b border-[#e5e2da] dark:border-[#212c24] bg-[#f8f8f5] dark:bg-[#111813]">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#1f4230] text-white flex items-center justify-center text-xs font-semibold">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#181c19] dark:text-[#eff3ef]">
                      Bro Foresee Assistant
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-1 text-[#828c84] hover:text-[#181c19] dark:hover:text-white rounded"
                    title="Settings"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-[#828c84] hover:text-[#181c19] dark:hover:text-white rounded"
                    aria-label="Close"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Settings Tray */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-3 pb-3 overflow-hidden border-t border-[#e5e2da] dark:border-[#212c24] bg-[#f0eee8] dark:bg-[#0f1611] text-xs"
                  >
                    <div className="space-y-2 pt-2">
                      <div>
                        <label className="text-[10px] font-semibold text-[#58615a] dark:text-[#95a398] uppercase">
                          Model Mode
                        </label>
                        <select
                          value={modelType}
                          onChange={(e) => setModelType(e.target.value)}
                          className="mt-1 w-full text-xs p-1 rounded bg-white dark:bg-[#18231c] border border-[#dcd7cd] dark:border-[#28372d] text-[#181c19] dark:text-[#eff3ef] outline-none"
                        >
                          <option value="fast">Fast (Flash Lite)</option>
                          <option value="general">Standard (Flash)</option>
                          <option value="complex">Detailed (Pro)</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <label className="text-[10px] font-semibold text-[#58615a] dark:text-[#95a398] uppercase">
                          Search Grounding
                        </label>
                        <input
                          type="checkbox"
                          checked={useSearch}
                          onChange={(e) => setUseSearch(e.target.checked)}
                          className="rounded text-[#1f4230] focus:ring-[#1f4230]"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#faf9f6] dark:bg-[#0f1611]">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2 ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 text-xs ${
                      msg.role === "user"
                        ? "bg-[#543d2c] text-white"
                        : "bg-[#1f4230] text-white"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="w-3 h-3" />
                    ) : (
                      <Bot className="w-3 h-3" />
                    )}
                  </div>

                  <div
                    className={`px-3 py-2 rounded-lg max-w-[82%] text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#1f4230] text-white shadow-2xs"
                        : "bg-white dark:bg-[#16201a] border border-[#e5e2da] dark:border-[#243328] text-[#181c19] dark:text-[#dce4de] shadow-2xs"
                    }`}
                  >
                    <div className="prose prose-stone dark:prose-invert prose-xs max-w-none text-xs">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#1f4230] text-white flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 animate-spin" />
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white dark:bg-[#16201a] border border-[#e5e2da] dark:border-[#243328] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#1f4230] rounded-full animate-bounce" />
                    <span
                      className="w-1.5 h-1.5 bg-[#1f4230] rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-[#1f4230] rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-2.5 border-t border-[#e5e2da] dark:border-[#212c24] bg-white dark:bg-[#141d17]">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask a question..."
                  disabled={isLoading}
                  className="w-full bg-[#f4f3ef] dark:bg-[#101712] border border-[#dcd7cd] dark:border-[#28372d] rounded-md py-1.5 pl-2.5 pr-8 text-xs text-[#181c19] dark:text-[#eff3ef] placeholder-[#828c84] focus:outline-none focus:ring-1 focus:ring-[#1f4230] focus:border-[#1f4230]"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1 p-1 bg-[#1f4230] hover:bg-[#163324] disabled:bg-[#dcd7cd] dark:disabled:bg-[#253229] text-white rounded transition-colors"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
