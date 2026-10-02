// Placeholder architecture for English (en-US) localization in future versions
import { esLATAM } from '../es-LATAM';

export const enUS: typeof esLATAM = {
  ...esLATAM,
  app: {
    name: 'EVOLVE',
    tagline: 'Your workout evolves with you',
    description: 'Adaptive personalized fitness, calisthenics, functional training, and habits.'
  },
  nav: {
    home: 'Home',
    train: 'Train',
    journey: 'Journey',
    nutrition: 'Nutrition',
    profile: 'Profile',
    coach: 'AI Coach'
  }
};
