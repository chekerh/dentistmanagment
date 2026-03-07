import React from 'react';
import { MessageCircle } from 'lucide-react';

interface ChatbotButtonProps {
  onClick: () => void;
  hasUnreadMessages?: boolean;
  unreadCount?: number;
}

export const ChatbotButton: React.FC<ChatbotButtonProps> = ({
  onClick,
  hasUnreadMessages = false,
  unreadCount = 0,
}) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center text-white z-[999] group touch-manipulation"
      aria-label="Open DentoFlow Assistant"
    >
      <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
      
      {hasUnreadMessages && (
        <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] md:text-xs font-bold shadow-lg animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </div>
      )}
      
      <div className="absolute inset-0 rounded-full bg-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
    </button>
  );
};
