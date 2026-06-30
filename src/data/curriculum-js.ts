import { Module } from '@/types';

export const jsModule: Module = {
  id: 'javascript',
  title: 'JavaScript & TypeScript',
  description: 'Moderný web a app development',
  units: [
    {
      id: 'js-basics', moduleId: 'javascript', title: 'JS Základy', description: 'Premenné, funkcie, typy',
      lessons: [
        {
          id: 'js-vars', unitId: 'js-basics', title: 'let, const, var',
          exercises: [
            { id: 'e1', type: 'explain', conceptId: 'js-vars', prompt: 'let, const a var — rozdiel',
              codeSnippet: `const meno = "Zuzka";    // nemožno zmeniť\nlet vek = 20;            // možno zmeniť\nvek = 21;               // OK\n// meno = "Anna";       // Chyba!\n\n// var je starý spôsob — nepoužívaj ho\nvar stary = "zabudni";`,
              explanation: 'const = nemenná hodnota (používaj 90% času). let = premenná hodnota. var = starý JS, vyhýbaj sa mu — má záludné scoping pravidlá.', xp: 5 },
            { id: 'e2', type: 'mcq', conceptId: 'const', prompt: 'Ktoré kľúčové slovo použiješ pre hodnotu, ktorú nemeníš?',
              options: ['var', 'let', 'const', 'static'], correctAnswer: 'const', xp: 10 },
            { id: 'e3', type: 'fill', conceptId: 'js-vars', prompt: 'Doplň správne kľúčové slovo:',
              codeSnippet: '___ API_URL = "https://api.example.com";  // nemení sa',
              blanks: [{ id: 'b1', options: ['const', 'let', 'var', 'final'], correct: 'const' }], xp: 15 },
          ],
        },
        {
          id: 'js-functions', unitId: 'js-basics', title: 'Arrow funkcie',
          exercises: [
            { id: 'e1', type: 'explain', conceptId: 'arrow-functions', prompt: 'Arrow funkcie — moderný zápis',
              codeSnippet: `// Klasická funkcia:\nfunction sucet(a, b) { return a + b; }\n\n// Arrow funkcia:\nconst sucet = (a, b) => a + b;\n\n// Viac riadkov:\nconst pozdrav = (meno) => {\n  const text = \`Ahoj, \${meno}!\`;\n  return text;\n};`,
              explanation: 'Arrow funkcie (=>) sú kratší zápis. Ak máš len jeden výraz, return a {} môžeš vynechať.', xp: 5 },
            { id: 'e2', type: 'mcq', conceptId: 'arrow-functions', prompt: 'Čo vráti: const dvojnasobok = x => x * 2; — dvojnasobok(5)?',
              options: ['5', '10', '25', 'chyba'], correctAnswer: '10', xp: 10 },
            { id: 'e3', type: 'fill', conceptId: 'arrow-functions', prompt: 'Doplň arrow funkciu:',
              codeSnippet: 'const odmocnina = x ___ Math.sqrt(x);',
              blanks: [{ id: 'b1', options: ['=>', '->', '=', ':'], correct: '=>' }], xp: 15 },
          ],
        },
        {
          id: 'js-arrays', unitId: 'js-basics', title: 'Array metódy: map, filter, reduce',
          exercises: [
            { id: 'e1', type: 'explain', conceptId: 'array-methods', prompt: 'Výkonné metódy na polia',
              codeSnippet: `const cisla = [1, 2, 3, 4, 5];\n\n// map — transformuj každý prvok:\nconst dvojnasobky = cisla.map(x => x * 2);\n// [2, 4, 6, 8, 10]\n\n// filter — vyfiltruj:\nconst parne = cisla.filter(x => x % 2 === 0);\n// [2, 4]\n\n// reduce — spoj do jednej hodnoty:\nconst sucet = cisla.reduce((acc, x) => acc + x, 0);\n// 15`,
              explanation: 'map() transformuje každý prvok. filter() vyberie len tie, čo splnia podmienku. reduce() spočíta/spojí všetky do jednej hodnoty.', xp: 5 },
            { id: 'e2', type: 'mcq', conceptId: 'map', prompt: 'Čo vráti [1,2,3].map(x => x + 10)?',
              options: ['[1,2,3]', '[11,12,13]', '6', '[10,20,30]'], correctAnswer: '[11,12,13]', xp: 10 },
            { id: 'e3', type: 'mcq', conceptId: 'filter', prompt: 'Čo vráti ["a","bb","ccc"].filter(s => s.length > 1)?',
              options: ['["a"]', '["bb","ccc"]', '["a","bb","ccc"]', 'chyba'], correctAnswer: '["bb","ccc"]', xp: 10 },
            { id: 'e4', type: 'fill', conceptId: 'array-methods', prompt: 'Doplň metódu na transformáciu:',
              codeSnippet: 'const mena = uziv.___(u => u.name);',
              blanks: [{ id: 'b1', options: ['map', 'filter', 'reduce', 'find'], correct: 'map' }], xp: 15 },
          ],
        },
      ],
    },
    {
      id: 'js-modern', moduleId: 'javascript', title: 'Moderný JavaScript', description: 'Destructuring, spread, optional chaining',
      lessons: [
        {
          id: 'js-destructuring', unitId: 'js-modern', title: 'Destructuring',
          exercises: [
            { id: 'e1', type: 'explain', conceptId: 'destructuring', prompt: 'Destructuring — vyber čo potrebuješ',
              codeSnippet: `// Objekt:\nconst user = { name: "Zuzka", age: 20, city: "BA" };\nconst { name, city } = user;\nconsole.log(name); // "Zuzka"\n\n// Array:\nconst [first, second, ...rest] = [1, 2, 3, 4];\nconsole.log(first);  // 1\nconsole.log(rest);   // [3, 4]\n\n// V parametroch funkcie:\nfunction greet({ name, age }) {\n  return \`\${name} má \${age} rokov\`;\n}`,
              explanation: 'Destructuring "vybalí" hodnoty z objektu alebo poľa do premenných. Šetrí písanie a robí kód čitateľnejším.', xp: 5 },
            { id: 'e2', type: 'mcq', conceptId: 'destructuring', prompt: 'Čo bude v name po: const { name } = { name: "Byte", age: 1 }?',
              options: ['"Byte"', '{ name: "Byte" }', 'undefined', 'chyba'], correctAnswer: '"Byte"', xp: 10 },
            { id: 'e3', type: 'fill', conceptId: 'spread', prompt: 'Doplň spread operátor:',
              codeSnippet: 'const updated = { ...user, city: "KE" };',
              blanks: [], xp: 10 },
            { id: 'e4', type: 'mcq', conceptId: 'optional-chaining', prompt: 'Čo vráti null?.name?',
              options: ['chyba', 'null', 'undefined', '"null"'], correctAnswer: 'undefined',
              explanation: '?. (optional chaining) bezpečne pristupuje k vlastnosti — ak je hodnota null/undefined, vráti undefined namiesto chyby.', xp: 10 },
            { id: 'e5', type: 'mcq', conceptId: 'nullish-coalescing', prompt: 'Čo vráti null ?? "predvolené"?',
              options: ['null', '"predvolené"', 'false', 'chyba'], correctAnswer: '"predvolené"',
              explanation: '?? (nullish coalescing) vráti pravú stranu len ak je ľavá null alebo undefined — na rozdiel od || ktoré reaguejú aj na "" a 0.', xp: 10 },
          ],
        },
        {
          id: 'js-async', unitId: 'js-modern', title: 'async / await',
          exercises: [
            { id: 'e1', type: 'explain', conceptId: 'async-await', prompt: 'async/await — čitateľný asynchrónny kód',
              codeSnippet: `// Promise hell:\nfetch(url)\n  .then(res => res.json())\n  .then(data => console.log(data))\n  .catch(err => console.error(err));\n\n// async/await — oveľa čitateľnejšie:\nasync function nacitaj() {\n  try {\n    const res = await fetch(url);\n    const data = await res.json();\n    console.log(data);\n  } catch (err) {\n    console.error(err);\n  }\n}`,
              explanation: 'async označí funkciu ako asynchrónnu. await "počká" na Promise bez blokovania ostatného kódu. Vždy obaľ do try/catch.', xp: 5 },
            { id: 'e2', type: 'mcq', conceptId: 'async-await', prompt: 'Čo musí obsahovať funkcia, ktorá používa await?',
              options: ['return statement', 'kľúčové slovo async', 'try/catch', 'export'], correctAnswer: 'kľúčové slovo async', xp: 10 },
            { id: 'e3', type: 'mcq', conceptId: 'promise-all', prompt: 'Čo robí Promise.all([p1, p2, p3])?',
              options: ['Spustí promise za sebou', 'Spustí všetky naraz a čaká kým všetky skončia', 'Vráti len prvý výsledok', 'Ignoruje chyby'], correctAnswer: 'Spustí všetky naraz a čaká kým všetky skončia',
              explanation: 'Promise.all je perfektný keď potrebuješ viacero dát naraz (napr. event + profil + attendees).', xp: 10 },
            { id: 'e4', type: 'fill', conceptId: 'async-await', prompt: 'Doplň kľúčové slová:',
              codeSnippet: '___ function loadData() {\n  const data = ___ fetch(url);\n  return data;\n}',
              blanks: [{ id: 'b1', options: ['async', 'sync', 'await', 'defer'], correct: 'async' }, { id: 'b2', options: ['await', 'wait', 'hold', 'async'], correct: 'await' }], xp: 15 },
          ],
        },
      ],
    },
    {
      id: 'ts-types', moduleId: 'javascript', title: 'TypeScript', description: 'Typovaný JavaScript', isCheckpoint: true,
      lessons: [
        {
          id: 'ts-basics', unitId: 'ts-types', title: 'Typy a Type Aliases',
          exercises: [
            { id: 'e1', type: 'explain', conceptId: 'typescript', prompt: 'TypeScript — bezpečnejší JS',
              codeSnippet: `// Type alias:\ntype User = {\n  id: string;\n  name: string;\n  age: number;\n  avatar: string | null;  // union type\n};\n\n// Funkcia s typmi:\nfunction greet(name: string): string {\n  return \`Ahoj, \${name}!\`;\n}\n\n// Optional property:\ntype Config = {\n  url: string;\n  timeout?: number;  // nepovinné\n};`,
              explanation: 'TypeScript pridá typy do JS. Chyby odchytíš pred spustením — nie keď ti zákazník hlási bug.', xp: 5 },
            { id: 'e2', type: 'mcq', conceptId: 'union-types', prompt: 'Čo je union type?',
              options: ['Typ ktorý môže byť jedna z viacerých hodnôt (string | null)', 'Typ pre spojenie dvoch tried', 'Typ pre pole', 'Generický typ'], correctAnswer: 'Typ ktorý môže byť jedna z viacerých hodnôt (string | null)', xp: 10 },
            { id: 'e3', type: 'mcq', conceptId: 'optional-chaining', prompt: 'Čo robí ?. (optional chaining)?',
              options: ['Bezpečný prístup k vlastnosti — vráti undefined namiesto chyby ak je null', 'Vytvorí optional typ', 'Skryje error', 'Skontroluje typ'], correctAnswer: 'Bezpečný prístup k vlastnosti — vráti undefined namiesto chyby ak je null', xp: 10 },
            { id: 'e4', type: 'fill', conceptId: 'union-types', prompt: 'Doplň union type:',
              codeSnippet: 'type ID = string ___ number;',
              blanks: [{ id: 'b1', options: ['|', '&', '+', '||'], correct: '|' }], xp: 15 },
            { id: 'e5', type: 'mcq', conceptId: 'generics', prompt: 'Čo je Record<string, number>?',
              options: ['Pole čísel', 'Objekt kde kľúče sú stringy a hodnoty čísla', 'Funkcia', 'Promise'], correctAnswer: 'Objekt kde kľúče sú stringy a hodnoty čísla',
              explanation: 'Record<K,V> je TypeScript shorthand pre { [key: K]: V }. Napr. Record<string, string[]> pre mapu miest na ulice.', xp: 10 },
          ],
        },
        {
          id: 'ts-narrowing', unitId: 'ts-types', title: 'Type narrowing a as casting',
          exercises: [
            { id: 'e1', type: 'explain', conceptId: 'narrowing', prompt: 'Type narrowing — TypeScript vie viac',
              codeSnippet: `function spracuj(hodnota: string | number) {\n  if (typeof hodnota === "string") {\n    // Tu TS vie že je to string\n    return hodnota.toUpperCase();\n  }\n  // Tu vie že je to number\n  return hodnota * 2;\n}\n\n// as casting — ty hovoríš TS čo to je:\nconst data = response as User[];\n\n// Non-null assertion — ty hovoríš "nie je null":\nconst el = document.getElementById("btn")!;`,
              explanation: 'TypeScript zužuje typ v if/else blokoch (narrowing). as hovorí "ver mi, viem čo to je". ! hovorí "garantujem že nie je null".', xp: 5 },
            { id: 'e2', type: 'mcq', conceptId: 'non-null', prompt: 'Čo robí výkričník (!) v TypeScript?',
              options: ['Logical NOT', 'Non-null assertion — "garantujem že nie je null/undefined"', 'Throws error', 'Optional'], correctAnswer: 'Non-null assertion — "garantujem že nie je null/undefined"', xp: 10 },
          ],
        },
      ],
    },
  ],
};
