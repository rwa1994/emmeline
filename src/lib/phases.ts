import type { PhaseInfo, CyclePhase } from '../types';

export const phases: PhaseInfo[] = [
  {
    phase: 'menstrual',
    name: 'Menstrual',
    dayRange: 'Days 1–5',  // user's period length
    color: '#C49A9E',
    bgColor: '#EDD5D7',
    description: 'Your body is shedding the womb lining (endometrium). Oestrogen and progesterone are at their lowest. Energy is naturally lower. This is a time for rest and gentleness with yourself.',
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
      {
        name: 'Lentil and spinach soup',
        description: 'Iron-rich and warming. Exactly what your body needs right now.',
        ingredients: ['200g red lentils', '2 large handfuls spinach', '1 onion, diced', '3 garlic cloves', '1L vegetable stock', '1 tsp cumin', '1 tsp turmeric', 'olive oil', 'juice of half a lemon', 'salt and pepper'],
        steps: ['Heat oil in a large pan, sauté onion for 5 min until soft.', 'Add garlic, cumin and turmeric. Cook for 1 min.', 'Add lentils and stock. Bring to a boil then simmer for 20 min.', 'Stir in spinach and cook until wilted.', 'Squeeze in lemon juice, season well and serve.'],
      },
      {
        name: 'Slow-cooked beef stew',
        description: 'Comforting and full of iron to replenish what is lost.',
        ingredients: ['600g beef chuck, cut into chunks', '3 carrots, chopped', '2 potatoes, cubed', '1 onion, roughly chopped', '2 tbsp tomato paste', '500ml beef stock', '2 sprigs rosemary', '1 tsp thyme', 'olive oil', 'salt and pepper'],
        steps: ['Preheat oven to 160°C. Brown beef in batches in an oven-safe pot with oil.', 'Remove beef, sauté onion in the same pot until soft.', 'Add tomato paste and stir for 1 min. Return beef to the pot.', 'Add stock, carrots, potatoes and herbs. Bring to a simmer.', 'Cover and cook in the oven for 2 to 2.5 hours until beef is tender.'],
      },
      {
        name: 'Golden milk',
        description: 'Anti-inflammatory and soothing. Warm, comforting, and genuinely good for you.',
        ingredients: ['400ml milk or oat milk', '1 tsp turmeric', '1cm fresh ginger, grated', '1 tsp honey', 'pinch of black pepper', 'pinch of cinnamon'],
        steps: ['Add milk, turmeric, ginger and black pepper to a small saucepan.', 'Warm over medium heat, stirring, for about 5 minutes. Do not boil.', 'Pour through a sieve into a mug.', 'Stir in honey and dust with cinnamon.'],
      },
      {
        name: 'Dark chocolate bark',
        description: 'Magnesium-rich and a genuine comfort. You have earned it.',
        ingredients: ['100g dark chocolate (70%+)', 'pinch of flaky sea salt', 'optional: handful of almonds, dried cranberries or pistachios'],
        steps: ['Melt chocolate in a heatproof bowl over a pan of barely simmering water.', 'Pour onto a baking tray lined with parchment and spread thin.', 'Scatter toppings over the top and sprinkle with sea salt.', 'Refrigerate for 30 min until set, then break into pieces.'],
      },
    ],
    learnMore: {
      nutrition: 'When you bleed, you lose iron — and low iron is one of the most common reasons women feel unusually fatigued during their period. A 2025 review in CMAJ confirmed iron deficiency is significantly underdiagnosed in menstruating women and directly impairs energy, concentration and mood. Anti-inflammatory omega-3 fats (from oily fish and flaxseed) and compounds like ginger and turmeric work by reducing prostaglandins — the hormone-like chemicals that drive uterine contractions and cramping. Multiple randomised controlled trials have found both ginger and omega-3 supplementation to be as effective as ibuprofen for dysmenorrhea (period pain) in some participants.',
      exercise: 'A 2024 meta-analysis in Sports Medicine Open analysed 29 randomised controlled trials involving over 1,800 women and found that aerobic exercise significantly reduced menstrual pain severity, with moderate-intensity movement showing the strongest effect. Exercise raises endorphins — your body\'s natural pain-relievers — and improves blood flow to the uterus, which directly eases cramping. You do not need to push hard to benefit; even a 20-minute walk can measurably reduce pain. On heavier days, rest is equally valid.',
      avoid: 'A review published in PMC (2016) found that caffeine intake was significantly associated with increased PMS severity and more intense cramping — caffeine stimulates prostaglandin production and constricts uterine blood vessels, both of which worsen pain. Research in Frontiers in Global Women\'s Health (2021) found that alcohol worsens period symptoms by raising systemic inflammation and disrupting sleep — both of which amplify pain sensitivity and low mood. Salt causes water retention because aldosterone (a hormone that makes the kidneys hold onto sodium) is more active when oestrogen drops sharply.',
      mental: 'Oestrogen and progesterone both reach their lowest point at the start of your period. These hormones directly regulate serotonin (the mood-stabilising neurotransmitter) and dopamine. Lower oestrogen means reduced serotonin signalling, which explains why you may feel more emotionally sensitive, tearful, or withdrawn. This is a well-documented biological response, not a character flaw. Research consistently shows that social withdrawal and introspection during menstruation are normal, adaptive responses to these hormonal shifts — your nervous system is genuinely more sensitive right now.',
    },
  },
  {
    phase: 'follicular',
    name: 'Follicular',
    dayRange: 'Days 6–12',
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
      {
        name: 'Grain bowl with roasted veg',
        description: 'Fresh, light, and full of the nutrients your body is craving.',
        ingredients: ['150g quinoa', '1 courgette, sliced', '1 red pepper, chopped', '1 red onion, wedged', '400g tin chickpeas, drained', '2 tbsp olive oil', 'juice of 1 lemon', '2 tbsp tahini', '1 garlic clove', 'salt and pepper'],
        steps: ['Preheat oven to 200°C. Toss veg and chickpeas in oil, season and roast for 25 min.', 'Cook quinoa according to packet instructions.', 'Whisk together tahini, lemon juice, garlic and 2 tbsp water to make the dressing.', 'Assemble: quinoa base, roasted veg on top, drizzle with tahini dressing.'],
      },
      {
        name: 'Pan-fried salmon with greens',
        description: 'Omega-3s support rising oestrogen and it is genuinely delicious.',
        ingredients: ['2 salmon fillets', '200g tenderstem broccoli', '2 large handfuls spinach', '3 garlic cloves, sliced', '1 lemon', '2 tbsp olive oil', 'salt and pepper'],
        steps: ['Season salmon with salt, pepper and a squeeze of lemon.', 'Heat oil in a frying pan over medium-high heat. Cook salmon skin-side down for 4 min.', 'Flip and cook for a further 3 min. Remove and rest.', 'In the same pan, sauté garlic for 1 min, add broccoli with a splash of water.', 'Add spinach, cook until wilted. Serve greens alongside salmon.'],
      },
      {
        name: 'Smoothie bowl',
        description: 'Colourful, fresh, and energising. Great for this phase.',
        ingredients: ['2 frozen bananas', '1 large handful spinach', '100g frozen mango', '100ml coconut milk', 'toppings: granola, fresh berries, chia seeds, honey'],
        steps: ['Blend banana, spinach, mango and coconut milk until completely smooth and thick.', 'Pour into a bowl. It should be thicker than a drink.', 'Top with granola, fresh berries, a sprinkle of chia seeds and a drizzle of honey.'],
      },
      {
        name: 'Smoked salmon and avocado open sandwich',
        description: 'Light and vibrant. Packed with good fats and protein.',
        ingredients: ['2 slices rye or sourdough bread', '100g smoked salmon', '1 avocado', 'half a lemon', 'small bunch of dill', '1 tbsp capers', 'black pepper'],
        steps: ['Toast the bread until golden.', 'Mash avocado with a squeeze of lemon, salt and pepper.', 'Spread avocado thickly on toast.', 'Layer smoked salmon over the top.', 'Finish with capers, fresh dill and another squeeze of lemon.'],
      },
    ],
    learnMore: {
      nutrition: 'As oestrogen rises in the follicular phase, your gut microbiome plays a critical role in how well your body processes it. Research published in Gut Microbes (2023) identified the "estrobolome" — a collection of gut bacteria that produce an enzyme called beta-glucuronidase, which determines how much oestrogen is cleared versus recirculated. A healthy, diverse gut microbiome supported by fermented foods (yoghurt, kefir, kimchi) and fibre helps oestrogen metabolise efficiently. Poor gut health disrupts this process, leading to oestrogen being reabsorbed rather than excreted — skewing hormone balance for the rest of your cycle. Eggs and seeds provide zinc, selenium and omega-3s that support follicle development.',
      exercise: 'Oestrogen has direct anabolic effects on muscle tissue — it supports faster repair, greater protein synthesis, and higher load tolerance. A 2024 meta-analysis in MDPI Sports confirmed women achieve significantly greater strength and cardiovascular gains from training in the follicular phase compared to the luteal phase. Your body is biologically primed to build fitness more efficiently right now. This is the best window in your cycle to push harder, try a new class, or work toward a personal best.',
      avoid: 'There are no specific foods or behaviours that are harmful in this phase — your body is in its most resilient state. The main consideration is staying well hydrated as energy and activity levels increase. Even mild dehydration blunts the cognitive and physical benefits of rising oestrogen, reducing concentration and physical performance.',
      mental: 'Rising oestrogen increases the sensitivity of dopamine receptors in the prefrontal cortex — dopamine is the neurotransmitter most closely linked to motivation, reward-seeking and creative drive. Oestrogen also boosts serotonin signalling, which directly lifts mood and reduces baseline anxiety. Multiple studies have found that verbal fluency, working memory and abstract thinking all measurably improve in the follicular phase. The mental clarity and motivation you feel right now are well-documented, reproducible hormonal effects — not coincidence or a random good day.',
    },
  },
  {
    phase: 'ovulatory',
    name: 'Ovulatory',
    dayRange: 'Days 13–16',
    color: '#C47A84',
    bgColor: '#FAE8EB',
    description: "Peak energy, confidence and communication. You're at your most magnetic. Oestrogen peaks and your brain sends a surge of LH (luteinising hormone) — the signal that triggers the release of an egg.",
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
      {
        name: 'Sushi bowl',
        description: 'Light, fresh, zinc-rich. All the flavour of sushi without the faff.',
        ingredients: ['200g sushi rice', '3 tbsp rice wine vinegar', '150g sashimi-grade salmon or tuna, sliced', '1 avocado, sliced', 'half a cucumber, sliced', '100g edamame (frozen, defrosted)', '2 tbsp soy sauce', '1 tsp sesame oil', 'sesame seeds', 'pickled ginger to serve'],
        steps: ['Cook sushi rice and stir through rice wine vinegar while still warm.', 'Mix soy sauce and sesame oil for the dressing.', 'Divide rice into bowls. Arrange fish, avocado, cucumber and edamame on top.', 'Drizzle with dressing, scatter sesame seeds and serve with pickled ginger.'],
      },
      {
        name: 'Avocado and prawn salad',
        description: 'Anti-inflammatory fats and fresh flavours. Ready in 10 minutes.',
        ingredients: ['300g cooked king prawns', '2 avocados, sliced', '100g mixed leaves or rocket', '200g cherry tomatoes, halved', 'half a cucumber, sliced', 'juice of 1 lemon', '2 tbsp olive oil', 'pinch of chilli flakes', 'salt and pepper'],
        steps: ['Arrange leaves, tomatoes and cucumber on a large plate.', 'Add sliced avocado and prawns on top.', 'Whisk lemon juice, olive oil and chilli flakes for the dressing.', 'Drizzle over the salad, season with salt and pepper and serve immediately.'],
      },
      {
        name: 'Halloumi and roasted pepper salad',
        description: 'Satisfying, colourful and worth making. Great for when energy is high.',
        ingredients: ['250g halloumi, sliced', '2 roasted red peppers (from a jar), sliced', '100g rocket', 'handful of pomegranate seeds', '30g pine nuts', '2 tbsp balsamic glaze', '1 tbsp olive oil'],
        steps: ['Toast pine nuts in a dry pan until golden. Set aside.', 'Brush halloumi with oil and grill or fry for 2 min each side until golden.', 'Arrange rocket on a plate, top with peppers and halloumi.', 'Scatter pomegranate seeds and pine nuts.', 'Drizzle with balsamic glaze and serve warm.'],
      },
      {
        name: 'Courgette and feta fritters',
        description: 'Zinc, protein and something a bit different. Brilliant with a side salad.',
        ingredients: ['2 courgettes, grated', '100g feta, crumbled', '2 eggs', '4 tbsp plain flour', 'small bunch of mint, chopped', 'zest of half a lemon', 'olive oil for frying', 'salt and pepper'],
        steps: ['Grate courgette, sprinkle with salt, leave 10 min then squeeze out as much liquid as possible.', 'Mix courgette with feta, eggs, flour, mint and lemon zest. Season well.', 'Heat a little oil in a frying pan. Drop heaped tablespoons of mixture in.', 'Cook for 3 min each side until golden and cooked through.', 'Serve with yoghurt or a simple green salad.'],
      },
    ],
    learnMore: {
      nutrition: 'At ovulation, your body releases a mature egg following a sharp surge in LH — luteinising hormone — triggered by peak oestrogen. Research in Frontiers in Neuroscience (2022) mapped this mechanism precisely: rising oestrogen activates GnRH neurones in the hypothalamus, which then flood the pituitary with a signal to release LH, causing the follicle to rupture and release the egg within 24 to 36 hours. Zinc is essential for healthy follicle development and LH receptor function. Anti-inflammatory omega-3 fats from salmon and avocado support the brief, controlled inflammatory process required for the follicle to open at ovulation.',
      exercise: 'Research shows that pain tolerance is measurably higher around ovulation due to the combined effects of peak oestrogen and a small but significant rise in testosterone (Bartley and Fillingim 2013, Journal of Pain). This makes ovulation the ideal window for personal bests, heavier lifting, or more intense training. Cardiovascular performance also peaks — VO2 max (how efficiently your body uses oxygen during exercise) is highest in this phase, meaning the same effort yields better output.',
      avoid: 'Heavy, hard-to-digest meals divert blood flow to the gut during a phase when the body is directing resources toward ovulation. Research suggests that excess alcohol in the days around ovulation may blunt the LH surge or alter its timing — potentially disrupting ovulation in some women. Keeping alcohol light or avoiding it during your ovulatory window is a sensible precaution, particularly for those monitoring fertility.',
      mental: 'Peak oestrogen simultaneously boosts oxytocin — the bonding and trust hormone — and dopamine, which is why you feel more socially confident, open and communicative right now. Research published in Psychoneuroendocrinology (2019) found that oxytocin receptor sensitivity increases around ovulation, enhancing empathy, social attunement and responsiveness to others. Your increased verbal confidence and empathy are real, measurable, hormonally-driven advantages. This is the best window in your cycle for important conversations, presentations, or any situation requiring connection and influence.',
    },
  },
  {
    phase: 'luteal',
    name: 'Luteal',
    dayRange: 'Days 17–28',  // last 12 days of cycle
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
      {
        name: 'Tomato and garlic pasta',
        description: 'Complex carbs stabilise mood swings. It is exactly what you will want.',
        ingredients: ['300g pasta', '400g tin cherry tomatoes', '4 garlic cloves, sliced', '4 tbsp olive oil', 'handful of fresh basil', '50g parmesan, grated', 'pinch of chilli flakes', 'salt and pepper'],
        steps: ['Cook pasta according to packet instructions. Reserve a cup of pasta water before draining.', 'In a wide pan, warm olive oil and fry garlic on low heat for 3 min until just golden.', 'Add chilli flakes and tomatoes. Simmer for 10 min until thickened.', 'Add drained pasta and a splash of pasta water. Toss well.', 'Finish with torn basil and a generous handful of parmesan.'],
      },
      {
        name: 'Baked salmon with sweet potato',
        description: 'Magnesium and omega-3s to ease PMS symptoms.',
        ingredients: ['2 salmon fillets', '2 medium sweet potatoes, cubed', '200g broccoli', '2 tbsp olive oil', '1 tsp paprika', '2 garlic cloves, minced', 'juice of 1 lemon', 'salt and pepper'],
        steps: ['Preheat oven to 200°C. Toss sweet potato cubes in oil, paprika and seasoning. Roast for 20 min.', 'Mix garlic, lemon juice and remaining oil. Brush over salmon fillets.', 'Place salmon on a baking tray. Add broccoli florets alongside.', 'Bake for 12 to 15 min until salmon is cooked through.', 'Plate with sweet potato and broccoli.'],
      },
      {
        name: 'Overnight oats',
        description: 'Slow-release energy to keep your mood steady through the day.',
        ingredients: ['80g rolled oats', '200ml oat milk', '1 tbsp chia seeds', '1 tbsp honey', '1 banana, sliced', '2 tbsp nut butter', 'optional: cinnamon'],
        steps: ['Combine oats, oat milk, chia seeds and honey in a jar or bowl.', 'Stir well, cover and refrigerate overnight.', 'In the morning, stir and add a splash more milk if needed.', 'Top with sliced banana, nut butter and a pinch of cinnamon.'],
      },
      {
        name: 'Chocolate and oat cookies',
        description: 'Dark chocolate, slow carbs, and a proper treat. No guilt required.',
        ingredients: ['2 ripe bananas', '150g rolled oats', '60g dark chocolate chips', '2 tbsp nut butter', '1 tbsp honey', '1 tsp vanilla extract', 'pinch of salt'],
        steps: ['Preheat oven to 180°C. Line a baking tray with parchment.', 'Mash bananas well in a bowl until smooth.', 'Mix in oats, nut butter, honey, vanilla and salt.', 'Fold in chocolate chips.', 'Drop heaped tablespoons onto the tray and flatten slightly.', 'Bake for 12 to 14 min until golden at the edges.'],
      },
    ],
    learnMore: {
      nutrition: 'Progesterone — the dominant hormone after ovulation — raises your metabolic rate by around 5 to 10%, which partly explains why you feel genuinely hungrier in this phase. Complex carbohydrates support steady blood sugar, which in turn drives serotonin production in the gut. Magnesium directly supports the GABA system — GABA is the brain\'s primary calming neurotransmitter, and its signalling weakens in the late luteal phase. Multiple controlled trials have found that magnesium supplementation measurably reduces PMS symptoms including mood changes, bloating and anxiety. Calcium has also shown consistent results in reducing PMS severity in randomised trials.',
      exercise: 'Progesterone raises your resting core temperature, which makes exercise feel harder than it actually is — your perceived effort increases even when your actual output is unchanged. Research published in the journal Temperature (2020) confirmed this thermoregulatory effect and found it can raise perceived exertion by a measurable margin during the luteal phase. This is not a fitness regression; it is a hormonal effect. Moderate movement in the luteal phase — walking, yoga, swimming — has been shown to improve mood, reduce bloating and lower PMS symptom severity through endorphin release. Pushing too hard in the final days before your period can worsen symptoms.',
      avoid: 'A review published in PMC (2016) found that caffeine intake was significantly associated with greater PMS severity, particularly mood symptoms and breast tenderness — caffeine stimulates cortisol, which is already more reactive in the luteal phase due to how progesterone interacts with the brain\'s stress system. Research in Frontiers in Global Women\'s Health (2021) confirmed that alcohol consistently worsens PMS by disrupting sleep and depleting magnesium — both of which are already under pressure in this phase. Salt activates aldosterone, the hormone that tells your kidneys to hold onto water. Aldosterone sensitivity is higher in the luteal phase, which is why salty food causes noticeably more bloating now than at other times.',
      mental: 'Progesterone is converted in the body into a compound called allopregnanolone, which normally calms the brain by activating GABA-A receptors. In the late luteal phase, however, this system can paradoxically shift — research in Neuropharmacology (2020) and Frontiers in Psychiatry (2023) found that allopregnanolone begins to act as an anxiogenic (anxiety-producing) compound rather than a calming one in women with PMS or PMDD, because GABA-A receptors become less responsive or change their configuration. The result: small problems feel larger, the inner critic is louder, and emotions are more intense. This is a real, documented biological mechanism — not an overreaction or weakness. Tracking these patterns across cycles helps you anticipate the window and build routines that support you through it.',
    },
  },
];

export function getPhase(phase: CyclePhase): PhaseInfo {
  return phases.find(p => p.phase === phase) ?? phases[0];
}
