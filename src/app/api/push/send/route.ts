import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

function getAPNsToken(): string {
  const keyPath = path.join(process.cwd(), 'AuthKey_ZKC6UMDMZ6.p8');
  let key: string;
  try {
    key = fs.readFileSync(keyPath, 'utf8');
  } catch {
    key = process.env.APNS_KEY || '';
  }

  const token = jwt.sign({}, key, {
    algorithm: 'ES256',
    header: {
      alg: 'ES256',
      kid: process.env.APNS_KEY_ID || 'ZKC6UMDMZ6',
    },
    issuer: process.env.APNS_TEAM_ID || 'J4YGZU25B2',
    expiresIn: '1h',
  });

  return token;
}

async function sendPush(deviceToken: string, title: string, body: string, data?: Record<string, string>) {
  const apnsToken = getAPNsToken();
  const bundleId = process.env.APNS_BUNDLE_ID || 'sk.coduy.app';
  // Use production URL for App Store, sandbox for development
  const host = 'https://api.push.apple.com';

  const payload = {
    aps: {
      alert: { title, body },
      sound: 'default',
      badge: 1,
    },
    ...data,
  };

  const res = await fetch(`${host}/3/device/${deviceToken}`, {
    method: 'POST',
    headers: {
      'authorization': `bearer ${apnsToken}`,
      'apns-topic': bundleId,
      'apns-push-type': 'alert',
      'apns-priority': '10',
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return { status: res.status, ok: res.ok };
}

export async function POST(req: NextRequest) {
  try {
    const { type } = await req.json();

    // Get all users with push tokens
    let users: any[] = [];
    let offset = 0;
    while (true) {
      const { data } = await sb.from('user_state')
        .select('user_id, push_token, display_name')
        .not('push_token', 'is', null)
        .range(offset, offset + 99);
      if (!data?.length) break;
      users.push(...data);
      offset += 100;
      if (data.length < 100) break;
    }

    if (users.length === 0) return NextResponse.json({ sent: 0 });

    let sent = 0;

    if (type === 'glossary') {
      // Pick random glossary term
      const { data: terms } = await sb.from('cb_lessons')
        .select('title, title_sk')
        .order('id')
        .limit(100);
      const term = terms?.[Math.floor(Math.random() * (terms?.length || 1))];
      const title = 'Word of the Day';
      const body = term?.title || 'Learn something new today!';

      for (const user of users) {
        try {
          await sendPush(user.push_token, title, body);
          sent++;
        } catch {}
      }
    } else if (type === 'reminder') {
      for (const user of users) {
        const name = user.display_name || 'there';
        try {
          await sendPush(
            user.push_token,
            'Keep your streak alive!',
            `Hey ${name}, don't forget to learn today. Just 3 minutes!`,
          );
          sent++;
        } catch {}
      }
    }

    return NextResponse.json({ sent, total: users.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
