import { NextRequest, NextResponse } from 'next/server';

// API key is server-side only (never sent to client)
const OPENAI_KEY = process.env.OPENAI_API_KEY || '';

// In-memory rate limit per IP+user (resets on redeploy)
const usage = new Map<string, { count: number; resetAt: number }>();
const DAILY_LIMIT = 20;

export async function POST(req: NextRequest) {
  if (!OPENAI_KEY) return NextResponse.json({ error: 'AI not configured' }, { status: 500 });

  // Validate origin
  const origin = req.headers.get('origin') || '';
  if (origin && !origin.includes('coduy.sk') && !origin.includes('coduy.com') && !origin.includes('localhost')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }
  const { question, lessonTitle, lessonContent, locale, userId } = body;

  if (!question || typeof question !== 'string' || question.length > 500) {
    return NextResponse.json({ error: 'Invalid question' }, { status: 400 });
  }
  if (!lessonContent || typeof lessonContent !== 'string') {
    return NextResponse.json({ error: 'Missing content' }, { status: 400 });
  }

  // Rate limit per IP + userId per day
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const key = `${userId || ip}-${new Date().toDateString()}`;
  const now = Date.now();
  const userUsage = usage.get(key) || { count: 0, resetAt: now + 86400000 };
  if (now > userUsage.resetAt) {
    userUsage.count = 0;
    userUsage.resetAt = now + 86400000;
  }
  if (userUsage.count >= DAILY_LIMIT) {
    return NextResponse.json({ error: locale === 'sk' ? 'Denný limit otázok dosiahnutý.' : 'Daily question limit reached.' }, { status: 429 });
  }
  userUsage.count++;
  usage.set(key, userUsage);

  const systemPrompt = locale === 'sk'
    ? `Si Byte, priateľský AI asistent v programovacej appke Coduy. Odpovedáš na otázky študentov k lekcii "${lessonTitle}".
Pravidlá:
- Odpovedaj KRÁTKO (max 3 vety)
- Použi jednoduchý jazyk, vysvetľuj ako 14-ročnému
- Odpovedaj IBA na otázky súvisiace s touto lekciou
- Ak sa pýtajú niečo mimo témy, povedz že sa môžu opýtať na niečo k tejto lekcii
- Slovensky, neformálne
- NIKDY nedávaj celé riešenia kvízov`
    : `You are Byte, a friendly AI assistant in the Coduy coding app. You answer student questions about the lesson "${lessonTitle}".
Rules:
- Answer BRIEFLY (max 3 sentences)
- Use simple language, explain like to a 14-year-old
- ONLY answer questions related to this lesson
- If they ask something off-topic, tell them to ask about this lesson
- Casual, friendly tone
- NEVER give full quiz solutions`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt + '\n\nObsah lekcie:\n' + lessonContent.slice(0, 2000) },
          { role: 'user', content: question },
        ],
        temperature: 0.5,
        max_tokens: 200,
      }),
    });

    const data = await res.json();
    const answer = data.choices?.[0]?.message?.content?.trim() || '';

    return NextResponse.json({ answer, remaining: 20 - userUsage.count });
  } catch {
    return NextResponse.json({ error: 'AI error' }, { status: 500 });
  }
}
