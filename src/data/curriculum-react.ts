import { Module } from '@/types';

export const reactModule: Module = {
  id: 'react',
  title: 'React & Next.js',
  description: 'Stavaj moderné webové aplikácie',
  units: [
    {
      id: 'react-basics', moduleId: 'react', title: 'React Základy', description: 'Komponenty, JSX, props',
      lessons: [
        {
          id: 'react-components', unitId: 'react-basics', title: 'Komponenty a JSX',
          exercises: [
            { id: 'e1', type: 'explain', conceptId: 'jsx', prompt: 'Čo je JSX a prečo existuje?',
              codeSnippet: `// JSX - HTML-like syntax v JavaScripte:\nfunction Pozdrav({ meno }: { meno: string }) {\n  return (\n    <div className="card">\n      <h1>Ahoj, {meno}!</h1>\n      <p>Vitaj v React.</p>\n    </div>\n  );\n}\n\n// Použiješ ho ako HTML element:\n<Pozdrav meno="Zuzka" />`,
              explanation: `**Čo je to?** JSX je syntaktická nadstavba JavaScriptu, ktorá vyzerá ako HTML, ale je to JS.

**Prečo existuje?** Pred Reactom si musel UI popisovať cez zložité volania funkcií: React.createElement("div", null, React.createElement("h1"...)). JSX to robí čitateľným.

**Ako funguje?** Babel preloží JSX na bežný JavaScript pred spustením. <div> sa stane React.createElement("div"). Premenné vkladáš do {} zátvoriek.

**Dôležité:** className namiesto class (class je rezervované slovo v JS). Každý JSX musí mať jeden root element (alebo <> fragment <>).`, xp: 5 },
            { id: 'e2', type: 'mcq', conceptId: 'jsx', prompt: 'Prečo sa v JSX používa className namiesto class?',
              options: ['Pretože to tak chcel Facebook', 'class je rezervované slovo v JavaScript', 'Je to rýchlejšie', 'CSS nevie pracovať s class v JS'],
              correctAnswer: 'class je rezervované slovo v JavaScript', explanation: 'class v JS definuje triedu (class MyComponent {}). Preto React používa className pre CSS triedu.', xp: 10 },
            { id: 'e3', type: 'fill', conceptId: 'props', prompt: 'Doplň syntax pre props - vkladanie premennej do JSX:',
              codeSnippet: '<h1>Ahoj, ___meno___!</h1>',
              blanks: [{ id: 'b1', options: ['{', '$(', '<%=', '#'], correct: '{' }, { id: 'b2', options: ['}', ')', '%>', '}'], correct: '}' }], xp: 15 },
            { id: 'e4', type: 'mcq', conceptId: 'components', prompt: 'Čo sú props v Reacte?',
              options: ['CSS vlastnosti', 'Vstupné parametre komponentu - dáta ktoré mu posielam z rodiča', 'Interný stav', 'Event handlery'],
              correctAnswer: 'Vstupné parametre komponentu - dáta ktoré mu posielam z rodiča', xp: 10 },
          ],
        },
        {
          id: 'react-rendering', unitId: 'react-basics', title: 'Podmienené renderovanie',
          exercises: [
            { id: 'e1', type: 'explain', conceptId: 'conditional-rendering', prompt: 'Kedy zobraziť čo - podmienené renderovanie',
              codeSnippet: `function Profil({ uzivatel, nacitava }) {\n  // Krátke vyhodnotenie (&&):\n  if (nacitava) return <Spinner />;\n\n  return (\n    <div>\n      <h1>{uzivatel.name}</h1>\n\n      {/* && - zobraz len ak je true */}\n      {uzivatel.isPremium && <Badge text="Premium" />}\n\n      {/* Ternárny operátor: */}\n      {uzivatel.online\n        ? <span>Online</span>\n        : <span>Offline</span>\n      }\n    </div>\n  );\n}`,
              explanation: `**Čo je to?** Schopnosť zobraziť rôzne UI podľa podmienky - ak je načítanie, zobraz spinner. Ak je admin, zobraz extra tlačidlá.

**Tri spôsoby:**
1. **if/return** - pre celý komponent (loading state)
2. **&& (short-circuit)** - zobraz element len ak je podmienka true. Ak je false, React nič nevykreslí
3. **Ternárny ? :** - ak/inak inline v JSX

**Prečo nie if v JSX?** JSX je výraz, nie príkaz. if nie je výraz v JS, takže nejde priamo do {}. Preto používame && a ternárny operátor.`, xp: 5 },
            { id: 'e2', type: 'mcq', conceptId: 'conditional-rendering', prompt: 'Čo zobrazí: {false && <Button />}?',
              options: ['Button', 'false', 'Nič - React ignoruje false', 'Chyba'], correctAnswer: 'Nič - React ignoruje false', xp: 10 },
            { id: 'e3', type: 'mcq', conceptId: 'conditional-rendering', prompt: 'Čo zobrazí: {0 && <Button />}?',
              options: ['Nič', 'Button', '"0"', 'Číslo 0 - toto je bug!'], correctAnswer: 'Číslo 0 - toto je bug!',
              explanation: 'React renderuje 0! Vždy konvertuj na boolean: {items.length > 0 && <List/>} alebo {!!items.length && <List/>}. Časté chyba!', xp: 15 },
          ],
        },
      ],
    },
    {
      id: 'react-hooks', moduleId: 'react', title: 'React Hooks', description: 'useState, useEffect, useCallback',
      lessons: [
        {
          id: 'hook-usestate', unitId: 'react-hooks', title: 'useState - lokálny stav',
          exercises: [
            { id: 'e1', type: 'explain', conceptId: 'useState', prompt: 'useState - prečo a ako?',
              codeSnippet: `import { useState } from 'react';\n\nfunction Pocitadlo() {\n  // [hodnota, funkcia-na-zmenu] = useState(počiatočná)\n  const [count, setCount] = useState(0);\n  const [meno, setMeno] = useState("");\n\n  return (\n    <div>\n      <p>Kliknutí: {count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        +1\n      </button>\n      <button onClick={() => setCount(prev => prev + 1)}>\n        +1 (bezpečnejšie)\n      </button>\n    </div>\n  );\n}`,
              explanation: `**Prečo useState?** Normálna premenná const x = 0 sa nemení - keď ju zmeníš, React to nevie a nevykreslí nové UI. useState oznamuje Reactu "zmenilo sa niečo, prekreslí prosím".

**Ako funguje?** useState vracia dvojicu [aktuálna hodnota, setter funkcia]. Keď zavoláš setter, React re-renderuje komponent s novou hodnotou.

**Prečo prev => prev + 1?** Ak zavoláš setCount(count + 1) rýchlo dvakrát, môžeš dostať starú hodnotu. Funkčný update (prev => prev + 1) vždy pracuje s najaktuálnejšou hodnotou.

**Dôležité:** Nikdy nemeň state priamo (count = count + 1)! Vždy cez setter.`, xp: 5 },
            { id: 'e2', type: 'mcq', conceptId: 'useState', prompt: 'Čo sa stane keď zavoláš setState()?',
              options: ['Stránka sa znovu načíta', 'Komponent sa re-renderuje s novou hodnotou', 'Nič viditeľné', 'Uloží sa do localStorage'],
              correctAnswer: 'Komponent sa re-renderuje s novou hodnotou', xp: 10 },
            { id: 'e3', type: 'fill', conceptId: 'useState', prompt: 'Doplň useState hook:',
              codeSnippet: 'const [loading, setLoading] = ___(false);',
              blanks: [{ id: 'b1', options: ['useState', 'useRef', 'useEffect', 'useReducer'], correct: 'useState' }], xp: 15 },
            { id: 'e4', type: 'mcq', conceptId: 'controlled-components', prompt: 'Čo je controlled component?',
              options: ['Komponent bez stavu', 'Input kde value je riadený React state-om (value={email} + onChange)', 'Komponent s iba jedným props', 'Komponent bez event handlerov'],
              correctAnswer: 'Input kde value je riadený React state-om (value={email} + onChange)', explanation: 'Controlled: React vlastní hodnotu. Uncontrolled: DOM vlastní hodnotu (ref). Controlled sú predvídateľnejšie.', xp: 10 },
          ],
        },
        {
          id: 'hook-useeffect', unitId: 'react-hooks', title: 'useEffect - vedľajšie efekty',
          exercises: [
            { id: 'e1', type: 'explain', conceptId: 'useEffect', prompt: 'useEffect - čo sa spustí po vykreslení',
              codeSnippet: `useEffect(() => {\n  // Spustí sa PO každom renderi\n  document.title = \`Strana: \${page}\`;\n}, [page]);  // len keď sa zmení page\n\n// Prázdne [] = len raz (mount):\nuseEffect(() => {\n  fetchUser();\n}, []);\n\n// Cleanup - upratanie:\nuseEffect(() => {\n  const timer = setInterval(tick, 1000);\n  return () => clearInterval(timer);  // cleanup\n}, []);`,
              explanation: `**Prečo useEffect?** React renderuje UI - ale čo so "side effects"? Načítanie dát, subscripcie, timery, zmena document.title - to nie je renderovanie. useEffect je miesto kde tieto veci patria.

**Dependency array:**
- **[page]** - spusti znova keď sa zmení page
- **[]** - spusti len raz (pri mount) - ideálne na fetch dát
- **nič** - spusti po každom renderi (zriedkavé, opatrne)

**Cleanup:** Return funkcia z useEffect sa zavolá pred ďalším spustením a pri unmount. Zabraňuje memory leaks (nekončiace timery, subscripcie).`, xp: 5 },
            { id: 'e2', type: 'mcq', conceptId: 'useEffect', prompt: 'Kedy sa spustí useEffect s prázdnym []?',
              options: ['Pri každom renderi', 'Len raz po prvom vykreslení (mount)', 'Nikdy', 'Každú sekundu'],
              correctAnswer: 'Len raz po prvom vykreslení (mount)', xp: 10 },
            { id: 'e3', type: 'mcq', conceptId: 'useEffect', prompt: 'Čo robí return funkcia z useEffect?',
              options: ['Vracia data z fetchu', 'Je to cleanup - spustí sa pred ďalším efektom alebo pri unmount', 'Nič - je ignorovaná', 'Re-renderuje komponent'],
              correctAnswer: 'Je to cleanup - spustí sa pred ďalším efektom alebo pri unmount', xp: 10 },
          ],
        },
        {
          id: 'hook-usecallback', unitId: 'react-hooks', title: 'useCallback a useRef',
          exercises: [
            { id: 'e1', type: 'explain', conceptId: 'useCallback', prompt: 'useCallback - memoraj funkciu',
              codeSnippet: `// Bez useCallback - nová funkcia pri každom renderi:\nconst handlePress = () => fetchData();\n\n// S useCallback - rovnaká funkcia ak deps nezmenili:\nconst handlePress = useCallback(() => {\n  fetchData();\n}, [userId]);  // znova len keď userId sa zmení\n\n// useRef - hodnota bez re-renderu:\nconst inputRef = useRef<HTMLInputElement>(null);\n// inputRef.current.focus();\n\nconst pocitadloRef = useRef(0);\npocitadloRef.current += 1;  // nezpôsobí re-render`,
              explanation: `**useCallback prečo?** Každý re-render vytvorí novú inštanciu funkcie. Keď túto funkciu posielaš ako prop do child komponentu, child sa zbytočne re-renderuje. useCallback zaručí, že funkcia je stále tá istá (pokiaľ sa nezmenili deps).

**useRef prečo?** Niekedy potrebuješ hodnotu, ktorá pretrváva medzi rendermi, ale jej zmena NEspôsobuje re-render. Napr. referencia na DOM element, timer ID, počítadlo renderov.

**Rozdiel ref vs state:** State zmena → re-render. Ref zmena → žiadny re-render.`, xp: 5 },
            { id: 'e2', type: 'mcq', conceptId: 'useCallback', prompt: 'Kedy použiješ useCallback?',
              options: ['Vždy - je to rýchlejšie', 'Keď posielaš funkciu ako prop do memo komponentu alebo do deps iného hooky', 'Keď potrebuješ async funkciu', 'Namiesto useEffect'],
              correctAnswer: 'Keď posielaš funkciu ako prop do memo komponentu alebo do deps iného hooky', xp: 10 },
          ],
        },
      ],
    },
    {
      id: 'nextjs', moduleId: 'react', title: 'Next.js App Router', description: 'Server/client, routing, API', isCheckpoint: true,
      lessons: [
        {
          id: 'nextjs-routing', unitId: 'nextjs', title: 'File-based routing',
          exercises: [
            { id: 'e1', type: 'explain', conceptId: 'nextjs-routing', prompt: 'Ako funguje routing v Next.js',
              codeSnippet: `// Súborová štruktúra = URL:\napp/\n  page.tsx          → /\n  about/\n    page.tsx        → /about\n  event/\n    [id]/\n      page.tsx      → /event/abc123\n  api/\n    users/\n      route.ts      → POST /api/users\n\n// Dynamický parameter:\nexport default function EventPage({ params }) {\n  const { id } = params;  // z URL /event/abc123\n}`,
              explanation: `**Čo je to?** Next.js App Router používa súborovú štruktúru ako navigáciu. Každý priečinok = segment URL. page.tsx = obsah stránky.

**[id] - dynamické segmenty:** Hranaté zátvork vytvárajú "placeholder" pre ľubovoľnú hodnotu. /event/abc, /event/xyz - obe vedú na rovnakú page.tsx ale s rôznym id.

**route.ts - API endpoint:** Exportuj funkcie GET, POST, DELETE... a Next.js ich vystaví ako HTTP API.

**Prečo file-based?** Žiadna konfigurácia routera. Súborová štruktúra je dokumentácia. Ľahko vidíš všetky stránky.`, xp: 5 },
            { id: 'e2', type: 'mcq', conceptId: 'dynamic-routes', prompt: 'Čo robí [id] v názve priečinka v Next.js?',
              options: ['Vytvorí statickú stránku s menom id', 'Dynamický parameter - /event/cokolwiek zachytí do params.id', 'Označí privátny priečinok', 'Spustí API'],
              correctAnswer: 'Dynamický parameter - /event/cokolwiek zachytí do params.id', xp: 10 },
          ],
        },
        {
          id: 'nextjs-server-client', unitId: 'nextjs', title: "Server vs Client komponenty",
          exercises: [
            { id: 'e1', type: 'explain', conceptId: 'server-client', prompt: "'use client' - kedy a prečo?",
              codeSnippet: `// Server komponent (default) - beží na serveri:\n// - žiadny state, žiadne event handlery\n// - môže čítať DB priamo\n// - rýchlejší prvý load\nasync function UserList() {\n  const users = await db.getUsers();  // priamo!\n  return <ul>{users.map(u => <li>{u.name}</li>)}</ul>;\n}\n\n// Client komponent - beží v browseri:\n'use client';\nimport { useState } from 'react';\nfunction SearchBar() {\n  const [query, setQuery] = useState("");\n  return <input onChange={e => setQuery(e.target.value)} />;\n}`,
              explanation: `**Prečo existujú dva typy?** Next.js 13+ môže spúšťať komponenty na serveri - bez JS bundle pre browser, rýchlejší load.

**Server komponent (default):**
- Môže byť async - priamo fetchuje dáta
- Nemôže mať useState, useEffect, event handlery
- Nie je v JS bundle - rýchlejší

**Client komponent ('use client'):**
- Beží v browseri
- Môže mať state, efekty, event handlery
- Je poslaný do browsera - väčší bundle

**Pravidlo:** Defaults to server. Pridaj 'use client' len keď potrebuješ interaktivitu.`, xp: 5 },
            { id: 'e2', type: 'mcq', conceptId: 'use-client', prompt: "Kedy MUSÍŠ pridať 'use client'?",
              options: ['Vždy na každý komponent', 'Keď komponent používa useState, useEffect alebo event handlery', 'Keď fetchuješ dáta', 'Nikdy - je to automatické'],
              correctAnswer: 'Keď komponent používa useState, useEffect alebo event handlery', xp: 10 },
          ],
        },
      ],
    },
    {
      id: 'supabase-deep', moduleId: 'react', title: 'Supabase', description: 'Databáza, auth, real-time',
      lessons: [
        {
          id: 'supabase-queries', unitId: 'supabase-deep', title: 'Supabase queries',
          exercises: [
            { id: 'e1', type: 'explain', conceptId: 'supabase', prompt: 'Supabase - tvoja databáza v JS',
              codeSnippet: `// SELECT:\nconst { data, error } = await supabase\n  .from('events')\n  .select('id, title, date')\n  .eq('city', 'Bratislava')\n  .order('date', { ascending: true })\n  .limit(10);\n\n// SELECT s joinom (cudzia tabuľka):\nconst { data } = await supabase\n  .from('attendees')\n  .select('id, profile:profiles(name, avatar_url)');\n\n// INSERT:\nawait supabase.from('events').insert({ title: 'Párty', city: 'BA' });\n\n// UPSERT (insert alebo update):\nawait supabase.from('user_state')\n  .upsert({ user_id: id, xp: 100 });`,
              explanation: `**Čo je Supabase?** Open-source Firebase alternatíva. PostgreSQL databáza + auth + storage + real-time - všetko cez jednoduché JS API.

**.from().select():** Vyberie tabuľku a stĺpce. Môžeš pisať meno cudzej tabuľky v select a Supabase ju automaticky joinuje.

**.eq():** WHERE v SQL. Existujú aj .gt() (greater than), .lt(), .like(), .in().

**upsert:** Geniálne - ak riadok existuje (podľa primary key), aktualizuje ho. Ak nie, vloží nový. Ideálne pre user_state.

**{ data, error }:** Supabase vždy vracia objekt s data a error. Vždy skontroluj error!`, xp: 5 },
            { id: 'e2', type: 'mcq', conceptId: 'supabase', prompt: 'Čo robí .maybeSingle()?',
              options: ['Vráti pole s jedným prvkom', 'Vráti null namiesto chyby keď nič nie je nájdené', 'Hodí error pri viacerých výsledkoch', 'Limituje na 1 výsledok'],
              correctAnswer: 'Vráti null namiesto chyby keď nič nie je nájdené', xp: 10 },
            { id: 'e3', type: 'mcq', conceptId: 'rls', prompt: 'Čo je Row Level Security (RLS)?',
              options: ['Šifrovanie dát', 'Databázové pravidlá - kto môže čítať/písať každý riadok', 'Zálohovanie', 'Indexovanie'],
              correctAnswer: 'Databázové pravidlá - kto môže čítať/písať každý riadok',
              explanation: 'RLS = bezpečnosť priamo v databáze. Aj keby niekto ukradol anon key, nemôže vidieť cudzie dáta. Políčka definuješ v Supabase dashboarde.', xp: 10 },
          ],
        },
      ],
    },
  ],
};
