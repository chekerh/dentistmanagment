import React from 'react';
import { Bot } from 'lucide-react';
import { TypingIndicator } from './TypingIndicator';
import { CommandPreview, CommandData } from './CommandPreview';
import { SuggestedChips } from './SuggestedChips';

export type MessageType = 'user' | 'bot' | 'command-preview' | 'success' | 'error';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  commandData?: CommandData;
  actionType?: string;
  suggestions?: string[];
  aiSource?: 'local' | 'cloud';
}

interface ChatMessageProps {
  message: Message;
  onConfirmCommand?: (messageId: string) => void;
  onCancelCommand?: (messageId: string) => void;
  onSuggestionClick?: (suggestion: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onConfirmCommand,
  onCancelCommand,
  onSuggestionClick,
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (message.type === 'user') {
    return (
      <div className="flex items-start justify-end gap-2 md:gap-3">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 md:p-4 rounded-2xl rounded-tr-none shadow-lg shadow-blue-500/20 max-w-[85%] md:max-w-[280px]">
          <p className="text-sm md:text-[14px] leading-relaxed text-white break-words">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 md:gap-3">
      <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white shrink-0 shadow-sm">
        <Bot className="w-4 h-4 md:w-5 md:h-5" />
      </div>
      <div className="space-y-3 w-full">
        {message.content && (
          <div className="bg-white border border-slate-100 p-3 md:p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] md:max-w-[280px]">
            <p className="text-sm md:text-[14px] leading-relaxed text-slate-700 whitespace-pre-line break-words">
              {message.content}
            </p>
            {message.aiSource && (
              <div className="mt-2 flex items-center gap-1">
                <span className={`text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded-full ${
                  message.aiSource === 'cloud' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-green-100 text-green-600'
                }`}>
                  {message.aiSource === 'cloud' ? '🌐 Cloud AI' : '💻 Local AI'}
                </span>
              </div>
            )}
          </div>
        )}

        {message.type === 'command-preview' && message.commandData && message.actionType && (
          <CommandPreview
            data={message.commandData}
            actionType={message.actionType}
            onConfirm={() => onConfirmCommand?.(message.id)}
            onCancel={() => onCancelCommand?.(message.id)}
          />
        )}

        {message.suggestions && message.suggestions.length > 0 && onSuggestionClick && (
          <SuggestedChips
            suggestions={message.suggestions}
            onSuggestionClick={onSuggestionClick}
          />
        )}

        <p className="text-[10px] text-slate-400 ml-1">{formatTime(message.timestamp)}</p>
      </div>
    </div>
  );
};

export const ChatMessageLoading: React.FC = () => {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white shrink-0 shadow-sm">
        <Bot className="w-5 h-5" />
      </div>
      <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
        <TypingIndicator />
      </div>
    </div>
  );
};
