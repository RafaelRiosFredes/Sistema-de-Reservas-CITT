import React from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";

interface ModalConfirmacionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  isDestructive?: boolean;
}

export const ModalConfirmacion: React.FC<ModalConfirmacionProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  isDestructive = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
              {isDestructive ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
            </div>
            <h3 className="text-xl font-bold text-slate-800 m-0">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors border-none cursor-pointer bg-transparent"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="text-slate-600 text-[15px] leading-relaxed">
            {message}
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2.5 text-sm font-bold text-white rounded-xl transition-all cursor-pointer border-none shadow-sm ${
              isDestructive 
                ? "bg-red-600 hover:bg-red-700 shadow-red-200" 
                : "bg-[#003B5C] hover:bg-[#002842] shadow-blue-200"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
