import React from 'react';
import { Minus, X, Bot } from 'lucide-react';
import { useLang } from '../../context/LanguageContext';

interface ChatHeaderProps {
  onMinimize?: () => void;
  onClose: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onMinimize, onClose }) => {
  const { t } = useLang();

  return (
    <header className="glass-header sticky top-0 z-20 flex items-center justify-between px-5 py-4 shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
            <Bot className="w-6 h-6" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full pulse-online"></div>
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800 leading-none">
            {t.chatbot.title}
          </h2>
          <p className="text-[11px] font-medium text-green-500 mt-1 uppercase tracking-wider">
            {t.chatbot.online}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {onMinimize && (
          <button
            onClick={onMinimize}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Minimize chat"
          >
            <Minus className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
