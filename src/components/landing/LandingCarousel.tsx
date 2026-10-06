import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Dumbbell, 
  Salad, 
  Flame, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  LogIn, 
  UserPlus, 
  X,
  Compass
} from 'lucide-react';
import { getAssetUrl } from '../../utils/assets';

interface SlideItem {
  id: string;
  badge: string;
  badgeIcon: React.ElementType;
  title: string;
  highlight: string;
  description: string;
  image: string;
  features: string[];
  ctaLabel: string;
}

const CAROUSEL_SLIDES: SlideItem[] = [
  {
    id: 'training',
    badge: 'ENTRENAMIENTO ADAPTATIVO',
    badgeIcon: Dumbbell,
    title: 'Tu rutina que evoluciona',
    highlight: 'en cada sesión',
    description: 'Calistenia, entrenamiento funcional y movilidad calibrados con tu nivel real. Si hoy tenés menos energía o poco tiempo, SOYFIT ajusta volumen e intensidad al instante.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=80',
    features: [
      'Ajustes diarios según tu energía y fatiga muscular',
      'Temporizador inteligente de series y descansos guiados',
      'Vías de progresión desde principiante hasta calistenia avanzada'
    ],
    ctaLabel: 'Empezar a Entrenar'
  },
  {
    id: 'nutrition',
    badge: 'NUTRICIÓN INTELIGENTE',
    badgeIcon: Salad,
    title: 'Alimentación balanceada',
    highlight: 'sin complicaciones',
    description: 'Planes de alimentación adaptados a tu estilo de vida: omnívoro, vegetariano, vegano o keto. Cálculo dinámico de calorías y macros con recetas prácticas y fáciles de preparar.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1600&q=80',
    features: [
      'Menú diario estructurado (desayuno, almuerzo, merienda, cena)',
      'Objetivos de hidratación con registros en tiempo real',
      'Desglose exacto de proteínas, carbohidratos y grasas saludables'
    ],
    ctaLabel: 'Ver Plan Nutricional'
  },
  {
    id: 'habits',
    badge: 'HÁBITOS & CONSTANCIA',
    badgeIcon: Flame,
    title: 'Construí constancia real',
    highlight: 'un día a la vez',
    description: 'El éxito físico se construye con pequeños hábitos diarios. Registrá tus pasos, agua, estiramientos y horas de sueño para multiplicar tu racha y desbloquear nuevos niveles.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=80',
    features: [
      'Checklist interactivo de hábitos saludables diarios',
      'Sistema de gamificación con XP, rachas y medallas',
      'Recordatorios sonoros e in-app para mantener tu ritmo'
    ],
    ctaLabel: 'Forjar Hábitos'
  },
  {
    id: 'coach',
    badge: 'COACH IA & MÉTRICAS',
    badgeIcon: TrendingUp,
    title: 'Tu progreso medible',
    highlight: 'con guía personalizada',
    description: 'Analizá tu volumen semanal con gráficos interactivos, evaluá tu fuerza con pruebas periódicas y consultá a tu Entrenador IA ante dudas de técnica, dolor o descansos.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80',
    features: [
      'Revisión semanal con tendencias de cumplimiento y volumen',
      'Entrenador IA disponible para responder dudas 24/7',
      'Radar de capacidades físicas y test de reevaluación mensual'
    ],
    ctaLabel: 'Explorar Progreso'
  }
];

interface LandingCarouselProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const LandingCarousel: React.FC<LandingCarouselProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
  onOpenRegister
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);
  const [touchFeedbackSide, setTouchFeedbackSide] = useState<'left' | 'right' | null>(null);

  // NOTE: Automatic loop has been completely removed as requested.
  // The user advances manually using arrows, swiping, or tapping the left/right sides.

  // Keyboard navigation support
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  if (!isOpen) return null;

  const currentSlide = CAROUSEL_SLIDES[currentIndex];
  const BadgeIcon = currentSlide.badgeIcon;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    triggerSideFeedback('right');
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
    triggerSideFeedback('left');
  };

  const triggerSideFeedback = (side: 'left' | 'right') => {
    setTouchFeedbackSide(side);
    setTimeout(() => {
      setTouchFeedbackSide(null);
    }, 250);
  };

  // Touch Swipe Gesture Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;
    const duration = Date.now() - touchStartTime.current;

    // Detect horizontal swipe (horizontal distance > 35px and dominant over vertical)
    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY) && duration < 800) {
      if (diffX > 0) {
        // Swiped left -> advance to next
        handleNext();
      } else {
        // Swiped right -> go to previous
        handlePrev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Container Card with Glass Blurred Effect */}
      <div 
        className="relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-[#16221F]/90 backdrop-blur-2xl text-white my-auto min-h-[560px] flex flex-col justify-between"
      >
        {/* Top Floating Header Bar */}
        <div className="relative z-30 flex items-center justify-between px-5 sm:px-8 py-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#56B89D] to-[#3B967D] flex items-center justify-center text-white font-black text-sm shadow-md">
              S
            </div>
            <span className="font-black text-lg tracking-tight text-white drop-shadow-sm">
              SOYFIT
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
                onOpenLogin();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-md border border-white/20 text-xs font-bold text-white transition-all cursor-pointer shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5 text-[#56B89D]" />
              <span>Iniciar Sesión</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white active:scale-95 backdrop-blur-md transition-all cursor-pointer border border-white/10"
              aria-label="Cerrar presentación"
              title="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stories-Style Top Progress Segments (Tap directly to jump) */}
        <div className="relative z-30 px-5 sm:px-8 pt-1 pb-2 flex items-center gap-2">
          {CAROUSEL_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/20 hover:bg-white/40 transition-all cursor-pointer group"
              title={`Paso ${idx + 1}: ${slide.badge}`}
              aria-label={`Ir al paso ${idx + 1}`}
            >
              <div 
                className={`h-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'bg-[#56B89D] shadow-sm' 
                    : idx < currentIndex 
                    ? 'bg-white/60' 
                    : 'bg-transparent'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Carousel Visual Body */}
        <div className="relative flex-1 flex flex-col justify-end min-h-[460px] sm:min-h-[500px]">
          {/* Background Image with Deep Gradient Overlays */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img 
              src={getAssetUrl(currentSlide.image)} 
              alt={currentSlide.title}
              className="w-full h-full object-cover object-center transition-all duration-700 scale-105"
            />
            {/* Deep Glass Blurring Vignette Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111A18] via-[#111A18]/80 to-[#111A18]/30 backdrop-blur-[1px]" />
            <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/75" />
          </div>

          {/* TOUCH & TAP ZONES (User requested tap on left side to go back, right side to advance) */}
          {/* Left tap zone: Tap to go back */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-0 top-0 bottom-24 w-1/4 sm:w-1/3 z-15 cursor-pointer flex items-center justify-start pl-2 sm:pl-4 group transition-all"
            title="Tocá aquí para volver al anterior"
            aria-label="Anterior"
          >
            <div className="opacity-0 group-hover:opacity-100 group-active:opacity-100 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/25 text-white/90 shadow-xl transition-all scale-95 group-hover:scale-105">
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* Right tap zone: Tap to advance */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-0 top-0 bottom-24 w-1/4 sm:w-1/3 z-15 cursor-pointer flex items-center justify-end pr-2 sm:pr-4 group transition-all"
            title="Tocá aquí para avanzar al siguiente"
            aria-label="Siguiente"
          >
            <div className="opacity-0 group-hover:opacity-100 group-active:opacity-100 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/25 text-white/90 shadow-xl transition-all scale-95 group-hover:scale-105">
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* Visual Touch Flash Ripple */}
          {touchFeedbackSide && (
            <div 
              className={`absolute top-0 bottom-0 pointer-events-none transition-opacity duration-300 z-10 ${
                touchFeedbackSide === 'left' 
                  ? 'left-0 w-1/4 bg-gradient-to-r from-white/10 to-transparent' 
                  : 'right-0 w-1/4 bg-gradient-to-l from-white/10 to-transparent'
              }`} 
            />
          )}

          {/* PROMINENT LATERAL ARROW BUTTONS (Desktop & Mobile) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-25 p-3 rounded-full bg-black/55 hover:bg-[#20312D] text-white/85 hover:text-white backdrop-blur-lg border border-white/20 shadow-xl transition-all hover:scale-110 active:scale-90 flex items-center justify-center cursor-pointer"
            aria-label="Diapositiva anterior"
            title="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-25 p-3 rounded-full bg-black/55 hover:bg-[#20312D] text-white/85 hover:text-white backdrop-blur-lg border border-white/20 shadow-xl transition-all hover:scale-110 active:scale-90 flex items-center justify-center cursor-pointer"
            aria-label="Siguiente diapositiva"
            title="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Content Overlay */}
          <div className="relative z-20 p-5 sm:p-10 pt-8 max-w-3xl pointer-events-none">
            {/* Functional Category Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#56B89D]/20 backdrop-blur-md border border-[#56B89D]/40 text-[#56B89D] text-xs font-black tracking-wider uppercase mb-2 sm:mb-3 shadow-inner pointer-events-auto">
              <BadgeIcon className="w-3.5 h-3.5 text-[#56B89D]" />
              <span>{currentSlide.badge}</span>
            </div>

            {/* Slide Title */}
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight mb-2 sm:mb-3 drop-shadow-md pointer-events-auto">
              {currentSlide.title}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#56B89D] via-[#75CEB5] to-[#E9A06D]">
                {currentSlide.highlight}
              </span>
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-base text-gray-200 leading-relaxed font-normal mb-4 sm:mb-6 max-w-2xl drop-shadow-sm pointer-events-auto">
              {currentSlide.description}
            </p>

            {/* Glass Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 mb-6 sm:mb-8 pointer-events-auto">
              {currentSlide.features.map((feature, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-2 p-2 sm:p-2.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 text-xs text-white/90 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#56B89D] shrink-0 mt-0.5" />
                  <span className="leading-snug">{feature}</span>
                </div>
              ))}
            </div>

            {/* Bottom Actions Row */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pointer-events-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                  onOpenRegister();
                }}
                className="flex items-center gap-2 px-5 sm:px-6 py-3 rounded-2xl bg-gradient-to-r from-[#56B89D] to-[#3B967D] hover:from-[#4AA88F] hover:to-[#31826B] text-[#111A18] font-black text-xs sm:text-sm shadow-lg shadow-[#56B89D]/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-[#111A18]" />
                <span>Crear Cuenta & Comenzar</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                  onOpenLogin();
                }}
                className="flex items-center gap-2 px-4 sm:px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 backdrop-blur-xl border border-white/20 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#56B89D]" />
                <span>Ya tengo cuenta</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="px-3 sm:px-4 py-3 rounded-2xl text-xs font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                Explorar como invitado →
              </button>
            </div>
          </div>

          {/* Navigation Footer: Dots & Subtle Gesture Hint */}
          <div className="relative z-30 px-5 sm:px-10 pb-5 sm:pb-6 flex items-center justify-between gap-4">
            {/* Gesture Hint for Mobile / Touch Users */}
            <div className="flex items-center gap-1.5 text-[11px] text-white/60 font-medium bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <Compass className="w-3.5 h-3.5 text-[#56B89D]" />
              <span className="hidden sm:inline">Deslizá con el dedo o tocá los laterales para navegar ({currentIndex + 1}/4)</span>
              <span className="sm:hidden">Deslizá o tocá los lados ({currentIndex + 1}/4)</span>
            </div>

            {/* Slide Indicator Dots */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {CAROUSEL_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx 
                      ? 'w-7 sm:w-8 bg-[#56B89D]' 
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Ir al paso ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
