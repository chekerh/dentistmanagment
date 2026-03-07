import React, { useRef, useEffect } from 'react';
import { ChatMessage, ChatMessageLoading, Message } from './ChatMessage';
import { QuickActions } from './QuickActions';
import { useLang } from '../../context/LanguageContext';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  showWelcome: boolean;
  onConfirmCommand: (messageId: string) => void;
  onCancelCommand: (messageId: string) => void;
  onSuggestionClick: (suggestion: string) => void;
  onQuickAction: (actionId: string, text?: string) => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  showWelcome,
  onConfirmCommand,
  onCancelCommand,
  onSuggestionClick,
  onQuickAction,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLang();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-slate-50/30">
      {showWelcome && (
        <>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white shrink-0 shadow-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
            </div>
            <div className="space-y-2">
              <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[280px]">
                <p className="text-[14px] leading-relaxed text-slate-700">
                  {t.chatbot.welcome}
                </p>
              </div>
            </div>
          </div>

          <QuickActions onActionClick={onQuickAction} />
        </>
      )}

      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          onConfirmCommand={onConfirmCommand}
          onCancelCommand={onCancelCommand}
          onSuggestionClick={onSuggestionClick}
        />
      ))}

      {isLoading && <ChatMessageLoading />}

      <div ref={messagesEndRef} />
    </div>
  );
};
