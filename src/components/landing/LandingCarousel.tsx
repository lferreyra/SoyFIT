import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Dumbbell, 
  Salad, 
  Flame, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  LogIn, 
  UserPlus, 
  X,
  ShieldCheck,
  Zap,
  Play
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
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-advance slides every 6 seconds if not paused
  useEffect(() => {
    if (!isOpen || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isOpen, isPaused]);

  if (!isOpen) return null;

  const currentSlide = CAROUSEL_SLIDES[currentIndex];
  const BadgeIcon = currentSlide.badgeIcon;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Container Card with Glass Blurred Effect */}
      <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-[#16221F]/90 backdrop-blur-2xl text-white my-auto">
        
        {/* Top Floating Header Bar */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-5 sm:px-8 py-4 bg-gradient-to-b from-black/70 to-transparent">
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
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold text-white transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-[#56B89D]" />
              <span>Iniciar Sesión</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-md transition-all cursor-pointer"
              aria-label="Cerrar presentación"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Visual Body */}
        <div className="relative min-h-[480px] sm:min-h-[540px] flex flex-col justify-end">
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src={getAssetUrl(currentSlide.image)} 
              alt={currentSlide.title}
              className="w-full h-full object-cover object-center transition-all duration-700 scale-105"
            />
            {/* Deep Glass Blurring Vignette Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111A18] via-[#111A18]/75 to-[#111A18]/30 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/70" />
          </div>

          {/* Slide Content Overlay */}
          <div className="relative z-10 p-6 sm:p-10 pt-20 max-w-3xl">
            {/* Functional Category Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#56B89D]/20 backdrop-blur-md border border-[#56B89D]/40 text-[#56B89D] text-xs font-black tracking-wider uppercase mb-3 shadow-inner">
              <BadgeIcon className="w-3.5 h-3.5 text-[#56B89D]" />
              <span>{currentSlide.badge}</span>
            </div>

            {/* Slide Title */}
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight mb-3 drop-shadow-md">
              {currentSlide.title}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#56B89D] via-[#75CEB5] to-[#E9A06D]">
                {currentSlide.highlight}
              </span>
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal mb-6 max-w-2xl drop-shadow-sm">
              {currentSlide.description}
            </p>

            {/* Glass Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-8">
              {currentSlide.features.map((feature, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-2 p-2.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 text-xs text-white/90 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#56B89D] shrink-0 mt-0.5" />
                  <span className="leading-snug">{feature}</span>
                </div>
              ))}
            </div>

            {/* Bottom Actions Row */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenRegister();
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#56B89D] to-[#3B967D] hover:from-[#4AA88F] hover:to-[#31826B] text-[#111A18] font-black text-sm shadow-lg shadow-[#56B89D]/25 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-[#111A18]" />
                <span>Crear Cuenta & Comenzar</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-xl border border-white/20 text-white font-bold text-sm transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#56B89D]" />
                <span>Ya tengo cuenta</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-3 rounded-2xl text-xs font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                Explorar como invitado →
              </button>
            </div>
          </div>

          {/* Navigation Controls: Arrows & Indicators */}
          <div className="relative z-10 px-6 sm:px-10 pb-6 flex items-center justify-between">
            {/* Slide Indicator Dots */}
            <div className="flex items-center gap-2">
              {CAROUSEL_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx 
                      ? 'w-8 bg-[#56B89D]' 
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Ir al paso ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white transition-all hover:scale-105 cursor-pointer"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white transition-all hover:scale-105 cursor-pointer"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
