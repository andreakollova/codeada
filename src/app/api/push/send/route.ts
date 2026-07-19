import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const GLOSSARY_TERMS = [
  { en: 'API - Application Programming Interface. A set of rules that lets apps talk to each other.', sk: 'API - Rozhranie na programovanie aplikácií. Pravidlá, ktoré umožňujú appkám komunikovať.' },
  { en: 'Bug - An error in code that causes unexpected behavior.', sk: 'Bug - Chyba v kóde, ktorá spôsobuje neočakávané správanie.' },
  { en: 'Variable - A named container that stores a value in memory.', sk: 'Premenná - Pomenovaný kontajner, ktorý uchováva hodnotu v pamäti.' },
  { en: 'Function - A reusable block of code that performs a specific task.', sk: 'Funkcia - Znovupoužiteľný blok kódu, ktorý vykonáva konkrétnu úlohu.' },
  { en: 'Loop - Code that repeats until a condition is met.', sk: 'Cyklus - Kód, ktorý sa opakuje, kým nie je splnená podmienka.' },
  { en: 'Array - An ordered collection of items stored in one variable.', sk: 'Pole - Usporiadaná kolekcia prvkov uložená v jednej premennej.' },
  { en: 'String - A sequence of characters, like text.', sk: 'Reťazec - Postupnosť znakov, ako text.' },
  { en: 'Boolean - A value that is either True or False.', sk: 'Boolean - Hodnota, ktorá je buď True alebo False.' },
  { en: 'Class - A blueprint for creating objects with shared properties.', sk: 'Trieda - Predloha na vytváranie objektov so spoločnými vlastnosťami.' },
  { en: 'Git - A version control system that tracks changes in your code.', sk: 'Git - Systém na správu verzií, ktorý sleduje zmeny v kóde.' },
  { en: 'HTTP - The protocol browsers use to communicate with servers.', sk: 'HTTP - Protokol, ktorý prehliadače používajú na komunikáciu so servermi.' },
  { en: 'JSON - A lightweight format for storing and transferring data.', sk: 'JSON - Ľahký formát na ukladanie a prenos dát.' },
  { en: 'CSS - The language that styles how websites look.', sk: 'CSS - Jazyk, ktorý definuje ako vyzerajú webové stránky.' },
  { en: 'SQL - A language for managing and querying databases.', sk: 'SQL - Jazyk na správu a dopytovanie databáz.' },
  { en: 'IDE - A software tool that helps you write code more efficiently.', sk: 'IDE - Softvérový nástroj, ktorý ti pomáha písať kód efektívnejšie.' },
  { en: 'RAM - Temporary memory that your computer uses while running programs.', sk: 'RAM - Dočasná pamäť, ktorú počítač používa pri spúšťaní programov.' },
  { en: 'DNS - The system that translates website names into IP addresses.', sk: 'DNS - Systém, ktorý prekladá názvy webov na IP adresy.' },
  { en: 'Algorithm - A step-by-step set of instructions to solve a problem.', sk: 'Algoritmus - Postupný súbor inštrukcií na vyriešenie problému.' },
  { en: 'Debugging - The process of finding and fixing errors in code.', sk: 'Debugovanie - Proces hľadania a opravovania chýb v kóde.' },
  { en: 'Framework - A pre-built structure that helps you build apps faster.', sk: 'Framework - Predpripravená štruktúra, ktorá ti pomáha vytvárať appky rýchlejšie.' },
  { en: 'Recursion - When a function calls itself to solve smaller parts of a problem.', sk: 'Rekurzia - Keď funkcia volá samú seba na riešenie menších častí problému.' },
  { en: 'Encryption - Converting data into a secret code to protect it.', sk: 'Šifrovanie - Premena dát na tajný kód na ich ochranu.' },
  { en: 'Stack - A data structure where the last item added is the first removed (LIFO).', sk: 'Zásobník - Dátová štruktúra, kde posledný pridaný prvok sa odoberá prvý (LIFO).' },
  { en: 'Compiler - A program that translates your code into machine language.', sk: 'Kompilátor - Program, ktorý prekladá tvoj kód do strojového jazyka.' },
  { en: 'Deployment - The process of making your app available to users.', sk: 'Deployment - Proces sprístupnenia tvojej appky používateľom.' },
  { en: 'Middleware - Software that sits between the app and the server.', sk: 'Middleware - Softvér, ktorý sedí medzi appkou a serverom.' },
  { en: 'Callback - A function passed to another function to be called later.', sk: 'Callback - Funkcia odovzdaná inej funkcii, ktorá sa zavolá neskôr.' },
  { en: 'Scope - The area of code where a variable can be accessed.', sk: 'Scope - Oblasť kódu, kde je premenná prístupná.' },
  { en: 'Token - A small piece of data used for authentication.', sk: 'Token - Malý kúsok dát používaný na autentifikáciu.' },
  { en: 'Webhook - An automatic message sent from one app to another when something happens.', sk: 'Webhook - Automatická správa poslaná z jednej appky do druhej, keď sa niečo stane.' },
];

const REMINDER_MESSAGES = {
  en: [
    "Learn something new today. Just 3 minutes.",
    "Spend a few minutes coding. You got this.",
    "We have a new lesson for you. Check it out!",
    "Continue where you left off. Keep going!",
    "Discover something new about programming today.",
    "3 minutes a day is all it takes.",
  ],
  sk: [
    "Dnes sa nauč niečo nové. Stačia 3 minúty.",
    "Venuj si pár minút programovaniu. Zvládneš to!",
    "Máme pre teba novú lekciu. Pozri sa na ňu!",
    "Pokračuj tam, kde si skončil. Nevzdávaj sa!",
    "Objav niečo nové z programovania.",
    "Stačia 3 minúty denne. Začni teraz.",
  ],
};

function getAPNsToken(): string {
  let key: string;
  try {
    key = fs.readFileSync(path.join(process.cwd(), 'AuthKey_ZKC6UMDMZ6.p8'), 'utf8');
  } catch {
    key = process.env.APNS_KEY || '';
  }
  if (!key) throw new Error('APNs key not found');

  return jwt.sign({}, key, {
    algorithm: 'ES256',
    header: { alg: 'ES256', kid: process.env.APNS_KEY_ID || 'ZKC6UMDMZ6' },
    issuer: process.env.APNS_TEAM_ID || 'J4YGZU25B2',
    expiresIn: '1h',
  });
}

async function sendPush(deviceToken: string, title: string, body: string) {
  const apnsToken = getAPNsToken();
  const bundleId = process.env.APNS_BUNDLE_ID || 'sk.coduy.app';
  const host = 'https://api.push.apple.com';

  const res = await fetch(`${host}/3/device/${deviceToken}`, {
    method: 'POST',
    headers: {
      'authorization': `bearer ${apnsToken}`,
      'apns-topic': bundleId,
      'apns-push-type': 'alert',
      'apns-priority': '10',
    },
    body: JSON.stringify({
      aps: { alert: { title, body }, sound: 'default', badge: 1 },
    }),
  });

  return res.ok;
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

    if (users.length === 0) return NextResponse.json({ sent: 0, total: 0 });

    let sent = 0;
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);

    if (type === 'glossary') {
      const term = GLOSSARY_TERMS[dayOfYear % GLOSSARY_TERMS.length];

      for (const user of users) {
        try {
          // Detect locale from display_name heuristic or default EN
          const isSk = user.locale === 'sk' || (user.display_name && /[áéíóúýžščťďľňŕ]/i.test(user.display_name));
          const title = isSk ? '📚 Slovo dňa' : '📚 Word of the Day';
          const body = isSk ? term.sk : term.en;
          const ok = await sendPush(user.push_token, title, body);
          if (ok) sent++;
        } catch {}
      }
    } else if (type === 'reminder') {
      const emojis = ['🚀', '💥', '🔥', '⚡', '✨', '🎯'];
      const emoji = emojis[dayOfYear % emojis.length];

      for (const user of users) {
        try {
          const isSk = user.locale === 'sk' || (user.display_name && /[áéíóúýžščťďľňŕ]/i.test(user.display_name));
          const msgs = isSk ? REMINDER_MESSAGES.sk : REMINDER_MESSAGES.en;
          const msg = msgs[dayOfYear % msgs.length];
          const ok = await sendPush(user.push_token, `${emoji} Coduy`, msg);
          if (ok) sent++;
        } catch {}
      }
    }

    return NextResponse.json({ sent, total: users.length, type });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
