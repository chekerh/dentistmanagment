import React from 'react';
import { Calendar, CheckCircle, Loader2 } from 'lucide-react';
import { useLang } from '../../context/LanguageContext';

export interface ConfirmationData {
  patientName?: string;
  treatment?: string;
  date?: string;
  time?: string;
  duration?: string;
  status?: string;
  [key: string]: any;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  data: ConfirmationData;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  actionIcon?: React.ReactNode;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  subtitle,
  data,
  onConfirm,
  onCancel,
  isLoading = false,
  actionIcon,
}) => {
  const { t } = useLang();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-md px-4">
      <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex flex-col items-center pt-10 pb-6 px-8 text-center">
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
            {actionIcon || (
              <Calendar className="w-10 h-10 text-blue-500" />
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h1>
          <p className="mt-2 text-slate-500 text-sm">{subtitle}</p>
        </div>

        {/* Summary Card */}
        <div className="px-8 pb-8">
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-5 space-y-4">
            {data.patientName && (
              <div className="flex items-start justify-between border-b border-slate-200/60 pb-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    {t.chatbot.commands.patient}
                  </p>
                  <p className="text-slate-900 font-semibold">{data.patientName}</p>
                </div>
                <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}

            {data.treatment && (
              <div className="flex items-start justify-between border-b border-slate-200/60 pb-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    {t.chatbot.commands.procedure}
                  </p>
                  <p className="text-slate-900 font-semibold">{data.treatment}</p>
                </div>
                <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {data.date && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    {t.chatbot.commands.date}
                  </p>
                  <p className="text-slate-900 font-semibold text-sm">{data.date}</p>
                </div>
              )}

              {data.time && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    {t.chatbot.commands.time}
                  </p>
                  <p className="text-slate-900 font-semibold text-sm">{data.time}</p>
                </div>
              )}

              {data.doctor && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    {t.chatbot.commands.doctor}
                  </p>
                  <p className="text-slate-900 font-semibold text-sm">{data.doctor}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-8 pb-10 flex flex-col gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/25 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t.common.loading}</span>
              </>
            ) : (
              <>
                <span>{t.chatbot.commands.confirm}</span>
                <CheckCircle className="w-5 h-5" />
              </>
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="w-full h-12 bg-transparent border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.chatbot.commands.cancel}
          </button>
        </div>

        {/* Footer Decor */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500/20 via-blue-500 to-blue-500/20"></div>
      </div>
    </div>
  );
};
