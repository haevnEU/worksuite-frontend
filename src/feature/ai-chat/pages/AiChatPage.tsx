import React, { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Bot,
  Send,
  Sparkles,
  StopCircle,
  Trash2,
  User,
} from "lucide-react";
import { useAI } from "../../ai-assistant";
import { MarkdownRenderer } from "../../../shared/components/MarkdownRenderer";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const AiChatPage: React.FC = () => {
  const {
    generate,
    abort,
    isLoading,
    error,
    isReady,
    currentModel,
    assistantName,
  } = useAI();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streamingText, setStreamingText] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  const handleSend = async () => {
    const userPrompt = input.trim();
    if (!userPrompt || isLoading || !isReady) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: userPrompt,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setStreamingText("");

    try {
      const response = await generate(userPrompt, {
        onChunk: (chunk: string) => {
          setStreamingText((prev) => prev + chunk);
        },
      });

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
    } finally {
      setStreamingText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    abort();
    setMessages([]);
    setStreamingText("");
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100dvh-5.5rem)] max-w-5xl mx-auto font-sans text-slate-200 overflow-hidden pb-1">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between p-3.5 bg-[#10192c]/80 border border-slate-800 rounded-2xl shadow-lg backdrop-blur mb-2.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">
              {assistantName} Chat
            </h1>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Active Model:{" "}
              <span className="text-purple-300">{currentModel}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              title="Clear current conversation"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Offline Alert */}
      {!isReady && (
        <div className="shrink-0 p-2.5 mb-2.5 bg-amber-950/20 border border-amber-800/40 rounded-xl flex items-center gap-2 text-amber-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            The {assistantName} integration is currently offline or disabled.
            Check connection in Settings.
          </span>
        </div>
      )}

      {/* Chat Area - Der einzige Container, der scrollen darf */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4 p-4 bg-[#0b111e]/60 border border-slate-800/80 rounded-2xl scrollbar-thin scrollbar-thumb-slate-800">
        {messages.length === 0 && !streamingText && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 text-slate-500 select-none">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-300">
                {assistantName} Chat
              </p>
              <p className="text-xs text-slate-500 max-w-sm">
                Ask coding questions, refactoring ideas, architecture patterns,
                or debug tips.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${
              msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border ${
                msg.role === "user"
                  ? "bg-blue-600/20 border-blue-500/40 text-blue-400"
                  : "bg-purple-600/20 border-purple-500/40 text-purple-400"
              }`}
            >
              {msg.role === "user" ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>

            <div
              className={`p-3.5 rounded-2xl border text-xs shadow-md ${
                msg.role === "user"
                  ? "bg-blue-600/10 border-blue-500/30 text-slate-100"
                  : "bg-[#10192c] border-slate-800 text-slate-200"
              }`}
            >
              {msg.role === "user" ? (
                <p className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </p>
              ) : (
                <MarkdownRenderer content={msg.content} />
              )}
              <span className="block mt-1.5 text-[10px] text-slate-500 font-mono">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && streamingText && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border bg-purple-600/20 border-purple-500/40 text-purple-400">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl border border-slate-800 bg-[#10192c] text-slate-200 text-xs shadow-md">
              <MarkdownRenderer content={streamingText} />
              <span className="inline-block w-1.5 h-3.5 bg-purple-400 animate-pulse ml-1 align-middle" />
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-950/30 border border-rose-800/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="shrink-0 mt-2.5 relative bg-[#10192c] border border-slate-800 rounded-2xl p-2 shadow-lg focus-within:border-purple-500/60 transition-colors">
        <textarea
          ref={inputRef}
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!isReady || isLoading}
          placeholder={
            isReady
              ? `Ask ${assistantName} anything... (Enter to send, Shift+Enter for newline)`
              : `Enable ${assistantName} in Settings to chat`
          }
          className="w-full bg-transparent p-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none resize-none disabled:opacity-50 max-h-20"
        />

        <div className="flex justify-between items-center px-1.5 pt-1 border-t border-slate-800/50">
          <span className="text-[10px] text-slate-500 font-mono">
            {input.length} chars
          </span>

          <div className="flex items-center gap-2">
            {isLoading ? (
              <button
                type="button"
                onClick={abort}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition cursor-pointer"
              >
                <StopCircle className="w-3.5 h-3.5" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || !isReady}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition cursor-pointer shadow-md shadow-purple-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer Footer */}
      <div className="shrink-0 mt-1.5 px-2 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 select-none">
        <AlertTriangle className="w-3 h-3 text-amber-500/70 shrink-0" />
        <span>
          {assistantName} responses can contain inaccuracies. Always verify
          generated code.
        </span>
      </div>
    </div>
  );
};

export default AiChatPage;
