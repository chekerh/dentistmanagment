import React, { useState, KeyboardEvent } from 'react';
import { Send, Mic } from 'lucide-react';
import { useLang } from '../../context/LanguageContext';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
}) => {
  const { t } = useLang();
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <footer className="glass-input p-3 md:p-4 mt-auto bg-white/90 backdrop-blur-md border-t border-slate-200 safe-area-bottom">
      <div className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="w-full bg-slate-100 border-none rounded-xl py-3 md:py-3 pl-4 pr-20 md:pr-20 text-sm md:text-[14px] placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          placeholder={t.chatbot.placeholder}
        />
        <div className="absolute right-2 flex items-center gap-1">
          <button
            type="button"
            className="w-9 h-9 md:w-8 md:h-8 flex items-center justify-center text-slate-400 hover:text-blue-500 active:text-blue-600 transition-colors touch-manipulation"
            aria-label="Voice input"
          >
            <Mic className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            className="w-9 h-9 md:w-8 md:h-8 flex items-center justify-center bg-blue-500 text-white rounded-lg shadow-md shadow-blue-500/30 hover:bg-blue-600 active:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
      <p className="text-[10px] text-center text-slate-400 mt-3 font-medium uppercase tracking-widest">
        {t.chatbot.poweredBy}
      </p>
    </footer>
  );
};
