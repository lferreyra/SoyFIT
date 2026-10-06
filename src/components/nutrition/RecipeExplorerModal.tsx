import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Clock, 
  ChefHat, 
  Check, 
  Sparkles, 
  Flame, 
  Fish, 
  Egg, 
  Salad, 
  Filter,
  BookOpen
} from 'lucide-react';
import { Meal, DietaryPreferenceType } from '../../types/fitness';
import { getAllAvailableRecipes } from '../../data/nutritionPlans';
import { formatCalories } from '../../i18n';

interface RecipeExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipeForMeal?: (recipe: Meal) => void;
}

export const RecipeExplorerModal: React.FC<RecipeExplorerModalProps> = ({
  isOpen,
  onClose,
  onSelectRecipeForMeal
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDiet, setFilterDiet] = useState<string>('all');
  const [selectedRecipeDetail, setSelectedRecipeDetail] = useState<Meal | null>(null);

  if (!isOpen) return null;

  const allRecipes = getAllAvailableRecipes();

  const filtered = allRecipes.filter(recipe => {
    // Type filter
    if (filterType !== 'all' && recipe.type.toLowerCase() !== filterType.toLowerCase()) {
      return false;
    }
    // Diet filter
    if (filterDiet === 'pomroy' && !recipe.dietPhase?.toLowerCase().includes('pomroy') && !recipe.dietaryTags.some(t => t.toLowerCase().includes('pomroy'))) {
      return false;
    }
    if (filterDiet === 'dukan' && !recipe.dietPhase?.toLowerCase().includes('dukan') && !recipe.dietaryTags.some(t => t.toLowerCase().includes('dukan'))) {
      return false;
    }
    if (filterDiet === 'vegetarian' && !recipe.dietaryTags.some(t => t.toLowerCase().includes('vegetariano'))) {
      return false;
    }
    if (filterDiet === 'vegan' && !recipe.dietaryTags.some(t => t.toLowerCase().includes('vegano'))) {
      return false;
    }
    if (filterDiet === 'omnivore' && (recipe.dietPhase?.toLowerCase().includes('pomroy') || recipe.dietPhase?.toLowerCase().includes('dukan'))) {
      return false;
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = recipe.name.toLowerCase().includes(q);
      const matchDesc = recipe.description.toLowerCase().includes(q);
      const matchIng = recipe.ingredients.some(ing => ing.toLowerCase().includes(q));
      const matchTag = recipe.dietaryTags.some(tag => tag.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchIng && !matchTag) return false;
    }

    return true;
  });

  const mealTypeLabels: Record<string, string> = {
    'Breakfast': 'Desayuno',
    'Lunch': 'Almuerzo',
    'Dinner': 'Cena',
    'Snack': 'Colación'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-[#F4F3EC] rounded-[28px] shadow-2xl border border-white flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#DCEFE8] text-[#56B89D] flex items-center justify-center shadow-xs">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-[#56B89D] tracking-wider">
                  Recetario Completo Oficial
                </span>
                <span className="px-2 py-0.5 rounded-full bg-black/5 text-[#20312D] text-[10px] font-bold">
                  {allRecipes.length} recetas
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#20312D] tracking-tight">
                Planes Dra. Pomroy & Dr. Dukan
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/5 hover:bg-black/10 text-[#20312D] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 sm:p-5 bg-white/70 border-b border-black/5 space-y-3 shrink-0">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#6F7D78] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por ingrediente (camote, salmón, avena, claras, aguacate...)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-black/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#56B89D]"
            />
          </div>

          {/* Diet filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
            <span className="text-[11px] text-[#6F7D78] shrink-0 font-bold mr-1">Dieta:</span>
            {[
              { id: 'all', label: 'Todas las dietas' },
              { id: 'pomroy', label: 'Dra. Pomroy (FMA 1, 2, 3)' },
              { id: 'dukan', label: 'Dr. Dukan (PP / PV)' },
              { id: 'omnivore', label: 'Omnívoro' },
              { id: 'vegetarian', label: 'Vegetariano' },
              { id: 'vegan', label: 'Vegano' }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setFilterDiet(btn.id)}
                className={`px-3 py-1.5 rounded-xl shrink-0 transition-all cursor-pointer ${
                  filterDiet === btn.id 
                    ? 'bg-[#20312D] text-white shadow-2xs' 
                    : 'bg-white border border-black/5 text-[#6F7D78] hover:text-[#20312D]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Meal type filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
            <span className="text-[11px] text-[#6F7D78] shrink-0 font-bold mr-1">Plato:</span>
            {[
              { id: 'all', label: 'Todos los momentos' },
              { id: 'breakfast', label: 'Desayunos' },
              { id: 'lunch', label: 'Almuerzos' },
              { id: 'dinner', label: 'Cenas' },
              { id: 'snack', label: 'Colaciones / Snacks' }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setFilterType(btn.id)}
                className={`px-3 py-1.5 rounded-xl shrink-0 transition-all cursor-pointer ${
                  filterType === btn.id 
                    ? 'bg-[#56B89D] text-white shadow-2xs' 
                    : 'bg-white border border-black/5 text-[#6F7D78] hover:text-[#20312D]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#6F7D78] font-bold px-1">
            <span>Mostrando {filtered.length} recetas variadas</span>
            <span>Tocá cualquier receta para ver detalles completos</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(recipe => (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipeDetail(recipe)}
                className="p-4 rounded-2xl bg-white border border-white hover:border-[#56B89D]/40 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div className="flex gap-3.5">
                  {recipe.imageUrl && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-black/5 relative">
                      <img 
                        src={recipe.imageUrl} 
                        alt={recipe.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-[#DCEFE8] text-[#20312D] text-[9px] font-black uppercase">
                        {mealTypeLabels[recipe.type] || recipe.type}
                      </span>
                      {recipe.dietPhase && (
                        <span className="px-2 py-0.5 rounded-md bg-[#F5D5C2] text-[#20312D] text-[9px] font-black">
                          {recipe.dietPhase}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-black text-[#20312D] line-clamp-2 group-hover:text-[#3B967D] transition-colors">
                      {recipe.name}
                    </h4>

                    <p className="text-[11px] text-[#6F7D78] line-clamp-2 leading-snug">
                      {recipe.description}
                    </p>
                  </div>
                </div>

                {/* Macros bottom strip */}
                <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[11px] font-bold text-[#6F7D78]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#56B89D]" />
                    {recipe.prepTimeMinutes} min
                  </span>
                  <span>•</span>
                  <span className="font-extrabold text-[#20312D]">
                    {recipe.proteinGrams}g proteína
                  </span>
                  <span>•</span>
                  <span>
                    ~{formatCalories(recipe.calories)}
                  </span>
                  {onSelectRecipeForMeal && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRecipeForMeal(recipe);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#20312D] hover:bg-black text-white text-[10px] font-black transition-colors"
                    >
                      Elegir hoy
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="p-12 text-center text-[#6F7D78]">
              <ChefHat className="w-12 h-12 text-[#6F7D78]/40 mx-auto mb-3" />
              <p className="text-sm font-bold">No se encontraron recetas con esos filtros.</p>
              <p className="text-xs mt-1">Probá cambiando los términos de búsqueda o seleccionando "Todas las dietas".</p>
            </div>
          )}
        </div>

        {/* Recipe Detail Slide-Over Modal */}
        {selectedRecipeDetail && (
          <div 
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
            onClick={() => setSelectedRecipeDetail(null)}
          >
            <div 
              className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-white"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#DCEFE8] text-[#20312D] text-[10px] font-black uppercase">
                      {mealTypeLabels[selectedRecipeDetail.type] || selectedRecipeDetail.type}
                    </span>
                    {selectedRecipeDetail.dietPhase && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F5D5C2] text-[#20312D] text-[10px] font-black">
                        {selectedRecipeDetail.dietPhase}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-[#20312D]">
                    {selectedRecipeDetail.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedRecipeDetail(null)}
                  className="p-1.5 rounded-xl bg-black/5 text-[#20312D]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedRecipeDetail.imageUrl && (
                <div className="w-full h-44 rounded-2xl overflow-hidden border border-black/5">
                  <img 
                    src={selectedRecipeDetail.imageUrl} 
                    alt={selectedRecipeDetail.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <p className="text-xs text-[#6F7D78] leading-relaxed">
                {selectedRecipeDetail.description}
              </p>

              {/* Macros */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-xl bg-[#F4F3EC]">
                  <span className="text-[10px] text-[#6F7D78] font-bold block">Proteína</span>
                  <span className="text-xs font-black text-[#20312D]">{selectedRecipeDetail.proteinGrams}g</span>
                </div>
                <div className="p-2 rounded-xl bg-[#F4F3EC]">
                  <span className="text-[10px] text-[#6F7D78] font-bold block">Carbos</span>
                  <span className="text-xs font-black text-[#E9A06D]">{selectedRecipeDetail.carbsGrams}g</span>
                </div>
                <div className="p-2 rounded-xl bg-[#F4F3EC]">
                  <span className="text-[10px] text-[#6F7D78] font-bold block">Grasas</span>
                  <span className="text-xs font-black text-[#6F7D78]">{selectedRecipeDetail.fatGrams}g</span>
                </div>
                <div className="p-2 rounded-xl bg-[#F4F3EC]">
                  <span className="text-[10px] text-[#6F7D78] font-bold block">Calorías</span>
                  <span className="text-xs font-black text-[#56B89D]">~{selectedRecipeDetail.calories}</span>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <h4 className="text-xs font-black text-[#20312D] uppercase tracking-wider mb-2">
                  Ingredientes exactos:
                </h4>
                <ul className="space-y-1 list-disc list-inside text-xs text-[#20312D]">
                  {selectedRecipeDetail.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              {selectedRecipeDetail.instructions && (
                <div>
                  <h4 className="text-xs font-black text-[#20312D] uppercase tracking-wider mb-2">
                    Preparación paso a paso:
                  </h4>
                  <ol className="space-y-2 list-decimal list-inside text-xs text-[#20312D] bg-[#F4F3EC]/70 p-4 rounded-2xl">
                    {selectedRecipeDetail.instructions.map((step, idx) => (
                      <li key={idx} className="leading-relaxed font-medium">{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Action */}
              {onSelectRecipeForMeal && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectRecipeForMeal(selectedRecipeDetail);
                    setSelectedRecipeDetail(null);
                    onClose();
                  }}
                  className="w-full py-3 rounded-2xl bg-[#20312D] hover:bg-black text-white text-xs font-black transition-all cursor-pointer"
                >
                  Asignar a mi menú de hoy
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
