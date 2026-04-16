import React, { useState } from "react";

export default function Chats() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);

  const send = () => {
    if (!msg.trim()) return;
    setChat([...chat, { user: msg, ai: "AI response here" }]);
    setMsg("");
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl shadow-sm">
          🤖
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">AI Assistant</h3>
          <p className="text-xs text-slate-500">Always ready to help</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
        {chat.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            Send a message to start chatting...
          </div>
        ) : (
          chat.map((c, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="self-end bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
                <p className="text-sm">{c.user}</p>
              </div>
              <div className="self-start bg-white text-slate-800 px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[80%] border border-slate-100 shadow-sm flex gap-3">
                <span className="text-lg">🤖</span>
                <p className="text-sm leading-relaxed">{c.ai}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2 relative">
          <input
            className="flex-1 bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-700 placeholder-slate-400"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask me anything..."
          />
          <button 
            onClick={send}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}