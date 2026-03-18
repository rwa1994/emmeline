import type { PhaseInfo, CyclePhase } from '../types';

export const phases: PhaseInfo[] = [
  {
    phase: 'menstrual',
    name: 'Menstrual',
    dayRange: 'Days 1–5',
    color: '#C49A9E',
    bgColor: '#EDD5D7',
    description: 'Your body is shedding the uterine lining. Energy is naturally lower. This is a time for rest and gentleness with yourself.',
    nutrition: [
      'Iron-rich foods: lentils, spinach, red meat',
      'Anti-inflammatory: ginger tea, turmeric, berries',
      'Dark chocolate (70%+) for magnesium',
      'Warm, nourishing meals like soups and stews',
    ],
    exercise: [
      'Gentle yoga or stretching',
      'Short walks in fresh air',
      'Rest is valid. Listen to your body.',
      'Avoid intense HIIT or heavy weights',
    ],
    avoid: [
      'Excess caffeine (worsens cramps)',
      'Alcohol (increases inflammation)',
      'Salty processed foods (increases bloating)',
      'Overcommitting socially',
    ],
    mentalHealth: [
      'Your nervous system is more sensitive right now. That is biology, not weakness.',
      'This is your most introspective phase. Journalling and quiet reflection feel natural.',
      'Lower your expectations of yourself and let that be enough.',
      'Cancel plans without guilt if you need to. Rest is not laziness.',
      'Crying more easily is normal. Let it out rather than pushing it down.',
      'Avoid big decisions or difficult conversations if you can wait a few days.',
    ],
    recipes: [
      { name: 'Lentil and spinach soup', description: 'Iron-rich and warming. Exactly what your body needs right now.' },
      { name: 'Slow-cooked beef stew', description: 'Comforting and full of iron to replenish what is lost.' },
      { name: 'Ginger and turmeric tea', description: 'Anti-inflammatory and soothing for cramps.' },
      { name: 'Dark chocolate (70%+)', description: 'Magnesium-rich and a genuine comfort. You have earned it.' },
    ],
  },
  {
    phase: 'follicular',
    name: 'Follicular',
    dayRange: 'Days 6–13',
    color: '#5E8057',
    bgColor: '#D4E8D1',
    description: 'Oestrogen is rising. Energy, mood and creativity are building. A great time to start new projects and make social plans.',
    nutrition: [
      'Fermented foods: yoghurt, kefir, kimchi',
      'Light, fresh meals like salads and smoothies',
      'Eggs and seeds for hormone support',
      'Plenty of leafy greens',
    ],
    exercise: [
      'Cardio and strength training feel great',
      'Try something new, like a class or sport',
      'Energy is building. Embrace it.',
      'Good time to push a little harder',
    ],
    avoid: [
      'Nothing specific. Energy is naturally higher.',
      'Stay hydrated as your activity increases',
    ],
    mentalHealth: [
      'Your mood is likely lifting as oestrogen rises. Lean into it.',
      'Great time for goal-setting, planning, and starting new things.',
      'Social energy is building. Say yes to the things that excite you.',
      'Creative and cognitive work feels more effortless now.',
      'Revisit goals or ideas you shelved during your last luteal phase.',
      'Notice how your mental clarity changes across your cycle.',
    ],
    recipes: [
      { name: 'Grain bowl with roasted veg', description: 'Fresh, light, and full of the nutrients your body is craving.' },
      { name: 'Salmon with greens', description: 'Omega-3s support rising oestrogen and it is genuinely delicious.' },
      { name: 'Smoothie bowl', description: 'Colourful, fresh, and energising. Great for this phase.' },
      { name: 'Spring rolls or fresh wraps', description: 'Light and vibrant. Matches the energy you have right now.' },
    ],
  },
  {
    phase: 'ovulatory',
    name: 'Ovulatory',
    dayRange: 'Days 14–16',
    color: '#C47A84',
    bgColor: '#FAE8EB',
    description: "Peak energy, confidence and communication. You're at your most magnetic. Oestrogen and LH surge together.",
    nutrition: [
      'Light, energising meals',
      'Raw vegetables and fresh fruit',
      'Anti-inflammatory fats: avocado, salmon',
      'Zinc-rich foods: pumpkin seeds, chickpeas',
    ],
    exercise: [
      'Peak performance. Great for intense workouts.',
      'HIIT, running, heavy lifting',
      'Team sports and group classes',
      'Your pain tolerance is highest now',
    ],
    avoid: [
      'Heavy, hard-to-digest meals',
      'Excessive alcohol',
    ],
    mentalHealth: [
      'You feel most confident, expressive, and socially magnetic right now.',
      'Best window for difficult conversations, presentations, or big asks.',
      'Your empathy and emotional intelligence peak during ovulation.',
      'Make the most of this window for connection and collaboration.',
      'A good time to check in with the people you care about.',
      'Notice how you feel now compared to the end of your last luteal phase.',
    ],
    recipes: [
      { name: 'Sushi', description: 'Light, fresh, zinc-rich. Perfect for this peak phase.' },
      { name: 'Avocado and prawn salad', description: 'Anti-inflammatory fats and fresh flavours.' },
      { name: 'Sharing plates', description: 'Tapas, mezze, charcuterie. Sociable and celebratory.' },
      { name: 'A special dinner', description: 'You are feeling your best. Match that energy with the occasion.' },
    ],
  },
  {
    phase: 'luteal',
    name: 'Luteal',
    dayRange: 'Days 17–28',
    color: '#7A6FA8',
    bgColor: '#DDD9EE',
    description: 'Progesterone rises then falls. Energy gradually declines toward the end. PMS symptoms may appear in the last few days.',
    nutrition: [
      'Complex carbs: oats, sweet potato, quinoa',
      'Magnesium-rich foods: dark leafy greens, nuts',
      'Reduce sugar and refined carbs to stabilise mood',
      'Calcium: dairy, fortified foods, almonds',
    ],
    exercise: [
      'Moderate movement: walking, yoga, swimming',
      'Lower intensity than ovulatory phase',
      'Movement helps with bloating and mood',
      "Don't push too hard in the last few days",
    ],
    avoid: [
      'Excess caffeine (heightens anxiety and irritability)',
      'Alcohol (worsens PMS symptoms)',
      'Salt (increases water retention and bloating)',
      'Overloading your schedule',
    ],
    mentalHealth: [
      'Irritability, anxiety, or low mood in this phase are hormonal, not personal.',
      'The inner critic gets louder in the luteal phase. Try not to take it at face value.',
      'Boundaries matter more now. It is okay to say no and protect your energy.',
      'Withdrawing slightly from social situations is natural and healthy.',
      'Journalling can help you separate PMS thoughts from reality.',
      'Track your patterns across cycles so you can anticipate and prepare.',
    ],
    recipes: [
      { name: 'Comfort pasta', description: 'Complex carbs stabilise mood swings. It is exactly what you will want.' },
      { name: 'Baked salmon with sweet potato', description: 'Magnesium and omega-3s to ease PMS symptoms.' },
      { name: 'Oat-based bakes', description: 'Slow-release energy to keep your mood steady through the day.' },
      { name: 'Something chocolatey', description: 'Dark chocolate or a proper dessert. You have earned it.' },
    ],
  },
];

export function getPhase(phase: CyclePhase): PhaseInfo {
  return phases.find(p => p.phase === phase) ?? phases[0];
}
