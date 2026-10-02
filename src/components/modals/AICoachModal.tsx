import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User as UserIcon, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';

interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AICoachModal: React.FC<AICoachModalProps> = ({ isOpen, onClose }) => {
  const { 
    coachMessages, 
    sendCoachMessage, 
    user, 
    readiness, 
    scores,
    todayWorkout,
    launchQuickWorkout,
    updateReadiness,
    setCurrentTab
  } = useFitness();
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendCoachMessage(inputText.trim());
    setInputText('');
  };

  const handleExecuteQuickAction = (action: NonNullable<(typeof coachMessages)[0]['quickAction']>) => {
    onClose();
    if (action.actionType === 'shorten_workout') {
      launchQuickWorkout(15);
    } else if (action.actionType === 'switch_to_recovery') {
      updateReadiness('okay', 2, 'moderate');
      setCurrentTab('train');
    } else {
      setCurrentTab('train');
    }
  };

  const samplePrompts = [
    "Solo tengo 15 minutos hoy",
    "El entrenamiento de hoy se siente muy pesado",
    "¿Por qué la rutina de hoy es más suave?",
    "¿Cómo avanzo en mis flexiones de brazos?",
    "Dame mi resumen semanal"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/45 backdrop-blur-md overflow-y-auto">
      <div 
        id="fit-coach-modal"
        className="relative w-full max-w-xl bg-[#F4F3EC] border border-white/80 rounded-[32px] shadow-2xl flex flex-col h-[640px] max-h-[90vh] text-[#20312D] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-white/70 border-b border-white/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#56B89D] to-[#3B967D] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-[#20312D]">ENTRENADOR IA</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#DCEFE8] text-[#20312D] text-[10px] font-bold">
                  IA adaptativa
                </span>
              </div>
              <p className="text-[11px] text-[#6F7D78]">
                Adaptado a {user.name ? user.name.trim().split(/\s+/)[0] : 'Daniela'} • Nivel: {scores.calculatedLevel} • Disposición: {readiness.readinessScore}%
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-[#6F7D78] hover:text-[#20312D] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {coachMessages.map(msg => {
            const isCoach = msg.sender === 'coach';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isCoach ? 'justify-start' : 'justify-end'}`}
              >
                {isCoach && (
                  <div className="w-8 h-8 rounded-xl bg-[#DCEFE8] text-[#56B89D] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div className={`
                  max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed
                  ${isCoach 
                    ? 'bg-white/90 border border-white text-[#20312D] shadow-xs' 
                    : 'bg-[#20312D] text-white'
                  }
                `}>
                  <p>{msg.text}</p>
                  <span className={`text-[10px] block mt-1.5 ${isCoach ? 'text-[#6F7D78]' : 'text-gray-300'}`}>
                    {msg.timestamp}
                  </span>

                  {msg.quickAction && (
                    <div className="mt-3 pt-2 border-t border-black/5">
                      <button
                        type="button"
                        onClick={() => handleExecuteQuickAction(msg.quickAction!)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#56B89D] hover:bg-[#46A389] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      >
                        <span>{msg.quickAction.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                {!isCoach && (
                  <div className="w-8 h-8 rounded-xl bg-white border border-black/5 text-[#20312D] flex items-center justify-center shrink-0 mt-0.5">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-5 py-2 overflow-x-auto flex gap-2 border-t border-white/60 bg-white/40 no-scrollbar">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => sendCoachMessage(prompt)}
              className="px-3 py-1.5 rounded-full bg-white/80 border border-white text-[11px] font-semibold text-[#20312D] hover:bg-[#DCEFE8] whitespace-nowrap transition-colors shadow-2xs cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-white/80 border-t border-white/80 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Consultale a tu Entrenador IA sobre tu rutina, técnica o recuperación..."
            className="flex-1 px-4 py-3 bg-white border border-black/10 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#56B89D]"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 rounded-2xl bg-[#20312D] text-white hover:bg-black disabled:opacity-40 transition-colors shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Non-Medical Notice */}
        <div className="px-4 py-1.5 bg-[#F5D5C2]/30 text-[10px] text-[#6F7D78] text-center">
          El Entrenador IA ofrece orientación deportiva y de progresión funcional. No sustituye la consulta médica profesional.
        </div>
      </div>
    </div>
  );
};
