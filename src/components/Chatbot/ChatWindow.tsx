import React, { useState } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ConfirmationModal, ConfirmationData } from './ConfirmationModal';
import { Message } from './ChatMessage';
import { useLang } from '../../context/LanguageContext';
import { mockPatients } from '../../data/mockData';
import { format, addDays } from 'date-fns';
import { fr, ar } from 'date-fns/locale';
import { aiService } from '../../services/ai/aiService';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
}

interface PendingAppointment {
  patientName?: string;
  treatment?: string;
  date?: string;
  time?: string;
  doctor?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  onClose,
  onMinimize,
}) => {
  const { t, lang } = useLang();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null);
  const [pendingAppointment, setPendingAppointment] = useState<PendingAppointment>({});
  const [conversationState, setConversationState] = useState<'idle' | 'awaiting-time' | 'awaiting-doctor' | 'awaiting-treatment'>('idle');
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'user' | 'bot'; content: string }>>([]);

  const getDateLocale = () => {
    switch (lang) {
      case 'fr': return fr;
      case 'ar': return ar;
      default: return undefined;
    }
  };

  const parseAppointmentRequest = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    // Check for patient names
    const patient = mockPatients.find(p => {
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
      return lowerInput.includes(fullName.toLowerCase()) ||
             lowerInput.includes(p.firstName.toLowerCase()) ||
             lowerInput.includes(p.lastName.toLowerCase());
    });

    // Extract treatment type
    let treatment = '';
    const treatmentKeywords = {
      'root canal': 'root-canal',
      'cleaning': 'cleaning',
      'checkup': 'checkup',
      'check-up': 'checkup',
      'filling': 'filling',
      'extraction': 'extraction',
      'crown': 'crown',
      'whitening': 'whitening',
      'implant': 'implant',
    };

    for (const [keyword, value] of Object.entries(treatmentKeywords)) {
      if (lowerInput.includes(keyword)) {
        treatment = value;
        break;
      }
    }

    // Extract date
    let dateStr = '';
    const today = new Date();
    if (lowerInput.includes('today')) {
      dateStr = format(today, 'PPP', { locale: getDateLocale() });
    } else if (lowerInput.includes('tomorrow')) {
      dateStr = format(addDays(today, 1), 'PPP', { locale: getDateLocale() });
    } else if (lowerInput.includes('monday')) {
      dateStr = format(addDays(today, 7), 'PPP', { locale: getDateLocale() });
    } else if (lowerInput.includes('tuesday')) {
      dateStr = format(addDays(today, 8), 'PPP', { locale: getDateLocale() });
    }

    return {
      patient,
      treatment,
      dateStr,
    };
  };

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setConversationHistory((prev) => [...prev, { role: 'user', content }]);
    setIsLoading(true);

    try {
      await processUserMessage(content);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: t.chatbot.messages.error,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const processUserMessage = async (content: string) => {
    // Use AI to understand intent
    const aiResponse = await aiService.processMessage(content, conversationHistory);
    
    // Add bot response to conversation history
    setConversationHistory((prev) => [...prev, { role: 'bot', content: aiResponse.message }]);
    
    const { intent } = aiResponse;
    
    // Handle scheduling flow with multi-step state management
    if (intent.entity === 'appointment' && intent.action === 'create') {
      await handleAppointmentScheduling(intent, aiResponse);
    } else if (intent.entity === 'patient') {
      await handlePatientQuery(intent, aiResponse);
    } else if (intent.entity === 'inventory') {
      await handleInventoryQuery(intent, aiResponse);
    } else {
      // Generic response
      const botResponse: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: aiResponse.message,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
        aiSource: intent.source,
      };
      setMessages((prev) => [...prev, botResponse]);
    }
  };

  const handleAppointmentScheduling = async (intent: any, _aiResponse: any) => {
    const { params } = intent;
    
    // Check if we have all required info
    if (!params.patientName) {
      // Ask for patient
      const patientSuggestions = mockPatients.slice(0, 5).map(p => `${p.firstName} ${p.lastName}`);
      const botResponse: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: t.chatbot.messages.selectPatient,
        timestamp: new Date(),
        suggestions: patientSuggestions,
        aiSource: intent.source,
      };
      setMessages((prev) => [...prev, botResponse]);
      setConversationState('awaiting-treatment');
      return;
    }

    setPendingAppointment(prev => ({ ...prev, patientName: params.patientName }));

    if (!params.treatment) {
      // Ask for treatment
      const treatments = ['Cleaning', 'Checkup', 'Filling', 'Root Canal', 'Extraction', 'Crown'];
      const botResponse: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: t.chatbot.messages.selectTreatment,
        timestamp: new Date(),
        suggestions: treatments,
        aiSource: intent.source,
      };
      setMessages((prev) => [...prev, botResponse]);
      setPendingAppointment(prev => ({ ...prev, patientName: params.patientName }));
      setConversationState('awaiting-time');
      return;
    }

    setPendingAppointment(prev => ({ ...prev, treatment: params.treatment }));

    if (!params.time) {
      // Ask for time
      const botResponse: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: t.chatbot.messages.selectTime,
        timestamp: new Date(),
        suggestions: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        aiSource: intent.source,
      };
      setMessages((prev) => [...prev, botResponse]);
      setPendingAppointment(prev => ({ ...prev, patientName: params.patientName, treatment: params.treatment }));
      setConversationState('awaiting-doctor');
      return;
    }

    setPendingAppointment(prev => ({ ...prev, time: params.time }));

    if (!params.doctor) {
      // Ask for doctor
      const botResponse: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: t.chatbot.messages.selectDoctor,
        timestamp: new Date(),
        suggestions: ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams'],
        aiSource: intent.source,
      };
      setMessages((prev) => [...prev, botResponse]);
      setPendingAppointment(prev => ({ 
        ...prev, 
        patientName: params.patientName, 
        treatment: params.treatment,
        time: params.time 
      }));
      setConversationState('idle');
      return;
    }

    // All info collected - show preview
    const appointment: PendingAppointment = {
      patientName: params.patientName,
      treatment: params.treatment,
      date: params.date || format(new Date(), 'PPP', { locale: getDateLocale() }),
      time: params.time,
      doctor: params.doctor,
    };
    setPendingAppointment(appointment);
    showAppointmentPreview(appointment);
    setConversationState('idle');
  };

  const handlePatientQuery = async (intent: any, _aiResponse: any) => {
    const { params } = intent;
    
    if (params.patientName) {
      // Find patient in mock data
      const patient = mockPatients.find(p => 
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(params.patientName.toLowerCase())
      );

      if (patient) {
        const botResponse: Message = {
          id: Date.now().toString(),
          type: 'bot',
          content: `**${patient.firstName} ${patient.lastName}**\n\n📧 ${patient.email}\n📞 ${patient.phone}\n💊 Allergies: ${patient.allergies || 'None'}`,
          timestamp: new Date(),
          suggestions: ['Schedule appointment', 'View history', 'Update info'],
          aiSource: intent.source,
        };
        setMessages((prev) => [...prev, botResponse]);
      } else {
        const botResponse: Message = {
          id: Date.now().toString(),
          type: 'bot',
          content: t.chatbot.messages.patientNotFound,
          timestamp: new Date(),
          aiSource: intent.source,
        };
        setMessages((prev) => [...prev, botResponse]);
      }
    } else {
      // List all patients
      const patientList = mockPatients.slice(0, 5).map(p => `${p.firstName} ${p.lastName}`).join('\n- ');
      const botResponse: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: `Recent patients:\n- ${patientList}`,
        timestamp: new Date(),
        suggestions: mockPatients.slice(0, 3).map(p => `${p.firstName} ${p.lastName}`),
        aiSource: intent.source,
      };
      setMessages((prev) => [...prev, botResponse]);
    }
  };

  const handleInventoryQuery = async (intent: any, aiResponse: any) => {
    const botResponse: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: aiResponse.message + '\n\n(Inventory feature coming soon)',
      timestamp: new Date(),
      suggestions: aiResponse.suggestions,
      aiSource: intent.source,
    };
    setMessages((prev) => [...prev, botResponse]);
  };

  // Handle conversation state responses
  const handleStateResponse = async (content: string) => {
    if (conversationState === 'awaiting-treatment') {
      // Check if user selected a patient
      const patient = mockPatients.find(p => {
        const fullName = `${p.firstName} ${p.lastName}`;
        return fullName === content || content.includes(fullName);
      });

      if (patient) {
        const patientName = `${patient.firstName} ${patient.lastName}`;
        setPendingAppointment({ patientName });
        
        const treatments = ['Cleaning', 'Checkup', 'Filling', 'Root Canal', 'Extraction', 'Crown'];
        const botResponse: Message = {
          id: Date.now().toString(),
          type: 'bot',
          content: t.chatbot.messages.selectTreatment,
          timestamp: new Date(),
          suggestions: treatments,
        };
        setMessages((prev) => [...prev, botResponse]);
        setConversationHistory((prev) => [...prev, { role: 'bot', content: t.chatbot.messages.selectTreatment }]);
        setConversationState('awaiting-time');
        return true;
      }
    }

    if (conversationState === 'awaiting-time') {
      setPendingAppointment(prev => ({ ...prev, treatment: content }));
      
      const botResponse: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: t.chatbot.messages.selectTime,
        timestamp: new Date(),
        suggestions: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      };
      setMessages((prev) => [...prev, botResponse]);
      setConversationHistory((prev) => [...prev, { role: 'bot', content: t.chatbot.messages.selectTime }]);
      setConversationState('awaiting-doctor');
      return true;
    }

    if (conversationState === 'awaiting-doctor') {
      setPendingAppointment(prev => ({ ...prev, time: content }));
      
      const botResponse: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: t.chatbot.messages.selectDoctor,
        timestamp: new Date(),
        suggestions: ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams'],
      };
      setMessages((prev) => [...prev, botResponse]);
      setConversationHistory((prev) => [...prev, { role: 'bot', content: t.chatbot.messages.selectDoctor }]);
      setConversationState('idle');
      return true;
    }

    return false;
  };

  const showAppointmentPreview = (appointment: PendingAppointment) => {
    const botResponse: Message = {
      id: Date.now().toString(),
      type: 'command-preview',
      content: '',
      timestamp: new Date(),
      actionType: 'schedule',
      commandData: {
        patientName: appointment.patientName,
        treatment: appointment.treatment,
        date: appointment.date,
        time: appointment.time,
        doctor: appointment.doctor,
      },
      suggestions: [t.chatbot.suggestions.checkAvailability, t.chatbot.suggestions.sendReminder],
    };
    setMessages((prev) => [...prev, botResponse]);
  };

  const handleConfirmCommand = (_messageId: string) => {
    const message = messages.find((m) => m.type === 'command-preview');
    if (message && message.commandData) {
      setConfirmationData(message.commandData);
      setShowConfirmModal(true);
    }
  };

  const handleCancelCommand = (_messageId: string) => {
    const botResponse: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: t.chatbot.messages.cancelled,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botResponse]);
    setConversationState('idle');
    setPendingAppointment({});
  };

  const handleModalConfirm = () => {
    setShowConfirmModal(false);

    // Simulate API call
    setTimeout(() => {
      const successMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: t.chatbot.messages.success,
        timestamp: new Date(),
        suggestions: [t.chatbot.suggestions.viewDetails, t.chatbot.suggestions.scheduleAnother],
      };
      setMessages((prev) => [...prev, successMessage]);
      setPendingAppointment({});
      setConversationState('idle');
    }, 500);
  };

  const handleModalCancel = () => {
    setShowConfirmModal(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleQuickAction = (actionId: string) => {
    if (actionId === 'schedule-appointment' || actionId === 'schedule') {
      const patientNames = mockPatients.slice(0, 5).map(p => `${p.firstName} ${p.lastName}`);
      const botResponse: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: t.chatbot.messages.selectPatient,
        timestamp: new Date(),
        suggestions: patientNames,
      };
      setMessages((prev) => [...prev, botResponse]);
      setConversationState('awaiting-treatment');
    } else {
      const botResponse: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: t.chatbot.messages.processing,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile: Full screen overlay, Desktop: Floating window */}
      <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-[400px] md:h-[650px] w-full h-full bg-white md:rounded-2xl shadow-2xl border-0 md:border md:border-slate-200 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-4 md:fade-in duration-300">
        <ChatHeader onClose={onClose} onMinimize={onMinimize} />

        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          showWelcome={messages.length === 0}
          onConfirmCommand={handleConfirmCommand}
          onCancelCommand={handleCancelCommand}
          onSuggestionClick={handleSuggestionClick}
          onQuickAction={handleQuickAction}
        />

        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        title={t.chatbot.commands.confirmAction}
        subtitle={t.chatbot.commands.scheduling}
        data={confirmationData || {}}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </>
  );
};
