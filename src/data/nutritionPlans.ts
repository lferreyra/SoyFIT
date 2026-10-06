import { Meal, DietaryPreferenceType } from '../types/fitness';

export interface DayNutritionPlan {
  dayNumber: number;
  theme: string;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snack: Meal;
  };
}

// Helper to calculate total proteins and animal/plant ratio
export function calculateProteinBalance(meals: Meal[]) {
  const totalProtein = meals.reduce((sum, m) => sum + m.proteinGrams, 0);
  const animalProtein = meals.reduce((sum, m) => sum + (m.proteinAnimalGrams || 0), 0);
  const plantProtein = meals.reduce((sum, m) => sum + (m.proteinPlantGrams || 0), 0);
  
  const animalPercent = totalProtein > 0 ? Math.round((animalProtein / totalProtein) * 100) : 0;
  const plantPercent = totalProtein > 0 ? Math.round((plantProtein / totalProtein) * 100) : 0;

  return { totalProtein, animalProtein, plantProtein, animalPercent, plantPercent };
}

// ====================================================
// 1. DRA. HAYLIE POMROY - LA DIETA DEL METABOLISMO ACELERADO
// Basado en el libro oficial y recetario de Haylie Pomroy:
// - Fase 1 (Lunes y Martes): Sosegar el estrés (Carbohidratos y fruta, proteína moderada, 0 grasas)
// - Fase 2 (Miércoles y Jueves): Desbloquear la grasa (Alta proteína magra y verduras alcalinas, 0 granos, 0 grasas)
// - Fase 3 (Viernes, Sábado y Domingo): Desatar la combustión (Grasas saludables, proteína, carbohidratos moderados, frutas de bajo IG)
// ====================================================
export const POMROY_RECIPES_POOL = [
  // --- POMROY SEMANA 1: FASE 1 (Día 1 - Lunes) ---
  {
    phase: 'Fase 1: Sosegar el estrés (Carbos & Fruta)',
    breakfast: {
      id: 'pom-f1-b1',
      type: 'Breakfast' as const,
      dietPhase: 'Pomroy F1 (Carbos & Fruta)',
      name: 'Cereal cremoso de arroz integral con moras frescas y canela',
      calories: 380,
      proteinGrams: 16,
      proteinAnimalGrams: 8,
      proteinPlantGrams: 8,
      carbsGrams: 72,
      fatGrams: 3,
      prepTimeMinutes: 10,
      imageUrl: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?auto=format&fit=crop&w=800&q=80',
      ingredients: ['1/3 taza arroz integral molido', '1 taza de moras frescas (zarzamoras o arándanos)', '2 claras de huevo batidas (proteína)', 'Canela molida', 'Stevia al gusto'],
      instructions: [
        'Moler el arroz integral en seco en la licuadora hasta textura de cereal fino.',
        'Hervir con 2 tazas de agua y cocinar a fuego lento 5 minutos hasta que espese y quede cremoso.',
        'Incorporar las claras batidas con fuerza para sumar textura cremosa y proteína sin grasa.',
        'Servir tibio con canela, stevia y coronar con las moras frescas.'
      ],
      description: 'Receta oficial Pomroy Fase 1: Calma las glándulas suprarrenales e inunda el cuerpo con glucógeno de fácil asimilación.',
      dietaryTags: ['Pomroy FMA', 'Fase 1', 'Cero grasas', 'Granos integrales'],
      benefitTip: 'El grano entero con fruta reduce la hormona de estrés (cortisol) y prepara al cuerpo para la quema de grasa.'
    },
    lunch: {
      id: 'pom-f1-l1',
      type: 'Lunch' as const,
      dietPhase: 'Pomroy F1 (Carbos & Fruta)',
      name: 'Sándwich abierto de atún blanco, manzana verde y espinacas',
      calories: 460,
      proteinGrams: 38,
      proteinAnimalGrams: 32,
      proteinPlantGrams: 6,
      carbsGrams: 65,
      fatGrams: 4,
      prepTimeMinutes: 8,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      ingredients: ['170g atún en agua escurrido', '1 taza manzana verde en cubos', '1/2 taza pepino en cubos', '2 rebanadas pan de granos germinados o espelta', 'Mostaza preparada', 'Jugo de limón'],
      instructions: [
        'Escurrir el atún y mezclarlo en un bol con la manzana verde picada, pepino, mostaza y jugo de limón.',
        'Tostar las rebanadas de pan de granos germinados.',
        'Montar el atún sobre el pan tostado con hojas de espinaca fresca.'
      ],
      description: 'Almuerzo clásico de Fase 1: Proteína magra limpia combinada con grano germinado y fibra frutal.',
      dietaryTags: ['Pomroy FMA', 'Fase 1', 'Sin grasa añadida', 'Rico en fibra'],
      benefitTip: 'La manzana verde aporta pectina para regular la absorción de los carbohidratos en sangre.'
    },
    dinner: {
      id: 'pom-f1-d1',
      type: 'Dinner' as const,
      dietPhase: 'Pomroy F1 (Carbos & Fruta)',
      name: 'Pasta de arroz integral con salsa de carne magra de pavo en cocción lenta',
      calories: 520,
      proteinGrams: 44,
      proteinAnimalGrams: 38,
      proteinPlantGrams: 6,
      carbsGrams: 76,
      fatGrams: 5,
      prepTimeMinutes: 20,
      imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
      ingredients: ['150g pechuga de pavo molida magra', '1 taza pasta de arroz integral cocida', '1 taza salsa de tomate casera sin azúcar', '1 taza calabacita picada', 'Champiñones laminados', 'Orégano y albahaca'],
      instructions: [
        'Dorar el pavo molido en sartén antiadherente con 2 cucharadas de caldo de verduras (sin aceite).',
        'Agregar la calabacita, champiñones, salsa de tomate y hierbas aromáticas.',
        'Cocinar a fuego lento durante 15 minutos hasta que los sabores se integren.',
        'Servir sobre la pasta de arroz integral al dente.'
      ],
      description: 'Cena reconfortante de Fase 1 para nutrir los depósitos de glucógeno muscular y relajarse.',
      dietaryTags: ['Pomroy FMA', 'Fase 1', 'Sin gluten', 'Antiestrés']
    },
    snack: {
      id: 'pom-f1-s1',
      type: 'Snack' as const,
      dietPhase: 'Pomroy F1 (Carbos & Fruta)',
      name: 'Batido quemagrasas de mango congelado y menta fresca',
      calories: 140,
      proteinGrams: 2,
      proteinAnimalGrams: 0,
      proteinPlantGrams: 2,
      carbsGrams: 34,
      fatGrams: 0,
      prepTimeMinutes: 3,
      imageUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80',
      ingredients: ['1/2 taza mango congelado', 'Jugo de 1/2 limón', 'Hojas de menta fresca', '1/2 taza cubos de hielo', 'Stevia al gusto'],
      instructions: [
        'Colocar el mango congelado en la licuadora con el hielo, jugo de limón, stevia y menta.',
        'Licuar a alta velocidad hasta consistencia de frappé o sorbete.',
        'Consumir inmediatamente a media mañana o tarde.'
      ],
      description: 'Colación energizante de Fase 1 que estimula la tiroides mediante vitamina C y fructosa natural.',
      dietaryTags: ['Pomroy FMA', 'Fase 1', 'Fruta pura', 'Refrescante']
    }
  },

  // --- POMROY SEMANA 1: FASE 1 (Día 2 - Martes) ---
  {
    phase: 'Fase 1: Sosegar el estrés (Carbos & Fruta)',
    breakfast: {
      id: 'pom-f1-b2',
      type: 'Breakfast' as const,
      dietPhase: 'Pomroy F1 (Carbos & Fruta)',
      name: 'Pan francés con claras de huevo, vainilla y compota tibia de fresas',
      calories: 390,
      proteinGrams: 22,
      proteinAnimalGrams: 14,
      proteinPlantGrams: 8,
      carbsGrams: 68,
      fatGrams: 3,
      prepTimeMinutes: 10,
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
      ingredients: ['2 rebanadas pan de granos germinados', '3 claras de huevo', '1 cucharadita extracto de vainilla', 'Canela molida', '1 taza fresas frescas', 'Gotas de limón'],
      instructions: [
        'Batir las claras de huevo con la vainilla y canela.',
        'Remojar el pan en la mezcla por ambos lados.',
        'Dorar en sartén antiadherente sin grasa 2 minutos por lado.',
        'Calentar las fresas en cacerola pequeña con gotas de limón y stevia hasta tiernizar; verter sobre el pan.'
      ],
      description: 'El desayuno consentido de Haylie Pomroy: disfrute pleno sin violar las reglas de cero grasa.',
      dietaryTags: ['Pomroy FMA', 'Fase 1', 'Desayuno Estrella', 'Rico en proteína']
    },
    lunch: {
      id: 'pom-f1-l2',
      type: 'Lunch' as const,
      dietPhase: 'Pomroy F1 (Carbos & Fruta)',
      name: 'Chili de pavo y frijoles negros con calabaza y comino',
      calories: 510,
      proteinGrams: 42,
      proteinAnimalGrams: 30,
      proteinPlantGrams: 12,
      carbsGrams: 72,
      fatGrams: 5,
      prepTimeMinutes: 20,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      ingredients: ['140g pechuga de pavo molida', '1 taza frijoles negros cocidos', '1 taza calabaza en cubos', '1 taza puré de tomate natural', 'Chile en polvo y comino', 'Cilantro'],
      instructions: [
        'Cocinar el pavo molido con cebolla y ajo en sartén con 2 cucharadas de caldo.',
        'Añadir los frijoles negros escurridos, la calabaza y el puré de tomate.',
        'Condimentar con comino, chile en polvo y sal de mar.',
        'Dejar cocinar a fuego suave 15 minutos y servir caliente con cilantro.'
      ],
      description: 'Plato tradicional del libro Pomroy: mezcla perfecta de proteína, fibra soluble y carbohidratos.',
      dietaryTags: ['Pomroy FMA', 'Fase 1', 'Olla o cazuela', 'Saciante']
    },
    dinner: {
      id: 'pom-f1-d2',
      type: 'Dinner' as const,
      dietPhase: 'Pomroy F1 (Carbos & Fruta)',
      name: 'Lenguado con salsa de jitomate, cebolla morada y arroz salvaje',
      calories: 450,
      proteinGrams: 40,
      proteinAnimalGrams: 34,
      proteinPlantGrams: 6,
      carbsGrams: 62,
      fatGrams: 4,
      prepTimeMinutes: 18,
      imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
      ingredients: ['180g filete de lenguado fresco', '3/4 taza arroz salvaje cocido', '1 taza jitomates picados', '1/2 taza calabacitas al vapor', 'Cilantro fresco', 'Limón'],
      instructions: [
        'Colocar el lenguado en sartén antiadherente caliente con rodajas de jitomate y cebolla.',
        'Rociar con jugo de limón y cocinar tapado durante 6 minutos.',
        'Servir sobre el arroz salvaje caliente decorado con cilantro.'
      ],
      description: 'Pescado blanco muy suave que no satura el hígado durante la fase de desestresamiento.',
      dietaryTags: ['Pomroy FMA', 'Fase 1', 'Cena marina', 'Fácil digestión']
    },
    snack: {
      id: 'pom-f1-s2',
      type: 'Snack' as const,
      dietPhase: 'Pomroy F1 (Carbos & Fruta)',
      name: 'Ensalada refrescante de pepino y mandarina con eneldo',
      calories: 120,
      proteinGrams: 2,
      proteinAnimalGrams: 0,
      proteinPlantGrams: 2,
      carbsGrams: 28,
      fatGrams: 0,
      prepTimeMinutes: 4,
      imageUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
      ingredients: ['1 taza pepinos en cubos', '1 mandarina en gajos', '1 cda vinagre de arroz', 'Eneldo fresco picado'],
      instructions: [
        'Mezclar en un tazón los cubos de pepino con los gajos de mandarina.',
        'Rociar con el vinagre de arroz y espolvorear eneldo fresco.'
      ],
      description: 'Snack crocante e hidratante con bioflavonoides cítricos para apoyar el metabolismo celular.',
      dietaryTags: ['Pomroy FMA', 'Fase 1', 'Hidratante', 'Vitamina C']
    }
  },

  // --- POMROY SEMANA 1: FASE 2 (Día 3 - Miércoles) ---
  {
    phase: 'Fase 2: Desbloquear la grasa (Proteína & Verdes)',
    breakfast: {
      id: 'pom-f2-b1',
      type: 'Breakfast' as const,
      dietPhase: 'Pomroy F2 (Proteína & Verdes)',
      name: 'Omelette de 4 claras con champiñones laminados y espinacas baby',
      calories: 230,
      proteinGrams: 30,
      proteinAnimalGrams: 26,
      proteinPlantGrams: 4,
      carbsGrams: 6,
      fatGrams: 2,
      prepTimeMinutes: 8,
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
      ingredients: ['4 claras de huevo', '1 taza espinacas baby frescas', '1/2 taza champiñones fileteados', '1 cdta chalote o cebolla picada', 'Sal de mar y pimienta blanca'],
      instructions: [
        'Cocinar el chalote y los champiñones en sartén antiadherente con 1 cucharada de caldo de verduras.',
        'Agregar las espinacas hasta que se marchiten (1 minuto).',
        'Verter las claras batidas sazonadas con sal de mar y pimienta.',
        'Cocinar a fuego medio 3 minutos, doblar y servir de inmediato.'
      ],
      description: 'Fase 2 Pomroy: Desbloquea grasa acumulada al forzar la carnitina celular a transportar ácidos grasos a la mitocondria.',
      dietaryTags: ['Pomroy FMA', 'Fase 2', 'Cero granos', 'Verduras alcalinas'],
      benefitTip: 'Las espinacas y champiñones alcalinizan el torrente sanguíneo protegiendo los riñones.'
    },
    lunch: {
      id: 'pom-f2-l1',
      type: 'Lunch' as const,
      dietPhase: 'Pomroy F2 (Proteína & Verdes)',
      name: 'Filete Nueva York a la plancha con brócoli al vapor y jugo de limón',
      calories: 410,
      proteinGrams: 52,
      proteinAnimalGrams: 46,
      proteinPlantGrams: 6,
      carbsGrams: 8,
      fatGrams: 9,
      prepTimeMinutes: 12,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      ingredients: ['180g filete de res o lomo magro desgrasado', '2 tazas floretes de brócoli al vapor', '1 diente de ajo picado', 'Jugo de 1/2 limón', 'Sal marina y pimienta'],
      instructions: [
        'Sellar el filete magro en sartén de hierro o parrilla caliente 3 a 4 minutos por lado.',
        'Cocinar el brócoli al vapor durante 5 minutos para preservar su clorofila intensa.',
        'Rociar el brócoli con jugo de limón fresco y servir junto al filete rebanado.'
      ],
      description: 'Alta concentración de hierro hemínico y carnitina para potenciar la construcción de músculo esbelto.',
      dietaryTags: ['Pomroy FMA', 'Fase 2', 'Carnitina activa', 'Proteína pura']
    },
    dinner: {
      id: 'pom-f2-d1',
      type: 'Dinner' as const,
      dietPhase: 'Pomroy F2 (Proteína & Verdes)',
      name: 'Pollo con hongos shiitake, ajo y hojas de mostaza salteadas',
      calories: 390,
      proteinGrams: 48,
      proteinAnimalGrams: 42,
      proteinPlantGrams: 6,
      carbsGrams: 7,
      fatGrams: 6,
      prepTimeMinutes: 15,
      imageUrl: 'https://images.unsplash.com/photo-1501595091296-3aa970afb3ff?auto=format&fit=crop&w=800&q=80',
      ingredients: ['190g pechuga de pollo en tiras', '1 taza hongos shiitake laminados', '2 tazas hojas de mostaza o acelgas troceadas', '1 cda vinagre de coco', 'Jengibre y ajo'],
      instructions: [
        'Dorar las tiras de pollo en sartén antiadherente con caldo de verduras y jengibre.',
        'Añadir los hongos shiitake y las hojas de mostaza con 1 cucharada de vinagre de coco.',
        'Tapar 4 minutos para ablandar las hojas verdes y concentrar los jugos.',
        'Servir caliente sin aceites añadidos.'
      ],
      description: 'Cena desintoxicante de Fase 2: El hongo shiitake aporta polisacáridos inmunes y las hojas amargas activan el hígado.',
      dietaryTags: ['Pomroy FMA', 'Fase 2', 'Hígado sano', 'Verduras amargas']
    },
    snack: {
      id: 'pom-f2-s1',
      type: 'Snack' as const,
      dietPhase: 'Pomroy F2 (Proteína & Verdes)',
      name: 'Pepinillos encurtidos envueltos en rosbif magro con mostaza Dijon',
      calories: 130,
      proteinGrams: 20,
      proteinAnimalGrams: 20,
      proteinPlantGrams: 0,
      carbsGrams: 3,
      fatGrams: 3,
      prepTimeMinutes: 3,
      imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
      ingredients: ['60g rosbif magro libre de nitratos', '4 pepinillos al eneldo sin azúcar', '1 cdta mostaza de Dijon'],
      instructions: [
        'Untar la mostaza sobre cada feta de rosbif.',
        'Enrollar alrededor de los pepinillos crujientes.',
        'Disfrutar a media tarde como refrigerio proteico saciante.'
      ],
      description: 'El refrigerio portátil por excelencia del libro de Pomroy para mantener el catabolismo de grasas.',
      dietaryTags: ['Pomroy FMA', 'Fase 2', 'Portátil', 'Cero grasas']
    }
  },

  // --- POMROY SEMANA 1: FASE 2 (Día 4 - Jueves) ---
  {
    phase: 'Fase 2: Desbloquear la grasa (Proteína & Verdes)',
    breakfast: {
      id: 'pom-f2-b2',
      type: 'Breakfast' as const,
      dietPhase: 'Pomroy F2 (Proteína & Verdes)',
      name: 'Salmón ahumado magro sobre bastones de pepino y eneldo fresco',
      calories: 220,
      proteinGrams: 28,
      proteinAnimalGrams: 26,
      proteinPlantGrams: 2,
      carbsGrams: 5,
      fatGrams: 5,
      prepTimeMinutes: 4,
      imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
      ingredients: ['120g salmón ahumado artesanal sin azúcar ni nitratos', '1 pepino grande en rodajas gruesas', 'Gotas de limón', 'Eneldo fresco picado'],
      instructions: [
        'Cortar el pepino en rodajas de 1 cm.',
        'Disponer trozos de salmón ahumado encima de cada rodaja.',
        'Rociar con gotas de limón y espolvorear eneldo fresco.'
      ],
      description: 'Desayuno fresco y elegante directo del libro: proteína marina pura para la mañana de Fase 2.',
      dietaryTags: ['Pomroy FMA', 'Fase 2', 'Proteína marina', 'Eneldo digestivo']
    },
    lunch: {
      id: 'pom-f2-l2',
      type: 'Lunch' as const,
      dietPhase: 'Pomroy F2 (Proteína & Verdes)',
      name: 'Pimiento rojo asado relleno de ensalada de atún y apio crujiente',
      calories: 340,
      proteinGrams: 46,
      proteinAnimalGrams: 42,
      proteinPlantGrams: 4,
      carbsGrams: 9,
      fatGrams: 4,
      prepTimeMinutes: 8,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      ingredients: ['1 lata atún al agua escurrido', '1 pimiento rojo grande partido a la mitad', '1/2 taza apio picado en cubos', '2 cdas cebolla morada', 'Mostaza y jugo de limón'],
      instructions: [
        'Mezclar el atún con el apio picado, cebolla morada, mostaza preparada y jugo de limón.',
        'Rellenar las dos mitades de pimiento rojo crudo o ligeramente horneado.',
        'Servir frío como un plato crujiente y suculento.'
      ],
      description: 'Receta oficial de Pomroy: sustituye la mayonesa con mostaza y aprovecha el pimiento como vehículo crujiente.',
      dietaryTags: ['Pomroy FMA', 'Fase 2', 'Fácil de llevar', 'Alcalino']
    },
    dinner: {
      id: 'pom-f2-d2',
      type: 'Dinner' as const,
      dietPhase: 'Pomroy F2 (Proteína & Verdes)',
      name: 'Bacalao horneado al pimentón con espárragos y limón',
      calories: 360,
      proteinGrams: 46,
      proteinAnimalGrams: 42,
      proteinPlantGrams: 4,
      carbsGrams: 6,
      fatGrams: 4,
      prepTimeMinutes: 15,
      imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
      ingredients: ['200g filete de bacalao o merluza', '8 tallos de espárragos frescos', 'Rodajas de limón', '1 cda salsa tamari', 'Páprika y sal marina'],
      instructions: [
        'Colocar los espárragos en molde para horno con salsa tamari y cubrir con papel aluminio 10 min a 200°C.',
        'Acomodar el filete de bacalao encima con rodajas de limón, páprika y sal.',
        'Hornear 12 minutos más hasta que el pescado esté tierno.'
      ],
      description: 'Cena marina ultra ligera: estimula el drenaje linfático con espárragos verdes.',
      dietaryTags: ['Pomroy FMA', 'Fase 2', 'Pescado blanco', 'Drenante']
    },
    snack: {
      id: 'pom-f2-s2',
      type: 'Snack' as const,
      dietPhase: 'Pomroy F2 (Proteína & Verdes)',
      name: 'Claras de huevo cocidas rellenas de verduras picadas',
      calories: 120,
      proteinGrams: 18,
      proteinAnimalGrams: 16,
      proteinPlantGrams: 2,
      carbsGrams: 3,
      fatGrams: 1,
      prepTimeMinutes: 4,
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
      ingredients: ['3 huevos cocidos duros (usar solo las claras)', '1/4 taza champiñones y pimiento picados finamente', 'Pizca de sal marina'],
      instructions: [
        'Retirar las yemas de los huevos cocidos duros.',
        'Rellenar el hueco de las claras con las verduras picadas finamente salteadas o crudas.'
      ],
      description: 'Bocado de pura albúmina con enzimas vegetales para saciar el apetito entre comidas.',
      dietaryTags: ['Pomroy FMA', 'Fase 2', 'Snack Proteico', 'Albúmina pura']
    }
  },

  // --- POMROY SEMANA 1: FASE 3 (Día 5 - Viernes) ---
  {
    phase: 'Fase 3: Desatar la combustión (Grasas Saludables)',
    breakfast: {
      id: 'pom-f3-b1',
      type: 'Breakfast' as const,
      dietPhase: 'Pomroy F3 (Grasas Saludables)',
      name: 'Tostada de pan germinado con aguacate pisado, huevo de campo y jitomate',
      calories: 460,
      proteinGrams: 22,
      proteinAnimalGrams: 14,
      proteinPlantGrams: 8,
      carbsGrams: 32,
      fatGrams: 24,
      prepTimeMinutes: 8,
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
      ingredients: ['1 rebanada pan de granos germinados (Ezequiel)', '1/2 aguacate maduro', '1 huevo entero de campo frito en aceite de oliva o poché', 'Rodajas de jitomate', '1 toronja fresca al lado'],
      instructions: [
        'Tostar el pan germinado.',
        'Pisar el medio aguacate con sal de mar y untar generosamente.',
        'Cocinar el huevo con un chorrito de aceite de oliva virgen extra y montarlo sobre la tostada con el jitomate.',
        'Comer acompañado de media toronja fresca.'
      ],
      description: 'Fase 3 Pomroy: Las grasas monoinsaturadas y la colina reinician las hormonas tiroideas y suprarrenales.',
      dietaryTags: ['Pomroy FMA', 'Fase 3', 'Grasas saludables', 'Hormonal'],
      benefitTip: 'El aguacate aporta manoheptulosa, carbohidrato único que reduce la resistencia a la insulina.'
    },
    lunch: {
      id: 'pom-f3-l1',
      type: 'Lunch' as const,
      dietPhase: 'Pomroy F3 (Grasas Saludables)',
      name: 'Ensalada de camarones con aguacate, palmitos y aderezo de vinagre de coco',
      calories: 490,
      proteinGrams: 36,
      proteinAnimalGrams: 32,
      proteinPlantGrams: 4,
      carbsGrams: 16,
      fatGrams: 26,
      prepTimeMinutes: 10,
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
      ingredients: ['160g camarones cocidos', '1/2 aguacate en cubos', '1/2 taza corazones de palmito en rodajas', '2 tazas arúgula fresca', '2 cdas vinagre de coco', '1 taza zarzamoras frescas'],
      instructions: [
        'En un tazón mezclar los camarones con los cubos de aguacate, palmitos y cebolla morada.',
        'Aderezar con vinagre de coco, sal de mar y pimienta.',
        'Servir sobre cama de arúgula con la taza de zarzamoras frescas al lado.'
      ],
      description: 'Plato festivo de Fase 3: Ácidos grasos insaturados con antioxidantes de frutos rojos.',
      dietaryTags: ['Pomroy FMA', 'Fase 3', 'Gourmet', 'Antioxidante']
    },
    dinner: {
      id: 'pom-f3-d1',
      type: 'Dinner' as const,
      dietPhase: 'Pomroy F3 (Grasas Saludables)',
      name: 'Pollo al curry con leche de coco, espinacas baby y quinoa',
      calories: 520,
      proteinGrams: 42,
      proteinAnimalGrams: 36,
      proteinPlantGrams: 6,
      carbsGrams: 28,
      fatGrams: 24,
      prepTimeMinutes: 20,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      ingredients: ['180g pechuga de pollo en dados', '1/2 taza leche de coco de lata entera', '2 cucharaditas curry en polvo', '2 tazas espinacas baby', '1/2 taza quinoa cocida', 'Aceite de oliva'],
      instructions: [
        'Saltear el pollo con 1 cucharada de aceite de oliva virgen y curry en polvo hasta dorar.',
        'Verter la leche de coco entera y dejar reducir 5 minutos a fuego medio.',
        'Añadir las espinacas hasta que se integren.',
        'Servir caliente sobre la porción de quinoa.'
      ],
      description: 'Triglicéridos de cadena media (MCT) del coco que el cuerpo utiliza como combustible termogénico inmediato.',
      dietaryTags: ['Pomroy FMA', 'Fase 3', 'MCT Coco', 'Termogénico']
    },
    snack: {
      id: 'pom-f3-s1',
      type: 'Snack' as const,
      dietPhase: 'Pomroy F3 (Grasas Saludables)',
      name: 'Apio crujiente con mantequilla de almendras crudas',
      calories: 190,
      proteinGrams: 6,
      proteinAnimalGrams: 0,
      proteinPlantGrams: 6,
      carbsGrams: 6,
      fatGrams: 16,
      prepTimeMinutes: 2,
      imageUrl: 'https://images.unsplash.com/photo-1508736793122-f516e3ba5569?auto=format&fit=crop&w=800&q=80',
      ingredients: ['3 tallos de apio limpios', '2 cucharadas colmadas de mantequilla de almendras crudas', 'Sal marina'],
      instructions: [
        'Cortar los tallos de apio en bastones de 6 cm.',
        'Rellenar el canal del apio con la mantequilla de almendras crudas.',
        'Espolvorear una pizca de sal marina.'
      ],
      description: 'El refrigerio predilecto de Haylie Pomroy para calmar el apetito y estimular las hormonas saciantes.',
      dietaryTags: ['Pomroy FMA', 'Fase 3', 'Frutos secos', 'Leptina activa']
    }
  },

  // --- POMROY SEMANA 1: FASE 3 (Día 6 - Sábado) ---
  {
    phase: 'Fase 3: Desatar la combustión (Grasas Saludables)',
    breakfast: {
      id: 'pom-f3-b2',
      type: 'Breakfast' as const,
      dietPhase: 'Pomroy F3 (Grasas Saludables)',
      name: 'Panqueques de avena, almendra y frutos del bosque con aceite de oliva',
      calories: 470,
      proteinGrams: 20,
      proteinAnimalGrams: 10,
      proteinPlantGrams: 10,
      carbsGrams: 38,
      fatGrams: 24,
      prepTimeMinutes: 12,
      imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
      ingredients: ['1/2 taza harina de almendras', '1/2 taza avena molida', '1 huevo entero', '1 taza moras azules', '2 cdas aceite de oliva virgen', 'Extracto de vainilla'],
      instructions: [
        'Licuar la harina de almendras con la avena, el huevo, aceite de oliva, vainilla y un chorrito de leche de almendras.',
        'Cocinar en plancha antiadherente 2 minutos por lado.',
        'Servir calientes con las moras azules frescas por encima.'
      ],
      description: 'Panqueques esponjosos de fin de semana con grasas buenas que nutren la tiroides y el corazón.',
      dietaryTags: ['Pomroy FMA', 'Fase 3', 'Desayuno de Finde', 'Rico en Omega-9']
    },
    lunch: {
      id: 'pom-f3-l2',
      type: 'Lunch' as const,
      dietPhase: 'Pomroy F3 (Grasas Saludables)',
      name: 'Salmón salvaje horneado con camote dulce, limón y ensalada verde con oliva',
      calories: 550,
      proteinGrams: 42,
      proteinAnimalGrams: 36,
      proteinPlantGrams: 6,
      carbsGrams: 28,
      fatGrams: 28,
      prepTimeMinutes: 20,
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
      ingredients: ['170g filete de salmón salvaje con piel', '1 camote asado pequeño', '2 tazas lechugas mixtas', '2 cdas aceite de oliva virgen extra', 'Jugo de limón y sal marina'],
      instructions: [
        'Hornear el salmón a 200°C rociado con aceite de oliva, limón y sal marina durante 15 minutos.',
        'Acompañar con el camote asado al horno.',
        'Servir con ensalada de hojas verdes aderezada con aceite de oliva virgen extra.'
      ],
      description: 'Explosión de Omega-3 EPA y DHA para desinflamar tejidos y derretir grasa acumulada en caderas y abdomen.',
      dietaryTags: ['Pomroy FMA', 'Fase 3', 'Omega-3', 'Poder lipolítico']
    },
    dinner: {
      id: 'pom-f3-d2',
      type: 'Dinner' as const,
      dietPhase: 'Pomroy F3 (Grasas Saludables)',
      name: 'Camarones al jengibre con verduras salteadas y ajonjolí tostado',
      calories: 460,
      proteinGrams: 38,
      proteinAnimalGrams: 32,
      proteinPlantGrams: 6,
      carbsGrams: 18,
      fatGrams: 22,
      prepTimeMinutes: 15,
      imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80',
      ingredients: ['200g camarones limpios', '2 cdas aceite de ajonjolí tostado', '1 taza champiñones rebanados', '1 taza calabacitas amarillas', '1/4 taza semillas de ajonjolí tostadas', 'Jengibre fresco'],
      instructions: [
        'Saltear los camarones en wok con 1 cucharada de aceite de ajonjolí y jengibre fresco durante 3 minutos.',
        'Retirar y saltear las verduras en el aceite restante hasta que queden al dente.',
        'Mezclar los camarones, espolvorear el ajonjolí tostado y servir de inmediato.'
      ],
      description: 'Cena ligera con sesamina del ajonjolí que estimula la oxidación hepática de ácidos grasos.',
      dietaryTags: ['Pomroy FMA', 'Fase 3', 'Wok oriental', 'Sesamina']
    },
    snack: {
      id: 'pom-f3-s2',
      type: 'Snack' as const,
      dietPhase: 'Pomroy F3 (Grasas Saludables)',
      name: 'Guacamole cremoso casero con bastones de pepino y jícama',
      calories: 210,
      proteinGrams: 3,
      proteinAnimalGrams: 0,
      proteinPlantGrams: 3,
      carbsGrams: 10,
      fatGrams: 18,
      prepTimeMinutes: 4,
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      ingredients: ['1/2 aguacate maduro machacado', '1 taza bastones de pepino y jícama', '1 cda cilantro picado', 'Jugo de 1/2 lima', 'Sal marina y chile'],
      instructions: [
        'Machacar el aguacate con jugo de lima, sal de mar y cilantro.',
        'Acompañar con los bastones frescos de pepino y jícama crujiente.'
      ],
      description: 'Grasas vegetales ricas con fibra crujiente para saciedad prolongada sin elevar la insulina.',
      dietaryTags: ['Pomroy FMA', 'Fase 3', 'Guacamole', 'Cero azúcar']
    }
  }
];

// ====================================================
// 2. DR. PIERRE DUKAN - DIETA DUKAN
// Alternancia estricta entre Ataque (PP: Proteína Pura) y Crucero (PV: Proteína + Verduras)
// ====================================================
export const DUKAN_RECIPES_POOL = [
  // --- DUKAN ATAQUE 1 (PP - Proteína Pura) ---
  {
    phase: 'Dukan: Fase Ataque (Proteína Pura - PP)',
    breakfast: {
      id: 'duk-pp-b1',
      type: 'Breakfast' as const,
      dietPhase: 'Dukan: Ataque (PP)',
      name: 'Galette Dukan tradicional de salvado de avena con ricota 0%',
      calories: 310,
      proteinGrams: 28,
      proteinAnimalGrams: 22,
      proteinPlantGrams: 6,
      carbsGrams: 18,
      fatGrams: 6,
      prepTimeMinutes: 8,
      imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
      ingredients: ['1.5 cda salvado de avena Dukan', '1 huevo entero y 2 claras', '2 cdas queso blanco o ricota 0%', 'Canela en polvo', 'Gotas de estevia pura'],
      instructions: [
        'En un bol, mezclar el salvado de avena con las claras, el huevo y el queso batido 0%.',
        'Batir hasta homogeneizar y perfumar con canela.',
        'Verter en sartén antiadherente precalentada con una gota de aceite esparcida con papel absorbente.',
        'Cocinar 3 minutos por lado hasta que quede dorada y esponjosa.'
      ],
      description: 'El pilar insustituible del Dr. Dukan: fibra soluble que atrapa calorías en el intestino y aporta máxima saciedad.',
      dietaryTags: ['Dukan PP', 'Salvado de avena', 'Proteína pura', '0% Azúcar'],
      benefitTip: 'El salvado de avena absorbe hasta 20 veces su volumen de agua en el estómago, prolongando la plenitud gástrica.'
    },
    lunch: {
      id: 'duk-pp-l1',
      type: 'Lunch' as const,
      dietPhase: 'Dukan: Ataque (PP)',
      name: 'Pechuga a la plancha marinada con limón y salsa tártara Dukan',
      calories: 420,
      proteinGrams: 54,
      proteinAnimalGrams: 52,
      proteinPlantGrams: 2,
      carbsGrams: 4,
      fatGrams: 5,
      prepTimeMinutes: 15,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      ingredients: ['220g pechuga de pollo desgrasada', '3 cdas queso fresco batido 0%', '1 cdta mostaza antigua', 'Pepinillos agridulces picados fino', 'Hierbas provenzales', 'Limón'],
      instructions: [
        'Marinar la pechuga cortada en bifes con limón, sal parrillera y hierbas provenzales.',
        'Asar en plancha muy caliente 4 minutos por lado hasta dorar.',
        'Para la salsa Dukan: mezclar el queso 0% con la mostaza y los pepinillos bien picados.',
        'Servir el pollo caliente con la salsa fría.'
      ],
      description: 'Proteína pura de altísimo valor biológico sin grasa que obliga al cuerpo a quemar reservas lipídicas para digerirla.',
      dietaryTags: ['Dukan PP', 'Ataque', 'Cero grasa', 'Hiperproteico puro'],
      benefitTip: 'El efecto termogénico de las proteínas puras consume hasta un 30% de sus propias calorías durante la digestión.'
    },
    dinner: {
      id: 'duk-pp-d1',
      type: 'Dinner' as const,
      dietPhase: 'Dukan: Ataque (PP)',
      name: 'Salmón fresco al vapor con costra de eneldo y limón',
      calories: 440,
      proteinGrams: 46,
      proteinAnimalGrams: 45,
      proteinPlantGrams: 1,
      carbsGrams: 2,
      fatGrams: 14,
      prepTimeMinutes: 15,
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
      ingredients: ['200g filete de salmón fresco o merluza', 'Eneldo fresco picado', 'Jugo de 1 limón', 'Sal marina gruesa'],
      instructions: [
        'Colocar el filete en vaporera o sartén tapada con un chorrito de agua y rodajas de limón.',
        'Cocinar al vapor durante 10 a 12 minutos a fuego medio.',
        'Espolvorear abundante eneldo fresco picado y servir caliente.'
      ],
      description: 'Pescado noble para una cena de Proteína Pura con ácidos grasos esenciales protectores.',
      dietaryTags: ['Dukan PP', 'Pescado', 'Omega-3', 'Cero carbos']
    },
    snack: {
      id: 'duk-pp-s1',
      type: 'Snack' as const,
      dietPhase: 'Dukan: Ataque (PP)',
      name: 'Rollitos de pechuga de pavo con huevo duro y pimentón',
      calories: 170,
      proteinGrams: 22,
      proteinAnimalGrams: 22,
      proteinPlantGrams: 0,
      carbsGrams: 1,
      fatGrams: 5,
      prepTimeMinutes: 4,
      imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
      ingredients: ['3 fetas de pechuga de pavo cocida magra', '1 huevo duro cortado en cuartos', 'Pizca de pimentón de la Vera'],
      instructions: [
        'Envolver cada cuarto de huevo en una feta de pavo.',
        'Espolvorear con pimentón de la Vera y consumir inmediatamente.'
      ],
      description: 'Colación 100% proteica recomendada por Dukan para saciar el hambre en cualquier momento del día.',
      dietaryTags: ['Dukan PP', 'Snack Proteico', 'Cero carbohidratos']
    }
  },

  // --- DUKAN CRUCERO (PV - Proteína + Verduras) ---
  {
    phase: 'Dukan: Fase Crucero (Proteína + Verduras - PV)',
    breakfast: {
      id: 'duk-pv-b1',
      type: 'Breakfast' as const,
      dietPhase: 'Dukan: Crucero (PV)',
      name: 'Omelette Dukan de claras con espinacas y cebollín fresco',
      calories: 270,
      proteinGrams: 30,
      proteinAnimalGrams: 26,
      proteinPlantGrams: 4,
      carbsGrams: 6,
      fatGrams: 4,
      prepTimeMinutes: 10,
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
      ingredients: ['3 claras y 1 huevo entero', '1 taza espinacas frescas cortadas', '1 tallo de cebollín o verdeo', 'Sal marina y orégano'],
      instructions: [
        'Saltear el cebollín y las espinacas 2 minutos en sartén antiadherente.',
        'Añadir los huevos batidos y cocinar a fuego medio hasta cuajar.',
        'Doblar y servir con orégano por encima.'
      ],
      description: 'Fase Crucero PV: Reintroducción de hortalizas no feculentas que aportan fibra, minerales y volumen gástrico.',
      dietaryTags: ['Dukan PV', 'Crucero', 'Verduras verdes', 'Saciedad'],
      benefitTip: 'Las espinacas aportan magnesio y potasio esenciales para evitar la retención hídrica en la fase de crucero.'
    },
    lunch: {
      id: 'duk-pv-l1',
      type: 'Lunch' as const,
      dietPhase: 'Dukan: Crucero (PV)',
      name: 'Wok de ternera magra con calabacines, pimientos y champiñones',
      calories: 460,
      proteinGrams: 50,
      proteinAnimalGrams: 44,
      proteinPlantGrams: 6,
      carbsGrams: 14,
      fatGrams: 9,
      prepTimeMinutes: 18,
      imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
      ingredients: ['200g lomo o ternera magra en tiras', '1 calabacín en medias lunas', '1/2 pimiento rojo', '1 taza champiñones frescos', 'Salsa de soja baja en sodio'],
      instructions: [
        'Saltear la ternera a fuego vivo en wok o sartén profunda durante 3 minutos.',
        'Agregar los vegetales cortados y saltear otros 4 minutos manteniendo las verduras al dente.',
        'Condimentar con unas gotas de salsa de soja baja en sodio y servir bien caliente.'
      ],
      description: 'Almuerzo de Crucero PV delicioso y variado que mantiene la pérdida de grasa activa sin monotonía.',
      dietaryTags: ['Dukan PV', 'Wok', 'Crucero', 'Verduras crujientes']
    },
    dinner: {
      id: 'duk-pv-d1',
      type: 'Dinner' as const,
      dietPhase: 'Dukan: Crucero (PV)',
      name: 'Filete de merluza con tomate al horno, espárragos y albahaca',
      calories: 380,
      proteinGrams: 42,
      proteinAnimalGrams: 38,
      proteinPlantGrams: 4,
      carbsGrams: 10,
      fatGrams: 5,
      prepTimeMinutes: 18,
      imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
      ingredients: ['200g filete de merluza fresca', '1 tomate redondo maduro en rodajas', '6 espárragos verdes al vapor', 'Albahaca fresca', 'Pimienta'],
      instructions: [
        'Disponer la merluza en una fuente para horno sobre las rodajas de tomate.',
        'Sumar los espárragos al costado y hornear a 190°C por 12 minutos.',
        'Perfumar con hojas de albahaca fresca antes de servir.'
      ],
      description: 'Cena de Crucero ligera y reconfortante con licopeno antioxidante del tomate cocido.',
      dietaryTags: ['Dukan PV', 'Pescado blanco', 'Antioxidante']
    },
    snack: {
      id: 'duk-pv-s1',
      type: 'Snack' as const,
      dietPhase: 'Dukan: Crucero (PV)',
      name: 'Bastones de apio y pepino con dip de queso 0% y finas hierbas',
      calories: 120,
      proteinGrams: 14,
      proteinAnimalGrams: 12,
      proteinPlantGrams: 2,
      carbsGrams: 8,
      fatGrams: 1,
      prepTimeMinutes: 4,
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      ingredients: ['2 ramas de apio crujiente', '1 pepino en bastones', '4 cdas queso blanco 0%', 'Perejil y ajo en polvo'],
      instructions: [
        'Mezclar el queso blanco 0% con las finas hierbas, sal y ajo en polvo.',
        'Untar los bastones de apio y pepino frescos en la crema.'
      ],
      description: 'Snack refrescante e hidratante que calma la necesidad de masticar algo crujiente.',
      dietaryTags: ['Dukan PV', 'Dip casero', 'Bajo en calorías']
    }
  }
];

// ====================================================
// 3. OMNIVORO EQUILIBRADO
// ====================================================
export const OMNIVORE_RECIPES_POOL = [
  {
    phase: 'Omnívoro: Equilibrio y Fuerza',
    breakfast: {
      id: 'omni-b-1',
      type: 'Breakfast' as const,
      dietPhase: 'Omnívoro',
      name: 'Omelette de claras con avena, espinacas y chía',
      calories: 420,
      proteinGrams: 28,
      proteinAnimalGrams: 16,
      proteinPlantGrams: 12,
      carbsGrams: 44,
      fatGrams: 14,
      prepTimeMinutes: 10,
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
      ingredients: ['2 huevos enteros y 2 claras', '30g avena arrollada', '1 taza espinaca fresca', '1 cda semillas de chía', '1 cdta aceite de oliva'],
      instructions: [
        'Batir los huevos con las claras, sal marina y una pizca de pimienta.',
        'Saltear ligeramente las hojas de espinaca en sartén antiadherente con unas gotas de aceite.',
        'Incorporar el batido y espolvorear la avena y la chía por encima.',
        'Cocinar a fuego medio 3 minutos por lado hasta que quede dorado y firme.'
      ],
      description: 'Combinación ideal de albúmina de alta digestibilidad con fibra vegetal soluble para arranque energético.',
      dietaryTags: ['Equilibrio Animal/Vegetal', 'Rico en fibra', 'Rápido'],
      benefitTip: 'La chía aporta ácidos grasos omega-3 que modulan la inflamación post-entrenamiento.'
    },
    lunch: {
      id: 'omni-l-1',
      type: 'Lunch' as const,
      dietPhase: 'Omnívoro',
      name: 'Bowl de pechuga grillada con lentejas estofadas y quinoa',
      calories: 590,
      proteinGrams: 46,
      proteinAnimalGrams: 26,
      proteinPlantGrams: 20,
      carbsGrams: 64,
      fatGrams: 15,
      prepTimeMinutes: 15,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      ingredients: ['140g pechuga de pollo', '1/2 taza lentejas cocidas', '1/2 taza quinoa cocida', 'Tomates cherry', 'Rúcula', 'Jugo de medio limón'],
      instructions: [
        'Sellar la pechuga a la plancha con orégano y limón hasta dorar (6 min).',
        'Mezclar en un bowl las lentejas templadas con la quinoa.',
        'Agregar tomates cherry al medio y hojas de rúcula fresca.',
        'Cortar el pollo en tiras, coronar el plato y aderezar con limón y una pizca de oliva.'
      ],
      description: 'Sinergia perfecta: aminoácidos del pollo combinados con hierro no hemínico de lentejas potenciado por la vitamina C del limón.',
      dietaryTags: ['Rico en proteína', 'Hierro + Vitamina C', 'Sin gluten'],
      benefitTip: 'Consumir legumbres con cereales y proteína magra asegura un perfil completo de aminoácidos ramificados (BCAAs).'
    },
    dinner: {
      id: 'omni-d-1',
      type: 'Dinner' as const,
      dietPhase: 'Omnívoro',
      name: 'Filete de salmón al horno con garbanzos crocantes y espárragos',
      calories: 540,
      proteinGrams: 42,
      proteinAnimalGrams: 25,
      proteinPlantGrams: 17,
      carbsGrams: 38,
      fatGrams: 20,
      prepTimeMinutes: 20,
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
      ingredients: ['150g salmón fresco o merluza', '1/2 taza garbanzos cocidos', '1 atado chico de espárragos', 'Romero', 'Pimentón dulce'],
      instructions: [
        'Disponer los garbanzos escurridos en una placa para horno con pimentón y sal marina.',
        'Sumar el filete y los espárragos al lado.',
        'Hornear a 200°C por 15 minutos hasta que el pescado esté tierno y los garbanzos crocantes.',
        'Servir caliente con un toque de limón fresco.'
      ],
      description: 'Cena regeneradora con ácidos grasos esenciales EPA/DHA y zinc vegetal para potenciar la recuperación muscular durante el sueño.',
      dietaryTags: ['Omega-3', 'Cena liviana', 'Antiinflamatorio'],
      benefitTip: 'El zinc de los garbanzos y el magnesio de los espárragos mejoran la calidad del descanso profundo.'
    },
    snack: {
      id: 'omni-s-1',
      type: 'Snack' as const,
      dietPhase: 'Omnívoro',
      name: 'Yogur griego con nueces y semillas de calabaza',
      calories: 220,
      proteinGrams: 16,
      proteinAnimalGrams: 11,
      proteinPlantGrams: 5,
      carbsGrams: 12,
      fatGrams: 11,
      prepTimeMinutes: 3,
      imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
      ingredients: ['150g yogur griego natural sin azúcar', '15g nueces picadas', '1 cdta semillas de calabaza', 'Canela'],
      instructions: [
        'Colocar el yogur en un pote o bowl.',
        'Espolvorear con canela y añadir las nueces y semillas de calabaza por encima.'
      ],
      description: 'Snack saciante de caseína láctea de digestión gradual y magnesio vegetal para calmar la fatiga.',
      dietaryTags: ['Rápido', 'Probióticos', 'Sin azúcar']
    }
  },
  {
    phase: 'Omnívoro: Energía y Rendimiento',
    breakfast: {
      id: 'omni-b-2',
      type: 'Breakfast' as const,
      dietPhase: 'Omnívoro',
      name: 'Pancakes proteicos de avena, ricota y arándanos',
      calories: 440,
      proteinGrams: 29,
      proteinAnimalGrams: 17,
      proteinPlantGrams: 12,
      carbsGrams: 52,
      fatGrams: 12,
      prepTimeMinutes: 12,
      imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
      ingredients: ['40g harina de avena', '80g ricota descremada', '2 claras de huevo', 'Arándanos frescos', 'Esencia de vainilla'],
      instructions: [
        'Procesar la avena con la ricota, las claras y unas gotas de vainilla hasta lograr masa homogénea.',
        'Verter porciones en sartén caliente antiadherente.',
        'Cocinar 2 minutos por lado a fuego bajo.',
        'Servir con los arándanos frescos tibios.'
      ],
      description: 'Desayuno esponjoso con calcio biodisponible y carbohidratos complejos de bajo índice glucémico.',
      dietaryTags: ['Equilibrio Proteico', 'Antioxidantes', 'Fácil']
    },
    lunch: {
      id: 'omni-l-2',
      type: 'Lunch' as const,
      dietPhase: 'Omnívoro',
      name: 'Wok salteado de ternera magra con edamame, arroz integral y verduras',
      calories: 610,
      proteinGrams: 48,
      proteinAnimalGrams: 28,
      proteinPlantGrams: 20,
      carbsGrams: 62,
      fatGrams: 16,
      prepTimeMinutes: 18,
      imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
      ingredients: ['130g lomo o ternera magra en tiras', '80g edamame pelado', '3/4 taza arroz integral cocido', 'Brócoli', 'Zanahoria', 'Salsa de soja baja en sodio'],
      instructions: [
        'Saltear la ternera en un wok bien caliente con un chorrito de aceite de oliva (4 min).',
        'Agregar los ramilletes de brócoli, tiras de zanahoria y el edamame.',
        'Cocinar 4 minutos más manteniendo las verduras crocantes.',
        'Incorporar el arroz integral cocido y un chorrito de salsa de soja; saltear 2 minutos y servir.'
      ],
      description: 'Potente aporte de creatina y hierro de la carne magra junto a isoflavonas y aminoácidos del edamame.',
      dietaryTags: ['Alto en proteína', 'Rico en fibra', 'Rendimiento']
    },
    dinner: {
      id: 'omni-d-2',
      type: 'Dinner' as const,
      dietPhase: 'Omnívoro',
      name: 'Merluza a la plancha sobre hummus casero y ensalada verde',
      calories: 510,
      proteinGrams: 44,
      proteinAnimalGrams: 26,
      proteinPlantGrams: 18,
      carbsGrams: 36,
      fatGrams: 16,
      prepTimeMinutes: 15,
      imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
      ingredients: ['180g filete de merluza fresca', '3 cdas colmadas de hummus de garbanzos', 'Espinacas tiernas', 'Semillas de sésamo', 'Limón'],
      instructions: [
        'Cocinar la merluza a la plancha vuelta y vuelta con sal, pimienta y limón (3 min por lado).',
        'En la base del plato, extender el hummus cremoso con una cuchara.',
        'Colocar el pescado dorado encima.',
        'Acompañar con ensalada de hojas verdes y espolvorear sésamo tostado.'
      ],
      description: 'Cena ligera de altísima asimilación: proteína blanca sin grasa combinada con crema de garbanzo.',
      dietaryTags: ['Digestión fácil', 'Pescado blanco', 'Bajo en grasas saturadas']
    },
    snack: {
      id: 'omni-s-2',
      type: 'Snack' as const,
      dietPhase: 'Omnívoro',
      name: 'Tostada integral con huevo duro y hummus',
      calories: 210,
      proteinGrams: 13,
      proteinAnimalGrams: 7,
      proteinPlantGrams: 6,
      carbsGrams: 20,
      fatGrams: 8,
      prepTimeMinutes: 4,
      imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
      ingredients: ['1 rebanada de pan 100% integral', '1 huevo duro en rodajas', '1 cda de hummus', 'Pizca de pimentón'],
      instructions: [
        'Tostar el pan integral.',
        'Untar con hummus y acomodar las rodajas de huevo duro con pimentón.'
      ],
      description: 'Combinación crocante con aporte de colina para la salud neuromuscular.',
      dietaryTags: ['Rápido', 'Energía limpia']
    }
  }
];

// ====================================================
// 4. VEGETARIANO (OVOLACTOVEGETARIANO)
// ====================================================
export const VEGETARIAN_RECIPES_POOL = [
  {
    phase: 'Vegetariano: Fuerza y Digestión',
    breakfast: {
      id: 'veg-b-1',
      type: 'Breakfast' as const,
      dietPhase: 'Vegetariano',
      name: 'Revuelto cremoso de huevos de campo, tofu y tostada de centeno',
      calories: 430,
      proteinGrams: 27,
      proteinAnimalGrams: 14,
      proteinPlantGrams: 13,
      carbsGrams: 42,
      fatGrams: 17,
      prepTimeMinutes: 10,
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
      ingredients: ['2 huevos enteros', '60g tofu firme desmenuzado', '1 rebanada pan de centeno', 'Tomatitos secos', 'Cúrcuma y orégano'],
      instructions: [
        'Desmenuzar el tofu con tenedor y dorarlo 2 minutos en sartén con cúrcuma.',
        'Añadir los huevos batidos a fuego mínimo y remover despacio hasta obtener textura cremosa.',
        'Servir sobre la tostada de centeno con tomatitos secos hidratados.'
      ],
      description: 'Equilibrio perfecto de aminoácidos entre proteína de huevo y soya no transgénica.',
      dietaryTags: ['Vegetariano', 'Cúrcuma antiinflamatoria', 'Rápido']
    },
    lunch: {
      id: 'veg-l-1',
      type: 'Lunch' as const,
      dietPhase: 'Vegetariano',
      name: 'Curry suave de garbanzos, queso feta y espinacas con arroz basmati',
      calories: 590,
      proteinGrams: 34,
      proteinAnimalGrams: 12,
      proteinPlantGrams: 22,
      carbsGrams: 68,
      fatGrams: 18,
      prepTimeMinutes: 20,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      ingredients: ['1 taza garbanzos cocidos', '40g queso feta desmenuzado', '2 tazas espinacas', '1/2 taza arroz basmati', 'Curry suave y leche vegetal'],
      instructions: [
        'Saltear las espinacas en olla mediana con pasta de curry y un chorrito de leche vegetal.',
        'Sumar los garbanzos cocidos y cocinar a fuego lento 8 minutos.',
        'Servir junto con el arroz basmati caliente y coronar con queso feta desmenuzado.'
      ],
      description: 'Plato cálido y reconfortante con excelente perfil de magnesio y hierro no hemínico.',
      dietaryTags: ['Vegetariano', 'Rico en fibra', 'Hierro vegetal']
    },
    dinner: {
      id: 'veg-d-1',
      type: 'Dinner' as const,
      dietPhase: 'Vegetariano',
      name: 'Berenjena rellena gratinada con ricota, lentejas y semillas de cáñamo',
      calories: 490,
      proteinGrams: 32,
      proteinAnimalGrams: 15,
      proteinPlantGrams: 17,
      carbsGrams: 42,
      fatGrams: 15,
      prepTimeMinutes: 25,
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      ingredients: ['1 berenjena grande partida al medio', '100g ricota magra', '1/2 taza lentejas cocidas', '1 cda semillas de cáñamo o chía', 'Salsa de tomate casera'],
      instructions: [
        'Hornear las mitades de berenjena a 190°C por 15 minutos hasta tiernizar la pulpa.',
        'Ahuecar y mezclar la pulpa con las lentejas, la ricota y salsa de tomate.',
        'Rellenar las berenjenas y gratinar 8 minutos en horno fuerte.',
        'Espolvorear con semillas de cáñamo antes de servir.'
      ],
      description: 'Cena sin carne con textura gratificante y alta saciedad por densidad de fibra y caseína láctea.',
      dietaryTags: ['Vegetariano', 'Cena liviana', 'Sin gluten']
    },
    snack: {
      id: 'veg-s-1',
      type: 'Snack' as const,
      dietPhase: 'Vegetariano',
      name: 'Yogur de kéfir o griego con semillas de chía y canela',
      calories: 190,
      proteinGrams: 15,
      proteinAnimalGrams: 12,
      proteinPlantGrams: 3,
      carbsGrams: 10,
      fatGrams: 6,
      prepTimeMinutes: 3,
      imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
      ingredients: ['150g yogur de kéfir o griego', '1 cdta semillas de chía hidratadas', 'Canela molida', 'Gotas de vainilla'],
      instructions: [
        'Batir el yogur con la vainilla.',
        'Incorporar la chía y canela molida.'
      ],
      description: 'Aporte de probióticos vivos para modular el microbioma y la inmunidad intestinal.',
      dietaryTags: ['Vegetariano', 'Probiótico', 'Digestión']
    }
  }
];

// ====================================================
// 5. VEGANO (100% PROTEÍNA VEGETAL COMPLETA)
// ====================================================
export const VEGAN_RECIPES_POOL = [
  {
    phase: 'Vegano: Densidad Nutricional 100% Plant-Based',
    breakfast: {
      id: 'veg-pl-b1',
      type: 'Breakfast' as const,
      dietPhase: 'Vegano',
      name: 'Tofu revuelto a la sartén con cúrcuma, espinacas y tostada integral',
      calories: 390,
      proteinGrams: 26,
      proteinAnimalGrams: 0,
      proteinPlantGrams: 26,
      carbsGrams: 38,
      fatGrams: 14,
      prepTimeMinutes: 10,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      ingredients: ['150g tofu firme desmenuzado', '1 cda levadura nutricional', '1 taza espinacas', '1/2 cdta cúrcuma y sal negra (kala namak)', '1 rebanada pan integral'],
      instructions: [
        'Desmenuzar el tofu con tenedor simulando textura de huevo revuelto.',
        'Saltear en sartén caliente con la cúrcuma, la levadura nutricional y las espinacas 4 minutos.',
        'Sazonar al final con una pizca de sal negra (kala namak) para aportar sabor umami y azufrado característico.',
        'Servir sobre tostada crujiente.'
      ],
      description: 'El clásico tofu scramble: proteína vegetal completa con vitaminas del complejo B de la levadura nutricional.',
      dietaryTags: ['100% Vegano', 'Sin colesterol', 'Levadura B12'],
      benefitTip: 'La levadura nutricional aporta sabor a queso y un perfil completo de aminoácidos esenciales.'
    },
    lunch: {
      id: 'veg-pl-l1',
      type: 'Lunch' as const,
      dietPhase: 'Vegano',
      name: 'Power bowl de tempeh marinado con quinoa, edamame y aguacate',
      calories: 580,
      proteinGrams: 38,
      proteinAnimalGrams: 0,
      proteinPlantGrams: 38,
      carbsGrams: 56,
      fatGrams: 20,
      prepTimeMinutes: 20,
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
      ingredients: ['120g tempeh fermentado en cubos', '1/2 taza quinoa cocida', '1/2 taza edamame', '1/4 aguacate', 'Zanahoria rallada', 'Salsa tamari'],
      instructions: [
        'Marinar el tempeh con salsa tamari, ajo en polvo y jengibre rallado.',
        'Dorar en sartén 5 minutos hasta que esté caramelizado y crujiente.',
        'Montar el bowl con base de quinoa, edamame templado, zanahoria y aguacate en láminas.',
        'Colocar el tempeh por encima y bañar con semillas de sésamo tostado.'
      ],
      description: 'Almuerzo de alta densidad con soja fermentada (tempeh) de altísima digestibilidad que no genera gases.',
      dietaryTags: ['100% Vegano', 'Proteína Completa', 'Fermentado saludable']
    },
    dinner: {
      id: 'veg-pl-d1',
      type: 'Dinner' as const,
      dietPhase: 'Vegano',
      name: 'Estofado de garbanzos con calabaza, espinacas y tahini',
      calories: 490,
      proteinGrams: 28,
      proteinAnimalGrams: 0,
      proteinPlantGrams: 28,
      carbsGrams: 58,
      fatGrams: 16,
      prepTimeMinutes: 20,
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      ingredients: ['1.5 tazas garbanzos cocidos', '1 taza calabaza en dados', '2 tazas espinacas tiernas', '1 cda tahini (pasta de sésamo)', 'Comino y pimentón ahumado'],
      instructions: [
        'Cocinar la calabaza en dados en una cacerola con un poco de agua hasta que esté tierna.',
        'Sumar los garbanzos, las espinacas y los condimentos aromáticos.',
        'Disolver el tahini en el estofado para generar un caldo untuoso y rico en calcio.',
        'Servir humeante.'
      ],
      description: 'Cena reconfortante y caliente rica en calcio biodisponible del tahini y triptófano vegetal para inducir el descanso.',
      dietaryTags: ['100% Vegano', 'Calcio biodisponible', 'Antiinflamatorio']
    },
    snack: {
      id: 'veg-pl-s1',
      type: 'Snack' as const,
      dietPhase: 'Vegano',
      name: 'Edamame al vapor con sal marina y limón',
      calories: 180,
      proteinGrams: 16,
      proteinAnimalGrams: 0,
      proteinPlantGrams: 16,
      carbsGrams: 12,
      fatGrams: 6,
      prepTimeMinutes: 5,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      ingredients: ['1 taza vainas de edamame enteras', 'Sal marina gruesa o escamas', 'Jugo de lima o limón'],
      instructions: [
        'Cocinar el edamame en agua hirviendo con sal durante 4 minutos.',
        'Escurrir y servir caliente con escamas de sal marina y gotas de limón.'
      ],
      description: 'Snack verde de proteína completa, rico en fibra prebiótica y minerales esenciales.',
      dietaryTags: ['100% Vegano', 'Snack Limpio', 'Fibra']
    }
  }
];

// Helper to retrieve all recipes flattened for the Recipe Explorer
export function getAllAvailableRecipes(): Meal[] {
  const allMeals: Meal[] = [];
  const pools = [
    ...POMROY_RECIPES_POOL,
    ...DUKAN_RECIPES_POOL,
    ...OMNIVORE_RECIPES_POOL,
    ...VEGETARIAN_RECIPES_POOL,
    ...VEGAN_RECIPES_POOL
  ];

  pools.forEach(day => {
    allMeals.push(day.breakfast);
    allMeals.push(day.lunch);
    allMeals.push(day.dinner);
    allMeals.push(day.snack);
  });

  // Deduplicate by ID
  const map = new Map<string, Meal>();
  allMeals.forEach(m => {
    if (!map.has(m.id)) {
      map.set(m.id, m);
    }
  });

  return Array.from(map.values());
}

// ----------------------------------------------------
// 30-DAY CHALLENGE GENERATOR
// ----------------------------------------------------
export function getMealPlanForDay(dayNumber: number, diet: DietaryPreferenceType): {
  dayNumber: number;
  theme: string;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snack: Meal;
  };
} {
  // Normalize day between 1 and 30
  const normalizedDay = Math.max(1, Math.min(30, dayNumber));

  let pool: any[];
  switch (diet) {
    case 'pomroy':
      pool = POMROY_RECIPES_POOL;
      break;
    case 'dukan':
    case 'dukan_keto':
    case 'hiperproteico':
      pool = DUKAN_RECIPES_POOL;
      break;
    case 'vegetarian':
      pool = VEGETARIAN_RECIPES_POOL;
      break;
    case 'vegan':
      pool = VEGAN_RECIPES_POOL;
      break;
    case 'omnivore':
    default:
      pool = OMNIVORE_RECIPES_POOL;
      break;
  }

  // Calculate day in pool (for Pomroy, it cycles cleanly across F1, F2, F3)
  const base = pool[(normalizedDay - 1) % pool.length];

  let themePrefix = '';
  if (diet === 'pomroy') {
    themePrefix = `Dra. Pomroy (Metabolismo Acelerado) • ${base.phase} • `;
  } else if (diet === 'dukan' || diet === 'dukan_keto' || diet === 'hiperproteico') {
    themePrefix = `Dr. Dukan • ${base.phase} • `;
  }

  const themes = [
    'Activación y fuerza metabólica',
    'Recuperación celular y balance',
    'Potencia y energía sostenida',
    'Depuración y ligereza digestiva',
    'Construcción y síntesis muscular',
    'Resistencia y antiinflamación',
    'Regeneración profunda de fin de semana'
  ];

  const theme = `${themePrefix}Día ${normalizedDay} • ${themes[(normalizedDay - 1) % themes.length]}`;

  // Clone with distinct ID for current challenge day
  return {
    dayNumber: normalizedDay,
    theme,
    meals: {
      breakfast: { ...base.breakfast, id: `${base.breakfast.id}-d${normalizedDay}` },
      lunch: { ...base.lunch, id: `${base.lunch.id}-d${normalizedDay}` },
      dinner: { ...base.dinner, id: `${base.dinner.id}-d${normalizedDay}` },
      snack: { ...base.snack, id: `${base.snack.id}-d${normalizedDay}` }
    }
  };
}
