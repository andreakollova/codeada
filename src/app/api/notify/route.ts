import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { event, email, name } = await req.json();
    const url = process.env.SLACK_WEBHOOK_URL;
    if (!url) return NextResponse.json({ ok: true });

    let message = '';
    if (event === 'new_user') {
      message = `New user registered! ${email || ''}${name ? ` (${name})` : ''}`;
    } else if (event === 'lesson_complete') {
      message = `${name || email || 'User'} completed a lesson!`;
    } else {
      message = `Coduy event: ${event} - ${email || name || ''}`;
    }

    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
