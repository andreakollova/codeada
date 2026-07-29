import { InteractiveProject } from '@/types';

export const calculatorProject: InteractiveProject = {
  id: 'calculator',
  title: 'Interaktívna kalkulačka',
  subtitle: 'Vytvor svoju prvú funkčnú aplikáciu v Pythone.',
  description: `V tomto projekte vytvoríš vlastnú kalkulačku, ktorá dokáže sčítať, odčítať, násobiť a deliť čísla, zobraziť výsledok, upozorniť používateľa na nesprávny vstup a zabrániť deleniu nulou.

Na pravej strane obrazovky sa bude nachádzať živý náhľad aplikácie. Po každom správne dokončenom kroku sa v náhľade zobrazí nová časť kalkulačky.`,
  difficulty: 'beginner',
  estimatedMinutes: 45,
  skills: [
    'vytvoriť a používať premenné',
    'pracovať s číslami',
    'získavať údaje od používateľa',
    'meniť text na číslo',
    'používať matematické operátory',
    'rozhodovať pomocou podmienok',
    'vytvárať vlastné funkcie',
    'kontrolovať nesprávne vstupy',
  ],
  icon: '🧮',
  color: '#22c55e',
  totalSteps: 8,
  sections: [
    // ========== THEORY ==========
    {
      id: 'theory',
      title: 'Teória',
      steps: [
        {
          id: 'theory-variables',
          type: 'theory',
          title: 'Premenné',
          theoryContent: `# Premenné

Program si počas svojho fungovania potrebuje pamätať rôzne hodnoty.

Kalkulačka si napríklad musí zapamätať:
- prvé číslo,
- druhé číslo,
- zvolenú operáciu,
- výsledok.

Na uchovávanie hodnôt používame **premenné**.

\`\`\`python
first_number = 12
second_number = 8
\`\`\`

Premennú si môžeš predstaviť ako označenú škatuľku.

Názov premennej nám hovorí, akú hodnotu škatuľka obsahuje. Namiesto krátkych názvov ako \`a = 12\` je lepšie používať zrozumiteľné názvy:

\`\`\`python
first_number = 12
second_number = 8
\`\`\`

Kód je potom jednoduchší na čítanie.`,
          xp: 5,
        },
        {
          id: 'theory-numbers',
          type: 'theory',
          title: 'Čísla v Pythone',
          theoryContent: `# Čísla v Pythone

Python pracuje s viacerými typmi čísel.

## Celé čísla

Celé čísla majú typ \`int\`.

\`\`\`python
age = 28
score = 100
temperature = -5
\`\`\`

## Desatinné čísla

Desatinné čísla majú typ \`float\`.

\`\`\`python
price = 19.99
height = 1.71
\`\`\`

Naša kalkulačka bude podporovať celé aj desatinné čísla. Preto budeme vstupy používateľa meniť na typ \`float\`.

\`\`\`python
number = float("12.5")
\`\`\`

Výsledkom bude číslo \`12.5\`.`,
          xp: 5,
        },
        {
          id: 'theory-input',
          type: 'theory',
          title: 'Vstup od používateľa',
          theoryContent: `# Vstup od používateľa

V aplikácii nebude hodnota čísla zapísaná priamo v kóde. Zadá ju používateľ prostredníctvom vstupného poľa.

Do Pythonu však vstup z formulára prichádza ako text. Hodnota \`12\` preto najskôr nie je číslo, ale textový reťazec \`"12"\`.

Aby sme s hodnotou mohli počítať, musíme ju skonvertovať:

\`\`\`python
first_number = float("12")
\`\`\`

Bez konverzie by Python mohol s hodnotami pracovať ako s textom:

\`\`\`python
"10" + "5"  # Výsledok: "105" (spojenie textov!)
\`\`\`

Po správnej konverzii:

\`\`\`python
10 + 5  # Výsledok: 15
\`\`\``,
          xp: 5,
        },
        {
          id: 'theory-operators',
          type: 'theory',
          title: 'Matematické operátory',
          theoryContent: `# Matematické operátory

Python obsahuje operátory pre bežné matematické výpočty.

| Operácia | Operátor | Príklad | Výsledok |
|----------|----------|---------|----------|
| Sčítanie | \`+\` | \`10 + 5\` | \`15\` |
| Odčítanie | \`-\` | \`10 - 5\` | \`5\` |
| Násobenie | \`*\` | \`10 * 5\` | \`50\` |
| Delenie | \`/\` | \`10 / 5\` | \`2.0\` |

Hviezdička \`*\` znamená násobenie. Lomka \`/\` znamená delenie.

\`\`\`python
result = 10 * 5  # result = 50
\`\`\``,
          xp: 5,
        },
        {
          id: 'theory-conditions',
          type: 'theory',
          title: 'Podmienky',
          theoryContent: `# Podmienky

Kalkulačka musí vykonať inú operáciu podľa toho, čo si používateľ vyberie.

Na rozhodovanie používame podmienky:

\`\`\`python
if operation == "+":
    result = first_number + second_number
\`\`\`

Viac možností spracujeme pomocou \`elif\`:

\`\`\`python
if operation == "+":
    result = first_number + second_number
elif operation == "-":
    result = first_number - second_number
elif operation == "*":
    result = first_number * second_number
elif operation == "/":
    result = first_number / second_number
\`\`\`

Python prechádza podmienky zhora nadol. Keď nájde prvú pravdivú podmienku, vykoná jej kód.

## Porovnávanie hodnôt

Dva znaky rovnosti \`==\` porovnávajú hodnoty. Jeden znak \`=\` priraďuje hodnotu.

\`\`\`python
=   # priradenie hodnoty
==  # porovnanie hodnôt
\`\`\``,
          xp: 5,
        },
        {
          id: 'theory-functions',
          type: 'theory',
          title: 'Funkcie',
          theoryContent: `# Funkcie

Výpočet kalkulačky by sme mohli napísať priamo do programu. Lepším riešením je však vytvoriť funkciu.

\`\`\`python
def calculate(first_number, second_number, operation):
    # Výpočet bude vo vnútri funkcie
\`\`\`

Funkcia je samostatná časť programu, ktorá vykonáva konkrétnu úlohu.

Funkciu potom môžeme použiť takto:

\`\`\`python
calculate(10, 5, "+")  # Výsledok: 15
\`\`\`

Na vrátenie hodnoty používame príkaz \`return\`:

\`\`\`python
def calculate(first_number, second_number, operation):
    result = first_number + second_number
    return result
\`\`\``,
          xp: 5,
        },
        {
          id: 'theory-errors',
          type: 'theory',
          title: 'Delenie nulou a nesprávny vstup',
          theoryContent: `# Delenie nulou

V matematike nie je možné deliť nulou. Ak by sa Python pokúsil vykonať \`10 / 0\`, program by skončil chybou \`ZeroDivisionError\`.

\`\`\`python
if operation == "/" and second_number == 0:
    return "Nulou nie je možné deliť."
\`\`\`

# Nesprávny vstup

Používateľ môže zadať napr. \`"ahoj"\` namiesto čísla. Na bezpečné zachytávanie chýb používame \`try\` a \`except\`:

\`\`\`python
try:
    number = float(user_input)
except ValueError:
    return "Zadaj platné číslo."
\`\`\`

Python sa najskôr pokúsi vykonať kód v časti \`try\`. Ak nastane chyba, vykoná kód v časti \`except\`.`,
          xp: 5,
        },
      ],
    },

    // ========== QUIZ ==========
    {
      id: 'quiz',
      title: 'Kvíz',
      steps: [
        {
          id: 'quiz-1',
          type: 'quiz',
          title: 'Premenné',
          quizQuestion: 'Na čo sa v programe používajú premenné?',
          quizOptions: [
            { text: 'Na zmenu vzhľadu aplikácie', correct: false },
            { text: 'Na uchovávanie hodnôt', correct: true },
            { text: 'Na pripájanie k internetu', correct: false },
            { text: 'Na opravu chýb', correct: false },
          ],
          xp: 10,
        },
        {
          id: 'quiz-2',
          type: 'quiz',
          title: 'Typy čísel',
          quizQuestion: 'Aký typ má hodnota 12.5?',
          quizOptions: [
            { text: 'str', correct: false },
            { text: 'int', correct: false },
            { text: 'float', correct: true },
            { text: 'bool', correct: false },
          ],
          xp: 10,
        },
        {
          id: 'quiz-3',
          type: 'quiz',
          title: 'Operátory',
          quizQuestion: 'Aký operátor používa Python na násobenie?',
          quizOptions: [
            { text: 'x', correct: false },
            { text: '*', correct: true },
            { text: '#', correct: false },
            { text: '%', correct: false },
          ],
          xp: 10,
        },
        {
          id: 'quiz-4',
          type: 'quiz',
          title: 'Priradenie vs porovnanie',
          quizQuestion: 'Aký je rozdiel medzi = a ==?',
          quizOptions: [
            { text: 'Nie je medzi nimi rozdiel', correct: false },
            { text: '= porovnáva a == priraďuje', correct: false },
            { text: '= priraďuje a == porovnáva', correct: true },
            { text: 'Oba operátory slúžia na sčítanie', correct: false },
          ],
          xp: 10,
        },
        {
          id: 'quiz-5',
          type: 'quiz',
          title: 'Delenie nulou',
          quizQuestion: 'Čo sa stane pri výpočte 10 / 0?',
          quizOptions: [
            { text: 'Výsledok bude 0', correct: false },
            { text: 'Výsledok bude 10', correct: false },
            { text: 'Python zobrazí chybu', correct: true },
            { text: 'Python výpočet preskočí', correct: false },
          ],
          xp: 10,
        },
        {
          id: 'quiz-6',
          type: 'quiz',
          title: 'Return',
          quizQuestion: 'Na čo slúži príkaz return?',
          quizOptions: [
            { text: 'Ukončí počítač', correct: false },
            { text: 'Vráti výsledok z funkcie', correct: true },
            { text: 'Vytvorí premennú', correct: false },
            { text: 'Vypíše komentár', correct: false },
          ],
          xp: 10,
        },
      ],
    },

    // ========== FILL CODE ==========
    {
      id: 'fill-code',
      title: 'Doplň kód',
      steps: [
        {
          id: 'fill-1',
          type: 'fill',
          title: 'Konverzia textu na číslo',
          prompt: 'Doplň typ, ktorý zmení text na desatinné číslo.',
          fillCode: 'number = ___("12.5")',
          fillBlanks: [{ id: 'b1', answer: 'float', alternatives: ['Float'] }],
          xp: 15,
        },
        {
          id: 'fill-2',
          type: 'fill',
          title: 'Operátor porovnávania',
          prompt: 'Doplň operátor porovnávania.',
          fillCode: 'if operation ___ "+":\n    result = first_number + second_number',
          fillBlanks: [{ id: 'b1', answer: '==' }],
          xp: 15,
        },
        {
          id: 'fill-3',
          type: 'fill',
          title: 'Vrátenie výsledku',
          prompt: 'Doplň príkaz, ktorý vráti výsledok z funkcie.',
          fillCode: 'def add(first_number, second_number):\n    result = first_number + second_number\n    ___ result',
          fillBlanks: [{ id: 'b1', answer: 'return' }],
          xp: 15,
        },
      ],
    },

    // ========== CODING STEPS ==========
    {
      id: 'step-1',
      title: 'Krok 1 - Priprav údaje',
      steps: [
        {
          id: 'code-1',
          type: 'write',
          title: 'Priprav údaje kalkulačky',
          prompt: 'Vytvor tri premenné: first_number s hodnotou 12, second_number s hodnotou 8, a operation s hodnotou "+".',
          starterCode: '# Vytvor premennú first_number\n\n\n# Vytvor premennú second_number\n\n\n# Vytvor premennú operation\n',
          solution: 'first_number = 12\nsecond_number = 8\noperation = "+"',
          tests: [
            { description: 'Premenná first_number existuje', code: '"first_number" in globals()', expected: 'True' },
            { description: 'Hodnota first_number je správna', code: 'first_number == 12', expected: 'True' },
            { description: 'Premenná second_number existuje', code: '"second_number" in globals()', expected: 'True' },
            { description: 'Hodnota second_number je správna', code: 'second_number == 8', expected: 'True' },
            { description: 'Premenná operation existuje', code: '"operation" in globals()', expected: 'True' },
            { description: 'Operácia je uložená ako text', code: 'operation == "+"', expected: 'True' },
            { description: 'Číselné hodnoty majú správny typ', code: 'isinstance(first_number, (int, float)) and isinstance(second_number, (int, float))', expected: 'True' },
          ],
          hints: [
            { text: 'Premennú vytvoríš pomocou názvu, znaku = a hodnoty.', code: 'name = value' },
            { text: 'Prvá premenná sa má volať first_number a má obsahovať číslo 12.' },
            { text: 'Začni týmto riadkom:', code: 'first_number = 12' },
            { text: 'Matematická operácia musí byť uložená ako text. Nezabudni na úvodzovky:', code: 'operation = "+"' },
          ],
          errorMessages: [
            { pattern: 'first_number.*not.*defined', message: 'Premenná first_number nebola vytvorená.', suggestion: 'Vytvor ju a priraď jej hodnotu 12.' },
            { pattern: 'first_number.*"12"', message: 'Hodnota first_number je uložená ako text.', suggestion: 'Odstráň úvodzovky, aby Python hodnotu chápal ako číslo.\n\nNesprávne: first_number = "12"\nSprávne: first_number = 12' },
          ],
          previewState: 'step-1-done',
          xp: 50,
        },
      ],
    },
    {
      id: 'step-2',
      title: 'Krok 2 - Prvý výpočet',
      steps: [
        {
          id: 'code-2',
          type: 'write',
          title: 'Vypočítaj prvý výsledok',
          prompt: 'Vytvor premennú result a ulož do nej súčet premenných first_number a second_number.',
          starterCode: 'first_number = 12\nsecond_number = 8\noperation = "+"\n\nresult = __________________________',
          solution: 'first_number = 12\nsecond_number = 8\noperation = "+"\n\nresult = first_number + second_number',
          tests: [
            { description: 'Premenná result existuje', code: '"result" in globals()', expected: 'True' },
            { description: 'Výsledok má správnu hodnotu', code: 'result == 20', expected: 'True' },
            { description: 'Výsledok je číselný údaj', code: 'isinstance(result, (int, float))', expected: 'True' },
          ],
          hints: [
            { text: 'Na sčítanie dvoch hodnôt používame operátor +' },
            { text: 'Výsledok má vzniknúť sčítaním premenných first_number a second_number.' },
            { text: 'Výraz bude mať tvar:', code: 'prva_premenna + druha_premenna' },
            { text: 'Doplň:', code: 'first_number + second_number' },
          ],
          errorMessages: [
            { pattern: 'result.*not.*defined', message: 'Výpočet prebehol, ale jeho výsledok nie je uložený.', suggestion: 'Vytvor premennú result a ulož do nej výsledok sčítania.' },
            { pattern: 'result.*=.*20', message: 'Výsledok je správny, ale výpočet nepoužíva premenné.', suggestion: 'Použi first_number a second_number, aby kalkulačka fungovala aj s inými číslami.' },
          ],
          previewState: 'step-2-done',
          xp: 60,
        },
      ],
    },
    {
      id: 'step-3',
      title: 'Krok 3 - Podmienky',
      steps: [
        {
          id: 'code-3a',
          type: 'fill',
          title: 'Doplň podmienku pre sčítanie',
          prompt: 'Doplň podmienku, aby kalkulačka vedela, kedy má sčítať čísla.',
          fillCode: 'if ___:\n    result = first_number + second_number',
          fillBlanks: [{ id: 'b1', answer: 'operation == "+"', alternatives: ['operation=="+"', "operation == '+'"] }],
          previewState: 'step-3a-done',
          xp: 20,
        },
        {
          id: 'code-3b',
          type: 'fill',
          title: 'Pridaj odčítanie',
          prompt: 'Doplň kľúčové slovo pre ďalšiu podmienku.',
          fillCode: 'if operation == "+":\n    result = first_number + second_number\n___ operation == "-":\n    result = first_number - second_number',
          fillBlanks: [{ id: 'b1', answer: 'elif' }],
          previewState: 'step-3b-done',
          xp: 20,
        },
        {
          id: 'code-3c',
          type: 'write',
          title: 'Dokonči všetky operácie',
          prompt: 'Napíš kompletný blok podmienok pre všetky 4 operácie (+, -, *, /).',
          starterCode: 'first_number = 12\nsecond_number = 8\noperation = "+"\n\n# Napíš podmienky pre +, -, *, /\n',
          solution: 'first_number = 12\nsecond_number = 8\noperation = "+"\n\nif operation == "+":\n    result = first_number + second_number\nelif operation == "-":\n    result = first_number - second_number\nelif operation == "*":\n    result = first_number * second_number\nelif operation == "/":\n    result = first_number / second_number',
          tests: [
            { description: 'Sčítanie funguje', code: 'operation = "+"; exec(user_code); result == 20', expected: 'True' },
            { description: 'Odčítanie funguje', code: 'operation = "-"; exec(user_code); result == 4', expected: 'True' },
            { description: 'Násobenie funguje', code: 'operation = "*"; exec(user_code); result == 96', expected: 'True' },
            { description: 'Delenie funguje', code: 'operation = "/"; exec(user_code); result == 1.5', expected: 'True' },
          ],
          hints: [
            { text: 'Začni s if pre sčítanie, potom použi elif pre ďalšie operácie.' },
            { text: 'Každá podmienka porovnáva operation s operátorom:', code: 'if operation == "+":' },
            { text: 'Pre násobenie použi *, pre delenie /.' },
          ],
          previewState: 'step-3-done',
          xp: 70,
        },
      ],
    },
    {
      id: 'step-4',
      title: 'Krok 4 - Funkcia calculate',
      steps: [
        {
          id: 'code-4',
          type: 'write',
          title: 'Vytvor funkciu calculate',
          prompt: 'Presuň výpočty do funkcie calculate(first_number, second_number, operation), ktorá vráti výsledok.',
          starterCode: 'def calculate(first_number, second_number, operation):\n    # Napíš podmienky a vráť výsledok\n    pass',
          solution: 'def calculate(first_number, second_number, operation):\n    if operation == "+":\n        return first_number + second_number\n    elif operation == "-":\n        return first_number - second_number\n    elif operation == "*":\n        return first_number * second_number\n    elif operation == "/":\n        return first_number / second_number',
          tests: [
            { description: 'calculate(10, 5, "+") = 15', code: 'calculate(10, 5, "+") == 15', expected: 'True' },
            { description: 'calculate(-3, 8, "+") = 5', code: 'calculate(-3, 8, "+") == 5', expected: 'True' },
            { description: 'calculate(10, 5, "-") = 5', code: 'calculate(10, 5, "-") == 5', expected: 'True' },
            { description: 'calculate(10, 5, "*") = 50', code: 'calculate(10, 5, "*") == 50', expected: 'True' },
            { description: 'calculate(10, 5, "/") = 2.0', code: 'calculate(10, 5, "/") == 2.0', expected: 'True' },
            { description: 'calculate(2.5, 1.5, "+") = 4.0', code: 'calculate(2.5, 1.5, "+") == 4.0', expected: 'True' },
          ],
          hints: [
            { text: 'Funkcia musí obsahovať podmienky pre všetky 4 operácie.' },
            { text: 'Namiesto result = ... použi return ...', code: 'return first_number + second_number' },
            { text: 'Každá vetva podmienky má vrátiť výsledok pomocou return.' },
          ],
          previewState: 'step-4-done',
          xp: 80,
        },
      ],
    },
    {
      id: 'step-5',
      title: 'Krok 5 - Delenie nulou',
      steps: [
        {
          id: 'code-5',
          type: 'write',
          title: 'Ošetri delenie nulou',
          prompt: 'Uprav funkciu calculate tak, aby pri delení nulou vrátila text "Nulou nie je možné deliť." namiesto chyby.',
          starterCode: 'def calculate(first_number, second_number, operation):\n    # Pridaj kontrolu delenia nulou\n    if operation == "+":\n        return first_number + second_number\n    elif operation == "-":\n        return first_number - second_number\n    elif operation == "*":\n        return first_number * second_number\n    elif operation == "/":\n        return first_number / second_number',
          solution: 'def calculate(first_number, second_number, operation):\n    if operation == "/" and second_number == 0:\n        return "Nulou nie je možné deliť."\n    if operation == "+":\n        return first_number + second_number\n    elif operation == "-":\n        return first_number - second_number\n    elif operation == "*":\n        return first_number * second_number\n    elif operation == "/":\n        return first_number / second_number',
          tests: [
            { description: 'calculate(10, 0, "/") vráti chybovú hlášku', code: 'calculate(10, 0, "/") == "Nulou nie je možné deliť."', expected: 'True' },
            { description: 'calculate(10, 5, "/") stále funguje', code: 'calculate(10, 5, "/") == 2.0', expected: 'True' },
            { description: 'Sčítanie stále funguje', code: 'calculate(10, 5, "+") == 15', expected: 'True' },
          ],
          hints: [
            { text: 'Kontrolu pridaj na začiatok funkcie, pred ostatné podmienky.' },
            { text: 'Použi operátor and na spojenie dvoch podmienok:', code: 'if operation == "/" and second_number == 0:' },
            { text: 'Vráť text s chybovou hláškou:', code: 'return "Nulou nie je možné deliť."' },
          ],
          previewState: 'step-5-done',
          xp: 70,
        },
      ],
    },
    {
      id: 'step-6',
      title: 'Krok 6 - Nesprávne vstupy',
      steps: [
        {
          id: 'code-6',
          type: 'write',
          title: 'Ošetri nesprávne vstupy',
          prompt: 'Napíš funkciu safe_convert(value), ktorá bezpečne zmení text na číslo. Ak to nie je možné, vráti None.',
          starterCode: 'def safe_convert(value):\n    # Použi try/except na bezpečnú konverziu\n    pass',
          solution: 'def safe_convert(value):\n    try:\n        return float(value)\n    except ValueError:\n        return None',
          tests: [
            { description: 'safe_convert("12") = 12.0', code: 'safe_convert("12") == 12.0', expected: 'True' },
            { description: 'safe_convert("3.14") = 3.14', code: 'safe_convert("3.14") == 3.14', expected: 'True' },
            { description: 'safe_convert("ahoj") = None', code: 'safe_convert("ahoj") is None', expected: 'True' },
            { description: 'safe_convert("") = None', code: 'safe_convert("") is None', expected: 'True' },
          ],
          hints: [
            { text: 'Použi try a except na zachytenie chyby.' },
            { text: 'V časti try skús float(value):', code: 'try:\n    return float(value)' },
            { text: 'V časti except vráť None:', code: 'except ValueError:\n    return None' },
          ],
          previewState: 'step-6-done',
          xp: 70,
        },
      ],
    },
    {
      id: 'step-7',
      title: 'Krok 7 - Kompletná kalkulačka',
      steps: [
        {
          id: 'code-7',
          type: 'write',
          title: 'Dokonči aplikáciu',
          prompt: 'Napíš kompletnú funkciu calculate, ktorá ošetrí delenie nulou aj nesprávne vstupy. Ak vstup nie je platné číslo, vráť "Zadaj platné číslo."',
          starterCode: 'def calculate(first_input, second_input, operation):\n    # 1. Konvertuj vstupy na čísla (safe_convert)\n    # 2. Skontroluj či sú platné\n    # 3. Skontroluj delenie nulou\n    # 4. Vykonaj výpočet\n    pass\n\ndef safe_convert(value):\n    try:\n        return float(value)\n    except ValueError:\n        return None',
          solution: 'def safe_convert(value):\n    try:\n        return float(value)\n    except ValueError:\n        return None\n\ndef calculate(first_input, second_input, operation):\n    first_number = safe_convert(first_input)\n    second_number = safe_convert(second_input)\n    if first_number is None or second_number is None:\n        return "Zadaj platné číslo."\n    if operation == "/" and second_number == 0:\n        return "Nulou nie je možné deliť."\n    if operation == "+":\n        return first_number + second_number\n    elif operation == "-":\n        return first_number - second_number\n    elif operation == "*":\n        return first_number * second_number\n    elif operation == "/":\n        return first_number / second_number',
          tests: [
            { description: 'calculate("12", "8", "+") = 20.0', code: 'calculate("12", "8", "+") == 20.0', expected: 'True' },
            { description: 'calculate("10", "0", "/") ošetrí delenie nulou', code: 'calculate("10", "0", "/") == "Nulou nie je možné deliť."', expected: 'True' },
            { description: 'calculate("ahoj", "5", "+") ošetrí nesprávny vstup', code: 'calculate("ahoj", "5", "+") == "Zadaj platné číslo."', expected: 'True' },
            { description: 'calculate("10", "abc", "-") ošetrí nesprávny vstup', code: 'calculate("10", "abc", "-") == "Zadaj platné číslo."', expected: 'True' },
            { description: 'calculate("2.5", "1.5", "*") = 3.75', code: 'calculate("2.5", "1.5", "*") == 3.75', expected: 'True' },
          ],
          hints: [
            { text: 'Najprv konvertuj oba vstupy pomocou safe_convert.' },
            { text: 'Skontroluj, či niektorý výsledok je None:', code: 'if first_number is None or second_number is None:' },
            { text: 'Kontrolu delenia nulou daj pred samotné podmienky operácií.' },
          ],
          previewState: 'step-7-done',
          xp: 100,
        },
      ],
    },
  ],

  finalCode: `def safe_convert(value):
    try:
        return float(value)
    except ValueError:
        return None

def calculate(first_input, second_input, operation):
    first_number = safe_convert(first_input)
    second_number = safe_convert(second_input)

    if first_number is None or second_number is None:
        return "Zadaj platné číslo."

    if operation == "/" and second_number == 0:
        return "Nulou nie je možné deliť."

    if operation == "+":
        return first_number + second_number
    elif operation == "-":
        return first_number - second_number
    elif operation == "*":
        return first_number * second_number
    elif operation == "/":
        return first_number / second_number`,
};
