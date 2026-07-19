import { NextResponse } from 'next/server';

const TERMS = [
  { term: 'API', full: 'Application Programming Interface', en: 'A set of rules that lets apps talk to each other.', sk: 'Pravidlá, ktoré umožňujú appkám komunikovať.' },
  { term: 'Bug', full: '', en: 'An error in code that causes unexpected behavior.', sk: 'Chyba v kóde, ktorá spôsobuje neočakávané správanie.' },
  { term: 'Variable', full: '', en: 'A named container that stores a value.', sk: 'Pomenovaný kontajner, ktorý uchováva hodnotu.' },
  { term: 'Function', full: '', en: 'A reusable block of code for a specific task.', sk: 'Znovupoužiteľný blok kódu pre konkrétnu úlohu.' },
  { term: 'Loop', full: '', en: 'Code that repeats until a condition is met.', sk: 'Kód, ktorý sa opakuje kým nie je splnená podmienka.' },
  { term: 'Array', full: '', en: 'An ordered collection of items.', sk: 'Usporiadaná kolekcia prvkov.' },
  { term: 'String', full: '', en: 'A sequence of characters, like text.', sk: 'Postupnosť znakov, ako text.' },
  { term: 'Boolean', full: '', en: 'A value that is either True or False.', sk: 'Hodnota, ktorá je buď True alebo False.' },
  { term: 'Class', full: '', en: 'A blueprint for creating objects.', sk: 'Predloha na vytváranie objektov.' },
  { term: 'Git', full: '', en: 'A system that tracks changes in your code.', sk: 'Systém, ktorý sleduje zmeny v kóde.' },
  { term: 'HTTP', full: 'HyperText Transfer Protocol', en: 'The protocol browsers use to talk to servers.', sk: 'Protokol, ktorý prehliadače používajú na komunikáciu.' },
  { term: 'JSON', full: 'JavaScript Object Notation', en: 'A format for storing and transferring data.', sk: 'Formát na ukladanie a prenos dát.' },
  { term: 'CSS', full: 'Cascading Style Sheets', en: 'The language that styles websites.', sk: 'Jazyk, ktorý štylizuje webové stránky.' },
  { term: 'SQL', full: 'Structured Query Language', en: 'A language for querying databases.', sk: 'Jazyk na dopytovanie databáz.' },
  { term: 'IDE', full: 'Integrated Development Environment', en: 'A tool that helps you write code efficiently.', sk: 'Nástroj na efektívne písanie kódu.' },
  { term: 'RAM', full: 'Random Access Memory', en: 'Temporary memory used while running programs.', sk: 'Dočasná pamäť používaná pri spúšťaní programov.' },
  { term: 'DNS', full: 'Domain Name System', en: 'Translates website names into IP addresses.', sk: 'Prekladá názvy webov na IP adresy.' },
  { term: 'Algorithm', full: '', en: 'Step-by-step instructions to solve a problem.', sk: 'Postupné inštrukcie na vyriešenie problému.' },
  { term: 'Debugging', full: '', en: 'Finding and fixing errors in code.', sk: 'Hľadanie a opravovanie chýb v kóde.' },
  { term: 'Framework', full: '', en: 'A structure that helps you build apps faster.', sk: 'Štruktúra, ktorá pomáha vytvárať appky rýchlejšie.' },
  { term: 'Recursion', full: '', en: 'When a function calls itself.', sk: 'Keď funkcia volá samú seba.' },
  { term: 'Encryption', full: '', en: 'Converting data into a secret code.', sk: 'Premena dát na tajný kód.' },
  { term: 'Compiler', full: '', en: 'Translates your code into machine language.', sk: 'Prekladá tvoj kód do strojového jazyka.' },
  { term: 'Deployment', full: '', en: 'Making your app available to users.', sk: 'Sprístupnenie appky používateľom.' },
  { term: 'Callback', full: '', en: 'A function passed to be called later.', sk: 'Funkcia odovzdaná na neskoršie zavolanie.' },
  { term: 'Scope', full: '', en: 'Where a variable can be accessed in code.', sk: 'Kde je premenná prístupná v kóde.' },
  { term: 'Token', full: '', en: 'A piece of data used for authentication.', sk: 'Kúsok dát na autentifikáciu.' },
  { term: 'Webhook', full: '', en: 'Auto message sent between apps when something happens.', sk: 'Automatická správa medzi appkami keď sa niečo stane.' },
  { term: 'Middleware', full: '', en: 'Software between the app and the server.', sk: 'Softvér medzi appkou a serverom.' },
  { term: 'OOP', full: 'Object Oriented Programming', en: 'Organizing code into objects with data and behavior.', sk: 'Organizovanie kódu do objektov s dátami a správaním.' },
];

export async function GET() {
  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const term = TERMS[day % TERMS.length];

  return NextResponse.json(term, {
    headers: { 'Cache-Control': 'public, max-age=3600' },
  });
}
