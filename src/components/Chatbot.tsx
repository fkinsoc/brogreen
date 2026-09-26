import React, { useState, useRef, useEffect } from "react";
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
  const [systemInstruction] = useState(
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
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Assistant"
          className="fixed bottom-5 right-5 p-2.5 rounded-xs bg-[#1f4230] hover:bg-[#163324] text-white border border-[#2e5940] transition-colors z-40 cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <MessageSquare className="w-4 h-4" />
            <span>Assistant</span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-5 right-5 w-88 sm:w-96 h-[500px] max-h-[82vh] bg-[#141d17] border border-[#28372d] rounded-xs flex flex-col z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex flex-col border-b border-[#212c24] bg-[#111813]">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-xs bg-[#1f4230] text-white flex items-center justify-center text-xs font-semibold">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#eff3ef]">
                    Bro Foresee Assistant
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1 text-[#828c84] hover:text-white rounded-xs transition-colors"
                  title="Settings"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-[#828c84] hover:text-white rounded-xs transition-colors"
                  aria-label="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Settings Tray */}
            {showSettings && (
              <div className="px-3 pb-3 border-t border-[#212c24] bg-[#0f1611] text-xs space-y-2 pt-2">
                <div>
                  <label className="text-[10px] font-semibold text-[#95a398] uppercase">
                    Model Mode
                  </label>
                  <select
                    value={modelType}
                    onChange={(e) => setModelType(e.target.value)}
                    className="mt-1 w-full text-xs p-1 rounded-xs bg-[#18231c] border border-[#28372d] text-[#eff3ef] outline-none"
                  >
                    <option value="fast">Fast (Flash Lite)</option>
                    <option value="general">Standard (Flash)</option>
                    <option value="complex">Detailed (Pro)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="text-[10px] font-semibold text-[#95a398] uppercase">
                    Search Grounding
                  </label>
                  <input
                    type="checkbox"
                    checked={useSearch}
                    onChange={(e) => setUseSearch(e.target.checked)}
                    className="rounded-xs text-[#1f4230] focus:ring-[#1f4230]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#0f1611]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-xs flex items-center justify-center flex-shrink-0 text-xs ${
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
                  className={`px-3 py-2 rounded-xs max-w-[82%] text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#1f4230] text-white"
                      : "bg-[#16201a] border border-[#243328] text-[#dce4de]"
                  }`}
                >
                  <div className="prose prose-invert prose-xs max-w-none text-xs">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 items-center text-xs text-[#7e9587]">
                <div className="w-6 h-6 rounded-xs bg-[#1f4230] text-white flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3" />
                </div>
                <div className="px-3 py-1.5 rounded-xs bg-[#16201a] border border-[#243328]">
                  Processing query...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-2.5 border-t border-[#212c24] bg-[#141d17]">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask a question about parcels or delays..."
                disabled={isLoading}
                className="w-full bg-[#101712] border border-[#28372d] rounded-xs py-1.5 pl-2.5 pr-8 text-xs text-[#eff3ef] placeholder-[#828c84] focus:outline-none focus:border-[#1f4230]"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-1 p-1 bg-[#1f4230] hover:bg-[#163324] disabled:bg-[#253229] text-white rounded-xs transition-colors"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
