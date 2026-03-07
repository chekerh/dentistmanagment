import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SuggestedChipsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

export const SuggestedChips: React.FC<SuggestedChipsProps> = ({
  suggestions,
  onSuggestionClick,
}) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          className="bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full text-[12px] font-medium text-blue-500 transition-all flex items-center gap-1"
        >
          {suggestion}
          <ArrowRight className="w-3 h-3" />
        </button>
      ))}
    </div>
  );
};
