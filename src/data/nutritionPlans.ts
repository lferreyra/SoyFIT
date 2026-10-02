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

// ----------------------------------------------------
// RECIPE TEMPLATES FOR OMNIVORE (EQUILIBRIO ANIMAL + VEGETAL)
// ----------------------------------------------------
const OMNIVORE_RECIPES_POOL = [
  {
    breakfast: {
      id: 'omni-b-1',
      type: 'Breakfast' as const,
      name: 'Omelette de claras con avena, espinacas y chía',
      calories: 420,
      proteinGrams: 28,
      proteinAnimalGrams: 16,
      proteinPlantGrams: 12,
      carbsGrams: 44,
      fatGrams: 14,
      prepTimeMinutes: 10,
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
      name: 'Bowl de pechuga grillada con lentejas estofadas y quinoa',
      calories: 590,
      proteinGrams: 46,
      proteinAnimalGrams: 26,
      proteinPlantGrams: 20,
      carbsGrams: 64,
      fatGrams: 15,
      prepTimeMinutes: 15,
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
      name: 'Filete de salmón al horno con garbanzos crocantes y espárragos',
      calories: 540,
      proteinGrams: 42,
      proteinAnimalGrams: 25,
      proteinPlantGrams: 17,
      carbsGrams: 38,
      fatGrams: 20,
      prepTimeMinutes: 20,
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
      name: 'Yogur griego con nueces y semillas de calabaza',
      calories: 220,
      proteinGrams: 16,
      proteinAnimalGrams: 11,
      proteinPlantGrams: 5,
      carbsGrams: 12,
      fatGrams: 11,
      prepTimeMinutes: 3,
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
    breakfast: {
      id: 'omni-b-2',
      type: 'Breakfast' as const,
      name: 'Pancakes proteicos de avena, ricota y arándanos',
      calories: 440,
      proteinGrams: 29,
      proteinAnimalGrams: 17,
      proteinPlantGrams: 12,
      carbsGrams: 52,
      fatGrams: 12,
      prepTimeMinutes: 12,
      ingredients: ['40g harina de avena', '80g ricota descremada', '2 claras de huevo', 'Arándanos frescos', 'Esencia de vainilla'],
      instructions: [
        'Procesar la avena con la ricota, las claras y unas gotas de vainilla hasta lograr masa homogénea.',
        'Verter porciones en sartén caliente antiadherente.',
        'Cocinar 2 minutos por lado a fuego bajo.',
        'Servir con los arándanos frescos tibios.'
      ],
      description: 'Desayuno esponjoso con calcio biodisponible y carbohidratos complejos de bajo índice glucémico.',
      dietaryTags: ['Equilibrio Proteico', 'Antioxidantes', 'Fácil'],
      benefitTip: 'Los flavonoides de los arándanos protegen la membrana celular del estrés oxidativo del ejercicio.'
    },
    lunch: {
      id: 'omni-l-2',
      type: 'Lunch' as const,
      name: 'Wok salteado de ternera magra con edamame, arroz integral y verduras',
      calories: 610,
      proteinGrams: 48,
      proteinAnimalGrams: 28,
      proteinPlantGrams: 20,
      carbsGrams: 62,
      fatGrams: 16,
      prepTimeMinutes: 18,
      ingredients: ['130g lomo o ternera magra en tiras', '80g edamame pelado', '3/4 taza arroz integral cocido', 'Brócoli', 'Zanahoria', 'Salsa de soja baja en sodio'],
      instructions: [
        'Saltear la ternera en un wok bien caliente con un chorrito de aceite de sésamo u oliva (4 min).',
        'Agregar los ramilletes de brócoli, tiras de zanahoria y el edamame.',
        'Cocinar 4 minutos más manteniendo las verduras crocantes.',
        'Incorporar el arroz integral cocido y un chorrito de salsa de soja; saltear 2 minutos y servir.'
      ],
      description: 'Potente aporte de creatina y hierro de la carne magra junto a isoflavonas y aminoácidos del edamame.',
      dietaryTags: ['Alto en proteína', 'Rico en fibra', 'Rendimiento'],
      benefitTip: 'El edamame aporta proteína vegetal completa y ácido fólico para la regeneración celular.'
    },
    dinner: {
      id: 'omni-d-2',
      type: 'Dinner' as const,
      name: 'Merluza a la plancha sobre hummus casero y ensalada verde',
      calories: 510,
      proteinGrams: 44,
      proteinAnimalGrams: 26,
      proteinPlantGrams: 18,
      carbsGrams: 36,
      fatGrams: 16,
      prepTimeMinutes: 15,
      ingredients: ['180g filete de merluza fresca', '3 cdas colmadas de hummus de garbanzos', 'Espinacas tiernas', 'Semillas de sésamo', 'Limón'],
      instructions: [
        'Cocinar la merluza a la plancha vuelta y vuelta con sal, pimienta y limón (3 min por lado).',
        'En la base del plato, extender el hummus cremoso con una cuchara.',
        'Colocar el pescado dorado encima.',
        'Acompañar con ensalada de hojas verdes y espolvorear sésamo tostado.'
      ],
      description: 'Cena ligera de altísima asimilación: proteína blanca sin grasa combinada con crema de garbanzo.',
      dietaryTags: ['Digestión fácil', 'Pescado blanco', 'Bajo en grasas saturadas'],
      benefitTip: 'El sésamo aporta calcio vegetal biodisponible para proteger la densidad ósea.'
    },
    snack: {
      id: 'omni-s-2',
      type: 'Snack' as const,
      name: 'Tostada integral con huevo duro y hummus',
      calories: 210,
      proteinGrams: 13,
      proteinAnimalGrams: 7,
      proteinPlantGrams: 6,
      carbsGrams: 20,
      fatGrams: 8,
      prepTimeMinutes: 4,
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

// ----------------------------------------------------
// RECIPE TEMPLATES FOR VEGETARIAN (OVOLACTOVEGETARIANO)
// ----------------------------------------------------
const VEGETARIAN_RECIPES_POOL = [
  {
    breakfast: {
      id: 'veg-b-1',
      type: 'Breakfast' as const,
      name: 'Revuelto cremoso de huevos de campo, tofu y tostada de centeno',
      calories: 430,
      proteinGrams: 27,
      proteinAnimalGrams: 14,
      proteinPlantGrams: 13,
      carbsGrams: 42,
      fatGrams: 17,
      prepTimeMinutes: 10,
      ingredients: ['2 huevos enteros', '60g tofu firme desmenuzado', '1 rebanada pan de centeno', 'Tomatitos secos', 'Cúrcuma y orégano'],
      instructions: [
        'Desmenuzar el tofu con tenedor y dorarlo 2 minutos en sartén con cúrcuma.',
        'Añadir los huevos batidos a fuego mínimo y remover despacio hasta obtener textura cremosa.',
        'Servir sobre la tostada de centeno con tomatitos secos hidratados.'
      ],
      description: 'Equilibrio perfecto de aminoácidos entre proteína de huevo y soya no transgénica.',
      dietaryTags: ['Vegetariano', 'Cúrcuma antiinflamatoria', 'Rápido'],
      benefitTip: 'La cúrcuma con pimienta es uno de los mejores moduladores articulares naturales.'
    },
    lunch: {
      id: 'veg-l-1',
      type: 'Lunch' as const,
      name: 'Curry suave de garbanzos, queso feta y espinacas con arroz basmati',
      calories: 590,
      proteinGrams: 34,
      proteinAnimalGrams: 12,
      proteinPlantGrams: 22,
      carbsGrams: 68,
      fatGrams: 18,
      prepTimeMinutes: 18,
      ingredients: ['1 taza garbanzos cocidos', '40g queso feta o ricota firme', '1 taza espinacas', '1/2 taza arroz basmati', 'Leche de coco liviana', 'Curry en polvo'],
      instructions: [
        'Dorar el curry con unas gotas de aceite y agregar los garbanzos.',
        'Verter 100 ml de leche de coco liviana y cocinar a fuego bajo 8 minutos.',
        'Incorporar las hojas de espinaca y apagar el fuego para que se marchiten suavemente.',
        'Servir con arroz basmati al vapor y desgranar el queso feta encima.'
      ],
      description: 'Plato reconfortante con excelente perfil proteico, magnesio y carbohidratos energéticos.',
      dietaryTags: ['Vegetariano', 'Rico en fibra', 'Sabor especiado'],
      benefitTip: 'Los garbanzos son ricos en manganeso, cofactor clave en la síntesis de colágeno.'
    },
    dinner: {
      id: 'veg-d-1',
      type: 'Dinner' as const,
      name: 'Hamburguesas caseras de lentejas y avena con ensalada de ricota y palta',
      calories: 530,
      proteinGrams: 32,
      proteinAnimalGrams: 10,
      proteinPlantGrams: 22,
      carbsGrams: 54,
      fatGrams: 18,
      prepTimeMinutes: 20,
      ingredients: ['1 taza lentejas cocidas pisadas', '3 cdas avena arrollada', '60g ricota magra', '1/4 palta madura', 'Hojas verdes', 'Ajo y perejil'],
      instructions: [
        'Mezclar las lentejas con la avena, ajo y perejil picado; armar 2 medallones.',
        'Cocinar en sartén antiadherente 4 minutos por lado hasta que estén firmes y doradas.',
        'Servir con un bowl de hojas verdes, la ricota desmenuzada y rodajitas de palta aderezadas con limón.'
      ],
      description: 'Cena vegetariana saciante, rica en triptófano para propiciar descanso y recuperación.',
      dietaryTags: ['Vegetariano', 'Hierro vegetal', 'Fibra prebiótica'],
      benefitTip: 'La avena y las lentejas combinadas aportan todos los aminoácidos indispensables.'
    },
    snack: {
      id: 'veg-s-1',
      type: 'Snack' as const,
      name: 'Yogur griego con semillas de cáñamo y frutos rojos',
      calories: 210,
      proteinGrams: 18,
      proteinAnimalGrams: 12,
      proteinPlantGrams: 6,
      carbsGrams: 16,
      fatGrams: 8,
      prepTimeMinutes: 3,
      ingredients: ['150g yogur griego descremado', '1 cda semillas de cáñamo (hemp seeds)', 'Frutillas o arándanos'],
      instructions: [
        'Mezclar el yogur griego con los frutos rojos y coronar con las semillas de cáñamo.'
      ],
      description: 'Aporte concentrado de proteína de cáñamo rica en arginina para favorecer la circulación.',
      dietaryTags: ['Vegetariano', 'Proteico', 'Rápido']
    }
  }
];

// ----------------------------------------------------
// RECIPE TEMPLATES FOR VEGAN (100% PROTEÍNAS VEGETALES)
// ----------------------------------------------------
const VEGAN_RECIPES_POOL = [
  {
    breakfast: {
      id: 'veg-pl-1',
      type: 'Breakfast' as const,
      name: 'Scramble de tofu sazonado con espinacas y tostadas de masa madre',
      calories: 410,
      proteinGrams: 25,
      proteinAnimalGrams: 0,
      proteinPlantGrams: 25,
      carbsGrams: 46,
      fatGrams: 14,
      prepTimeMinutes: 10,
      ingredients: ['150g tofu orgánico firme', '1 taza espinaca', '1 cda levadura nutricional', 'Pizca cúrcuma y sal negra (kala namak)', '1 rebanada pan de masa madre'],
      instructions: [
        'Desmenuzar el tofu en sartén caliente con cúrcuma y levadura nutricional.',
        'Agregar la espinaca y saltear hasta integrar los sabores.',
        'Finalizar con una pizca de sal negra para aroma auténtico.',
        'Servir sobre tostada crujiente de masa madre.'
      ],
      description: 'Desayuno 100% vegetal con textura similar al revuelto, cargado de vitaminas del grupo B gracias a la levadura nutricional.',
      dietaryTags: ['100% Vegano', 'Levadura nutricional B12', 'Proteína completa'],
      benefitTip: 'La levadura nutricional fortificada aporta vitamina B12 esencial y zinc.'
    },
    lunch: {
      id: 'veg-pl-l-1',
      type: 'Lunch' as const,
      name: 'Bowl hiperproteico de tempeh marinado, quinoa real y edamame',
      calories: 620,
      proteinGrams: 42,
      proteinAnimalGrams: 0,
      proteinPlantGrams: 42,
      carbsGrams: 65,
      fatGrams: 18,
      prepTimeMinutes: 18,
      ingredients: ['120g tempeh en cubos', '1/2 taza quinoa cocida', '80g edamame cocido', 'Repollo morado', 'Zanahoria', 'Aderezo de tahini y limón'],
      instructions: [
        'Marinar los cubos de tempeh con salsa de soja y limón 5 min.',
        'Dorar en sartén con fuego vivo hasta caramelizar los bordes.',
        'Montar en un bowl sobre la base de quinoa y edamame.',
        'Acompañar con repollo morado rallado y aderezar con una emulsión de tahini y agua tibia.'
      ],
      description: 'El tempeh fermentado ofrece máxima biodisponibilidad y digestión ligera con 42g de pura proteína vegetal.',
      dietaryTags: ['100% Vegano', 'Fermentados', 'Alto rendimiento'],
      benefitTip: 'La fermentación natural del tempeh reduce los fitatos y mejora la absorción de hierro y calcio.'
    },
    dinner: {
      id: 'veg-pl-d-1',
      type: 'Dinner' as const,
      name: 'Guiso estofado de lentejas rojas, leche de coco y semillas de calabaza',
      calories: 520,
      proteinGrams: 31,
      proteinAnimalGrams: 0,
      proteinPlantGrams: 31,
      carbsGrams: 64,
      fatGrams: 15,
      prepTimeMinutes: 20,
      ingredients: ['3/4 taza lentejas rojas partidas', '1 cda semillas de calabaza tostadas', 'Calabaza en cubitos', 'Jengibre rallado', 'Espinacas', 'Comino'],
      instructions: [
        'Cocinar las lentejas rojas con los cubitos de calabaza y comino por 12 minutos (se cocinan muy rápido).',
        'Agregar jengibre rallado fresco y un puñado de espinacas.',
        'Servir bien cremoso en un plato hondo con las semillas de calabaza tostadas por encima para sumar crocancia y zinc.'
      ],
      description: 'Cena reconfortante de digestión rápida y alto valor saciante sin pesadez estomacal.',
      dietaryTags: ['100% Vegano', 'Lentejas rojas', 'Rápida digestión'],
      benefitTip: 'Las lentejas rojas al no tener piel son sumamente suaves para el tracto digestivo nocturno.'
    },
    snack: {
      id: 'veg-pl-s-1',
      type: 'Snack' as const,
      name: 'Batido de proteína vegetal de arveja con leche de almendras y manteca de maní',
      calories: 240,
      proteinGrams: 24,
      proteinAnimalGrams: 0,
      proteinPlantGrams: 24,
      carbsGrams: 14,
      fatGrams: 9,
      prepTimeMinutes: 3,
      ingredients: ['1 medida de proteína vegetal aislada (arveja/arroz)', '250 ml bebida vegetal sin azúcar', '1 cdta manteca de maní natural', 'Canela'],
      instructions: [
        'Agitar en shaker o licuar 30 segundos y beber frío.'
      ],
      description: 'Shot inmediato de aminoácidos para frenar el catabolismo y promover la síntesis de nuevas fibras.',
      dietaryTags: ['100% Vegano', 'Post-entreno', 'Express']
    }
  }
];

// ----------------------------------------------------
// RECIPE TEMPLATES FOR DUKAN / KETO PROTEICA (DR. PIERRE DUKAN)
// ----------------------------------------------------
const DUKAN_KETO_RECIPES_POOL = [
  {
    breakfast: {
      id: 'dukan-b-1',
      type: 'Breakfast' as const,
      name: 'Galette Dukan de salvado de avena con revuelto de claras y pavo',
      calories: 360,
      proteinGrams: 38,
      proteinAnimalGrams: 32,
      proteinPlantGrams: 6,
      carbsGrams: 16,
      fatGrams: 11,
      prepTimeMinutes: 10,
      ingredients: ['1.5 cda salvado de avena (dosis diaria Dukan)', '1 huevo entero y 3 claras', '50g pechuga de pavo natural 0% grasa', 'Sal marina y finas hierbas'],
      instructions: [
        'Batir el huevo y las claras con el salvado de avena y una pizca de hierbas provenzales.',
        'Verter en sartén con apenas una gota de aceite esparcida con servilleta.',
        'Cocinar la galette 3 minutos por lado hasta que quede dorada y esponjosa.',
        'Servir acompañada de las fetas de pavo natural en rollitos.'
      ],
      description: 'Clásico indiscutido del Dr. Pierre Dukan: el salvado de avena absorbe hasta 20 veces su volumen en agua, saciando el apetito y regulando la glucemia.',
      dietaryTags: ['Método Dukan', 'Keto Proteico', 'Salvado de avena', 'Bajo en carbos'],
      benefitTip: 'Fase de Ataque/Crucero: el salvado de avena atrapa calorías en el tránsito digestivo mientras la proteína pura estimula la termogénesis.'
    },
    lunch: {
      id: 'dukan-l-1',
      type: 'Lunch' as const,
      name: 'Pechuga marinada a las hierbas con espárragos grillados (Día Proteína + Verdura)',
      calories: 460,
      proteinGrams: 52,
      proteinAnimalGrams: 47,
      proteinPlantGrams: 5,
      carbsGrams: 8,
      fatGrams: 12,
      prepTimeMinutes: 15,
      ingredients: ['200g pechuga de pollo magra', '12 espárragos frescos', 'Mostaza de Dijon (sin azúcar)', 'Hierbas provenzales', 'Jugo de limón'],
      instructions: [
        'Untar la pechuga con una capa fina de mostaza de Dijon y jugo de limón.',
        'Cocinar a la plancha a fuego medio-alto hasta obtener un sellado dorado y jugoso.',
        'En la misma plancha, grillar los espárragos con sal marina gruesa 5 minutos.',
        'Emplatar juntos para un almuerzo saciante y sin carbohidratos simples.'
      ],
      description: 'Patrón de crucero Dukan (PV): máxima densidad proteica con fibra verde no feculenta que no eleva la insulina.',
      dietaryTags: ['Método Dukan', 'Alto en proteína pura', 'Cero azúcares', 'Keto'],
      benefitTip: 'Consumir 50g de proteína magra demanda un 25-30% de sus propias calorías solo para ser metabolizada (efecto térmico de los alimentos).'
    },
    dinner: {
      id: 'dukan-d-1',
      type: 'Dinner' as const,
      name: 'Lomo de atún fresco o salmón con salteado de espinacas y ajo',
      calories: 440,
      proteinGrams: 48,
      proteinAnimalGrams: 43,
      proteinPlantGrams: 5,
      carbsGrams: 6,
      fatGrams: 14,
      prepTimeMinutes: 15,
      ingredients: ['180g lomo de atún o salmón fresco', '2 tazas espinacas frescas', '1 diente de ajo laminado', 'Gotas de aceite de oliva', 'Sal gruesa'],
      instructions: [
        'Sellar el lomo de atún 2 minutos de cada lado en plancha bien caliente (debe quedar rosado en el centro para conservar jugosidad).',
        'En sartén contigua, dorar el ajo laminado y agregar las espinacas 90 segundos.',
        'Servir inmediatamente con unas gotas de limón.'
      ],
      description: 'Pescado noble rico en aminoácidos esenciales y omega-3 sin interrupción del estado de cetosis nutricional.',
      dietaryTags: ['Método Dukan', 'Proteína Pura Marina', 'Cetosis'],
      benefitTip: 'Excelente opción para cena Dukan: saciedad absoluta sin retención de líquidos nocturna.'
    },
    snack: {
      id: 'dukan-s-1',
      type: 'Snack' as const,
      name: 'Queso blanco 0% grasa batido con canela y gotas de vainilla',
      calories: 140,
      proteinGrams: 20,
      proteinAnimalGrams: 20,
      proteinPlantGrams: 0,
      carbsGrams: 6,
      fatGrams: 0,
      prepTimeMinutes: 2,
      ingredients: ['180g queso blanco o ricota 0% materia grasa', 'Pizca canela de Ceilán', 'Esencia de vainilla'],
      instructions: [
        'Batir el queso 0% con tenedor hasta que quede como una crema suave.',
        'Aromatizar con vainilla y canela.'
      ],
      description: 'Colación permitida a voluntad en el esquema del Dr. Dukan: 100% caseína magra anti-ansiedad.',
      dietaryTags: ['Método Dukan', '0% Grasa', 'Express']
    }
  },
  {
    breakfast: {
      id: 'dukan-b-2',
      type: 'Breakfast' as const,
      name: 'Omelette Dukan de 3 claras y 1 yema con queso magro 0% y orégano',
      calories: 320,
      proteinGrams: 36,
      proteinAnimalGrams: 35,
      proteinPlantGrams: 1,
      carbsGrams: 4,
      fatGrams: 10,
      prepTimeMinutes: 8,
      ingredients: ['1 huevo entero y 3 claras', '40g queso magro 0% grasa', 'Orégano seco', 'Pizca sal marina'],
      instructions: [
        'Batir enérgicamente las claras y el huevo con orégano.',
        'Cocinar en sartén antiadherente precalentada.',
        'Rellenar en el centro con el queso magro 0% y doblar en medialuna.',
        'Tapar 1 minuto para que el queso se funda.'
      ],
      description: 'Proteína pura matutina de rápida absorción con mínimo impacto calórico.',
      dietaryTags: ['Método Dukan', 'Proteína Pura (PP)', 'Keto'],
      benefitTip: 'Ideal para días de Proteína Pura (PP) que aceleran la lipólisis sin pérdida de masa muscular.'
    },
    lunch: {
      id: 'dukan-l-2',
      type: 'Lunch' as const,
      name: 'Medallones de ternera magra a la pimienta con calabacín (zucchini) asado',
      calories: 490,
      proteinGrams: 54,
      proteinAnimalGrams: 50,
      proteinPlantGrams: 4,
      carbsGrams: 7,
      fatGrams: 14,
      prepTimeMinutes: 16,
      ingredients: ['200g bola de lomo o cuadril magro', '1 zucchini mediano en rodajas', 'Pimienta negra recién molida', 'Romero fresco'],
      instructions: [
        'Sellar la carne magra a la plancha bien caliente al punto deseado con pimienta abundante.',
        'En la misma plancha dorar las rodajas de calabacín hasta que tomen marcas de cocción.',
        'Servir caliente aromatizado con romero.'
      ],
      description: 'Aporte masivo de hierro hemínico, vitamina B12 y zinc para maximizar la síntesis de hemoglobina y energía mitocondrial.',
      dietaryTags: ['Método Dukan', 'Proteína + Verdura (PV)', 'Alto en hierro'],
      benefitTip: 'El calabacín aporta potasio para contrarrestar la pérdida de electrolitos típica del proceso keto.'
    },
    dinner: {
      id: 'dukan-d-2',
      type: 'Dinner' as const,
      name: 'Salteado de mariscos y langostinos al ajillo con hinojo crocante',
      calories: 390,
      proteinGrams: 46,
      proteinAnimalGrams: 44,
      proteinPlantGrams: 2,
      carbsGrams: 5,
      fatGrams: 9,
      prepTimeMinutes: 12,
      ingredients: ['220g langostinos o mix de mariscos limpios', '1 diente de ajo', '1/2 bulbo de hinojo en juliana fina', 'Perejil picado', 'Gotas de limón'],
      instructions: [
        'Dorar el ajo en sartén bien caliente.',
        'Añadir los langostinos y saltear a fuego fuerte por 3 minutos.',
        'Incorporar el hinojo en juliana los últimos 90 segundos para preservar su textura crujiente.',
        'Finalizar con perejil fresco y unas gotas de limón.'
      ],
      description: 'Cena marina gourmet con casi 0g de carbohidratos, altísima biodisponibilidad de yodo y selenio.',
      dietaryTags: ['Método Dukan', 'Mariscos', 'Cena proteica pura'],
      benefitTip: 'El yodo de los mariscos optimiza el funcionamiento de la glándula tiroides y el metabolismo basal.'
    },
    snack: {
      id: 'dukan-s-2',
      type: 'Snack' as const,
      name: 'Rollitos de pechuga de pavo con huevo poché o duro',
      calories: 180,
      proteinGrams: 22,
      proteinAnimalGrams: 22,
      proteinPlantGrams: 0,
      carbsGrams: 1,
      fatGrams: 7,
      prepTimeMinutes: 4,
      ingredients: ['3 fetas de pechuga de pavo cocida artesanal', '1 huevo duro o poché', 'Pizca de pimentón'],
      instructions: [
        'Envolver gajos de huevo en cada feta de pavo con una pizca de pimentón.'
      ],
      description: 'Snack 100% proteico para saciar cualquier antojo entre comidas sin alterar la cetosis.',
      dietaryTags: ['Método Dukan', 'Proteína Pura', 'Cero carbos']
    }
  }
];

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
    case 'vegetarian':
      pool = VEGETARIAN_RECIPES_POOL;
      break;
    case 'vegan':
      pool = VEGAN_RECIPES_POOL;
      break;
    case 'dukan_keto':
      pool = DUKAN_KETO_RECIPES_POOL;
      break;
    case 'omnivore':
    default:
      pool = OMNIVORE_RECIPES_POOL;
      break;
  }

  const base = pool[(normalizedDay - 1) % pool.length];

  const themes = [
    'Activación y fuerza metabólica',
    'Recuperación celular y balance',
    'Potencia y energía sostenida',
    'Depuración y ligereza digestiva',
    'Construcción y síntesis muscular',
    'Resistencia y antiinflamación',
    'Regeneración profunda de fin de semana'
  ];

  const theme = `Día ${normalizedDay} • ${themes[(normalizedDay - 1) % themes.length]}`;

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
