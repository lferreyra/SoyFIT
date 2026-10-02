import React, { useState } from 'react';
import { X, Trophy, ArrowRight, Sparkles, TrendingUp, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFitness } from '../../context/FitnessContext';
import { calculateFitnessScores } from '../../services/adaptiveEngine';

interface ReassessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReassessmentModal: React.FC<ReassessmentModalProps> = ({ isOpen, onClose }) => {
  const { scores, submitAssessment } = useFitness();
  const [completed, setCompleted] = useState(false);

  // New re-test values
  const [pushupCurrent, setPushupCurrent] = useState(14);
  const [squatCurrent, setSquatCurrent] = useState(32);
  const [plankCurrent, setPlankCurrent] = useState(71);

  if (!isOpen) return null;

  const handleApplyReassessment = () => {
    // Dynamically calculate scores based on re-test inputs
    const dynamicScores = calculateFitnessScores({
      pushupVariation: pushupCurrent >= 15 ? 'standard' : pushupCurrent >= 8 ? 'knee' : 'incline',
      pushupReps: pushupCurrent,
      squatReps: squatCurrent,
      plankSeconds: plankCurrent,
      mobilityScore: Math.min(5, Math.max(1, Math.round((scores.mobilityScore || 50) / 20)))
    });

    submitAssessment(dynamicScores);

    setCompleted(true);
    try {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#56B89D', '#F5D5C2', '#E9A06D', '#20312D']
      });
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md overflow-y-auto">
      <div 
        id="reassessment-modal"
        className="relative w-full max-w-lg bg-[#F4F3EC] border border-white/80 rounded-[32px] p-6 sm:p-8 shadow-2xl my-6 text-[#20312D]"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-[#6F7D78] hover:text-[#20312D] cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!completed ? (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-extrabold tracking-widest text-[#56B89D] uppercase">
                Evaluación de ciclo de 4 semanas
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#20312D] mt-1">
                Tu próxima evaluación está lista
              </h2>
              <p className="text-xs text-[#6F7D78] mt-1">
                Comprobá tus adaptaciones físicas reevaluando tus movimientos clave. Tu puntaje actualizado calibrará tu próximo bloque de 4 semanas.
              </p>
            </div>

            {/* Test Inputs & Comparative Baseline */}
            <div className="space-y-3">
              {/* Push-up test comparison */}
              <div className="bg-white/90 border border-white rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-[#20312D]">Empuje de tren superior (Inclinado)</h4>
                  <span className="text-[11px] text-[#6F7D78]">Puntaje base inicial: 6 reps</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#6F7D78]">Ahora:</span>
                  <input
                    type="number"
                    value={pushupCurrent}
                    onChange={e => setPushupCurrent(Number(e.target.value))}
                    className="w-16 px-2 py-1.5 bg-[#F4F3EC] rounded-xl text-sm font-black text-center text-[#20312D] border border-black/10"
                  />
                  <span className="text-xs font-extrabold text-[#56B89D]">+133%</span>
                </div>
              </div>

              {/* Squat comparison */}
              <div className="bg-white/90 border border-white rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-[#20312D]">Sentadillas al aire (45 seg)</h4>
                  <span className="text-[11px] text-[#6F7D78]">Puntaje base inicial: 18 reps</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#6F7D78]">Ahora:</span>
                  <input
                    type="number"
                    value={squatCurrent}
                    onChange={e => setSquatCurrent(Number(e.target.value))}
                    className="w-16 px-2 py-1.5 bg-[#F4F3EC] rounded-xl text-sm font-black text-center text-[#20312D] border border-black/10"
                  />
                  <span className="text-xs font-extrabold text-[#56B89D]">+78%</span>
                </div>
              </div>

              {/* Plank comparison */}
              <div className="bg-white/90 border border-white rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-[#20312D]">Plancha frontal isométrica</h4>
                  <span className="text-[11px] text-[#6F7D78]">Puntaje base inicial: 32 seg</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#6F7D78]">Ahora:</span>
                  <input
                    type="number"
                    value={plankCurrent}
                    onChange={e => setPlankCurrent(Number(e.target.value))}
                    className="w-16 px-2 py-1.5 bg-[#F4F3EC] rounded-xl text-sm font-black text-center text-[#20312D] border border-black/10"
                  />
                  <span className="text-xs font-extrabold text-[#56B89D]">+122%</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleApplyReassessment}
              className="w-full py-4 rounded-2xl bg-[#56B89D] hover:bg-[#46A389] text-white font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Actualizar nivel y calibrar nuevo plan</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6 text-center py-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-[#DCEFE8] text-[#56B89D] flex items-center justify-center mx-auto shadow-md">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-black tracking-widest text-[#56B89D] uppercase">
                ¡ASCENSO DE NIVEL DESBLOQUEADO!
              </span>
              <h2 className="text-3xl font-black text-[#20312D] mt-1">
                Ascendiste a Intermedio 1
              </h2>
              <p className="text-xs text-[#6F7D78] mt-1">
                Tu puntaje físico subió de 54 a 68. ¡Tu nuevo ciclo de 4 semanas incorpora flexiones de brazos completas y sentadillas búlgaras!
              </p>
            </div>

            <div className="bg-white/80 border border-white rounded-2xl p-4 text-left space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#20312D]">Caminos de progresión desbloqueados:</span>
                <span className="font-extrabold text-[#56B89D]">+2 Nuevos movimientos</span>
              </div>
              <p className="text-[11px] text-[#6F7D78]">
                ✓ Flexiones negativas desbloqueadas en el Camino de flexiones<br/>
                ✓ Sentadillas búlgaras desbloqueadas en el Camino de sentadillas
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-[#20312D] text-white font-extrabold text-sm shadow-md hover:bg-black transition-all cursor-pointer"
            >
              Explorar programa actualizado
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
