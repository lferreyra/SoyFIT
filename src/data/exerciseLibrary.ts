import { Exercise, ProgressionPathway } from '../types/fitness';

export const EXERCISE_LIBRARY: Exercise[] = [
  // PROGRESIÓN DE FLEXIONES (EMPUJE)
  {
    id: 'pushup-wall',
    name: 'Flexiones en pared',
    category: 'Calisthenics',
    muscleGroups: ['Pectoral', 'Hombros', 'Tríceps', 'Core'],
    difficulty: 'Beginner',
    equipment: ['bodyweight'],
    instructions: [
      'Parate frente a una pared sólida a un brazo de distancia con los pies al ancho de caderas.',
      'Apoyá las palmas en la pared a la altura de los hombros, apenas más abiertas que el ancho de hombros.',
      'Flexioná los codos acercando el pecho hacia la pared, manteniendo el cuerpo en una línea recta de la cabeza a los talones.',
      'Empujá con firmeza con las palmas hasta extender los brazos sin trabar bruscamente los codos.'
    ],
    commonMistakes: [
      'Abrir los codos a 90 grados hacia afuera',
      'Arquear la espalda baja perdiendo tensión en el abdomen',
      'Llevar el mentón hacia adelante en lugar de mover todo el torso'
    ],
    standardVariation: 'De pie con inclinación diagonal a 45 grados para mayor resistencia',
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 45,
    progressionLevel: 1,
    progressionPathwayId: 'pushup-journey',
    regressionOptions: ['Flexiones en pared con pies más cerca'],
    progressionOptions: ['Flexiones inclinadas en banco o mesa firme'],
    safetyNotes: 'Muy suave con hombros y muñecas; ideal para construir el patrón básico de empuje.',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pushup-incline',
    name: 'Flexiones inclinadas',
    category: 'Calisthenics',
    muscleGroups: ['Pectoral', 'Deltoides anterior', 'Tríceps', 'Core'],
    difficulty: 'Beginner',
    equipment: ['bodyweight', 'bench'],
    instructions: [
      'Apoyá las manos sobre una superficie elevada y firme (banco, escalón o mesa sólida), un poco más abiertas que los hombros.',
      'Extendé las piernas hacia atrás formando una línea recta continua desde los talones hasta la coronilla.',
      'Inhalá y bajá el pecho hacia el borde del apoyo, manteniendo los codos en ángulo de 45 grados respecto al cuerpo.',
      'Exhalá y empujá con fuerza con las palmas para volver a la posición inicial.'
    ],
    commonMistakes: [
      'Dejar caer la cadera hacia abajo',
      'Mirar hacia arriba y sobrecargar el cuello',
      'Acortar el recorrido sin bajar el pecho'
    ],
    beginnerVariation: 'Superficie alta (mesada o mesa firme)',
    standardVariation: 'Superficie intermedia (banco de entrenamiento o escalón alto)',
    advancedVariation: 'Superficie baja (escalón bajo)',
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 45,
    progressionLevel: 2,
    progressionPathwayId: 'pushup-journey',
    regressionOptions: ['Flexiones en pared'],
    progressionOptions: ['Flexiones de rodillas', 'Flexiones negativas'],
    safetyNotes: 'Mantené el abdomen activo y los glúteos contraídos durante cada repetición.',
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pushup-knee',
    name: 'Flexiones de rodillas',
    category: 'Calisthenics',
    muscleGroups: ['Pectoral', 'Hombros', 'Tríceps', 'Abdominales'],
    difficulty: 'Beginner',
    equipment: ['bodyweight', 'mat'],
    instructions: [
      'Colocate en cuatro apoyos sobre una colchoneta con las manos debajo de los hombros.',
      'Llevá las rodillas unos centímetros hacia atrás para que el torso quede en diagonal desde las rodillas hasta la cabeza.',
      'Activá el abdomen y bajá el pecho de forma controlada hasta quedar a un puño del piso.',
      'Empujá el suelo con decisión hasta volver a la posición inicial manteniendo la cadera alineada.'
    ],
    commonMistakes: [
      'Dejar la cola arriba en posición de cuatro apoyos',
      'Bajar la panza antes que el pecho'
    ],
    standardVariation: 'Flexiones de rodillas con rango completo de recorrido',
    defaultSets: 3,
    defaultReps: 8,
    defaultRestSeconds: 60,
    progressionLevel: 3,
    progressionPathwayId: 'pushup-journey',
    regressionOptions: ['Flexiones inclinadas en banco'],
    progressionOptions: ['Flexiones negativas', 'Flexiones estándar'],
    safetyNotes: 'Colocá una colchoneta o toalla doblada bajo las rodillas para mayor confort.',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pushup-negative',
    name: 'Flexiones negativas',
    category: 'Calisthenics',
    muscleGroups: ['Pectoral', 'Tríceps', 'Deltoides', 'Serratos', 'Core'],
    difficulty: 'Intermediate',
    equipment: ['bodyweight', 'mat'],
    instructions: [
      'Empezá en plancha alta sobre la punta de los pies con el cuerpo completamente firme.',
      'Iniciá una bajada muy lenta y controlada de 4 a 5 segundos enteros hasta apoyar el pecho en el piso.',
      'Apoyá las rodillas para levantarte de forma cómoda sin fatigar el hombro, y volvé a armar la plancha alta arriba.',
      'Repetí cada repetición enfatizando la fase excéntrica lenta.'
    ],
    commonMistakes: [
      'Caer de golpe en los últimos centímetros',
      'Desconectar el abdomen a mitad de bajada'
    ],
    standardVariation: 'Bajada estricta en 4 segundos continuos',
    defaultSets: 3,
    defaultReps: 6,
    defaultRestSeconds: 60,
    progressionLevel: 4,
    progressionPathwayId: 'pushup-journey',
    regressionOptions: ['Flexiones de rodillas'],
    progressionOptions: ['Flexiones estándar'],
    safetyNotes: 'Excelente para ganar fuerza pura sin sobrecargar articulaciones.',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pushup-standard',
    name: 'Flexiones estándar',
    category: 'Calisthenics',
    muscleGroups: ['Pectoral mayor', 'Tríceps', 'Deltoides anterior', 'Core'],
    difficulty: 'Intermediate',
    equipment: ['bodyweight', 'mat'],
    instructions: [
      'Apoyá las manos en el piso al ancho de hombros con los dedos bien abiertos y pies juntos o al ancho de caderas.',
      'Generá tensión en todo el cuerpo apretando glúteos, cuádriceps y abdomen.',
      'Bajá en bloque manteniendo los codos a unos 45 grados hasta rozar el suelo con el pecho.',
      'Empujá el piso con potencia hasta bloquear los codos de forma suave.'
    ],
    commonMistakes: [
      'Hundir las escápulas o dejar caer la zona lumbar',
      'Hacer repeticiones cortas sin profundidad real'
    ],
    standardVariation: 'Flexión completa con pecho al piso',
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60,
    progressionLevel: 5,
    progressionPathwayId: 'pushup-journey',
    regressionOptions: ['Flexiones negativas', 'Flexiones de rodillas'],
    progressionOptions: ['Flexiones diamante', 'Flexiones con pies elevados'],
    safetyNotes: 'Si sentís tensión en la muñeca, podés apoyar los puños o usar mancuernas como agarre neutro.',
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pushup-diamond',
    name: 'Flexiones diamante',
    category: 'Calisthenics',
    muscleGroups: ['Tríceps', 'Pectoral interno', 'Deltoides anterior', 'Core'],
    difficulty: 'Advanced',
    equipment: ['bodyweight', 'mat'],
    instructions: [
      'En posición de plancha, juntá los pulgares e índices debajo del centro del pecho formando un triángulo o diamante.',
      'Apretá todo el cuerpo y bajá el esternón directamente hacia el centro de las manos.',
      'Empujá con fuerza concentrando el esfuerzo en la extensión de tríceps.'
    ],
    commonMistakes: [
      'Abrir demasiado los codos hacia afuera',
      'Desarmar la línea de la cintura'
    ],
    standardVariation: 'Flexiones diamante estrictas en punta de pies',
    defaultSets: 3,
    defaultReps: 8,
    defaultRestSeconds: 75,
    progressionLevel: 6,
    progressionPathwayId: 'pushup-journey',
    regressionOptions: ['Flexiones estándar', 'Flexiones diamante sobre rodillas'],
    progressionOptions: ['Flexiones pseudo planche'],
    safetyNotes: 'Exige mayor movilidad de muñecas y codos. Calentá bien las articulaciones antes.',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80'
  },

  // PROGRESIÓN DE SENTADILLAS (TREN INFERIOR)
  {
    id: 'squat-chair',
    name: 'Sentadillas al cajón o silla',
    category: 'Functional',
    muscleGroups: ['Cuádriceps', 'Glúteos', 'Isquiotibiales', 'Zona media'],
    difficulty: 'Beginner',
    equipment: ['bodyweight', 'bench'],
    instructions: [
      'Parate de espaldas a una silla o banco firme con los pies al ancho de hombros y las puntas ligeramente hacia afuera.',
      'Llevá la cadera hacia atrás y flexioná las rodillas controlando la bajada hasta tocar el asiento suavemente.',
      'Hacé una pausa breve de un segundo sin relajarte y empujá con los talones para ponerte de pie.'
    ],
    commonMistakes: [
      'Dejarse caer pesadamente sobre la silla',
      'Meter las rodillas hacia adentro al levantarse',
      'Levantar los talones del suelo'
    ],
    standardVariation: 'Toque suave sobre silla o banco a 90 grados',
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 45,
    progressionLevel: 1,
    progressionPathwayId: 'squat-journey',
    regressionOptions: ['Sentadilla asistida agarrándote de un marco de puerta'],
    progressionOptions: ['Sentadillas al aire sin asiento'],
    safetyNotes: 'Protege las rodillas y enseña el bisagraje de cadera perfecto.',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'squat-air',
    name: 'Sentadillas al aire',
    category: 'Functional',
    muscleGroups: ['Cuádriceps', 'Glúteo mayor', 'Aductores', 'Core'],
    difficulty: 'Beginner',
    equipment: ['bodyweight'],
    instructions: [
      'Parate derecho con los pies entre el ancho de caderas y de hombros, puntas mirando ligeramente hacia afuera (15-20°).',
      'Extendé los brazos al frente para contrapeso o juntalos en el pecho.',
      'Inhalá, empujá las caderas hacia atrás y abajo manteniendo el pecho abierto y talones firmes en el suelo.',
      'Bajá hasta que los muslos queden paralelos al piso (o según tu movilidad cómoda) y empujá con el suelo para subir.'
    ],
    commonMistakes: [
      'Colapsar las rodillas hacia adentro (valgo de rodilla)',
      'Curvar la espalda lumbar al fondo',
      'Despegar los talones'
    ],
    standardVariation: 'Sentadilla profunda con muslos paralelos al piso',
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSeconds: 45,
    progressionLevel: 2,
    progressionPathwayId: 'squat-journey',
    regressionOptions: ['Sentadilla a la silla'],
    progressionOptions: ['Sentadilla split', 'Sentadilla búlgara'],
    safetyNotes: 'Alineá siempre las rodillas en la misma dirección que la punta de los pies.',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'squat-split',
    name: 'Sentadilla split / Estocada fija',
    category: 'Strength',
    muscleGroups: ['Cuádriceps', 'Glúteos', 'Isquiotibiales', 'Estabilizadores'],
    difficulty: 'Intermediate',
    equipment: ['bodyweight'],
    instructions: [
      'Parate en posición de zancada amplia con un pie adelante y el otro atrás apoyado en la punta.',
      'Mantené el torso erguido y las manos en la cintura o al frente.',
      'Bajá flexionando ambas rodillas en ángulo de 90 grados, acercando la rodilla trasera hacia el piso sin golpearlo.',
      'Empujá fuerte con el talón delantero para volver a subir manteniendo la posición de las piernas.'
    ],
    commonMistakes: [
      'Dar un paso demasiado corto levantando el talón delantero',
      'Inclinar el torso excesivamente hacia adelante'
    ],
    standardVariation: 'Estocada fija con descenso vertical a 90 grados',
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60,
    progressionLevel: 3,
    progressionPathwayId: 'squat-journey',
    regressionOptions: ['Sentadillas al aire', 'Estocada estática con apoyo en la pared'],
    progressionOptions: ['Sentadilla búlgara con pie elevado'],
    safetyNotes: 'Excelente para equilibrar la fuerza de ambas piernas y cuidar la pelvis.',
    imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'squat-bulgarian',
    name: 'Sentadilla búlgara',
    category: 'Strength',
    muscleGroups: ['Glúteo medio y mayor', 'Cuádriceps', 'Isquiotibiales', 'Core'],
    difficulty: 'Advanced',
    equipment: ['bodyweight', 'bench'],
    instructions: [
      'Parate de espaldas a un banco o silla a un paso largo de distancia.',
      'Apoyá el empeine de un pie sobre el banco detrás tuyo.',
      'Bajá la rodilla trasera en dirección al suelo, asegurando que la rodilla delantera se mantenga estable sobre el pie.',
      'Empujá con firmeza a través del talón delantero para regresar arriba.'
    ],
    commonMistakes: [
      'Colapsar la rodilla delantera hacia adentro',
      'Distancia inadecuada con el banco que genera tensión en la ingle'
    ],
    standardVariation: 'Sentadilla búlgara estricta con pie trasero en banco a 40 cm',
    defaultSets: 3,
    defaultReps: 8,
    defaultRestSeconds: 60,
    progressionLevel: 4,
    progressionPathwayId: 'squat-journey',
    regressionOptions: ['Sentadilla split en el suelo'],
    progressionOptions: ['Sentadilla búlgara con pausa en el fondo', 'Pistol squat asistida'],
    safetyNotes: 'Construye una estabilidad y fuerza de piernas excepcional sin necesidad de cargas pesadas.',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80'
  },

  // PROGRESIÓN DE CORE Y ESTABILIDAD
  {
    id: 'core-deadbug',
    name: 'Bicho muerto (Dead Bug)',
    category: 'Core',
    muscleGroups: ['Abdomen profundo (Transverso)', 'Suelo pélvico', 'Dorsales', 'Flexores'],
    difficulty: 'Beginner',
    equipment: ['bodyweight', 'mat'],
    instructions: [
      'Acostate boca arriba en la colchoneta con los brazos apuntando al techo y piernas levantadas a 90 grados (posición de mesa).',
      'Pegá la espalda baja contra el piso asegurándote de que no pase aire por la cintura.',
      'De forma lenta y coordinada, extendé el brazo derecho hacia atrás y la pierna izquierda hacia adelante sin tocar el piso.',
      'Volvé al centro y alterná con el brazo izquierdo y la pierna derecha manteniendo la espalda pegada al piso.'
    ],
    commonMistakes: [
      'Arquear la espalda lumbar separándola del suelo',
      'Hacer el movimiento rápido perdiendo el control abdominal',
      'Aguantar la respiración'
    ],
    standardVariation: 'Movimiento cruzado completo con 2 segundos de pausa en la extensión',
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 45,
    progressionLevel: 1,
    progressionPathwayId: 'core-journey',
    regressionOptions: ['Bicho muerto moviendo solo brazos o solo piernas'],
    progressionOptions: ['Bird Dog en cuadrupedia', 'Plancha frontal'],
    safetyNotes: 'Patrón de oro para rehabilitación de espalda y control anti-extensión.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'core-birddog',
    name: 'Perro de caza (Bird Dog)',
    category: 'Core',
    muscleGroups: ['Erectores espinales', 'Glúteos', 'Deltoides posterior', 'Core'],
    difficulty: 'Beginner',
    equipment: ['bodyweight', 'mat'],
    instructions: [
      'Colocate en cuatro apoyos con las manos bajo hombros y rodillas bajo caderas.',
      'Mantené la columna en posición neutra y el cuello alineado con la espalda.',
      'Extendé el brazo derecho al frente y la pierna izquierda hacia atrás hasta que queden en línea paralela con el torso.',
      'Sostené 2 segundos en la posición de máxima extensión sin rotar la pelvis y regresá con suavidad.'
    ],
    commonMistakes: [
      'Arquear en exceso la espalda baja al levantar la pierna',
      'Rotar o inclinar la pelvis hacia un costado'
    ],
    standardVariation: 'Extensión cruzada alternada con 2 segundos de pausa arriba',
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 45,
    progressionLevel: 2,
    progressionPathwayId: 'core-journey',
    regressionOptions: ['Bird Dog levantando solo una pierna a la vez'],
    progressionOptions: ['Plancha frontal isométrica'],
    safetyNotes: 'Recomendado por especialistas en columna para proteger y descomprimir la espalda.',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'core-plank',
    name: 'Plancha frontal isométrica',
    category: 'Core',
    muscleGroups: ['Recto abdominal', 'Transverso', 'Serratos', 'Glúteos', 'Hombros'],
    difficulty: 'Intermediate',
    equipment: ['bodyweight', 'mat'],
    instructions: [
      'Apoyá los antebrazos en el suelo con los codos directamente bajo los hombros.',
      'Extendé las piernas apoyando la punta de los pies y elevá la cadera formando una tabla recta.',
      'Apretá glúteos fuertemente, meté el ombligo hacia la columna y empujá el piso con los antebrazos.',
      'Respirá de manera fluida y rítmica sosteniendo la tensión.'
    ],
    commonMistakes: [
      'Dejar caer la cadera hacia el piso comprimiendo las vértebras lumbares',
      'Subir la cola demasiado en forma de carpa',
      'Colgar la cabeza hacia abajo'
    ],
    standardVariation: 'Plancha frontal sobre antebrazos con cuerpo rígido como tabla',
    defaultSets: 3,
    defaultDurationSeconds: 40,
    defaultRestSeconds: 45,
    progressionLevel: 3,
    progressionPathwayId: 'core-journey',
    regressionOptions: ['Plancha con rodillas apoyadas', 'Plancha con manos elevadas en banco'],
    progressionOptions: ['Plancha lateral', 'Hollow Body Hold'],
    safetyNotes: 'Terminá la serie en cuanto sientas que la espalda baja se empieza a arquear.',
    imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'core-sideplank',
    name: 'Plancha lateral',
    category: 'Core',
    muscleGroups: ['Oblicuos', 'Glúteo medio', 'Cuadrado lumbar', 'Hombros'],
    difficulty: 'Intermediate',
    equipment: ['bodyweight', 'mat'],
    instructions: [
      'Acostate de lado apoyando el antebrazo en el piso con el codo justo bajo el hombro.',
      'Apilá los pies o colocá el pie superior un poco adelantado para mayor base de apoyo.',
      'Elevá la cadera del piso hasta que tu cuerpo dibuje una línea diagonal recta.',
      'Sostené la postura firme sintiendo el esfuerzo en el lateral del torso.'
    ],
    commonMistakes: [
      'Dejar caer la cadera hacia el piso',
      'Girar el pecho hacia adelante perdiendo la alineación'
    ],
    standardVariation: 'Sostén estricto de 30 segundos por cada lado',
    defaultSets: 3,
    defaultDurationSeconds: 30,
    defaultRestSeconds: 45,
    progressionLevel: 4,
    progressionPathwayId: 'core-journey',
    regressionOptions: ['Plancha lateral con rodillas flexionadas a 90 grados'],
    progressionOptions: ['Hollow Body Hold', 'Plancha lateral con elevación de pierna'],
    safetyNotes: 'Fundamental para estabilizar la cadera y prevenir molestias de espalda baja.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'core-hollowhold',
    name: 'Postura de barca (Hollow Body)',
    category: 'Calisthenics',
    muscleGroups: ['Pared abdominal completa', 'Flexores de cadera', 'Serratos'],
    difficulty: 'Advanced',
    equipment: ['bodyweight', 'mat'],
    instructions: [
      'Acostate boca arriba y aplastá la zona lumbar contra el suelo sin dejar ningún espacio.',
      'Extendé los brazos hacia atrás junto a las orejas y despegá los hombros del piso.',
      'Levantá los pies a unos 15 cm del piso con piernas juntas y puntas estiradas.',
      'Mantené la forma de barca o cuchara resistiendo con todo el abdomen.'
    ],
    commonMistakes: [
      'Despegar la espalda baja del suelo',
      'Tensionar el cuello excesivamente'
    ],
    standardVariation: 'Hollow body completo con brazos y piernas estiradas',
    defaultSets: 3,
    defaultDurationSeconds: 25,
    defaultRestSeconds: 60,
    progressionLevel: 5,
    progressionPathwayId: 'core-journey',
    regressionOptions: ['Hollow tuck con rodillas al pecho'],
    progressionOptions: ['Hollow rocks (balanceos controlados)'],
    safetyNotes: 'Postura base de gimnasia olímpica y calistenia avanzada.',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
  },

  // TRACCIÓN / CADENA POSTERIOR
  {
    id: 'pull-band-row',
    name: 'Remo con banda elástica',
    category: 'Strength',
    muscleGroups: ['Dorsal ancho', 'Romboides', 'Deltoides posterior', 'Bíceps'],
    difficulty: 'Beginner',
    equipment: ['resistance_bands'],
    instructions: [
      'Sentate en el piso con piernas estiradas y pasá la banda elástica por la planta de los pies.',
      'Tomá los extremos de la banda manteniendo la espalda erguida y hombros relajados.',
      'Tirá de los codos hacia atrás pegados a las costillas, juntando las escápulas al final del recorrido.',
      'Regresá despacio sintiendo el estiramiento en la espalda.'
    ],
    commonMistakes: [
      'Encorvar los hombros hacia adelante y encoger el cuello',
      'Tirar con los brazos en lugar de iniciar con las escápulas'
    ],
    standardVariation: 'Remo sentado con 2 segundos de contracción en el punto máximo',
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 45,
    progressionLevel: 1,
    regressionOptions: ['Remo con banda de menor resistencia o de pie'],
    progressionOptions: ['Remo invertido en mesa o barra baja'],
    safetyNotes: 'Clave para contrarrestar las horas de postura frente a la computadora y el celular.',
    imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'glute-bridge',
    name: 'Puente de glúteos',
    category: 'Functional',
    muscleGroups: ['Glúteo mayor', 'Isquiotibiales', 'Zona lumbar', 'Core'],
    difficulty: 'Beginner',
    equipment: ['bodyweight', 'mat'],
    instructions: [
      'Acostate boca arriba con las rodillas flexionadas y las plantas de los pies apoyadas en el piso al ancho de caderas.',
      'Brazos a los lados del cuerpo con las palmas hacia el suelo.',
      'Presioná con los talones y elevá la pelvis apretando fuerte los glúteos hasta formar una línea recta de rodillas a hombros.',
      'Sostené 1 segundo arriba y bajá de manera controlada sin descansar del todo la cola en el piso.'
    ],
    commonMistakes: [
      'Hiperextender la espalda baja en lugar de apretar los glúteos',
      'Despegar las puntas de los pies o apoyar solo los dedos'
    ],
    standardVariation: 'Puente bipodal con 2 segundos de contracción en el punto más alto',
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSeconds: 45,
    progressionLevel: 1,
    regressionOptions: ['Puente bipodal con menor elevación'],
    progressionOptions: ['Puente de glúteos a una sola pierna'],
    safetyNotes: 'Excelente activación de la cadena posterior sin impacto para rodillas ni espalda.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
  },

  // MOVILIDAD Y RECUPERACIÓN
  {
    id: 'mobility-worlds-greatest',
    name: 'El mejor estiramiento del mundo',
    category: 'Mobility',
    muscleGroups: ['Caderas', 'Columna torácica', 'Isquiotibiales', 'Pectoral'],
    difficulty: 'Intermediate',
    equipment: ['bodyweight', 'mat'],
    instructions: [
      'Empezá en posición de zancada profunda con el pie derecho al lado de la mano derecha en el piso.',
      'Llevá el codo derecho hacia el tobillo derecho buscando profundidad.',
      'Girá el torso hacia la derecha elevando el brazo derecho hacia el techo y mirando hacia la mano.',
      'Bajá la mano y estirá la pierna delantera empujando las caderas hacia atrás para estirar el isquiotibial.',
      'Repetí fluido de 5 a 6 veces por lado.'
    ],
    commonMistakes: [
      'Forzar la rotación del cuello en lugar de rotar desde la parte media de la espalda',
      'Contener la respiración durante la apertura'
    ],
    standardVariation: 'Secuencia dinámica continua de 3 pasos por lado',
    defaultSets: 2,
    defaultReps: 6,
    defaultRestSeconds: 30,
    progressionLevel: 2,
    regressionOptions: ['Zancada con apoyo de rodilla trasera en el piso'],
    progressionOptions: ['Estiramiento del mundo sin apoyo de rodilla trasera'],
    safetyNotes: 'Abre caderas y libera la columna rígida de manera integral.',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mobility-catcow',
    name: 'Gato-Vaca (Movilidad de columna)',
    category: 'Mobility',
    muscleGroups: ['Columna completa', 'Cuello', 'Abdomen', 'Pelvis'],
    difficulty: 'Beginner',
    equipment: ['bodyweight', 'mat'],
    instructions: [
      'Colocate en cuatro apoyos con manos bajo hombros y rodillas bajo caderas.',
      'Inhalá, arqueá suavemente la columna llevando el pecho hacia el frente y mirando ligeramente hacia arriba (Vaca).',
      'Exhalá, empujá el suelo con las manos redondeando la espalda como un gato enojado y llevando el mentón al pecho (Gato).',
      'Mové vértebra por vértebra de manera lenta y coordinada con la respiración.'
    ],
    commonMistakes: [
      'Mover solo el cuello sin articular el resto de la espalda',
      'Hacer movimientos bruscos o con rebotes'
    ],
    standardVariation: 'Respiración sincronizada continua durante 60 segundos',
    defaultSets: 2,
    defaultReps: 10,
    defaultRestSeconds: 20,
    progressionLevel: 1,
    regressionOptions: ['Movimiento sentado en silla si hay dolor de muñecas'],
    progressionOptions: ['Gato-vaca con disociación pélvica'],
    safetyNotes: 'Alivia tensiones acumuladas en la espalda y mejora la circulación en la columna.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mobility-9090-hips',
    name: 'Rotaciones de cadera 90/90',
    category: 'Mobility',
    muscleGroups: ['Rotadores internos y externos de cadera', 'Glúteos', 'Pelvis'],
    difficulty: 'Beginner',
    equipment: ['bodyweight', 'mat'],
    instructions: [
      'Sentate en el piso con ambas piernas flexionadas a 90 grados: una pierna adelante y la otra hacia el costado.',
      'Mantené el torso erguido apoyando suavemente las manos detrás tuyo si necesitás soporte.',
      'Incliná suavemente el torso sobre la pierna delantera manteniendo la espalda recta.',
      'Girá ambas rodillas hacia el otro lado pasando por el centro sin despegar los talones del piso.'
    ],
    commonMistakes: [
      'Encorvarse en exceso para intentar llegar más abajo',
      'Forzar la rodilla en lugar de rotar desde la articulación de la cadera'
    ],
    standardVariation: 'Rotación fluida de lado a lado con apoyo de manos',
    defaultSets: 2,
    defaultReps: 8,
    defaultRestSeconds: 30,
    progressionLevel: 1,
    regressionOptions: ['Sentado en silla abriendo y cerrando rodillas'],
    progressionOptions: ['Rotaciones 90/90 sin apoyar las manos en el piso'],
    safetyNotes: 'Cuidá las rodillas; no fuerces el rango si sentís pinchazos.',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80'
  },

  // CARDIO FUNCIONAL Y HIIT DE BAJO IMPACTO
  {
    id: 'cardio-marching-knees',
    name: 'Marcha con rodillas altas (Bajo impacto)',
    category: 'Cardio',
    muscleGroups: ['Flexores de cadera', 'Pantorrillas', 'Core', 'Sistema cardiovascular'],
    difficulty: 'Beginner',
    equipment: ['bodyweight'],
    instructions: [
      'Parate erguido con los pies al ancho de caderas y los brazos en posición atlética de carrera.',
      'Elevá la rodilla izquierda hasta la altura de la cadera mientras el brazo derecho va hacia adelante.',
      'Apoyá suavemente con la punta del pie y elevá de inmediato la rodilla derecha.',
      'Mantené un ritmo fluido, postura erguida y respiración rítmica.'
    ],
    commonMistakes: [
      'Inclinarse hacia atrás al subir las rodillas',
      'Pisar con fuerza y golpear el suelo con el talón'
    ],
    standardVariation: 'Marcha rítmica continua a buen ritmo',
    advancedVariation: 'Trote suave elevando rodillas con apoyos ágiles',
    defaultSets: 3,
    defaultDurationSeconds: 45,
    defaultRestSeconds: 30,
    progressionLevel: 1,
    regressionOptions: ['Marcha en el lugar a ritmo pausado'],
    progressionOptions: ['Carrera con rodillas altas', 'Escaladores'],
    safetyNotes: 'Sin impacto agresivo en articulaciones; eleva las pulsaciones con total seguridad.',
    imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cardio-mountain-climbers',
    name: 'Escaladores (Mountain Climbers)',
    category: 'HIIT',
    muscleGroups: ['Core', 'Hombros', 'Flexores de cadera', 'Sistema cardiovascular'],
    difficulty: 'Intermediate',
    equipment: ['bodyweight', 'mat'],
    instructions: [
      'Colocate en plancha alta con las manos firmes directamente debajo de los hombros.',
      'Llevá la rodilla derecha hacia el pecho de forma ágil sin levantar la cola.',
      'Extendé la pierna derecha atrás mientras alternás llevando la rodilla izquierda al pecho.',
      'Mantené una cadencia constante manteniendo los hombros firmes y estables.'
    ],
    commonMistakes: [
      'Rebotar la cadera arriba y abajo desarmando la plancha',
      'Desplazar las manos por delante de los hombros'
    ],
    standardVariation: 'Cadencia constante de 1 paso por segundo con plancha firme',
    defaultSets: 3,
    defaultDurationSeconds: 35,
    defaultRestSeconds: 30,
    progressionLevel: 2,
    regressionOptions: ['Escaladores lentos paso a paso'],
    progressionOptions: ['Escaladores cruzados (rodilla a codo opuesto)'],
    safetyNotes: 'Mantené los hombros lejos de las orejas y el abdomen activo.',
    imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80'
  }
];

export const PROGRESSION_PATHWAYS: ProgressionPathway[] = [
  {
    id: 'pushup-journey',
    name: 'Camino de flexiones (Push-Ups)',
    description: 'Desde la mecánica inicial en pared hasta flexiones completas en el suelo y variantes diamante avanzadas.',
    stages: [
      { stageNumber: 1, exerciseId: 'pushup-wall', name: 'Flexiones en pared', targetCriteria: '3 series de 15 reps con buena técnica', isUnlocked: true, isCurrent: false },
      { stageNumber: 2, exerciseId: 'pushup-incline', name: 'Flexiones inclinadas', targetCriteria: '3 series de 12 reps en banco intermedio', isUnlocked: true, isCurrent: true },
      { stageNumber: 3, exerciseId: 'pushup-knee', name: 'Flexiones de rodillas', targetCriteria: '3 series de 10 reps con pecho al suelo', isUnlocked: true, isCurrent: false },
      { stageNumber: 4, exerciseId: 'pushup-negative', name: 'Flexiones negativas', targetCriteria: '3 series de 8 reps con bajada en 4 segundos', isUnlocked: false, isCurrent: false },
      { stageNumber: 5, exerciseId: 'pushup-standard', name: 'Flexiones estándar', targetCriteria: '3 series de 10 reps estrictas en punta de pies', isUnlocked: false, isCurrent: false },
      { stageNumber: 6, exerciseId: 'pushup-diamond', name: 'Flexiones diamante', targetCriteria: '3 series de 8 reps estrictas', isUnlocked: false, isCurrent: false }
    ]
  },
  {
    id: 'squat-journey',
    name: 'Dominio de sentadillas',
    description: 'Desarrollá fuerza y movilidad en piernas desde sentadillas al cajón hasta sentadillas profundas y balance unilateral.',
    stages: [
      { stageNumber: 1, exerciseId: 'squat-chair', name: 'Sentadillas al cajón o silla', targetCriteria: '3 series de 15 reps con bisagraje perfecto', isUnlocked: true, isCurrent: false },
      { stageNumber: 2, exerciseId: 'squat-air', name: 'Sentadillas al aire', targetCriteria: '3 series de 15 reps profundas y fluidas', isUnlocked: true, isCurrent: true },
      { stageNumber: 3, exerciseId: 'squat-split', name: 'Sentadilla split / Estocada fija', targetCriteria: '3 series de 10 reps por pierna', isUnlocked: false, isCurrent: false },
      { stageNumber: 4, exerciseId: 'squat-bulgarian', name: 'Sentadilla búlgara', targetCriteria: '3 series de 8 reps por pierna con pie elevado', isUnlocked: false, isCurrent: false }
    ]
  },
  {
    id: 'core-journey',
    name: 'Fuerza y estabilidad de core',
    description: 'Estabilidad espinal profunda desde ejercicios anti-extensión en el piso hasta planchas isométricas y Hollow Body.',
    stages: [
      { stageNumber: 1, exerciseId: 'core-deadbug', name: 'Bicho muerto (Dead Bug)', targetCriteria: '3 series de 12 reps por lado con espalda pegada', isUnlocked: true, isCurrent: false },
      { stageNumber: 2, exerciseId: 'core-birddog', name: 'Perro de caza (Bird Dog)', targetCriteria: '3 series de 10 reps por lado con 2 seg de pausa', isUnlocked: true, isCurrent: true },
      { stageNumber: 3, exerciseId: 'core-plank', name: 'Plancha frontal isométrica', targetCriteria: 'Sostener plancha estricta por 60 seg continuos', isUnlocked: true, isCurrent: false },
      { stageNumber: 4, exerciseId: 'core-sideplank', name: 'Plancha lateral', targetCriteria: 'Sostener 45 seg por lado con pelvis alta', isUnlocked: false, isCurrent: false },
      { stageNumber: 5, exerciseId: 'core-hollowhold', name: 'Postura de barca (Hollow Body)', targetCriteria: 'Sostener 30 seg sin arquear la zona lumbar', isUnlocked: false, isCurrent: false }
    ]
  }
];
