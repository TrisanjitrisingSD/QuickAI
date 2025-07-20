import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from "@clerk/clerk-react";
import axios from 'axios'
// or your own auth logic


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const ChatBot = () => {
  const [messages, setMessages] = useState([]); // { role: 'user'|'bot', content: '' }
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const {getToken}=useAuth();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);




const sendMessage = async () => {
  if (!input.trim()) return;

  const messageToSend = input.trim();
  const userMsg = { role: 'user', content: messageToSend };
  setMessages((prev) => [...prev, userMsg]);
  setInput('');
  setLoading(true);

  try {
    const token = await getToken(); // Clerk auth

    const response = await axios.post(
      '/api/ai/chat',
      { message: messageToSend }, // ✅ payload
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const botMsg = {
      role: 'bot',
      content: response.data.reply || '🤖 No response received.',
    };

    setMessages((prev) => [...prev, botMsg]);
  } catch (err) {
    console.error('Chat error:', err);
    setMessages((prev) => [
      ...prev,
      { role: 'bot', content: '❌ Error fetching response.' },
    ]);
  } finally {
    setLoading(false);
  }
};








  return (
    <div className="flex flex-col h-full overflow-y-scroll p-6 max-w-4xl mx-auto bg-white border-x border-gray-200">
      {/* Header */}
      <div className="p-4 border-b font-semibold text-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-md shadow-sm">
        💬 Quick.AI – ChatBot(Tris)
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-2 items-start ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                🤖
              </div>
            )}

            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl shadow text-sm sm:text-base leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-100 text-right'
                  : 'bg-white border text-left'
              }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                🧑
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-gray-500 text-sm italic">
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
          </div>
        )}

        <div ref={scrollRef}></div>
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
        <div className="flex gap-2">
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Send
          </button>
          <button
            onClick={() => setMessages([])}
            className="px-3 py-2 border border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-600 rounded-lg transition"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;