import { InteractiveProject } from '@/types';

export const passwordGeneratorProject: InteractiveProject = {
  id: 'password-generator',
  title: 'Password Generator',
  subtitle: 'Vytvor vlastnú aplikáciu na generovanie silných hesiel.',
  description: `V tomto projekte vytvoríš aplikáciu, ktorá dokáže vytvoriť náhodné heslá podľa tvojich požiadaviek. Používateľ si bude môcť vybrať dĺžku hesla, veľké písmená, malé písmená, číslice a špeciálne znaky.`,
  difficulty: 'beginner',
  estimatedMinutes: 50,
  skills: [
    'používať knižnice',
    'importovať moduly',
    'generovať náhodné hodnoty',
    'pracovať s textom',
    'vytvárať zoznamy znakov',
    'používať cykly',
    'vytvárať vlastné funkcie',
  ],
  icon: '🔐',
  color: '#8b5cf6',
  totalSteps: 10,
  sections: [
    // ========== THEORY ==========
    {
      id: 'theory',
      title: 'Teória',
      steps: [
        {
          id: 'theory-why-passwords',
          type: 'theory',
          title: 'Prečo generovať heslá?',
          theoryContent: `# Prečo generovať heslá?

Veľa ľudí používa heslá ako \`123456\` alebo \`password\`. Takéto heslá dokáže útočník uhádnuť za veľmi krátky čas.

Moderné aplikácie preto odporúčajú používať dlhé náhodné heslá, napríklad:

\`\`\`text
vG8#L!xQ2@Pw7
\`\`\`

Bezpečné heslo by malo byť:
- dostatočne dlhé,
- náhodné,
- obsahovať viac druhov znakov,
- nepoužívať slová zo slovníka.`,
          xp: 5,
        },
        {
          id: 'theory-how-random',
          type: 'theory',
          title: 'Ako vzniká náhodné heslo?',
          theoryContent: `# Ako vzniká náhodné heslo?

Počítač si pripraví veľký zoznam možných znakov:
- \`ABCDEFGHIJKLMNOPQRSTUVWXYZ\` — veľké písmená
- \`abcdefghijklmnopqrstuvwxyz\` — malé písmená
- \`0123456789\` — číslice
- \`!@#$%^&*()\` — symboly

Potom začne náhodne vyberať jednotlivé znaky a pokračuje dovtedy, kým nevytvorí celé heslo.

Python obsahuje knižnicu \`random\`, ktorá dokáže vyberať náhodné hodnoty. Napríklad funkcia \`random.choice()\` vyberie jeden náhodný znak zo zoznamu.`,
          xp: 5,
        },
        {
          id: 'theory-libraries',
          type: 'theory',
          title: 'Knižnice a import',
          theoryContent: `# Čo je knižnica?

Python má niektoré nástroje pripravené hneď. Iné si musíš načítať — takýmto nástrojom je knižnica \`random\`.

\`\`\`python
import random
\`\`\`

Od tejto chvíle môžeme používať všetky funkcie, ktoré knižnica obsahuje:

\`\`\`python
random.choice()   # vyberie náhodný prvok
random.randint()  # vygeneruje náhodné celé číslo
\`\`\`

Funkcia je pripravený kus programu, ktorý vykonáva konkrétnu úlohu.`,
          xp: 5,
        },
        {
          id: 'theory-loops',
          type: 'theory',
          title: 'Cykly',
          theoryContent: `# Ako vznikne celé heslo?

Nestačí vybrať iba jeden znak. Musíme ich vybrať viac — a na opakovanie použijeme cyklus \`for\`.

\`\`\`python
for i in range(12):
    # tento kód sa vykoná 12-krát
\`\`\`

Heslo sa skladá postupne:

\`\`\`text
P → Px → Px7 → Px7@ → Px7@L
\`\`\`

A pokračuje dovtedy, kým nemáme požadovanú dĺžku hesla.`,
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
          title: 'Bezpečné heslá',
          quizQuestion: 'Prečo sú náhodné heslá bezpečnejšie?',
          quizOptions: [
            { text: 'Sú krajšie.', correct: false },
            { text: 'Ťažšie sa uhádnu.', correct: true },
            { text: 'Rýchlejšie sa píšu.', correct: false },
            { text: 'Zaberajú menej miesta.', correct: false },
          ],
          xp: 10,
        },
        {
          id: 'quiz-2',
          type: 'quiz',
          title: 'Knižnica random',
          quizQuestion: 'Aká knižnica generuje náhodné hodnoty?',
          quizOptions: [
            { text: 'math', correct: false },
            { text: 'random', correct: true },
            { text: 'text', correct: false },
            { text: 'string', correct: false },
          ],
          xp: 10,
        },
        {
          id: 'quiz-3',
          type: 'quiz',
          title: 'Import',
          quizQuestion: 'Čo robí príkaz import?',
          quizOptions: [
            { text: 'Vymaže program.', correct: false },
            { text: 'Načíta knižnicu do programu.', correct: true },
            { text: 'Vytvorí premennú.', correct: false },
            { text: 'Spustí aplikáciu.', correct: false },
          ],
          xp: 10,
        },
        {
          id: 'quiz-4',
          type: 'quiz',
          title: 'random.choice()',
          quizQuestion: 'Čo robí random.choice()?',
          quizOptions: [
            { text: 'Spočíta čísla.', correct: false },
            { text: 'Vyberie náhodný prvok.', correct: true },
            { text: 'Zoradí zoznam.', correct: false },
            { text: 'Vytvorí premennú.', correct: false },
          ],
          xp: 10,
        },
        {
          id: 'quiz-5',
          type: 'quiz',
          title: 'Cykly',
          quizQuestion: 'Prečo používame cyklus?',
          quizOptions: [
            { text: 'Aby sme nemuseli písať rovnaký kód viackrát.', correct: true },
            { text: 'Aby bol program farebnejší.', correct: false },
            { text: 'Aby bol rýchlejší internet.', correct: false },
            { text: 'Aby vznikla databáza.', correct: false },
          ],
          xp: 10,
        },
      ],
    },

    // ========== CODING STEPS ==========
    {
      id: 'step-1',
      title: 'Krok 1 - Import random',
      steps: [
        {
          id: 'code-1',
          type: 'fill',
          title: 'Načítaj knižnicu random',
          prompt: 'Doplň názov knižnice na generovanie náhodných hodnôt.',
          fillCode: 'import ___',
          fillBlanks: [{ id: 'b1', answer: 'random' }],
          previewState: 'step-1-done',
          xp: 40,
        },
      ],
    },
    {
      id: 'step-2',
      title: 'Krok 2 - Dĺžka hesla',
      steps: [
        {
          id: 'code-2',
          type: 'fill',
          title: 'Nastav dĺžku hesla',
          prompt: 'Nastav dĺžku hesla na 12 znakov.',
          fillCode: 'import random\n\nlength = ___',
          fillBlanks: [{ id: 'b1', answer: '12' }],
          previewState: 'step-2-done',
          xp: 40,
        },
      ],
    },
    {
      id: 'step-3',
      title: 'Krok 3 - Veľké písmená',
      steps: [
        {
          id: 'code-3',
          type: 'write',
          title: 'Pridaj veľké písmená',
          prompt: 'Vytvor premennú uppercase obsahujúcu všetky veľké písmená anglickej abecedy (A-Z).',
          starterCode: 'import random\n\nlength = 12\n\nuppercase = "___"',
          solution: 'import random\n\nlength = 12\n\nuppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"',
          tests: [
            { description: 'Premenná uppercase existuje', code: '"uppercase" in globals()', expected: 'True' },
            { description: 'Obsahuje 26 znakov', code: 'len(uppercase) == 26', expected: 'True' },
            { description: 'Obsahuje správne písmená', code: 'uppercase == "ABCDEFGHIJKLMNOPQRSTUVWXYZ"', expected: 'True' },
            { description: 'Všetky písmená sú veľké', code: 'uppercase.isupper()', expected: 'True' },
          ],
          hints: [
            { text: 'Text začína písmenom A a končí písmenom Z.' },
            { text: 'Použi všetkých 26 písmen bez medzier.' },
            { text: 'Doplň:', code: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
          ],
          previewState: 'step-3-done',
          xp: 50,
        },
      ],
    },
    {
      id: 'step-4',
      title: 'Krok 4 - Malé písmená',
      steps: [
        {
          id: 'code-4',
          type: 'write',
          title: 'Pridaj malé písmená',
          prompt: 'Vytvor premennú lowercase obsahujúcu všetky malé písmená anglickej abecedy (a-z).',
          starterCode: 'import random\n\nlength = 12\n\nuppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"\n\nlowercase = "___"',
          solution: 'import random\n\nlength = 12\n\nuppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"\nlowercase = "abcdefghijklmnopqrstuvwxyz"',
          tests: [
            { description: 'Premenná lowercase existuje', code: '"lowercase" in globals()', expected: 'True' },
            { description: 'Obsahuje 26 znakov', code: 'len(lowercase) == 26', expected: 'True' },
            { description: 'Obsahuje správne písmená', code: 'lowercase == "abcdefghijklmnopqrstuvwxyz"', expected: 'True' },
            { description: 'Všetky písmená sú malé', code: 'lowercase.islower()', expected: 'True' },
          ],
          hints: [
            { text: 'Text začína písmenom a a končí písmenom z.' },
            { text: 'Doplň:', code: 'abcdefghijklmnopqrstuvwxyz' },
          ],
          previewState: 'step-4-done',
          xp: 50,
        },
      ],
    },
    {
      id: 'step-5',
      title: 'Krok 5 - Číslice',
      steps: [
        {
          id: 'code-5',
          type: 'write',
          title: 'Pridaj číslice',
          prompt: 'Vytvor premennú numbers obsahujúcu číslice 0-9 ako text.',
          starterCode: 'import random\n\nlength = 12\n\nuppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"\nlowercase = "abcdefghijklmnopqrstuvwxyz"\n\nnumbers = "___"',
          solution: 'import random\n\nlength = 12\n\nuppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"\nlowercase = "abcdefghijklmnopqrstuvwxyz"\nnumbers = "0123456789"',
          tests: [
            { description: 'Premenná numbers existuje', code: '"numbers" in globals()', expected: 'True' },
            { description: 'Je to text', code: 'isinstance(numbers, str)', expected: 'True' },
            { description: 'Obsahuje 10 znakov', code: 'len(numbers) == 10', expected: 'True' },
            { description: 'Obsahuje správne číslice', code: 'numbers == "0123456789"', expected: 'True' },
          ],
          hints: [
            { text: 'Začni číslicou 0 a skonči číslicou 9.' },
            { text: 'Nezabudni na úvodzovky — číslice musia byť text.' },
            { text: 'Doplň:', code: '0123456789' },
          ],
          previewState: 'step-5-done',
          xp: 50,
        },
      ],
    },
    {
      id: 'step-6',
      title: 'Krok 6 - Symboly',
      steps: [
        {
          id: 'code-6',
          type: 'write',
          title: 'Pridaj symboly',
          prompt: 'Vytvor premennú symbols obsahujúcu špeciálne znaky !@#$%^&*()',
          starterCode: 'import random\n\nlength = 12\n\nuppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"\nlowercase = "abcdefghijklmnopqrstuvwxyz"\nnumbers = "0123456789"\n\nsymbols = "___"',
          solution: 'import random\n\nlength = 12\n\nuppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"\nlowercase = "abcdefghijklmnopqrstuvwxyz"\nnumbers = "0123456789"\nsymbols = "!@#$%^&*()"',
          tests: [
            { description: 'Premenná symbols existuje', code: '"symbols" in globals()', expected: 'True' },
            { description: 'Obsahuje 10 znakov', code: 'len(symbols) == 10', expected: 'True' },
            { description: 'Obsahuje správne symboly', code: 'symbols == "!@#$%^&*()"', expected: 'True' },
          ],
          hints: [
            { text: 'Použi tieto symboly: !@#$%^&*()' },
            { text: 'Nezabudni na úvodzovky.' },
          ],
          previewState: 'step-6-done',
          xp: 50,
        },
      ],
    },
    {
      id: 'step-7',
      title: 'Krok 7 - Spoj znaky',
      steps: [
        {
          id: 'code-7',
          type: 'write',
          title: 'Spoj všetky znaky',
          prompt: 'Vytvor premennú characters spojením všetkých štyroch skupín znakov pomocou operátora +.',
          starterCode: 'import random\n\nlength = 12\n\nuppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"\nlowercase = "abcdefghijklmnopqrstuvwxyz"\nnumbers = "0123456789"\nsymbols = "!@#$%^&*()"\n\ncharacters = ___',
          solution: 'import random\n\nlength = 12\n\nuppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"\nlowercase = "abcdefghijklmnopqrstuvwxyz"\nnumbers = "0123456789"\nsymbols = "!@#$%^&*()"\n\ncharacters = uppercase + lowercase + numbers + symbols',
          tests: [
            { description: 'Premenná characters existuje', code: '"characters" in globals()', expected: 'True' },
            { description: 'Obsahuje 72 znakov', code: 'len(characters) == 72', expected: 'True' },
            { description: 'Obsahuje veľké písmená', code: 'uppercase in characters', expected: 'True' },
            { description: 'Obsahuje malé písmená', code: 'lowercase in characters', expected: 'True' },
            { description: 'Obsahuje číslice', code: 'numbers in characters', expected: 'True' },
            { description: 'Obsahuje symboly', code: 'symbols in characters', expected: 'True' },
          ],
          hints: [
            { text: 'Na spájanie textov používame operátor +.' },
            { text: 'Spoj štyri premenné:', code: 'uppercase + lowercase + ...' },
            { text: 'Celý výraz:', code: 'uppercase + lowercase + numbers + symbols' },
          ],
          previewState: 'step-7-done',
          xp: 60,
        },
      ],
    },
    {
      id: 'step-8',
      title: 'Krok 8 - Náhodný znak',
      steps: [
        {
          id: 'code-8',
          type: 'fill',
          title: 'Vyber náhodný znak',
          prompt: 'Doplň názov funkcie, ktorá vyberie jeden náhodný znak z characters.',
          fillCode: 'random_character = random.___(characters)',
          fillBlanks: [{ id: 'b1', answer: 'choice' }],
          previewState: 'step-8-done',
          xp: 70,
        },
      ],
    },
    {
      id: 'step-9',
      title: 'Krok 9 - Celé heslo',
      steps: [
        {
          id: 'code-9',
          type: 'write',
          title: 'Vytvor celé heslo pomocou cyklu for',
          prompt: 'Vytvor prázdny password a pomocou cyklu for pridaj length náhodných znakov z characters.',
          starterCode: 'password = ""\n\nfor i in range(length):\n    ___',
          solution: 'password = ""\n\nfor i in range(length):\n    password += random.choice(characters)',
          tests: [
            { description: 'Premenná password existuje', code: '"password" in globals()', expected: 'True' },
            { description: 'Je to text', code: 'isinstance(password, str)', expected: 'True' },
            { description: 'Má správnu dĺžku', code: 'len(password) == length', expected: 'True' },
            { description: 'Každý znak je povolený', code: 'all(c in characters for c in password)', expected: 'True' },
          ],
          hints: [
            { text: 'Použi += na pridanie znaku na koniec hesla.' },
            { text: 'Vyber znak pomocou random.choice(characters).' },
            { text: 'Celý riadok:', code: 'password += random.choice(characters)' },
          ],
          previewState: 'step-9-done',
          xp: 120,
        },
      ],
    },
    {
      id: 'step-10',
      title: 'Krok 10 - Funkcia',
      steps: [
        {
          id: 'code-10',
          type: 'write',
          title: 'Vytvor funkciu generate_password',
          prompt: 'Vlož generovanie hesla do funkcie generate_password(), ktorá vráti hotové heslo. Potom funkciu spusti a výsledok ulož do premennej password.',
          starterCode: 'import random\n\nlength = 12\nuppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"\nlowercase = "abcdefghijklmnopqrstuvwxyz"\nnumbers = "0123456789"\nsymbols = "!@#$%^&*()"\ncharacters = uppercase + lowercase + numbers + symbols\n\n\ndef ___():\n    password = ""\n\n    for i in range(length):\n        password += random.choice(characters)\n\n    ___ password\n\n\npassword = ___()',
          solution: 'import random\n\nlength = 12\nuppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"\nlowercase = "abcdefghijklmnopqrstuvwxyz"\nnumbers = "0123456789"\nsymbols = "!@#$%^&*()"\ncharacters = uppercase + lowercase + numbers + symbols\n\n\ndef generate_password():\n    password = ""\n\n    for i in range(length):\n        password += random.choice(characters)\n\n    return password\n\n\npassword = generate_password()',
          tests: [
            { description: 'Funkcia generate_password existuje', code: '"generate_password" in globals()', expected: 'True' },
            { description: 'Je to funkcia', code: 'callable(generate_password)', expected: 'True' },
            { description: 'Vracia text', code: 'isinstance(generate_password(), str)', expected: 'True' },
            { description: 'Heslo má správnu dĺžku', code: 'len(generate_password()) == length', expected: 'True' },
            { description: 'Znaky sú povolené', code: 'all(c in characters for c in generate_password())', expected: 'True' },
          ],
          hints: [
            { text: 'Funkciu vytvoríš pomocou def.' },
            { text: 'Názov funkcie je generate_password.' },
            { text: 'Na konci funkcie vráť heslo pomocou return password.' },
            { text: 'Funkciu spustíš: password = generate_password()' },
          ],
          previewState: 'step-10-done',
          xp: 100,
        },
      ],
    },
  ],

  finalCode: `import random

length = 12

uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
lowercase = "abcdefghijklmnopqrstuvwxyz"
numbers = "0123456789"
symbols = "!@#$%^&*()"

characters = uppercase + lowercase + numbers + symbols


def generate_password():
    password = ""

    for i in range(length):
        password += random.choice(characters)

    return password


password = generate_password()
print(password)`,
};
