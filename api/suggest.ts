export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { suggestion, phase, dayOfCycle, herName, sharedInterests, soloInterests, type } = await req.json();

  const phaseDescriptions: Record<string, string> = {
    menstrual: 'menstrual phase (days 1-5). She is on her period, energy is low, she needs warmth, quiet, and comfort. She is not up for big plans or high-stimulation activities.',
    follicular: 'follicular phase (days 6-13). Her energy is rising, mood is positive, she is up for new experiences and social plans. A great time to get out and do things together.',
    ovulatory: 'ovulatory phase (days 14-16). She is at peak energy and confidence. She will love social, stimulating, and special experiences right now.',
    luteal: 'luteal phase (days 17-28). Energy is declining, she may feel more sensitive or irritable. She needs comfort, low-pressure plans, and patience.',
  };

  const isActivity = type === 'activity';

  const prompt = `You are a warm, practical assistant helping a partner support their significant other through their menstrual cycle.

Context:
- Her name: ${herName}
- She is currently in her ${phaseDescriptions[phase] ?? phase}
- Day ${dayOfCycle} of her cycle
- Their shared interests: ${sharedInterests?.length > 0 ? sharedInterests.join(', ') : 'not specified'}
- His solo interests: ${soloInterests?.length > 0 ? soloInterests.join(', ') : 'not specified'}

The partner has tapped this suggestion: "${suggestion}"

${isActivity
  ? `Generate a warm, specific, practical response that:
1. Briefly explains why this activity suits her current phase (1-2 sentences)
2. Gives a concrete, personalised plan for how they could actually do this — specific timing, what to bring, what to consider given her phase, how to make it feel special but low-pressure
3. If their shared interests are relevant, weave them in naturally
4. Keep it conversational, like advice from a knowledgeable friend — not a listicle
5. 150-200 words maximum`
  : `Generate a warm, specific, practical response that:
1. Explains what this actually looks like in practice today or this week — not generic advice but specific actions
2. Gives 2-3 concrete examples of how to do this given her current phase and their interests
3. Keep it conversational and encouraging — the partner wants to do right by her
4. 100-150 words maximum`
}

Write in British English. Do not use em dashes. Be warm but practical.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    return new Response('API error', { status: 500 });
  }

  const data = await response.json();
  const text: string = data.content?.[0]?.text ?? '';

  return new Response(JSON.stringify({ text }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
