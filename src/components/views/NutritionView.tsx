import React, { useState } from 'react';
import { 
  Droplet, 
  RotateCw, 
  Plus, 
  Sparkles, 
  Info, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Salad, 
  Egg, 
  Fish, 
  ChefHat,
  BookOpen
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { GlassCard } from '../common/GlassCard';
import { t, formatCalories } from '../../i18n';
import { DietaryPreferenceType, Meal } from '../../types/fitness';
import { calculateProteinBalance } from '../../data/nutritionPlans';
import { RecipeExplorerModal } from '../nutrition/RecipeExplorerModal';

export const NutritionView: React.FC = () => {
  const { 
    nutrition, 
    addWater, 
    resetHydration, 
    swapMeal, 
    selectCustomRecipeForMeal,
    setDietaryPreference, 
    selectChallengeDay, 
    habits 
  } = useFitness();

  const [expandedInstructions, setExpandedInstructions] = useState<Record<string, boolean>>({});
  const [isRecipeExplorerOpen, setIsRecipeExplorerOpen] = useState(false);

  const toggleInstructions = (mealId: string) => {
    setExpandedInstructions(prev => ({ ...prev, [mealId]: !prev[mealId] }));
  };

  const dietOptions: { id: DietaryPreferenceType; label: string; icon: any; desc: string }[] = [
    { 
      id: 'pomroy', 
      label: 'Dra. Haylie Pomroy (FMA)', 
      icon: Sparkles, 
      desc: 'Metabolismo Acelerado: 3 fases cíclicas (F1: Carbos & Fruta, F2: Proteína & Verdes, F3: Grasas saludables).' 
    },
    { 
      id: 'dukan', 
      label: 'Dr. Pierre Dukan', 
      icon: Flame, 
      desc: 'Alternancia de fases: Ataque (PP: Proteína Pura) y Crucero (PV: Proteína + Verduras seleccionadas).' 
    },
    { 
      id: 'omnivore', 
      label: 'Omnívoro equilibrado', 
      icon: Fish, 
      desc: 'Balance óptimo entre proteínas animales magras y vegetales (legumbres, quinoa, chía).' 
    },
    { 
      id: 'vegetarian', 
      label: 'Vegetariano', 
      icon: Egg, 
      desc: 'Ovolactovegetariano con huevos de campo, yogur griego, tofu firme y legumbres.' 
    },
    { 
      id: 'vegan', 
      label: 'Vegano', 
      icon: Salad, 
      desc: '100% Proteínas vegetales completas: tempeh, lentejas, levadura nutricional y semillas.' 
    }
  ];

  const currentDay = nutrition.selectedChallengeDay || 1;
  const currentDiet: string = (nutrition.dietaryPreference === 'dukan_keto' || nutrition.dietaryPreference === 'hiperproteico' ? 'dukan' : nutrition.dietaryPreference) || 'pomroy';

  const mealTypeLabels: Record<string, string> = {
    'Breakfast': 'Desayuno',
    'Lunch': 'Almuerzo',
    'Dinner': 'Cena',
    'Snack': 'Colación saludable'
  };

  // Calculate day protein balance
  const proteinStats = calculateProteinBalance(nutrition.todayMeals);

  // Water habit sync
  const waterHabit = habits.find(h => h.id === 'h1');
  const hydrationPct = Math.min(100, Math.round((nutrition.hydrationCurrentLiters / nutrition.hydrationTargetLiters) * 100));

  const handleSelectRecipeFromModal = (recipe: Meal) => {
    // Find matching meal ID in todayMeals of same type
    const existing = nutrition.todayMeals.find(m => m.type === recipe.type);
    if (existing) {
      selectCustomRecipeForMeal(existing.id, recipe);
    }
  };

  return (
    <div id="nutrition-dashboard" className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header with Title and Recetario Completo Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-[#20312D] tracking-tight">
            {t('nutrition.title')}
          </h1>
          <p className="text-sm text-[#6F7D78] mt-0.5">
            {t('nutrition.subtitle')}
          </p>
        </div>

        {/* Recipe Explorer Modal Trigger */}
        <button
          type="button"
          onClick={() => setIsRecipeExplorerOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#20312D] hover:bg-black text-white text-xs font-black shadow-xs transition-all cursor-pointer self-start sm:self-auto hover:scale-[1.02] active:scale-[0.98]"
        >
          <BookOpen className="w-4 h-4 text-[#56B89D]" />
          <span>Explorar Recetario (80+ Recetas)</span>
        </button>
      </div>

      {/* 1. WATER HYDRATION HABIT TRACKER */}
      <GlassCard className="p-6 bg-gradient-to-r from-[#DCEFE8]/70 via-white/80 to-[#DCEFE8]/40 border-[#56B89D]/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative w-14 h-14 rounded-2xl bg-white text-[#56B89D] flex items-center justify-center shadow-xs shrink-0 border border-[#56B89D]/20 overflow-hidden">
              <div 
                className="absolute bottom-0 left-0 right-0 bg-[#56B89D]/20 transition-all duration-500" 
                style={{ height: `${hydrationPct}%` }}
              />
              <Droplet className="w-7 h-7 fill-current relative z-10" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#56B89D]">
                  {t('nutrition.hydrationTracker')}
                </span>
                {waterHabit?.completed && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#56B89D] text-white text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Hábito cumplido</span>
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-black text-[#20312D] mt-0.5">
                {nutrition.hydrationCurrentLiters.toFixed(1).replace('.', ',')} L 
                <span className="text-xs font-normal text-[#6F7D78]"> / Meta diaria {nutrition.hydrationTargetLiters} L ({hydrationPct}%)</span>
              </h3>
              <p className="text-xs text-[#6F7D78] mt-0.5">
                La hidratación continua oxigena los tejidos, lubrica articulaciones y previene la fatiga prematura.
              </p>
            </div>
          </div>

          {/* Quick Water Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => addWater(0.25)}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#56B89D]/30 text-xs font-extrabold text-[#20312D] hover:bg-[#DCEFE8] shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
              title="Sumar 1 vaso de agua"
            >
              <Plus className="w-3.5 h-3.5 text-[#56B89D]" />
              <span>+250 ml</span>
            </button>

            <button
              onClick={() => addWater(0.5)}
              className="px-3.5 py-2 rounded-xl bg-[#20312D] hover:bg-black text-white text-xs font-extrabold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              title="Sumar 1 botella chica de 500 ml"
            >
              <Plus className="w-3.5 h-3.5 text-[#56B89D]" />
              <span>+500 ml</span>
            </button>

            <button
              onClick={() => addWater(0.75)}
              className="px-3 py-2 rounded-xl bg-white/90 border border-black/10 text-xs font-extrabold text-[#20312D] hover:bg-white shadow-2xs transition-all flex items-center gap-1 cursor-pointer hidden sm:flex"
              title="Sumar botella grande de 750 ml"
            >
              <Plus className="w-3.5 h-3.5 text-[#56B89D]" />
              <span>+750 ml</span>
            </button>

            {nutrition.hydrationCurrentLiters > 0 && (
              <button
                onClick={resetHydration}
                className="px-2.5 py-2 rounded-xl bg-white/60 hover:bg-white text-xs font-bold text-[#6F7D78] hover:text-[#20312D] transition-colors cursor-pointer"
                title="Reiniciar contador de agua"
              >
                Reiniciar
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-white/90 rounded-full mt-4 overflow-hidden border border-white/60 p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-[#56B89D] to-[#3B967D] rounded-full transition-all duration-500"
            style={{ width: `${hydrationPct}%` }}
          />
        </div>
      </GlassCard>

      {/* 2. DIETARY PREFERENCE SELECTOR (ADAPTIVE DIETS) */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[11px] font-extrabold tracking-wider text-[#56B89D] uppercase block">
              {t('nutrition.dietaryType')}
            </span>
            <h3 className="text-xl font-black text-[#20312D]">
              Planes Nutricionales Adaptativos
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {dietOptions.map(option => {
            const Icon = option.icon;
            const isSelected = currentDiet === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setDietaryPreference(option.id)}
                className={`
                  p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer
                  ${isSelected 
                    ? 'bg-[#20312D] border-[#20312D] text-white shadow-md scale-[1.01]' 
                    : 'bg-white/80 border-white/90 text-[#20312D] hover:bg-white hover:border-[#56B89D]/40 shadow-xs'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white/15 text-[#56B89D]' : 'bg-[#DCEFE8] text-[#56B89D]'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-full bg-[#56B89D] text-[#20312D] text-[9px] font-black uppercase tracking-wider">
                      Activo
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-black">{option.label}</h4>
                  <p className={`text-[10px] mt-1 line-clamp-2 leading-relaxed ${isSelected ? 'text-gray-300' : 'text-[#6F7D78]'}`}>
                    {option.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* 3. 30-DAY MONTH / CHALLENGE PICKER */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#DCEFE8] text-[#20312D] text-[10px] font-black uppercase">
                {t('nutrition.challengeMonth')}
              </span>
              <span className="text-xs font-bold text-[#6F7D78]">
                Rotación semanal para no aburrirse
              </span>
            </div>
            <h3 className="text-xl font-black text-[#20312D] mt-1">
              Día {currentDay} de 30 • Plan del Desafío
            </h3>
          </div>

          {/* Prev / Next day buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => selectChallengeDay(Math.max(1, currentDay - 1))}
              disabled={currentDay <= 1}
              className="p-2 rounded-xl bg-white border border-black/10 text-[#20312D] hover:bg-[#DCEFE8] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              title="Día anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1.5 rounded-xl bg-white/90 border border-white font-mono text-xs font-extrabold text-[#20312D]">
              Día {currentDay} / 30
            </span>
            <button
              onClick={() => selectChallengeDay(Math.min(30, currentDay + 1))}
              disabled={currentDay >= 30}
              className="p-2 rounded-xl bg-white border border-black/10 text-[#20312D] hover:bg-[#DCEFE8] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              title="Siguiente día"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Days Slider */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
            <button
              key={day}
              onClick={() => selectChallengeDay(day)}
              className={`
                px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition-all cursor-pointer
                ${day === currentDay 
                  ? 'bg-[#20312D] text-white shadow-xs scale-105' 
                  : 'bg-white/80 border border-black/5 text-[#6F7D78] hover:bg-white hover:text-[#20312D]'
                }
              `}
            >
              Día {day}
            </button>
          ))}
        </div>

        {/* 4. PROTEIN BALANCE HERO BAR */}
        <div className="mt-5 p-4 rounded-2xl bg-white/80 border border-white space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-black uppercase text-[#56B89D] tracking-wider block">
                {t('nutrition.animalVsPlant')}
              </span>
              <h4 className="text-sm font-black text-[#20312D]">
                Total proteico del día: {proteinStats.totalProtein}g
              </h4>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              {currentDiet !== 'vegan' && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E9A06D]" />
                  <span className="text-[#20312D]">Animal: {proteinStats.animalProtein}g ({proteinStats.animalPercent}%)</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#56B89D]" />
                <span className="text-[#20312D]">Vegetal: {proteinStats.plantProtein}g ({proteinStats.plantPercent}%)</span>
              </div>
            </div>
          </div>

          {/* Visual Ratio Bar */}
          <div className="w-full h-3 rounded-full bg-black/5 flex overflow-hidden">
            {currentDiet !== 'vegan' && proteinStats.animalPercent > 0 && (
              <div 
                className="h-full bg-[#E9A06D] transition-all duration-500" 
                style={{ width: `${proteinStats.animalPercent}%` }} 
                title={`Proteína Animal: ${proteinStats.animalProtein}g`}
              />
            )}
            <div 
              className="h-full bg-[#56B89D] transition-all duration-500" 
              style={{ width: `${proteinStats.plantPercent}%` }} 
              title={`Proteína Vegetal: ${proteinStats.plantProtein}g`}
            />
          </div>
          <span className="text-[10px] text-[#6F7D78] block">
            {currentDiet === 'pomroy'
              ? 'Plan Dra. Pomroy: Rotación en 3 fases semanales (Carbos/Fruta, Proteínas/Verdes alcalinos, Grasas saludables) para confundir al metabolismo y acelerar la combustión.'
              : currentDiet === 'dukan'
              ? 'Plan Dr. Dukan: Alternancia de Proteína Pura (PP) y Proteínas con Verduras (PV) para saciedad máxima sin carbohidratos refinados.'
              : currentDiet === 'vegan'
                ? 'Combinación completa de legumbres, cereales ancestrales y semillas para aportar los 9 aminoácidos esenciales.'
                : 'La sinergia entre aminoácidos animales y vegetales optimiza la digestión intestinal y previene la inflamación.'
            }
          </span>
        </div>
      </GlassCard>

      {/* 5. RECIPES FOR TODAY (BREAKFAST, LUNCH, DINNER, SNACK) */}
      <GlassCard className="p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <span className="text-[11px] font-extrabold tracking-wider text-[#56B89D] uppercase block">
              Menú completo y recetas fáciles
            </span>
            <h3 className="text-2xl font-black text-[#20312D]">
              {t('nutrition.todayMeals')} (Día {currentDay})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsRecipeExplorerOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-black/10 hover:border-[#56B89D] text-[#20312D] text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#56B89D]" />
              <span>Ver catálogo completo</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {nutrition.todayMeals.map(meal => {
            const isExpanded = !!expandedInstructions[meal.id];
            return (
              <div
                key={meal.id}
                className="p-5 rounded-3xl bg-white/90 border border-white shadow-2xs space-y-4 transition-all overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Recipe Image Card */}
                  {meal.imageUrl && (
                    <div className="w-full sm:w-48 h-36 sm:h-auto rounded-2xl overflow-hidden shrink-0 border border-black/5 shadow-2xs relative">
                      <img 
                        src={meal.imageUrl} 
                        alt={meal.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-extrabold text-white">
                        {mealTypeLabels[meal.type] || meal.type}
                      </span>
                    </div>
                  )}

                  <div className="flex-1 flex flex-col justify-between space-y-2">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-[#DCEFE8] text-[#20312D] text-[10px] font-black uppercase tracking-wider">
                            {mealTypeLabels[meal.type] || meal.type}
                          </span>
                          {meal.dietPhase && (
                            <span className="px-2.5 py-1 rounded-full bg-[#F5D5C2] text-[#20312D] text-[10px] font-black">
                              {meal.dietPhase}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-xs font-bold text-[#6F7D78]">
                            <Clock className="w-3.5 h-3.5 text-[#56B89D]" />
                            {meal.prepTimeMinutes} min
                          </span>
                          <span className="text-xs font-black text-[#20312D]">
                            • ~{formatCalories(meal.calories)}
                          </span>
                        </div>

                        {/* Swap Button (cycles through all recipes of this type!) */}
                        <button
                          onClick={() => swapMeal(meal.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-black/10 text-xs font-bold text-[#6F7D78] hover:text-[#20312D] hover:border-[#56B89D] transition-colors shrink-0 shadow-2xs cursor-pointer"
                          title="Rotar a la siguiente variante de receta"
                        >
                          <RotateCw className="w-3.5 h-3.5 text-[#56B89D]" />
                          <span>{t('nutrition.swapMeal')}</span>
                        </button>
                      </div>

                      <h4 className="text-base sm:text-lg font-black text-[#20312D] tracking-tight">
                        {meal.name}
                      </h4>

                      <p className="text-xs text-[#6F7D78] leading-relaxed">
                        {meal.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Macros & Protein Balance Pill */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="bg-[#F4F3EC] rounded-xl p-2 text-center">
                    <span className="text-[10px] text-[#6F7D78] block font-bold">Proteína Total</span>
                    <span className="text-xs font-black text-[#20312D]">{meal.proteinGrams}g</span>
                  </div>
                  <div className="bg-[#F4F3EC] rounded-xl p-2 text-center">
                    <span className="text-[10px] text-[#6F7D78] block font-bold">Animal / Vegetal</span>
                    <span className="text-xs font-black text-[#56B89D]">
                      {meal.proteinAnimalGrams ?? 0}g / {meal.proteinPlantGrams ?? 0}g
                    </span>
                  </div>
                  <div className="bg-[#F4F3EC] rounded-xl p-2 text-center">
                    <span className="text-[10px] text-[#6F7D78] block font-bold">Carbohidratos</span>
                    <span className="text-xs font-black text-[#E9A06D]">{meal.carbsGrams}g</span>
                  </div>
                  <div className="bg-[#F4F3EC] rounded-xl p-2 text-center">
                    <span className="text-[10px] text-[#6F7D78] block font-bold">Grasas</span>
                    <span className="text-xs font-black text-[#6F7D78]">{meal.fatGrams}g</span>
                  </div>
                </div>

                {/* Ingredients Tags */}
                <div>
                  <span className="text-[11px] font-bold text-[#20312D] block mb-1">
                    Ingredientes fáciles:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {meal.ingredients.map((ing, i) => (
                      <span key={i} className="text-[10px] px-2.5 py-1 rounded-lg bg-black/[0.04] text-[#20312D] font-medium">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Step-by-Step Instructions Toggle */}
                {meal.instructions && meal.instructions.length > 0 && (
                  <div className="pt-2 border-t border-black/5">
                    <button
                      onClick={() => toggleInstructions(meal.id)}
                      className="text-xs font-extrabold text-[#56B89D] hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <ChefHat className="w-3.5 h-3.5" />
                      <span>{isExpanded ? 'Ocultar paso a paso' : 'Ver preparación paso a paso (rápida)'}</span>
                    </button>

                    {isExpanded && (
                      <ol className="mt-2.5 space-y-1.5 list-decimal list-inside text-xs text-[#20312D] bg-[#F4F3EC]/70 p-3.5 rounded-2xl animate-in fade-in">
                        {meal.instructions.map((step, idx) => (
                          <li key={idx} className="leading-relaxed">
                            <span className="font-semibold">{step}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                )}

                {/* Tip Nutricional */}
                {meal.benefitTip && (
                  <div className="flex items-start gap-2 bg-[#DCEFE8]/40 border border-[#56B89D]/20 p-2.5 rounded-xl text-[11px] text-[#20312D]">
                    <Sparkles className="w-3.5 h-3.5 text-[#56B89D] shrink-0 mt-0.5" />
                    <span><strong className="font-bold">Aporte clave:</strong> {meal.benefitTip}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* NON-MEDICAL SAFETY DISCLAIMER */}
      <div className="bg-[#F5D5C2]/40 border border-[#E9A06D]/40 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#E9A06D] shrink-0 mt-0.5" />
        <div className="text-[11px] text-[#20312D] leading-relaxed">
          <span className="font-bold block text-xs">Información nutricional deportiva orientativa</span>
          {t('nutrition.disclaimer')}
        </div>
      </div>

      {/* Recipe Explorer Modal */}
      <RecipeExplorerModal
        isOpen={isRecipeExplorerOpen}
        onClose={() => setIsRecipeExplorerOpen(false)}
        onSelectRecipeForMeal={handleSelectRecipeFromModal}
      />
    </div>
  );
};
