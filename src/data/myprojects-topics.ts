import { ProjectTopic } from '@/types';

export const projectTopics: ProjectTopic[] = [
  {
    id: 'react-native',
    title: 'React Native',
    description: 'Mobilné aplikácie pre iOS a Android',
    icon: 'smartphone',
    lessons: [
      {
        id: 'rn-components',
        unitId: 'react-native',
        title: 'Natívne komponenty',
        exercises: [
          {
            id: 'rn-comp-1', type: 'explain', conceptId: 'rn-view',
            prompt: 'View, Text, TouchableOpacity — stavebné bloky RN',
            codeSnippet: `import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';\n\nfunction Karta({ nadpis, onPress }) {\n  return (\n    <TouchableOpacity onPress={onPress} style={styles.karta}>\n      <View style={styles.obsah}>\n        <Text style={styles.nadpis}>{nadpis}</Text>\n      </View>\n    </TouchableOpacity>\n  );\n}\n\nconst styles = StyleSheet.create({\n  karta: { borderRadius: 16, padding: 16, backgroundColor: '#1a1a1a' },\n  obsah: { flexDirection: 'row', alignItems: 'center' },\n  nadpis: { fontSize: 16, color: '#fff', fontWeight: '700' },\n});`,
            explanation: `**Čo je to?** React Native nemá div ani button — má View (ako div), Text (ako p/span), TouchableOpacity (klikateľný element).

**Prečo existujú?** RN prekladá JS komponenty na natívne iOS/Android UI prvky. View → UIView (iOS) / android.view.View (Android). Preto nevyzerá ako webview — vyzerá ako skutočná natívna app.

**StyleSheet.create:** Optimalizovaný spôsob definovania štýlov. Podobný CSS ale iný — žiadne dedičstvo (okrem Text), všetky hodnoty v JS objektoch, čísla bez jednotiek.

**TouchableOpacity vs Pressable:** TouchableOpacity zblední element pri stlačení. Pressable je novší s viac kontrolou (pressed state, ripple na Android).`,
            xp: 10,
          },
          {
            id: 'rn-comp-2', type: 'mcq', conceptId: 'rn-view',
            prompt: 'Čo je ekvivalent HTML div v React Native?',
            options: ['Box', 'View', 'Container', 'Div'],
            correctAnswer: 'View',
            explanation: 'View je základný layout komponent v RN — zodpovedá div v HTML. Môže mať deti, style, touch handlery.',
            xp: 10,
          },
          {
            id: 'rn-comp-3', type: 'mcq', conceptId: 'rn-styles',
            prompt: 'Prečo používa React Native StyleSheet.create() namiesto obyčajného objektu?',
            options: [
              'Je to povinné — bez toho nefunguje',
              'Optimalizuje štýly — validuje ich a posiela na natívnu stranu raz',
              'Umožňuje CSS selektory',
              'Pridáva animácie automaticky',
            ],
            correctAnswer: 'Optimalizuje štýly — validuje ich a posiela na natívnu stranu raz',
            xp: 10,
          },
          {
            id: 'rn-comp-4', type: 'fill', conceptId: 'rn-flatlist',
            prompt: 'Doplň komponent na renderovanie dlhých zoznamov výkonne:',
            codeSnippet: '<___ data={events} keyExtractor={i => i.id} renderItem={({ item }) => <EventCard event={item} />} />',
            blanks: [{ id: 'b1', options: ['FlatList', 'ScrollView', 'ListView', 'List'], correct: 'FlatList' }],
            xp: 15,
          },
        ],
      },
      {
        id: 'rn-navigation',
        unitId: 'react-native',
        title: 'Expo Router navigácia',
        exercises: [
          {
            id: 'rn-nav-1', type: 'explain', conceptId: 'expo-router',
            prompt: 'Expo Router — file-based navigácia v mobilných appkách',
            codeSnippet: `// app/(tabs)/index.tsx → Hlavná záložka\n// app/(tabs)/profile.tsx → Profilová záložka\n// app/event/[id].tsx → Detail eventu\n\n// Navigácia:\nimport { router } from 'expo-router';\nrouter.push('/event/abc123');\nrouter.back();\n\n// Čítanie parametrov:\nimport { useLocalSearchParams } from 'expo-router';\nconst { id } = useLocalSearchParams();`,
            explanation: `**Čo je to?** Expo Router prináša Next.js-like file-based routing do mobilných appiek. Súborová štruktúra = navigácia.

**Prečo existuje?** Pred tým si musel ručne konfigurovať React Navigation stacky, zaregistrovať screens, nastaviť deep links. Expo Router to robí automaticky.

**(tabs) priečinok:** Skupiny v zátvorkách sú "route groups" — nespôsobia segment v URL. Všetko v (tabs) dostane bottom tab bar automaticky.

**router.push vs router.replace:** push pridá na stack (môžeš ísť späť). replace nahradí aktuálnu obrazovku (login → home — nechceš ísť späť na login).`,
            xp: 10,
          },
          {
            id: 'rn-nav-2', type: 'mcq', conceptId: 'expo-router',
            prompt: 'Čo robí router.replace() na rozdiel od router.push()?',
            options: [
              'Nahradí aktuálnu obrazovku — nemôžeš sa vrátiť späť na ňu',
              'Refreshne aktuálnu obrazovku',
              'Vymaže celý navigation stack',
              'Presmeruje na iný web',
            ],
            correctAnswer: 'Nahradí aktuálnu obrazovku — nemôžeš sa vrátiť späť na ňu',
            xp: 10,
          },
        ],
      },
    ],
  },
  {
    id: 'supabase-advanced',
    title: 'Supabase Databáza',
    description: 'Pokročilé queries, RLS, real-time, storage',
    icon: 'database',
    lessons: [
      {
        id: 'supa-rls',
        unitId: 'supabase-advanced',
        title: 'Row Level Security',
        exercises: [
          {
            id: 'rls-1', type: 'explain', conceptId: 'rls-policy',
            prompt: 'RLS politiky — bezpečnosť priamo v databáze',
            codeSnippet: `-- Zapni RLS na tabuľke:\nALTER TABLE events ENABLE ROW LEVEL SECURITY;\n\n-- Politika: každý vidí len svoje eventy:\nCREATE POLICY "vlastné eventy"\n  ON events FOR SELECT\n  USING (user_id = auth.uid());\n\n-- Politika: verejné eventy sú viditeľné všetkým:\nCREATE POLICY "verejné eventy"\n  ON events FOR SELECT\n  USING (is_public = true);`,
            explanation: `**Čo je to?** RLS politiky sú SQL pravidlá, ktoré kontrolujú prístup k jednotlivým riadkom tabuľky — priamo na úrovni databázy.

**Prečo existuje?** Bez RLS: ak niekto ukradne tvoj anon key, môže čítať všetky dáta. S RLS: aj s kľúčom vidí len to, na čo má povolenie.

**auth.uid():** Supabase funkcia, ktorá vráti ID aktuálneho prihláseného používateľa. Automaticky dostupná v politikách.

**USING vs WITH CHECK:** USING = pre SELECT/DELETE (čo môžeš čítať/mazať). WITH CHECK = pre INSERT/UPDATE (čo môžeš zapisovať). Môžeš mať obe na jednej politike.`,
            xp: 10,
          },
          {
            id: 'rls-2', type: 'mcq', conceptId: 'rls-policy',
            prompt: 'Čo sa stane s tabuľkou ak zapneš RLS ale nemáš žiadnu politiku?',
            options: [
              'Všetci majú prístup (default)',
              'Nikto nemá prístup — tabuľka je úplne uzavretá',
              'Len admin má prístup',
              'Supabase hodí chybu',
            ],
            correctAnswer: 'Nikto nemá prístup — tabuľka je úplne uzavretá',
            explanation: 'RLS bez politík = deny all. Musíš explicitne povedať kto smie čo robiť.',
            xp: 15,
          },
        ],
      },
      {
        id: 'supa-realtime',
        unitId: 'supabase-advanced',
        title: 'Real-time subscripcie',
        exercises: [
          {
            id: 'rt-1', type: 'explain', conceptId: 'supabase-realtime',
            prompt: 'Real-time — live aktualizácie z databázy',
            codeSnippet: `useEffect(() => {\n  const channel = supabase\n    .channel('attendees-room')\n    .on(\n      'postgres_changes',\n      { event: 'INSERT', schema: 'public', table: 'attendees' },\n      (payload) => {\n        setAttendees(prev => [...prev, payload.new]);\n      }\n    )\n    .subscribe();\n\n  return () => { supabase.removeChannel(channel); };\n}, [eventId]);`,
            explanation: `**Čo je to?** Supabase Real-time sleduje zmeny v PostgreSQL databáze a posiela ich klientovi cez WebSocket — v reálnom čase.

**Prečo existuje?** Bez real-time musíš pollovat (každú sekundu fetchovať) čo je neefektívne. WebSocket = trvalé spojenie, server posiela dáta keď nastane zmena.

**channel():** Každé spojenie má meno. Môžeš mať viac channelov pre rôzne tabuľky/filtre.

**Cleanup:** Vždy odstrán channel v cleanup funkcii useEffect — zabraňuje memory leaks a duplicitným správam pri re-mountnutí.`,
            xp: 10,
          },
          {
            id: 'rt-2', type: 'mcq', conceptId: 'supabase-realtime',
            prompt: 'Prečo treba v useEffect cleanup odstrániť Supabase channel?',
            options: [
              'Je to len best practice, nič sa nestane',
              'Bez cleanup zostane WebSocket spojenie otvorené a správy prídu viackrát',
              'Supabase to vyžaduje v dokumentácii',
              'Zabraňuje TypeScript chybám',
            ],
            correctAnswer: 'Bez cleanup zostane WebSocket spojenie otvorené a správy prídu viackrát',
            xp: 10,
          },
        ],
      },
    ],
  },
  {
    id: 'auth',
    title: 'Autentifikácia',
    description: 'Prihlasovanie, OAuth, session management',
    icon: 'shield',
    lessons: [
      {
        id: 'auth-basics',
        unitId: 'auth',
        title: 'Supabase Auth',
        exercises: [
          {
            id: 'auth-1', type: 'explain', conceptId: 'supabase-auth',
            prompt: 'Auth flow — od prihlásenia po session',
            codeSnippet: `// Prihlásenie:\nconst { data, error } = await supabase.auth.signInWithPassword({\n  email, password\n});\n\n// OAuth (Google, GitHub...):\nawait supabase.auth.signInWithOAuth({ provider: 'google' });\n\n// Sleduj session zmeny:\nsupabase.auth.onAuthStateChange((event, session) => {\n  if (event === 'SIGNED_IN') setUser(session.user);\n  if (event === 'SIGNED_OUT') setUser(null);\n});\n\n// Aktuálny user:\nconst { data: { user } } = await supabase.auth.getUser();`,
            explanation: `**Čo je to?** Supabase Auth spravuje registráciu, prihlásenie, session a tokeny za teba.

**Session:** Po prihlásení Supabase uloží JWT do localStorage/cookie automaticky. Pri každej Supabase query sa token pošle v hlavičke — nemusíš to robiť ručne.

**onAuthStateChange:** Počúva na zmeny prihlásenia — aj keď token expiruje a Supabase ho automaticky refreshuje. Registruj ho raz (napr. v layout komponentoch).

**signInWithOAuth:** Presmeruje na Google/GitHub login stránku. Po prihlásení presmeruje späť do tvojej app na redirect URL.`,
            xp: 10,
          },
          {
            id: 'auth-2', type: 'mcq', conceptId: 'supabase-auth',
            prompt: 'Kde Supabase automaticky ukladá JWT token po prihlásení?',
            options: [
              'Musíš ho uložiť ručne do state',
              'Do localStorage alebo cookie — automaticky',
              'Iba v pamäti (stratí sa pri refreshi)',
              'Do Supabase databázy',
            ],
            correctAnswer: 'Do localStorage alebo cookie — automaticky',
            xp: 10,
          },
          {
            id: 'auth-3', type: 'fill', conceptId: 'supabase-auth',
            prompt: 'Doplň spôsob prihlásenia cez Google:',
            codeSnippet: "await supabase.auth.signInWithOAuth({ provider: '_______' });",
            blanks: [{ id: 'b1', options: ['google', 'Google', 'GOOGLE', 'oauth-google'], correct: 'google' }],
            xp: 10,
          },
        ],
      },
    ],
  },
  {
    id: 'stripe',
    title: 'Stripe Platby',
    description: 'Prijímanie platieb, webhooks, subscriptions',
    icon: 'credit-card',
    lessons: [
      {
        id: 'stripe-checkout',
        unitId: 'stripe',
        title: 'Checkout Session',
        exercises: [
          {
            id: 'stripe-1', type: 'explain', conceptId: 'stripe-checkout',
            prompt: 'Stripe Checkout — bezpečné prijímanie platieb',
            codeSnippet: `// API route: /api/checkout/route.ts\nexport async function POST(req: Request) {\n  const { ticketId, userId } = await req.json();\n\n  const session = await stripe.checkout.sessions.create({\n    mode: 'payment',\n    payment_method_types: ['card'],\n    line_items: [{\n      price_data: {\n        currency: 'eur',\n        unit_amount: 1500,  // 15.00 EUR v centoch!\n        product_data: { name: 'Vstupenka na párty' },\n      },\n      quantity: 1,\n    }],\n    success_url: \`\${origin}/success?session_id={CHECKOUT_SESSION_ID}\`,\n    cancel_url: \`\${origin}/cancel\`,\n    metadata: { ticketId, userId },\n  });\n\n  return Response.json({ url: session.url });\n}`,
            explanation: `**Čo je to?** Stripe Checkout je hostovaná platobná stránka od Stripe — nemusíš riešiť bezpečnosť kariet, PCI compliance, 3DS overenie.

**unit_amount v centoch:** Vždy v najmenšej mene — pre EUR v centoch (15 EUR = 1500). Toto je časté zdrojom bugov!

**metadata:** Dáta, ktoré si priložíš k platbe — dostaneš ich späť vo webhooku. Ideálne na prepojenie platby s tvojím systémom (userId, ticketId).

**Webhook:** Nikdy nespoliehaj sa len na success_url! Používateľ môže zatvoriť tab. Webhook je notifikácia od Stripe na tvoj server, keď je platba naozaj zaplatená.`,
            xp: 10,
          },
          {
            id: 'stripe-2', type: 'mcq', conceptId: 'stripe-checkout',
            prompt: 'Prečo NIKDY nemáš spoliehať na success_url ako potvrdenie platby?',
            options: [
              'Je to zastaralé API',
              'Používateľ môže zatvoriť tab predtým ako sa presmeruje — platba prebehla, ale ty nevieš',
              'Stripe nezaručuje presmerovanie',
              'success_url neprijíma parametre',
            ],
            correctAnswer: 'Používateľ môže zatvoriť tab predtým ako sa presmeruje — platba prebehla, ale ty nevieš',
            xp: 15,
          },
          {
            id: 'stripe-3', type: 'fill', conceptId: 'stripe-units',
            prompt: 'Koľko je 9.99 EUR v centoch (unit_amount pre Stripe)?',
            codeSnippet: 'unit_amount: ___,  // 9.99 EUR',
            blanks: [{ id: 'b1', options: ['999', '9.99', '9990', '99'], correct: '999' }],
            xp: 10,
          },
        ],
      },
    ],
  },
  {
    id: 'discord',
    title: 'Discord API',
    description: 'Boti, webhooky, slash príkazy, embedy',
    icon: 'message-square',
    lessons: [
      {
        id: 'discord-webhooks',
        unitId: 'discord',
        title: 'Webhooky a embedy',
        exercises: [
          {
            id: 'discord-1', type: 'explain', conceptId: 'discord-webhook',
            prompt: 'Discord webhook — posielaj správy bez bota',
            codeSnippet: `async function posliDoDiscord(clanek) {\n  const embed = {\n    title: clanek.nadpis,\n    description: clanek.perex,\n    color: 0x00ff00,  // zelená v hexadecimálnom (int!)\n    url: clanek.url,\n    thumbnail: { url: clanek.obrazok },\n    fields: [\n      { name: 'Zdroj', value: clanek.zdroj, inline: true },\n      { name: 'Dátum', value: clanek.datum, inline: true },\n    ],\n    footer: { text: 'Coduy News' },\n    timestamp: new Date().toISOString(),\n  };\n\n  await fetch(WEBHOOK_URL, {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ embeds: [embed] }),\n  });\n}`,
            explanation: `**Čo je to?** Discord webhook je URL, na ktorý môžeš POST požiadavkou poslať správu do konkrétneho Discord kanála — bez bota, bez OAuth.

**Embed:** Bohatá kartička so štruktúrovaným obsahom — titulok, popis, polia, thumbnail, farba, timestamp. Oveľa krajšie ako plain text.

**color:** Číslo, nie hex string! 0x00ff00 je zelená. Konverzia: parseInt("00ff00", 16) = 65280.

**Kedy webhook vs bot?** Webhook = jednosmerné posielanie správ. Bot = obojsmerná komunikácia (príkazy, reakcie, tlačidlá). Pre jednoduché notifikácie postačí webhook.`,
            xp: 10,
          },
          {
            id: 'discord-2', type: 'mcq', conceptId: 'discord-embed',
            prompt: 'Aký formát má color v Discord embede?',
            options: [
              'Hex string "#00ff00"',
              'Celé číslo v decimálnom alebo hexadecimálnom tvare (0x00ff00)',
              'RGB pole [0, 255, 0]',
              'CSS názov farby "green"',
            ],
            correctAnswer: 'Celé číslo v decimálnom alebo hexadecimálnom tvare (0x00ff00)',
            xp: 10,
          },
        ],
      },
      {
        id: 'discord-bot',
        unitId: 'discord',
        title: 'Discord Bot s tlačidlami',
        exercises: [
          {
            id: 'discord-3', type: 'explain', conceptId: 'discord-bot',
            prompt: 'Interaktívne správy s tlačidlami',
            codeSnippet: `// Posielanie správy s tlačidlami:\nawait client.channels.cache.get(channelId).send({\n  embeds: [embed],\n  components: [{\n    type: 1, // ActionRow\n    components: [\n      {\n        type: 2, // Button\n        style: 3, // SUCCESS (zelené)\n        label: 'Schváliť',\n        custom_id: \`approve_\${articleId}\`,\n      },\n      {\n        type: 2,\n        style: 4, // DANGER (červené)\n        label: 'Odmietnuť',\n        custom_id: \`reject_\${articleId}\`,\n      },\n    ],\n  }],\n});\n\n// Zachytenie kliknutia:\nclient.on('interactionCreate', async (interaction) => {\n  if (!interaction.isButton()) return;\n  const [action, id] = interaction.customId.split('_');\n  if (action === 'approve') { /* ... */ }\n});`,
            explanation: `**Čo je to?** Discord boti môžu posielať správy s interaktívnymi komponentmi — tlačidlá, select menu, modaly.

**ActionRow (type 1):** Kontajner pre komponenty. Každá správa môže mať max 5 ActionRow, každý ActionRow max 5 tlačidiel.

**Button styles:** 1=Primary(modrá), 2=Secondary(sivá), 3=Success(zelená), 4=Danger(červená), 5=Link.

**custom_id:** Identifikátor tlačidla — dostaneš ho späť pri interakcii. Kóduj dáta do neho: "approve_123" = akcia + ID záznamu. Max 100 znakov.

**interactionCreate:** Event, ktorý bot dostane keď niekto klikne na tlačidlo. Musíš vždy odpovedať (defer alebo reply) do 3 sekúnd.`,
            xp: 10,
          },
        ],
      },
    ],
  },
  {
    id: 'instagram-api',
    title: 'Instagram / Meta API',
    description: 'Automatické posty, Graph API, média',
    icon: 'camera',
    lessons: [
      {
        id: 'ig-basics',
        unitId: 'instagram-api',
        title: 'Meta Graph API',
        exercises: [
          {
            id: 'ig-1', type: 'explain', conceptId: 'meta-graph',
            prompt: 'Meta Graph API — automatické postovanie',
            codeSnippet: `// 1. Nahraj obrázok (získaj media container):\nconst container = await fetch(\n  \`https://graph.facebook.com/v21.0/\${igUserId}/media\`,\n  {\n    method: 'POST',\n    body: new URLSearchParams({\n      image_url: publicImageUrl,\n      caption: 'Môj post #hashtag',\n      access_token: TOKEN,\n    }),\n  }\n).then(r => r.json());\n\n// 2. Publikuj container:\nawait fetch(\n  \`https://graph.facebook.com/v21.0/\${igUserId}/media_publish\`,\n  {\n    method: 'POST',\n    body: new URLSearchParams({\n      creation_id: container.id,\n      access_token: TOKEN,\n    }),\n  }\n);`,
            explanation: `**Čo je to?** Meta Graph API umožňuje automaticky posielať príspevky na Instagram Business/Creator účty.

**Dvojkrokový proces:** 1) Vytvoríš media container (upload URL obrázka, caption). 2) Publikuješ container. Medzi krokmi môžeš počkať (Carousel sa skladá inak).

**Obrázok musí byť PUBLIC URL:** Instagram sám stiahne obrázok zo tvojho servera/storage. Preto nahrávaj na Supabase Storage (public bucket) a posielaj public URL.

**Access Token:** Long-lived page access token (60 dní) alebo system user token (neexpiruje). Nikdy ich nevkladaj priamo do kódu — env variables!`,
            xp: 10,
          },
          {
            id: 'ig-2', type: 'mcq', conceptId: 'meta-graph',
            prompt: 'Prečo musí byť obrázok na PUBLIC URL pri postovaní cez Meta Graph API?',
            options: [
              'API vyžaduje obrázky na ich serveroch',
              'Instagram sám stiahne obrázok zo tvojej URL — musí byť verejne dostupný',
              'Je to len odporúčanie',
              'Private URL funguje s správnym tokenom',
            ],
            correctAnswer: 'Instagram sám stiahne obrázok zo tvojej URL — musí byť verejne dostupný',
            xp: 10,
          },
        ],
      },
    ],
  },
  {
    id: 'nextjs-advanced',
    title: 'Next.js',
    description: 'App Router, Server Actions, API routes, middleware',
    icon: 'zap',
    lessons: [
      {
        id: 'nextjs-api',
        unitId: 'nextjs-advanced',
        title: 'API Routes a Server Actions',
        exercises: [
          {
            id: 'nx-1', type: 'explain', conceptId: 'nextjs-api-routes',
            prompt: 'API Routes — tvoj backend v Next.js',
            codeSnippet: `// app/api/events/route.ts\nimport { NextRequest, NextResponse } from 'next/server';\n\n// GET /api/events\nexport async function GET(req: NextRequest) {\n  const city = req.nextUrl.searchParams.get('city');\n  const { data } = await supabase.from('events').select('*').eq('city', city);\n  return NextResponse.json(data);\n}\n\n// POST /api/events\nexport async function POST(req: NextRequest) {\n  const body = await req.json();\n  const { data, error } = await supabase.from('events').insert(body);\n  if (error) return NextResponse.json({ error }, { status: 400 });\n  return NextResponse.json(data, { status: 201 });\n}`,
            explanation: `**Čo je to?** Next.js App Router podporuje API routes ako serverless funkcie — súbor route.ts v app/ priečinku.

**Exportuj HTTP metódy:** GET, POST, PUT, PATCH, DELETE, HEAD. Každá je async funkcia, dostane NextRequest, vracia NextResponse.

**Kedy použiť API route vs Server Action?** API route: keď potrebuješ REST API (iné klienty, webhooky). Server Action: keď je to len pre tvoju Next.js app (formuláre, mutácie priamo z komponentov).

**Bezpečnosť:** API routes sú verejné! Vždy validuj vstup, over autentifikáciu (supabase.auth.getUser()), používaj RLS.`,
            xp: 10,
          },
          {
            id: 'nx-2', type: 'mcq', conceptId: 'server-actions',
            prompt: 'Čo je Server Action v Next.js?',
            options: [
              'Funkcia označená "use server" — beží na serveri, môže ju volať klient priamo',
              'Middleware funkcia',
              'Supabase RPC volanie',
              'API endpoint na /api/ ceste',
            ],
            correctAnswer: 'Funkcia označená "use server" — beží na serveri, môže ju volať klient priamo',
            explanation: '"use server" = Server Action. Volaj ju ako bežnú funkciu z Client komponentu — Next.js to preloží na POST požiadavku na server.',
            xp: 10,
          },
        ],
      },
      {
        id: 'nextjs-middleware',
        unitId: 'nextjs-advanced',
        title: 'Middleware a Auth guard',
        exercises: [
          {
            id: 'nx-3', type: 'explain', conceptId: 'nextjs-middleware',
            prompt: 'Middleware — bežia pred každou požiadavkou',
            codeSnippet: `// middleware.ts (v root priečinku)\nimport { NextRequest, NextResponse } from 'next/server';\n\nexport function middleware(req: NextRequest) {\n  const token = req.cookies.get('sb-access-token')?.value;\n  const isAuth = !!token;\n  const isProtected = req.nextUrl.pathname.startsWith('/dashboard');\n\n  if (isProtected && !isAuth) {\n    return NextResponse.redirect(new URL('/login', req.url));\n  }\n\n  return NextResponse.next();\n}\n\nexport const config = {\n  matcher: ['/dashboard/:path*', '/profile/:path*'],\n};`,
            explanation: `**Čo je to?** Middleware je funkcia, ktorá beží na Edge (CDN node) pred každou požiadavkou — ešte pred server komponentmi.

**Prečo existuje?** Auth check bez middleware = flash obsahu (stránka sa načíta, potom presmeruje). Middleware presmeruje PRED odoslaním HTML.

**matcher:** Definuje pre ktoré URL beží middleware. :path* matchuje akúkoľvek podstiahku. Používaj len pre chránené cesty — middleware na každej route spomaľuje.

**Edge vs Node:** Middleware beží na Edge runtime — rýchlejší, ale má obmedzenia (nie všetky Node.js API dostupné).`,
            xp: 10,
          },
        ],
      },
    ],
  },
  {
    id: 'git-deploy',
    title: 'Git & Deployment',
    description: 'GitHub, Vercel, GitHub Actions, CI/CD',
    icon: 'git-branch',
    lessons: [
      {
        id: 'git-basics',
        unitId: 'git-deploy',
        title: 'Git workflow',
        exercises: [
          {
            id: 'git-1', type: 'explain', conceptId: 'git-workflow',
            prompt: 'Git — od zmeny po produkciu',
            codeSnippet: `# Základný workflow:\ngit status              # čo sa zmenilo?\ngit add src/components/ # pridaj konkrétne súbory\ngit commit -m "feat: pridaj komponent EventCard"\ngit push origin main    # pošli na GitHub\n\n# Vetvy (branches):\ngit checkout -b feature/login  # vytvor novú vetvu\n# ... pracuješ ...\ngit checkout main              # prepni na main\ngit merge feature/login        # zlúč\n\n# Keď si niečo pokazil:\ngit restore súbor.ts           # zahoď zmeny v súbore\ngit reset HEAD~1               # vráť posledný commit (zmeny ostanú)`,
            explanation: `**Čo je Git?** Distribuovaný systém na správu verzií. Každý commit = snapshot celého projektu v danom momente.

**Prečo vetvy?** Main/master = stabilný kód. Feature branches = experimentuješ bez rizika. Merge = zlúč keď si hotový.

**Konvencia commit správ:** feat: (nová funkcia), fix: (oprava bugu), chore: (konfigurácia), docs: (dokumentácia). Pomáha tímu a generovaniu changelog.

**git add konkrétne súbory:** Nikdy git add . slepó! Môžeš náhodou commitnúť .env s tajnými kľúčmi. Vždy git status pred add.`,
            xp: 10,
          },
          {
            id: 'git-2', type: 'mcq', conceptId: 'git-workflow',
            prompt: 'Prečo je nebezpečné používať "git add ." naslepo?',
            options: [
              'Je to pomalé',
              'Môžeš accidentálne commitnúť .env súbory s API kľúčmi',
              'Git to neodporúča',
              'Nefunguje na Windows',
            ],
            correctAnswer: 'Môžeš accidentálne commitnúť .env súbory s API kľúčmi',
            xp: 10,
          },
        ],
      },
      {
        id: 'github-actions',
        unitId: 'git-deploy',
        title: 'GitHub Actions',
        exercises: [
          {
            id: 'ga-1', type: 'explain', conceptId: 'github-actions',
            prompt: 'GitHub Actions — automatizácia pri každom pushe',
            codeSnippet: `# .github/workflows/scraper.yml\nname: Scraper\n\non:\n  schedule:\n    - cron: '0 8,13,17 * * *'  # 3x denne\n  workflow_dispatch:            # manuálne spustenie\n\njobs:\n  run:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: { python-version: '3.12' }\n      - run: pip install -r requirements.txt\n      - run: python scraper.py\n        env:\n          SUPABASE_URL: \${{ secrets.SUPABASE_URL }}\n          SUPABASE_KEY: \${{ secrets.SUPABASE_KEY }}`,
            explanation: `**Čo je to?** GitHub Actions = CI/CD priamo v GitHube. YAML súbory v .github/workflows/ definujú automatizované úlohy.

**on: schedule:** Cron syntax: "0 8 * * *" = každý deň o 8:00 UTC. Prvé číslo = minúty, druhé = hodiny.

**secrets:** API kľúče nikdy priamo v YAML! Uložíš ich v GitHub Settings → Secrets a referencuješ ako \${{ secrets.MENO }}.

**workflow_dispatch:** Tlačidlo na manuálne spustenie v GitHub UI — super na testovanie.

**runs-on: ubuntu-latest:** Virtuálny stroj kde beží tvoj kód. Free tier má limit minút za mesiac.`,
            xp: 10,
          },
        ],
      },
    ],
  },
  {
    id: 'typescript-advanced',
    title: 'TypeScript',
    description: 'Generics, utility types, type guards, enums',
    icon: 'code',
    lessons: [
      {
        id: 'ts-generics',
        unitId: 'typescript-advanced',
        title: 'Generics a Utility Types',
        exercises: [
          {
            id: 'ts-1', type: 'explain', conceptId: 'ts-generics',
            prompt: 'Generics — funkcie a typy pre ľubovoľný typ',
            codeSnippet: `// Generic funkcia — funguje pre akýkoľvek typ:\nfunction prvyPrvok<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\n\nconst cislo = prvyPrvok([1, 2, 3]);   // typ: number\nconst meno = prvyPrvok(['Zuzka', 'Byte']); // typ: string\n\n// Generic interface:\ninterface ApiResponse<T> {\n  data: T;\n  error: string | null;\n  count: number;\n}\n\n// Utility types:\ntype PartialUser = Partial<User>;    // všetky vlastnosti optional\ntype ReadonlyUser = Readonly<User>;  // všetky readonly\ntype UserKeys = keyof User;          // union všetkých kľúčov`,
            explanation: `**Čo sú Generics?** Typ "parameter" — napíšeš funkciu/interface raz, funguje pre ľubovoľný typ. TypeScript odvodí typ automaticky z použitia.

**Prečo existujú?** Bez generics by si musel písať prvyPrvokCisel, prvyPrvokStringov... S generics stačí jedna funkcia.

**Utility types — zabudované v TS:**
- Partial<T> → všetky vlastnosti optional (ideálne pre update operácie)
- Required<T> → všetky povinné
- Pick<T, 'a'|'b'> → vyber len niektoré
- Omit<T, 'password'> → vynechaj niektoré
- Record<K, V> → objekt kde kľúče sú K a hodnoty V`,
            xp: 10,
          },
          {
            id: 'ts-2', type: 'mcq', conceptId: 'ts-generics',
            prompt: 'Čo robí Partial<User>?',
            options: [
              'Vymaže polovicu vlastností',
              'Spraví všetky vlastnosti User optional (?)',
              'Sprístupní len public vlastnosti',
              'Skopíruje typ User',
            ],
            correctAnswer: 'Spraví všetky vlastnosti User optional (?)',
            explanation: 'Partial<T> je ekvivalent User kde každá vlastnosť má ?. Ideálne pre update endpointy kde posielaš len zmenené polia.',
            xp: 10,
          },
        ],
      },
    ],
  },
  {
    id: 'state-management',
    title: 'State Management',
    description: 'Zustand, Context API, optimalizácia',
    icon: 'layers',
    lessons: [
      {
        id: 'zustand-advanced',
        unitId: 'state-management',
        title: 'Zustand — pokročilé patterny',
        exercises: [
          {
            id: 'zu-1', type: 'explain', conceptId: 'zustand-patterns',
            prompt: 'Zustand middleware: persist a devtools',
            codeSnippet: `import { create } from 'zustand';\nimport { persist, devtools } from 'zustand/middleware';\n\nconst useStore = create<State & Actions>()(\n  devtools(\n    persist(\n      (set, get) => ({\n        count: 0,\n        inc: () => set(s => ({ count: s.count + 1 })),\n      }),\n      {\n        name: 'moja-app-v1',  // kľúč v localStorage\n        partialize: (s) => ({ count: s.count }),  // čo ukladať\n      }\n    ),\n    { name: 'MojaApp Store' }  // meno v DevTools\n  )\n);`,
            explanation: `**persist middleware:** Automaticky ukladá definované časti state do localStorage (alebo sessionStorage, AsyncStorage v RN). partialize = vyber len čo ukladáš (nie funkcie!).

**partialize prečo?** Funkcie sa nedajú serializovať do JSON. Vždy vynechaj akcie — ukladaj len dáta.

**devtools:** Prepojí Zustand so Zustand DevTools alebo Redux DevTools rozšírením v Chrome. Vidíš každú akciu a zmenu state.

**versioning:** Keď zmeníš štruktúru state, zmeň kľúč persist (napr. 'app-v2'). Inak stará uložená verzia spôsobí problémy.`,
            xp: 10,
          },
          {
            id: 'zu-2', type: 'mcq', conceptId: 'zustand-patterns',
            prompt: 'Prečo v partialize vynecháš akcie (funkcie)?',
            options: [
              'Akcie sú automaticky uložené',
              'Funkcie sa nedajú serializovať do JSON — localStorage ukladá JSON',
              'Akcie sú zbytočné ukladať',
              'Zustand to zakazuje',
            ],
            correctAnswer: 'Funkcie sa nedajú serializovať do JSON — localStorage ukladá JSON',
            xp: 10,
          },
        ],
      },
    ],
  },
  {
    id: 'push-notifications',
    title: 'Push Notifikácie',
    description: 'Expo Notifications, tokeny, scheduling',
    icon: 'bell',
    lessons: [
      {
        id: 'expo-notif',
        unitId: 'push-notifications',
        title: 'Expo Push Notifications',
        exercises: [
          {
            id: 'notif-1', type: 'explain', conceptId: 'expo-push',
            prompt: 'Push notifikácie — od tokenu po odoslanie',
            codeSnippet: `// 1. Získaj push token zariadenia:\nconst { data: token } = await Notifications.getExpoPushTokenAsync();\n// Ulož token do Supabase: { user_id, push_token: token }\n\n// 2. Nastav handlery:\nNotifications.setNotificationHandler({\n  handleNotification: async () => ({\n    shouldShowAlert: true,\n    shouldPlaySound: true,\n    shouldSetBadge: false,\n  }),\n});\n\n// 3. Odošli cez Expo Push API (server):\nawait fetch('https://exp.host/--/api/v2/push/send', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({\n    to: token,\n    title: 'Nová správa',\n    body: 'Máš nový event v Woeva!',\n    data: { eventId: '123' },\n  }),\n});`,
            explanation: `**Čo je to?** Push notifikácie doručia správu na telefón aj keď je app zatvorená. Expo abstrauje iOS APNs a Android FCM do jedného API.

**Expo Push Token:** Unikátny identifikátor zariadenia pre push notifikácie. Musíš ho získať od používateľa (potrebuje povolenie) a uložiť na server.

**Prečo server?** Notifikácie sa neposielajú priamo z klienta — musíš ich poslať zo servera. Expo Push API je relay — prijme tvoje notifikácie a rozošle na APNs/FCM.

**data payload:** Ľubovoľné dáta, ktoré dostaneš v handler keď používateľ klikne na notifikáciu. Použi na navigáciu na správny screen.`,
            xp: 10,
          },
        ],
      },
    ],
  },
  {
    id: 'maps-location',
    title: 'Mapy & Lokácia',
    description: 'MapLibre, react-native-maps, GPS, geolokácia',
    icon: 'map-pin',
    lessons: [
      {
        id: 'maps-basics',
        unitId: 'maps-location',
        title: 'Mapový view a lokácia',
        exercises: [
          {
            id: 'map-1', type: 'explain', conceptId: 'maps-rn',
            prompt: 'Mapy v React Native — react-native-maps',
            codeSnippet: `import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';\nimport * as Location from 'expo-location';\n\n// Získaj povolenie a polohu:\nconst { status } = await Location.requestForegroundPermissionsAsync();\nif (status !== 'granted') return;\nconst loc = await Location.getCurrentPositionAsync({});\n\n// Mapa s markermi:\n<MapView\n  provider={PROVIDER_DEFAULT}\n  style={{ flex: 1 }}\n  initialRegion={{\n    latitude: loc.coords.latitude,\n    longitude: loc.coords.longitude,\n    latitudeDelta: 0.05,\n    longitudeDelta: 0.05,\n  }}\n>\n  {events.map(e => (\n    <Marker\n      key={e.id}\n      coordinate={{ latitude: e.lat, longitude: e.lng }}\n      title={e.title}\n      onPress={() => router.push(\`/event/\${e.id}\`)}\n    />\n  ))}\n</MapView>`,
            explanation: `**Čo je to?** react-native-maps je wrapper okolo natívnych map (Apple Maps na iOS, Google Maps na Android s PROVIDER_GOOGLE).

**latitudeDelta / longitudeDelta:** Zoom level — čím menšie číslo, tým viac priblížené. 0.01 = vidíš okolie ~1km, 0.05 = ~5km.

**PROVIDER_DEFAULT:** Použije Apple Maps na iOS bez Google Maps API kľúča. Ak chceš Google Maps všade, potrebuješ PROVIDER_GOOGLE + API key.

**expo-location:** Spravuje povolenia a GPS. Vždy requestni povolenie pred použitím. foreground = keď je app otvorená, background = aj keď beží na pozadí (iné povolenie).`,
            xp: 10,
          },
        ],
      },
    ],
  },
  {
    id: 'storage-files',
    title: 'Storage & Súbory',
    description: 'Supabase Storage, upload obrázkov, file management',
    icon: 'hard-drive',
    lessons: [
      {
        id: 'storage-upload',
        unitId: 'storage-files',
        title: 'Upload súborov do Supabase Storage',
        exercises: [
          {
            id: 'stor-1', type: 'explain', conceptId: 'supabase-storage',
            prompt: 'Supabase Storage — upload a public URL',
            codeSnippet: `// Upload obrázka:\nasync function uploadObrazok(file: File, userId: string) {\n  const ext = file.name.split('.').pop();\n  const path = \`\${userId}/\${Date.now()}.\${ext}\`;\n\n  const { error } = await supabase.storage\n    .from('avatars')  // bucket\n    .upload(path, file, {\n      upsert: true,   // prepíše ak existuje\n      contentType: file.type,\n    });\n\n  if (error) throw error;\n\n  // Získaj public URL:\n  const { data } = supabase.storage\n    .from('avatars')\n    .getPublicUrl(path);\n\n  return data.publicUrl;\n}`,
            explanation: `**Čo je to?** Supabase Storage je file hosting — obrázky, PDF, videá. Za scénou používa S3-compatible storage s Supabase polítikami.

**Bucket:** Kontajner pre súbory. Public bucket = každý môže čítať (ideálne pre obrázky). Private bucket = prístup len cez signed URLs alebo autentifikovaný.

**path konvencia:** userId/timestamp.ext zabraňuje kolíziám. Neukladaj pôvodný názov súboru od používateľa — môže obsahovať špeciálne znaky alebo byť zámerný útoky.

**upsert: true:** Prepíše existujúci súbor na tej istej ceste. Bez toho dostaneš chybu ak path existuje.`,
            xp: 10,
          },
        ],
      },
    ],
  },
  {
    id: 'animations-ui',
    title: 'Animácie & UI',
    description: 'Framer Motion, React Native Reanimated, gestá',
    icon: 'sparkles',
    lessons: [
      {
        id: 'framer-basics',
        unitId: 'animations-ui',
        title: 'Framer Motion — animácie v React',
        exercises: [
          {
            id: 'fm-1', type: 'explain', conceptId: 'framer-motion',
            prompt: 'Framer Motion — deklaratívne animácie',
            codeSnippet: `import { motion, AnimatePresence } from 'framer-motion';\n\n// Základná animácia:\n<motion.div\n  initial={{ opacity: 0, y: 20 }}  // počiatočný stav\n  animate={{ opacity: 1, y: 0 }}   // cieľový stav\n  exit={{ opacity: 0, scale: 0.9 }} // pri unmount\n  transition={{ duration: 0.3, ease: 'easeOut' }}\n>\n  Obsah\n</motion.div>\n\n// AnimatePresence pre conditional rendering:\n<AnimatePresence mode="wait">\n  {isVisible && (\n    <motion.div key="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>\n      Modal\n    </motion.div>\n  )}\n</AnimatePresence>`,
            explanation: `**Čo je to?** Framer Motion je React knižnica na animácie — opisuješ čo chceš, nie ako to dosiahnuť.

**initial / animate / exit:** Tri kľúčové stavy. initial = pred animáciou, animate = výsledok, exit = animácia pred odstránením z DOM.

**AnimatePresence prečo?** React normálne component okamžite unmountuje — exit animácia nestihne prebehnúť. AnimatePresence "drží" component nažive kým exit nedokonči.

**mode="wait":** Počká na exit animáciu predtým ako začne enter animácia. Ideálne pre page transitions a modaly.`,
            xp: 10,
          },
          {
            id: 'fm-2', type: 'mcq', conceptId: 'framer-motion',
            prompt: 'Prečo treba AnimatePresence pre exit animácie?',
            options: [
              'Je to len štýlová záležitosť',
              'React okamžite unmountuje component — AnimatePresence ho drží nažive kým exit dokonší',
              'exit prop nefunguje bez neho',
              'Zabraňuje memory leaks',
            ],
            correctAnswer: 'React okamžite unmountuje component — AnimatePresence ho drží nažive kým exit dokonší',
            xp: 10,
          },
        ],
      },
    ],
  },
];

export function getTopicById(id: string): ProjectTopic | undefined {
  return projectTopics.find(t => t.id === id);
}
