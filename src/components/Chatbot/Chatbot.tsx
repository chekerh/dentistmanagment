import React, { useState } from 'react';
import { ChatbotButton } from './ChatbotButton';
import { ChatWindow } from './ChatWindow';

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <ChatbotButton
        onClick={handleToggle}
        hasUnreadMessages={hasUnread && !isOpen}
        unreadCount={3}
      />
      <ChatWindow isOpen={isOpen} onClose={handleClose} />
    </>
  );
};
