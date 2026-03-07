import React from 'react';
import { User, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useLang } from '../../context/LanguageContext';

export interface CommandData {
  patientName?: string;
  treatment?: string;
  date?: string;
  time?: string;
  duration?: string;
  [key: string]: any;
}

interface CommandPreviewProps {
  data: CommandData;
  actionType: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const CommandPreview: React.FC<CommandPreviewProps> = ({
  data,
  actionType,
  onConfirm,
  onCancel,
}) => {
  const { t } = useLang();
  
  return (
    <div className="bg-white border-l-4 border-l-blue-500 rounded-xl shadow-sm overflow-hidden border border-slate-100">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-50 pb-2">
          <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">
            {t.chatbot.commands.confirmAction}
          </h4>
          <span className="bg-blue-500/10 text-blue-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
            {actionType === 'schedule' ? t.chatbot.commands.scheduling : t.chatbot.commands.patient}
          </span>
        </div>

        <div className="space-y-2">
          {data.patientName && (
            <div className="flex items-center gap-3 text-slate-600">
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium">{data.patientName}</span>
            </div>
          )}

          {data.treatment && (
            <div className="flex items-center gap-3 text-slate-600">
              <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
              <span className="text-sm">{data.treatment}</span>
            </div>
          )}

          {data.date && (
            <div className="flex items-center gap-3 text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-sm">{data.date}</span>
            </div>
          )}

          {data.time && (
            <div className="flex items-center gap-3 text-slate-600">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-sm">{data.time}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onConfirm}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-[13px] font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {t.chatbot.commands.confirm}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border border-slate-200 text-slate-500 hover:bg-slate-50 text-[13px] font-bold py-2 rounded-lg transition-colors"
          >
            {t.chatbot.commands.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};
