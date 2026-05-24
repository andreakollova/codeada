import { Module } from '@/types';

export const curriculum: Module[] = [
  {
    id: 'python-basics',
    title: 'Python Základy',
    description: 'Nauč sa základy programovania od nuly',


    units: [
      {
        id: 'variables',
        moduleId: 'python-basics',
        title: 'Premenné a typy',
        description: 'Ako ukladať a pracovať s dátami',

        lessons: [
          {
            id: 'what-is-variable',
            unitId: 'variables',
            title: 'Čo je premenná?',

            exercises: [
              {
                id: 'explain-var-1',
                type: 'explain',
                conceptId: 'variable-intro',
                prompt: 'Čo je premenná?',
                codeSnippet: `meno = "Zuzka"\nvek = 18\nprint(meno)  # Zuzka`,
                explanation: 'Premenná je ako škatuľa s nálepkou. Dáš do nej hodnotu a neskôr ju podľa nálepky nájdeš. V Pythone ju vytvoríš jednoducho: napíšeš názov, = a hodnotu.',
                xp: 5,
              },
              {
                id: 'mcq-var-1',
                type: 'mcq',
                conceptId: 'variable-intro',
                prompt: 'Ako vytvoríš premennú v Pythone?',
                options: ['var meno = "Zuzka"', 'meno = "Zuzka"', 'let meno = "Zuzka"', 'string meno = "Zuzka"'],
                correctAnswer: 'meno = "Zuzka"',
                explanation: 'Python nepotrebuje kľúčové slovo ako var alebo let. Stačí napísať názov a priradiť hodnotu cez =.',
                xp: 10,
              },
              {
                id: 'mcq-var-2',
                type: 'mcq',
                conceptId: 'variable-intro',
                prompt: 'Čo vypíše tento kód?\n\nx = 5\nx = 10\nprint(x)',
                options: ['5', '10', '5 10', 'chyba'],
                correctAnswer: '10',
                explanation: 'Premenná x sa najprv rovná 5, potom sa prepíše na 10. print(x) vypíše aktuálnu hodnotu — teda 10.',
                xp: 10,
              },
              {
                id: 'fill-var-1',
                type: 'fill',
                conceptId: 'variable-intro',
                prompt: 'Doplň kód tak, aby premenná mesto obsahovala hodnotu "Bratislava":',
                codeSnippet: '___ = "Bratislava"',
                blanks: [{ id: 'b1', options: ['var', 'mesto', 'string', 'let'], correct: 'mesto' }],
                xp: 15,
              },
              {
                id: 'write-var-1',
                type: 'write',
                conceptId: 'variable-intro',
                prompt: 'Vytvor premennú meno s hodnotou svojho mena a vypíš ju pomocou print().',
                codeSnippet: '# Napíš kód tu\n',
                testCases: [
                  { input: '', expected: 'contains:print', description: 'Kód obsahuje print()' },
                ],
                xp: 20,
              },
            ],
          },
          {
            id: 'data-types',
            unitId: 'variables',
            title: 'Typy dát',

            exercises: [
              {
                id: 'explain-types-1',
                type: 'explain',
                conceptId: 'data-types',
                prompt: 'Typy dát v Pythone',
                codeSnippet: `cislo = 42          # int (celé číslo)\ndesatinne = 3.14    # float (desatinné)\ntexT = "Ahoj"       # str (text)\npravda = True       # bool (pravda/nepravda)`,
                explanation: 'Každá hodnota v Pythone má typ. Python ho uhádne sám — nemusíš ho písať. Celé čísla sú int, desatinné float, text str (string) a pravda/nepravda bool.',
                xp: 5,
              },
              {
                id: 'mcq-types-1',
                type: 'mcq',
                conceptId: 'data-types',
                prompt: 'Aký typ má hodnota 3.14?',
                options: ['int', 'float', 'str', 'bool'],
                correctAnswer: 'float',
                xp: 10,
              },
              {
                id: 'mcq-types-2',
                type: 'mcq',
                conceptId: 'data-types',
                prompt: 'Aký typ má hodnota True?',
                options: ['int', 'str', 'bool', 'float'],
                correctAnswer: 'bool',
                explanation: 'bool môže byť True alebo False. Používa sa napríklad pri podmienkach.',
                xp: 10,
              },
              {
                id: 'fill-types-1',
                type: 'fill',
                conceptId: 'data-types',
                prompt: 'Doplň správny typ pre každú premennú:',
                codeSnippet: 'vek = 25           # ___\nmeno = "Anna"      # ___',
                blanks: [
                  { id: 'b1', options: ['str', 'int', 'float', 'bool'], correct: 'int' },
                  { id: 'b2', options: ['str', 'int', 'float', 'bool'], correct: 'str' },
                ],
                xp: 15,
              },
              {
                id: 'mcq-types-3',
                type: 'mcq',
                conceptId: 'data-types',
                prompt: 'Čo vráti type(42)?',
                options: ["<class 'str'>", "<class 'float'>", "<class 'int'>", "<class 'bool'>"],
                correctAnswer: "<class 'int'>",
                explanation: 'Funkcia type() ti prezradí typ hodnoty. 42 je celé číslo, teda int.',
                xp: 10,
              },
              {
                id: 'write-types-1',
                type: 'write',
                conceptId: 'data-types',
                prompt: 'Vytvor 3 premenné: meno (text), vek (celé číslo), vyska (desatinné číslo) a vypíš ich typy pomocou type().',
                codeSnippet: '# Napíš kód tu\n',
                testCases: [
                  { input: '', expected: 'contains:type', description: 'Kód používa type()' },
                ],
                xp: 25,
              },
            ],
          },
          {
            id: 'strings',
            unitId: 'variables',
            title: 'Reťazce (Strings)',

            exercises: [
              {
                id: 'explain-str-1',
                type: 'explain',
                conceptId: 'strings',
                prompt: 'Práca s textom',
                codeSnippet: `meno = "Byte"\npozdrav = "Ahoj, " + meno  # "Ahoj, Byte"\ndlzka = len(meno)           # 4\nvelke = meno.upper()        # "BYTE"`,
                explanation: 'Reťazce (strings) sú texty v úvodzovkách. Môžeš ich spájať cez +, zistiť ich dĺžku pomocou len() alebo zmeniť na veľké/malé písmená.',
                xp: 5,
              },
              {
                id: 'mcq-str-1',
                type: 'mcq',
                conceptId: 'strings',
                prompt: 'Čo vypíše kód: print("Ahoj" + " " + "svet")?',
                options: ['Ahoj svet', 'AhojSvet', '"Ahoj" " " "svet"', 'chyba'],
                correctAnswer: 'Ahoj svet',
                xp: 10,
              },
              {
                id: 'fill-str-1',
                type: 'fill',
                conceptId: 'strings',
                prompt: 'Doplň kód aby vypísal dĺžku reťazca:',
                codeSnippet: 'slovo = "Python"\nprint(___(slovo))',
                blanks: [{ id: 'b1', options: ['len', 'size', 'count', 'length'], correct: 'len' }],
                xp: 15,
              },
              {
                id: 'explain-fstring',
                type: 'explain',
                conceptId: 'f-strings',
                prompt: 'F-strings — moderný spôsob spájania textu',
                codeSnippet: `meno = "Zuzka"\nvek = 20\nprint(f"Volám sa {meno} a mám {vek} rokov.")`,
                explanation: 'F-string začína písmenom f pred úvodzovkami. Do zložených zátvork {} dáš premennú a Python ju automaticky vloží do textu. Oveľa elegantnejšie ako spájanie cez +.',
                xp: 5,
              },
              {
                id: 'mcq-fstring',
                type: 'mcq',
                conceptId: 'f-strings',
                prompt: 'Ako sa tvorí f-string?',
                options: ['format("text {var}")', 'f"text {var}"', '"text" + var', '"text {var}".format(var)'],
                correctAnswer: 'f"text {var}"',
                xp: 10,
              },
              {
                id: 'write-str-1',
                type: 'write',
                conceptId: 'strings',
                prompt: 'Vytvor premenné meno a mesto. Pomocou f-stringu vypíš: "Volám sa [meno] a som z [mesto]."',
                codeSnippet: '# Napíš kód tu\n',
                testCases: [
                  { input: '', expected: 'contains:f"', description: 'Kód používa f-string' },
                ],
                xp: 25,
              },
            ],
          },
        ],
      },
      {
        id: 'operators',
        moduleId: 'python-basics',
        title: 'Operátory',
        description: 'Počítaj a porovnávaj hodnoty',

        lessons: [
          {
            id: 'math-operators',
            unitId: 'operators',
            title: 'Matematika v Pythone',

            exercises: [
              {
                id: 'explain-math-1',
                type: 'explain',
                conceptId: 'math-ops',
                prompt: 'Matematické operátory',
                codeSnippet: `a = 10\nb = 3\nprint(a + b)   # 13 — sčítanie\nprint(a - b)   # 7  — odčítanie\nprint(a * b)   # 30 — násobenie\nprint(a / b)   # 3.333 — delenie\nprint(a // b)  # 3  — celočíselné delenie\nprint(a % b)   # 1  — zvyšok po delení\nprint(a ** b)  # 1000 — umocnenie`,
                explanation: 'Python má všetky bežné matematické operácie. Špeciálne sú // (delenie bez zvyšku), % (modulo — zvyšok) a ** (umocnenie).',
                xp: 5,
              },
              {
                id: 'mcq-math-1',
                type: 'mcq',
                conceptId: 'math-ops',
                prompt: 'Čo vráti výraz 17 % 5?',
                options: ['3', '2', '3.4', '12'],
                correctAnswer: '2',
                explanation: '17 deleno 5 je 3 so zvyškom 2. Operátor % vracia práve ten zvyšok.',
                xp: 10,
              },
              {
                id: 'mcq-math-2',
                type: 'mcq',
                conceptId: 'math-ops',
                prompt: 'Čo vypíše: print(2 ** 8)?',
                options: ['16', '256', '64', '128'],
                correctAnswer: '256',
                explanation: '2 na ôsmu je 256. Operátor ** je umocnenie.',
                xp: 10,
              },
              {
                id: 'fill-math-1',
                type: 'fill',
                conceptId: 'math-ops',
                prompt: 'Doplň operátor na výpočet zvyšku po delení:',
                codeSnippet: 'zvysok = 10 ___ 3\nprint(zvysok)  # 1',
                blanks: [{ id: 'b1', options: ['/', '//', '%', '**'], correct: '%' }],
                xp: 15,
              },
              {
                id: 'write-math-1',
                type: 'write',
                conceptId: 'math-ops',
                prompt: 'Vypočítaj obvod obdĺžnika so stranami a=8 a b=5. Výsledok vypíš.',
                codeSnippet: '# Obvod = 2 * (a + b)\na = 8\nb = 5\n# Dopíš zvyšok\n',
                testCases: [
                  { input: '', expected: 'contains:26', description: 'Výsledok je 26' },
                ],
                xp: 20,
              },
            ],
          },
          {
            id: 'comparison-operators',
            unitId: 'operators',
            title: 'Porovnávacie operátory',

            exercises: [
              {
                id: 'explain-cmp-1',
                type: 'explain',
                conceptId: 'comparison',
                prompt: 'Porovnávanie hodnôt',
                codeSnippet: `a = 10\nb = 5\nprint(a > b)   # True\nprint(a < b)   # False\nprint(a == b)  # False (rovná sa?)\nprint(a != b)  # True  (nerovná sa?)\nprint(a >= 10) # True`,
                explanation: 'Porovnávacie operátory vracajú True alebo False. Dôležité: rovnosť sa píše == (dve rovnítka!), nie = (to je priradenie).',
                xp: 5,
              },
              {
                id: 'mcq-cmp-1',
                type: 'mcq',
                conceptId: 'comparison',
                prompt: 'Čo vráti: 5 == 5.0?',
                options: ['True', 'False', 'chyba', '5'],
                correctAnswer: 'True',
                explanation: 'Python porovnáva hodnoty. 5 (int) a 5.0 (float) majú rovnakú hodnotu, takže == vráti True.',
                xp: 10,
              },
              {
                id: 'mcq-cmp-2',
                type: 'mcq',
                conceptId: 'comparison',
                prompt: 'Aký operátor sa používa na porovnanie rovnosti (nie priradenie)?',
                options: ['=', '==', '===', ':='],
                correctAnswer: '==',
                xp: 10,
              },
              {
                id: 'fill-cmp-1',
                type: 'fill',
                conceptId: 'comparison',
                prompt: 'Doplň operátor "nerovná sa":',
                codeSnippet: 'print(10 ___ 5)  # True',
                blanks: [{ id: 'b1', options: ['!=', '!==', '<>', '=/='], correct: '!=' }],
                xp: 15,
              },
            ],
          },
        ],
        isCheckpoint: false,
      },
      {
        id: 'conditions',
        moduleId: 'python-basics',
        title: 'Podmienky',
        description: 'Nauč program rozhodovať',

        isCheckpoint: true,
        lessons: [
          {
            id: 'if-else',
            unitId: 'conditions',
            title: 'if a else',

            exercises: [
              {
                id: 'explain-if-1',
                type: 'explain',
                conceptId: 'if-else',
                prompt: 'Podmienky — if / else',
                codeSnippet: `vek = 18\nif vek >= 18:\n    print("Dospelý")\nelse:\n    print("Mladistvý")`,
                explanation: 'if spustí blok kódu iba ak je podmienka True. else sa vykoná keď podmienka nie je splnená. Dôležité: za podmienkou musí byť dvojbodka : a kód vnútri musí byť odsadený (4 medzery alebo Tab).',
                xp: 5,
              },
              {
                id: 'mcq-if-1',
                type: 'mcq',
                conceptId: 'if-else',
                prompt: 'Čo vypíše kód ak je skore = 45?\n\nif skore >= 50:\n    print("Úspech")\nelse:\n    print("Skús znova")',
                options: ['Úspech', 'Skús znova', 'Nič', 'chyba'],
                correctAnswer: 'Skús znova',
                explanation: '45 >= 50 je False, takže ide do else vetvy a vypíše "Skús znova".',
                xp: 10,
              },
              {
                id: 'fill-if-1',
                type: 'fill',
                conceptId: 'if-else',
                prompt: 'Doplň chýbajúce klíčové slová:',
                codeSnippet: '___ teplota > 30:\n    print("Horúco")\n___:\n    print("Pohoda")',
                blanks: [
                  { id: 'b1', options: ['if', 'when', 'check', 'for'], correct: 'if' },
                  { id: 'b2', options: ['else', 'elif', 'otherwise', 'then'], correct: 'else' },
                ],
                xp: 15,
              },
              {
                id: 'write-if-1',
                type: 'write',
                conceptId: 'if-else',
                prompt: 'Napíš program: ak je číslo 7 párne, vypíš "párne", inak vypíš "nepárne". (Hint: párne číslo má zvyšok po delení 2 rovný 0)',
                codeSnippet: 'cislo = 7\n# Napíš podmienku\n',
                testCases: [
                  { input: '', expected: 'contains:nepárne', description: 'Vypíše "nepárne" pre číslo 7' },
                ],
                xp: 25,
              },
            ],
          },
          {
            id: 'elif',
            unitId: 'conditions',
            title: 'elif — viac možností',

            exercises: [
              {
                id: 'explain-elif-1',
                type: 'explain',
                conceptId: 'elif',
                prompt: 'elif — keď máš viac podmienok',
                codeSnippet: `skore = 75\nif skore >= 90:\n    print("Výborný")\nelif skore >= 70:\n    print("Dobrý")\nelif skore >= 50:\n    print("Dostatočný")\nelse:\n    print("Nedostatočný")`,
                explanation: 'elif (skratka pre "else if") ti umožní skontrolovať viac podmienok za sebou. Python ich prejde zhora nadol a zastaví pri prvej, ktorá je True.',
                xp: 5,
              },
              {
                id: 'mcq-elif-1',
                type: 'mcq',
                conceptId: 'elif',
                prompt: 'Čo vypíše kód pri skore = 75?',
                options: ['Výborný', 'Dobrý', 'Dostatočný', 'Nedostatočný'],
                correctAnswer: 'Dobrý',
                explanation: '75 >= 90? Nie. 75 >= 70? Áno! → "Dobrý"',
                xp: 10,
              },
              {
                id: 'fill-elif-1',
                type: 'fill',
                conceptId: 'elif',
                prompt: 'Doplň správne kľúčové slovo:',
                codeSnippet: 'if temp > 30:\n    print("Horúco")\n___ temp > 20:\n    print("Teplo")\nelse:\n    print("Chladno")',
                blanks: [{ id: 'b1', options: ['elif', 'else if', 'elseif', 'or if'], correct: 'elif' }],
                xp: 15,
              },
              {
                id: 'write-elif-1',
                type: 'write',
                conceptId: 'elif',
                prompt: 'Napíš funkciu hodnotenia: ak je vek < 13 → "dieťa", ak 13-17 → "teenager", ak 18+ → "dospelý". Otestuj pre vek = 15.',
                codeSnippet: 'vek = 15\n# Napíš podmienky\n',
                testCases: [
                  { input: '', expected: 'contains:teenager', description: 'Pre vek 15 vypíše "teenager"' },
                ],
                xp: 30,
              },
            ],
          },
        ],
      },
      {
        id: 'loops',
        moduleId: 'python-basics',
        title: 'Cykly',
        description: 'Opakuj kód inteligentne',

        lessons: [
          {
            id: 'for-loop',
            unitId: 'loops',
            title: 'for cyklus',

            exercises: [
              {
                id: 'explain-for-1',
                type: 'explain',
                conceptId: 'for-loop',
                prompt: 'for cyklus — opakuj pre každý prvok',
                codeSnippet: `# Prejdi cez zoznam\nfarby = ["červená", "zelená", "modrá"]\nfor farba in farby:\n    print(farba)\n\n# Opakuj N-krát pomocou range()\nfor i in range(5):\n    print(i)  # 0, 1, 2, 3, 4`,
                explanation: 'for cyklus prejde každý prvok v zozname (alebo v range) a vykoná kód pre každý z nich. range(5) vytvorí čísla 0 až 4.',
                xp: 5,
              },
              {
                id: 'mcq-for-1',
                type: 'mcq',
                conceptId: 'for-loop',
                prompt: 'Koľkokrát sa vykoná kód:\nfor i in range(3):\n    print("Byte")',
                options: ['2×', '3×', '4×', '1×'],
                correctAnswer: '3×',
                explanation: 'range(3) generuje 0, 1, 2 — tri čísla, teda cyklus prebehne 3-krát.',
                xp: 10,
              },
              {
                id: 'fill-for-1',
                type: 'fill',
                conceptId: 'for-loop',
                prompt: 'Doplň kód aby vypísal čísla 1 až 5:',
                codeSnippet: 'for i in ___(1, 6):\n    print(i)',
                blanks: [{ id: 'b1', options: ['range', 'list', 'loop', 'iter'], correct: 'range' }],
                xp: 15,
              },
              {
                id: 'write-for-1',
                type: 'write',
                conceptId: 'for-loop',
                prompt: 'Vypíš súčet čísel od 1 do 10 pomocou for cyklu.',
                codeSnippet: 'sucet = 0\n# Napíš cyklus\n# print(sucet)\n',
                testCases: [
                  { input: '', expected: 'contains:55', description: 'Výsledok je 55' },
                ],
                xp: 25,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'my-projects',
    title: 'Moje Projekty',
    description: 'Koncepty z reálnych projektov — React Native, TypeScript, Supabase',


    units: [
      {
        id: 'js-fundamentals',
        moduleId: 'my-projects',
        title: 'JavaScript Základy',
        description: 'Async/await, destructuring, optional chaining',

        lessons: [
          {
            id: 'async-await',
            unitId: 'js-fundamentals',
            title: 'Async / Await',

            exercises: [
              {
                id: 'explain-async-1',
                type: 'explain',
                conceptId: 'async-await',
                prompt: 'Async/Await — neblokujúci kód',
                codeSnippet: `// Bez async/await (callback hell):\nfetch(url).then(res => res.json()).then(data => {\n  console.log(data);\n});\n\n// S async/await (čitateľné):\nasync function nacitajData() {\n  const res = await fetch(url);\n  const data = await res.json();\n  console.log(data);\n}`,
                explanation: 'async/await je moderný spôsob práce s asynchrónnymi operáciami (sieť, databáza). Namiesto reťaze .then() môžeš písať kód, ktorý vyzerá synchrónne. await "počká" na výsledok bez blokovania ostatného kódu.',
                xp: 5,
              },
              {
                id: 'mcq-async-1',
                type: 'mcq',
                conceptId: 'async-await',
                prompt: 'Čo musí mať funkcia, aby mohla používať await?',
                options: ['musí sa volať "asyncFunc"', 'musí byť označená ako async', 'musí vrátiť Promise ručne', 'nič špeciálne'],
                correctAnswer: 'musí byť označená ako async',
                explanation: 'await môžeš použiť iba vnútri funkcie označenej kľúčovým slovom async.',
                xp: 10,
              },
              {
                id: 'mcq-async-2',
                type: 'mcq',
                conceptId: 'async-await',
                prompt: 'Čo je Promise?',
                options: [
                  'Hodnota, ktorá bude dostupná neskôr (výsledok asynchrónnej operácie)',
                  'Sľub medzi dvoma funkciami',
                  'Špeciálny typ poľa',
                  'Nástroj na cachovanig',
                ],
                correctAnswer: 'Hodnota, ktorá bude dostupná neskôr (výsledok asynchrónnej operácie)',
                xp: 10,
              },
              {
                id: 'fill-async-1',
                type: 'fill',
                conceptId: 'async-await',
                prompt: 'Doplň správne kľúčové slová:',
                codeSnippet: '___ function loadUser() {\n  const data = ___ fetchUser();\n  return data;\n}',
                blanks: [
                  { id: 'b1', options: ['async', 'sync', 'parallel', 'defer'], correct: 'async' },
                  { id: 'b2', options: ['await', 'wait', 'hold', 'pause'], correct: 'await' },
                ],
                xp: 15,
              },
            ],
          },
          {
            id: 'destructuring',
            unitId: 'js-fundamentals',
            title: 'Destructuring a Spread',

            exercises: [
              {
                id: 'explain-dest-1',
                type: 'explain',
                conceptId: 'destructuring',
                prompt: 'Destructuring — vyber len čo potrebuješ',
                codeSnippet: `// Objekt destructuring:\nconst user = { name: "Zuzka", age: 20, city: "BA" };\nconst { name, city } = user; // vytiahne len name a city\n\n// Array destructuring:\nconst [first, second] = [10, 20, 30];\n\n// Spread — spoj objekty:\nconst updated = { ...user, city: "KE" }; // city sa prepíše`,
                explanation: 'Destructuring ti umožní "vybalit" len konkrétne hodnoty z objektu alebo poľa. Spread operátor (...) skopíruje všetky vlastnosti — ako keby si vyliala celú škatuľu a niektoré veci vymenila.',
                xp: 5,
              },
              {
                id: 'mcq-dest-1',
                type: 'mcq',
                conceptId: 'destructuring',
                prompt: 'Čo bude v premennej name po tejto línii?\nconst { name, age } = { name: "Byte", age: 1, mood: "happy" }',
                options: ['"Byte"', '{ name: "Byte" }', 'undefined', '"happy"'],
                correctAnswer: '"Byte"',
                xp: 10,
              },
              {
                id: 'mcq-dest-2',
                type: 'mcq',
                conceptId: 'spread',
                prompt: 'Čo robí spread operátor ... ?',
                options: [
                  'Rozloží prvky poľa alebo objektu na jednotlivé hodnoty',
                  'Vytvorí nové prázdne pole',
                  'Async funkcia',
                  'Porovná dva objekty',
                ],
                correctAnswer: 'Rozloží prvky poľa alebo objektu na jednotlivé hodnoty',
                xp: 10,
              },
            ],
          },
        ],
      },
      {
        id: 'typescript',
        moduleId: 'my-projects',
        title: 'TypeScript',
        description: 'Typy, interfaces, generics — bezpečnejší JavaScript',

        lessons: [
          {
            id: 'ts-types',
            unitId: 'typescript',
            title: 'Typy a Type Aliases',

            exercises: [
              {
                id: 'explain-ts-1',
                type: 'explain',
                conceptId: 'ts-types',
                prompt: 'TypeScript — statické typy',
                codeSnippet: `// Type alias — pomenovaný tvar\ntype Attendee = {\n  id: string;\n  name: string;\n  avatar: string | null;  // union type\n};\n\n// Funkcia s typmi\nfunction greet(name: string): string {\n  return \`Ahoj, \${name}!\`;\n}`,
                explanation: 'TypeScript pridáva typy do JavaScriptu. type alias ti umožní pomenovať štruktúru (tvar objektu). Union type (|) hovorí "môže byť jedno ALEBO druhé". Toto odchytí chyby ešte pred spustením kódu.',
                xp: 5,
              },
              {
                id: 'mcq-ts-1',
                type: 'mcq',
                conceptId: 'ts-types',
                prompt: 'Čo je union type?',
                options: [
                  'Typ ktorý môže byť jedna z viacerých hodnôt (napr. string | null)',
                  'Spojenie dvoch tried',
                  'Špeciálny array typ',
                  'Generický parameter',
                ],
                correctAnswer: 'Typ ktorý môže byť jedna z viacerých hodnôt (napr. string | null)',
                xp: 10,
              },
              {
                id: 'mcq-ts-2',
                type: 'mcq',
                conceptId: 'optional-chaining',
                prompt: 'Čo robí optional chaining (?.) v TypeScript/JS?\nprofile?.avatar_url',
                options: [
                  'Bezpečne pristúpi k vlastnosti — ak je profile null, vráti undefined namiesto chyby',
                  'Označí vlastnosť ako povinnú',
                  'Vytvorí novú premennú',
                  'Skontroluje či je profile string',
                ],
                correctAnswer: 'Bezpečne pristúpi k vlastnosti — ak je profile null, vráti undefined namiesto chyby',
                explanation: 'Bez ?. by null.avatar_url hodilo chybu. S ?. dostaneš undefined — bezpečne.',
                xp: 10,
              },
              {
                id: 'fill-ts-1',
                type: 'fill',
                conceptId: 'ts-types',
                prompt: 'Doplň union type, ktorý môže byť string alebo null:',
                codeSnippet: 'type MaybeString = string ___ null;',
                blanks: [{ id: 'b1', options: ['|', '&', '?', '+'], correct: '|' }],
                xp: 15,
              },
            ],
          },
        ],
      },
      {
        id: 'react-patterns',
        moduleId: 'my-projects',
        title: 'React Patterny',
        description: 'useState, useEffect, podmienené renderovanie',

        isCheckpoint: true,
        lessons: [
          {
            id: 'react-hooks',
            unitId: 'react-patterns',
            title: 'React Hooks',

            exercises: [
              {
                id: 'explain-usestate-1',
                type: 'explain',
                conceptId: 'useState',
                prompt: 'useState — lokálny stav komponentu',
                codeSnippet: `import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  //     ↑ hodnota  ↑ setter   ↑ počiatočná hodnota\n\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Kliknutí: {count}\n    </button>\n  );\n}`,
                explanation: 'useState vracia dvojicu: [aktuálna hodnota, funkcia na zmenu]. Keď zavoláš setter, React re-renderuje komponent s novou hodnotou. Počiatočná hodnota sa použije len raz.',
                xp: 5,
              },
              {
                id: 'mcq-usestate-1',
                type: 'mcq',
                conceptId: 'useState',
                prompt: 'Čo sa stane keď zavoláš setState()?',
                options: [
                  'Komponent sa re-renderuje s novou hodnotou',
                  'Stránka sa znovu načíta',
                  'Hodnota sa uloží do localStorage',
                  'Nič — musíš zavolať render() ručne',
                ],
                correctAnswer: 'Komponent sa re-renderuje s novou hodnotou',
                xp: 10,
              },
              {
                id: 'explain-useeffect',
                type: 'explain',
                conceptId: 'useEffect',
                prompt: 'useEffect — vedľajšie efekty',
                codeSnippet: `useEffect(() => {\n  // Toto sa spustí po každom renderi\n  fetchData();\n}, [userId]); // ← dependency array\n// Ak je [] prázdne: spustí sa LEN raz (pri mountnutí)\n// Ak obsahuje [userId]: spustí sa keď sa zmení userId`,
                explanation: 'useEffect spúšťa kód po tom, čo React vykreslí komponent. Používa sa na načítanie dát, subscripcie, timery. Dependency array určuje kedy sa efekt znovu spustí.',
                xp: 5,
              },
              {
                id: 'mcq-useeffect-1',
                type: 'mcq',
                conceptId: 'useEffect',
                prompt: 'Kedy sa spustí useEffect s prázdnym dependency array []?',
                options: [
                  'Len raz — keď sa komponent prvýkrát vykreslí (mount)',
                  'Pri každej zmene state',
                  'Nikdy',
                  'Každú sekundu',
                ],
                correctAnswer: 'Len raz — keď sa komponent prvýkrát vykreslí (mount)',
                xp: 10,
              },
              {
                id: 'mcq-conditional',
                type: 'mcq',
                conceptId: 'conditional-rendering',
                prompt: 'Čo robí tento JSX kód?\n{isLoading && <Spinner />}',
                options: [
                  'Zobrazí Spinner iba keď isLoading je true',
                  'Vždy zobrazí Spinner',
                  'Skryje Spinner keď isLoading je true',
                  'Hodí chybu',
                ],
                correctAnswer: 'Zobrazí Spinner iba keď isLoading je true',
                explanation: 'Short-circuit evaluation: && vracia druhú hodnotu len ak je prvá truthy. React vyrenderuje len truthy hodnoty.',
                xp: 10,
              },
            ],
          },
        ],
      },
      {
        id: 'supabase-basics',
        moduleId: 'my-projects',
        title: 'Supabase',
        description: 'Databáza, auth, RLS — backend pre tvoje projekty',

        lessons: [
          {
            id: 'supabase-queries',
            unitId: 'supabase-basics',
            title: 'Supabase Queries',

            exercises: [
              {
                id: 'explain-supabase-1',
                type: 'explain',
                conceptId: 'supabase-client',
                prompt: 'Supabase — databáza v JavaScripte',
                codeSnippet: `// Jednoduchý SELECT:\nconst { data, error } = await supabase\n  .from('events')\n  .select('*')\n  .eq('city', 'Bratislava');\n\n// S joinmi:\nconst { data } = await supabase\n  .from('attendees')\n  .select('id, profile:profiles(name, avatar)')`,
                explanation: 'Supabase client ti dá prístup k PostgreSQL databáze cez čitateľné JS/TS API. .from() vyberie tabuľku, .select() stĺpce, .eq() filtráciu. V zátvorkách select() môžeš joinovať cudzie tabuľky.',
                xp: 5,
              },
              {
                id: 'mcq-supabase-1',
                type: 'mcq',
                conceptId: 'supabase-client',
                prompt: 'Čo robí .maybeSingle()?',
                options: [
                  'Vráti null namiesto chyby keď nie je nájdený žiadny riadok',
                  'Vráti pole s jedným prvkom',
                  'Hodí chybu ak je viac ako jeden výsledok',
                  'Vymaže záznamy',
                ],
                correctAnswer: 'Vráti null namiesto chyby keď nie je nájdený žiadny riadok',
                xp: 10,
              },
              {
                id: 'mcq-rls-1',
                type: 'mcq',
                conceptId: 'rls',
                prompt: 'Čo je Row Level Security (RLS)?',
                options: [
                  'Databázové pravidlá, ktoré kontrolujú kto môže čítať/písať každý riadok',
                  'Šifrovanie dát v databáze',
                  'Komprimácia tabuliek',
                  'Zálohovanie databázy',
                ],
                correctAnswer: 'Databázové pravidlá, ktoré kontrolujú kto môže čítať/písať každý riadok',
                explanation: 'RLS politiky = bezpečnosť na úrovni databázy. Používateľ vidí len svoje dáta, aj keby niekto ukradol anon key.',
                xp: 10,
              },
              {
                id: 'mcq-upsert',
                type: 'mcq',
                conceptId: 'upsert',
                prompt: 'Čo robí upsert?',
                options: [
                  'Vloží riadok ALEBO ho aktualizuje ak už existuje',
                  'Len vloží nový riadok (insert)',
                  'Len aktualizuje existujúci riadok',
                  'Vymaže a znova vloží',
                ],
                correctAnswer: 'Vloží riadok ALEBO ho aktualizuje ak už existuje',
                explanation: 'upsert = insert + update. Ak riadok s daným primary key existuje, aktualizuje ho. Ak nie, vloží nový.',
                xp: 10,
              },
            ],
          },
        ],
      },
    ],
  },
];

// Flat lesson lookup
export function getAllLessons() {
  return curriculum.flatMap(m => m.units.flatMap(u => u.lessons));
}

export function getLessonById(id: string) {
  return getAllLessons().find(l => l.id === id);
}

export function getUnitByLessonId(lessonId: string) {
  for (const m of curriculum) {
    for (const u of m.units) {
      if (u.lessons.some(l => l.id === lessonId)) return u;
    }
  }
  return null;
}

export function getModuleByLessonId(lessonId: string) {
  for (const m of curriculum) {
    for (const u of m.units) {
      if (u.lessons.some(l => l.id === lessonId)) return m;
    }
  }
  return null;
}
