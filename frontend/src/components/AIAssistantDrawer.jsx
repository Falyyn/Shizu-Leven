import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import ReactMarkdown from 'react-markdown';

const AIAssistantDrawer = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! Saya asisten AI Shizu Leven. Tanyakan apa saja tentang stok Anda.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    setMessages(prev => [...prev, { role: 'user', content: currentInput }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', { prompt: currentInput });
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Maaf, terjadi kesalahan saat menghubungi server AI.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed right-0 top-0 h-full w-[400px] bg-surface shadow-[-8px_0_30px_rgb(0,0,0,0.1)] z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="px-6 py-8 border-b border-outline-variant/20 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <div>
              <h2 className="font-headline font-bold text-lg">AI Assistant</h2>
              <p className="font-sans text-xs text-on-surface-variant">Powered by Gemini</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-highest transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-surface-container-highest text-primary' : 'bg-primary text-white'}`}>
                <span className="material-symbols-outlined text-sm">{msg.role === 'user' ? 'person' : 'auto_awesome'}</span>
              </div>
              <div className={`p-4 rounded-2xl font-sans text-sm ${msg.role === 'user' ? 'bg-zinc-900 text-white rounded-tr-sm' : 'bg-white border border-outline-variant/30 text-on-surface rounded-tl-sm shadow-sm prose prose-sm prose-zinc max-w-none'}`}>
                {msg.role === 'assistant' ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%] self-start">
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-primary text-white">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
              </div>
              <div className="p-4 rounded-2xl font-sans text-sm bg-white border border-outline-variant/30 text-on-surface rounded-tl-sm shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-outline-variant/20">
          <form onSubmit={handleSend} className="relative flex items-end">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim() && !isLoading) {
                    handleSend(e);
                    e.target.style.height = 'auto';
                  }
                }
              }}
              placeholder="Tanya tentang stok..."
              className="w-full bg-surface border border-outline-variant/30 rounded-2xl py-3 pl-4 pr-12 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm resize-none overflow-y-auto min-h-[46px] max-h-[120px] custom-scrollbar"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50 hover:bg-primary/90 transition-colors shadow-md"
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AIAssistantDrawer;
