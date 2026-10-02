// Placeholder architecture for Portuguese (pt-BR) localization in future versions
import { esLATAM } from '../es-LATAM';

export const ptBR: typeof esLATAM = {
  ...esLATAM,
  app: {
    name: 'EVOLVE',
    tagline: 'Seu treino evolui com você',
    description: 'Treino funcional adaptativo, calistenia, nutrição e hábitos personalizados.'
  },
  nav: {
    home: 'Início',
    train: 'Treinar',
    journey: 'Jornada',
    nutrition: 'Nutrição',
    profile: 'Perfil',
    coach: 'Treinador IA'
  }
};
