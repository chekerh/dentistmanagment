import React from 'react';
import { Calendar, UserPlus, Package, CreditCard } from 'lucide-react';
import { useLang } from '../../context/LanguageContext';

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  color: string;
  borderColor: string;
  onClick: () => void;
}

interface QuickActionsProps {
  onActionClick: (actionId: string, text?: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  const { t } = useLang();
  
  const actions: QuickAction[] = [
    {
      id: 'schedule',
      icon: <Calendar className="w-5 h-5" />,
      label: t.chatbot.quickActions.schedule,
      color: 'text-blue-500',
      borderColor: 'border-l-blue-500',
      onClick: () => onActionClick('schedule'),
    },
    {
      id: 'add-patient',
      icon: <UserPlus className="w-5 h-5" />,
      label: t.chatbot.quickActions.addPatient,
      color: 'text-orange-500',
      borderColor: 'border-l-orange-500',
      onClick: () => onActionClick('add-patient'),
    },
    {
      id: 'inventory',
      icon: <Package className="w-5 h-5" />,
      label: t.chatbot.quickActions.checkInventory,
      color: 'text-emerald-500',
      borderColor: 'border-l-emerald-500',
      onClick: () => onActionClick('inventory'),
    },
    {
      id: 'billing',
      icon: <CreditCard className="w-5 h-5" />,
      label: t.chatbot.quickActions.billing,
      color: 'text-purple-500',
      borderColor: 'border-l-purple-500',
      onClick: () => onActionClick('billing'),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 md:gap-3 pb-2">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={action.onClick}
          className={`flex flex-col items-start p-3 md:p-4 bg-white border-l-4 ${action.borderColor} rounded-xl shadow-sm hover:shadow-md active:shadow-lg transition-all text-left group touch-manipulation`}
        >
          <div className={`${action.color} mb-1.5 md:mb-2 group-hover:scale-110 group-active:scale-105 transition-transform`}>
            {action.icon}
          </div>
          <span className="text-[11px] md:text-xs font-bold text-slate-800 leading-tight">{action.label}</span>
        </button>
      ))}
    </div>
  );
};
