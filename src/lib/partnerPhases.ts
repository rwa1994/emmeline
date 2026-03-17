import type { CyclePhase } from '../types';

export interface PartnerPhaseInfo {
  phase: CyclePhase;
  name: string;
  color: string;
  bgColor: string;
  headline: string;
  howToHelp: string[];
  whatToAvoid: string[];
  thingsToSay: string[];
  recipes: { name: string; description: string }[];
  activities: { name: string; description: string; type: 'together' | 'solo' }[];
}

export const partnerPhases: PartnerPhaseInfo[] = [
  {
    phase: 'menstrual',
    name: 'Menstrual',
    color: '#C49A9E',
    bgColor: '#EDD5D7',
    headline: 'She needs warmth and quiet today.',
    howToHelp: [
      'Be quietly present — you don\'t need to fix anything',
      'Offer warmth: a hot water bottle, a blanket, a cup of tea',
      'Take over tasks she\'d normally do without being asked',
      'Keep the environment calm and low-pressure',
    ],
    whatToAvoid: [
      'Minimising her discomfort ("it\'s just a period")',
      'Making plans or adding pressure to her schedule',
      'Bringing up heavy conversations or big decisions',
      'Expecting her to be her usual self — she\'s not, and that\'s okay',
    ],
    thingsToSay: [
      '"Is there anything I can do for you?"',
      '"Take all the time you need."',
      '"I\'ve got dinner sorted tonight."',
      '"You don\'t have to explain — just rest."',
    ],
    recipes: [
      { name: 'Lentil & spinach soup', description: 'Iron-rich and warming — exactly what she needs right now' },
      { name: 'Slow-cooked beef stew', description: 'Comforting, nourishing, and full of iron to replenish what\'s lost' },
      { name: 'Ginger & turmeric tea', description: 'Anti-inflammatory and soothing for cramps — make her a pot' },
      { name: 'Dark chocolate', description: 'Magnesium-rich and a genuine comfort — get the good stuff (70%+)' },
    ],
    activities: [
      { name: 'Movie night in', description: 'Let her pick. No commentary.', type: 'together' },
      { name: 'Gentle walk', description: 'Only if she wants to — fresh air can help, but don\'t push it', type: 'together' },
      { name: 'Give her space to rest', description: 'Take care of something around the house so she can switch off', type: 'solo' },
      { name: 'Set up a comfort corner', description: 'Blanket, heating pad, her favourite snacks — without being asked', type: 'solo' },
    ],
  },
  {
    phase: 'follicular',
    name: 'Follicular',
    color: '#5E8057',
    bgColor: '#D4E8D1',
    headline: 'Her energy is building — match it.',
    howToHelp: [
      'Engage with her rising energy — she\'s ready for more',
      'Make plans and suggest things to look forward to',
      'Be present and enthusiastic — she\'s in a good place',
      'This is a great time to work on something together',
    ],
    whatToAvoid: [
      'Being passive or disengaged — she\'s energising up',
      'Cancelling plans — she\'s keen to be out and doing things',
    ],
    thingsToSay: [
      '"Want to do something fun this weekend?"',
      '"You seem really good at the moment."',
      '"I\'ve been thinking about planning a trip — what do you think?"',
      '"Let\'s try that new place we\'ve been meaning to go to."',
    ],
    recipes: [
      { name: 'Grain bowl with roasted veg', description: 'Fresh, light, and full of the nutrients her body is craving' },
      { name: 'Salmon with greens', description: 'Omega-3s support rising oestrogen — and it\'s genuinely delicious' },
      { name: 'Smoothie bowls', description: 'Colourful, fresh, and energising — great for this phase' },
      { name: 'Spring rolls or fresh wraps', description: 'Light and vibrant — matches the energy of this phase' },
    ],
    activities: [
      { name: 'Try somewhere new', description: 'New restaurant, new area, new experience — she\'s up for it', type: 'together' },
      { name: 'Go for a hike', description: 'Her physical energy is building — get outdoors', type: 'together' },
      { name: 'Plan a trip together', description: 'Great time to sit down and plan something to look forward to', type: 'together' },
      { name: 'Visit a gallery or market', description: 'She\'ll enjoy the stimulation and social aspect', type: 'together' },
    ],
  },
  {
    phase: 'ovulatory',
    name: 'Ovulatory',
    color: '#C47A84',
    bgColor: '#FAE8EB',
    headline: 'She\'s at her best — be there for it.',
    howToHelp: [
      'She\'s confident, social, and communicative — lean into it',
      'This is the best time for important conversations',
      'Make her feel seen and appreciated',
      'Say yes to social plans — she\'ll thrive',
    ],
    whatToAvoid: [
      'Wasting this window — she\'s at her most open and expressive',
      'Being distracted or half-present when she wants to connect',
    ],
    thingsToSay: [
      '"You look amazing."',
      '"I love spending time with you."',
      '"I\'ve been wanting to talk about something — is now a good time?"',
      '"Let\'s do something special tonight."',
    ],
    recipes: [
      { name: 'Sharing plates', description: 'Tapas, mezze, charcuterie — sociable and celebratory', type: 'together' },
      { name: 'Sushi', description: 'Light, fresh, zinc-rich — perfect for this peak phase' },
      { name: 'A special dinner', description: 'She\'s feeling her best — match that energy with the occasion', type: 'together' },
      { name: 'Avocado & prawn salad', description: 'Anti-inflammatory fats and fresh flavours' },
    ] as any,
    activities: [
      { name: 'Date night', description: 'Pull out all the stops — she\'ll feel it and appreciate it', type: 'together' },
      { name: 'See friends together', description: 'She\'s at peak social energy — great time for a group catch-up', type: 'together' },
      { name: 'Active adventure', description: 'Her energy and pain tolerance are highest now — make the most of it', type: 'together' },
      { name: 'A concert or event', description: 'She\'ll love the stimulation and atmosphere', type: 'together' },
    ],
  },
  {
    phase: 'luteal',
    name: 'Luteal',
    color: '#7A6FA8',
    bgColor: '#DDD9EE',
    headline: 'She may need extra patience and comfort.',
    howToHelp: [
      'Be patient — any irritability is hormonal, not personal',
      'Offer comfort before solutions — just listen first',
      'Take things off her plate without waiting to be asked',
      'Keep the environment calm and predictable',
    ],
    whatToAvoid: [
      'Taking her mood personally or getting defensive',
      'Bringing up big decisions or difficult conversations (especially days 25–28)',
      'Cancelling plans at the last minute — uncertainty is hard right now',
      'Nitpicking or pointing out small things',
    ],
    thingsToSay: [
      '"I\'m here for you."',
      '"What do you need tonight?"',
      '"You don\'t have to explain — I\'ve got you."',
      '"Let\'s have a quiet one — I\'ll sort everything."',
    ],
    recipes: [
      { name: 'Comfort pasta', description: 'Complex carbs stabilise mood swings — and it\'s exactly what she\'ll want' },
      { name: 'Baked salmon with sweet potato', description: 'Magnesium and omega-3s to ease PMS symptoms' },
      { name: 'Oat-based bakes', description: 'Slow-release energy to keep her mood steady through the day' },
      { name: 'Something chocolatey', description: 'Dark chocolate or a proper dessert — she\'s earned it', },
    ],
    activities: [
      { name: 'Quiet evening in', description: 'Let her choose the vibe — cosy and low-key is usually perfect', type: 'together' },
      { name: 'Comfort watching', description: 'Familiar shows she loves, no pressure to try something new', type: 'together' },
      { name: 'Early night', description: 'She may be more tired than usual — don\'t fight it', type: 'together' },
      { name: 'Sort the house', description: 'A tidy, calm space genuinely helps — do it without mentioning it', type: 'solo' },
    ],
  },
];

export function getPartnerPhase(phase: CyclePhase): PartnerPhaseInfo {
  return partnerPhases.find(p => p.phase === phase) ?? partnerPhases[0];
}
