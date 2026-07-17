import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '../context/AuthContext';

const AIAssistantModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hi there! I'm your Studora Quick AI Assistant. Ask me any quick doubt, math question, or study query!"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userText = inputValue;
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputValue('');
    setLoading(true);

    try {
      const token = localStorage.getItem('studora_token');
      const response = await fetch(`${API_BASE}/ai/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question: userText })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, { sender: 'ai', text: data.answer }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: "Sorry, I'm having trouble connecting to the server. Please try again shortly." }
        ]);
      }
    } catch (err) {
      console.error('Error sending quick AI doubt:', err);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: "Oops! Something went wrong. Please check your network connection." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Basic formatter for code blocks and bold text to make AI answers beautiful
  const formatText = (text) => {
    if (!text) return '';
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const codeLines = part.replace(/```/g, '').trim().split('\n');
        // Check if first line is language
        let lang = '';
        if (codeLines[0] && codeLines[0].length < 15 && !codeLines[0].includes(' ') && !codeLines[0].includes('=')) {
          lang = codeLines.shift();
        }
        const code = codeLines.join('\n');
        return (
          <div key={index} className="my-3 rounded-lg overflow-hidden border border-white/5 font-mono text-xs bg-slate-950/80 shadow-inner">
            {lang && (
              <div className="bg-slate-900 px-3 py-1 text-[10px] text-slate-400 font-sans border-b border-white/5 flex justify-between uppercase">
                <span>{lang}</span>
              </div>
            )}
            <pre className="p-3 overflow-x-auto text-violet-300 whitespace-pre">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Format header markup like "### " or "#### "
      const lines = part.split('\n');
      return (
        <span key={index}>
          {lines.map((line, lIdx) => {
            if (line.startsWith('### ')) {
              return <h3 key={lIdx} className="font-bold text-sm text-slate-200 mt-3 mb-1">{line.replace('### ', '')}</h3>;
            }
            if (line.startsWith('#### ')) {
              return <h4 key={lIdx} className="font-semibold text-xs text-indigo-400 mt-2 mb-1">{line.replace('#### ', '')}</h4>;
            }
            if (line.startsWith('* ') || line.startsWith('- ')) {
              return (
                <span key={lIdx} className="block pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-violet-500 my-0.5">
                  {formatInlineMarkup(line.substring(2))}
                </span>
              );
            }
            return <span key={lIdx} className="block my-1">{formatInlineMarkup(line)}</span>;
          })}
        </span>
      );
    });
  };

  const formatInlineMarkup = (text) => {
    // Regex replace **bold** with strong elements
    const boldParts = text.split(/(\*\*.*?\*\*)/g);
    return boldParts.map((bPart, idx) => {
      if (bPart.startsWith('**') && bPart.endsWith('**')) {
        return <strong key={idx} className="font-extrabold text-violet-300">{bPart.slice(2, -2)}</strong>;
      }
      // Inline code `code`
      const codeParts = bPart.split(/(`.*?`)/g);
      return codeParts.map((cPart, cIdx) => {
        if (cPart.startsWith('`') && cPart.endsWith('`')) {
          return <code key={cIdx} className="px-1.5 py-0.5 rounded bg-slate-900 border border-white/5 font-mono text-[11px] text-indigo-300 font-semibold">{cPart.slice(1, -1)}</code>;
        }
        return cPart;
      });
    });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40 no-print">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 border border-violet-400/20 hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer ${
            isOpen ? 'bg-gradient-to-tr from-rose-600 to-orange-600 shadow-rose-500/20' : ''
          }`}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          title="Quick Study Doubts"
        >
          {isOpen ? <X className="w-6 h-6 animate-spin-once" /> : <Sparkles className="w-6 h-6 animate-pulse" />}
        </motion.button>
      </div>

      {/* Slide-in Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] max-h-[80vh] border border-white/10 rounded-2xl bg-slate-950/80 backdrop-blur-xl shadow-2xl flex flex-col z-40 overflow-hidden no-print"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-violet-900/40 via-indigo-900/40 to-slate-900/40 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-violet-400" />
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    Studora Quick AI <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  </h3>
                  <span className="text-[10px] text-slate-400">Ask any doubt instantly</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5">
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse text-right' : 'text-left'}`}
                >
                  <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center border text-xs font-semibold ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-300' 
                      : 'bg-violet-600/20 border-violet-500/30 text-violet-300'
                  }`}>
                    {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-br from-indigo-600/90 to-violet-600/90 text-white rounded-tr-none'
                      : 'bg-slate-900/60 border border-white/5 text-slate-300 rounded-tl-none font-sans'
                  }`}>
                    {msg.sender === 'user' ? msg.text : formatText(msg.text)}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex gap-2.5 text-left">
                  <div className="w-7 h-7 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-3 rounded-2xl rounded-tl-none bg-slate-900/60 border border-white/5 text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form 
              onSubmit={handleSend}
              className="p-3 bg-slate-900/40 border-t border-white/5 flex gap-2 items-center"
            >
              <input
                type="text"
                placeholder="Ask doubt (e.g. explain React Hooks)..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={loading}
                className="flex-1 bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || loading}
                className={`p-2 rounded-xl bg-violet-600 text-white shadow-md shadow-violet-500/10 border border-violet-500/20 flex items-center justify-center transition-all cursor-pointer ${
                  !inputValue.trim() || loading 
                    ? 'opacity-40 cursor-not-allowed' 
                    : 'hover:bg-violet-500 active:scale-95'
                }`}
                title="Send doubt"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistantModal;
