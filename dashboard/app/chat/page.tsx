"use client";
import { useState, useEffect } from "react";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { sendChatToS3, checkForBotResponse, getChatHistory } from "@/lib/chat-actions";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Chat Agent is Ready. Type something!" }
  ]);
  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  // Load history on mount
  useEffect(() => {
    const loadHistory = async () => {
      const history = await getChatHistory();
      if (history && history.length > 0) {
        setMessages(history);
      }
    };
    loadHistory();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isWaiting) return;

    const userText = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userText }]);
    setIsWaiting(true);

    const result = await sendChatToS3(userText);

    if (result.success && result.id) {
      const interval = setInterval(async () => {
        const botData = await checkForBotResponse(result.id as number);

        if (botData) {
          setMessages(prev => [...prev, { role: "bot", content: botData.content }]);
          setIsWaiting(false);
          clearInterval(interval);
        }
      }, 2000);

      setTimeout(() => { 
        clearInterval(interval); 
        setIsWaiting(false); 
      }, 30000);
    } else {
      setIsWaiting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 flex flex-col items-center font-sans">
      <div className="w-full max-w-2xl bg-zinc-900/50 border border-white/10 rounded-2xl flex flex-col h-[600px] shadow-2xl">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <h2 className="font-bold text-sm uppercase tracking-widest text-zinc-400">S3 Agent Chat</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl flex gap-3 ${
                msg.role === 'user' ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'bg-zinc-800 border border-white/5'
              }`}>
                <div className="mt-1">{msg.role === 'bot' ? <Bot size={18}/> : <User size={18}/>}</div>
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isWaiting && (
            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-zinc-800/50 border border-white/5 p-4 rounded-2xl flex gap-3 items-center text-zinc-500">
                <Loader2 size={18} className="animate-spin" />
                <p className="text-xs italic">Agent is thinking (S3 Polling...)</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10 bg-black/20 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={isWaiting ? "Waiting for agent..." : "Ask your agent something..."}
            disabled={isWaiting}
            className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={isWaiting}
            className="bg-blue-600 px-4 py-2 rounded-xl hover:bg-blue-500 transition-all disabled:bg-zinc-800 flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}