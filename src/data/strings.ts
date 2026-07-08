type Locale = 'en' | 'sk';

const strings = {
  // Homepage
  welcomeBack: { en: 'Welcome back', sk: 'Vitaj späť' },
  dayOne: { en: 'Day one', sk: 'Prvý deň' },
  daysInRow: { en: 'days in a row', sk: 'dní v rade' },
  dayStreak: { en: 'day streak — impressive', sk: 'dňový streak — super' },
  pickLesson: { en: 'Pick a lesson and start learning.', sk: 'Vyber si lekciu a začni sa učiť.' },
  lessonsCompleted: { en: 'lessons completed', sk: 'lekcií dokončených' },
  lessonCompleted: { en: 'lesson completed', sk: 'lekcia dokončená' },

  // Stats sidebar
  yourStats: { en: 'Your Stats', sk: 'Tvoje štatistiky' },
  dayStreakLabel: { en: 'Day Streak', sk: 'Streak' },
  totalXp: { en: 'Total XP', sk: 'Celkové XP' },
  lessonsDone: { en: 'Lessons Done', sk: 'Hotové lekcie' },
  hearts: { en: 'Hearts', sk: 'Životy' },
  gems: { en: 'Gems', sk: 'Gemy' },
  greatJob: { en: 'Great job!', sk: 'Výborne!' },
  keepTrying: { en: 'Keep trying!', sk: 'Nevzdávaj sa!' },
  onFire: { en: 'On fire!', sk: 'Si v rane!' },
  readyToLearn: { en: 'Ready to learn?', sk: 'Pripravený učiť sa?' },

  // BottomNav
  courses: { en: 'Courses', sk: 'Kurzy' },
  reels: { en: 'Reels', sk: 'Reels' },
  projects: { en: 'Projects', sk: 'Projekty' },
  glossary: { en: 'Glossary', sk: 'Slovník' },
  workshop: { en: 'Workshop', sk: 'Šatník' },

  // CodingPath
  coding: { en: 'Coding', sk: 'Programovanie' },
  exercisesCompleted: { en: 'exercises completed', sk: 'cvičení dokončených' },
  exercises: { en: 'exercises', sk: 'cvičení' },
  checkpoint: { en: 'Checkpoint', sk: 'Kontrolný bod' },

  // TheoryHub
  theoryHub: { en: 'Theory Hub', sk: 'Teória' },
  readsCompleted: { en: 'reads completed', sk: 'prečítaných' },
  browseAll: { en: 'Browse all', sk: 'Zobraziť všetko' },
  showLess: { en: 'Show less', sk: 'Zobraziť menej' },
  nowReading: { en: 'Now reading', sk: 'Práve čítaš' },
  moreLessonsAhead: { en: 'more lessons ahead', sk: 'ďalších lekcií' },
  allTheoryDone: { en: 'All theory lessons completed. Nice work.', sk: 'Všetky lekcie dokončené. Výborne.' },
  lesson: { en: 'Lesson', sk: 'Lekcia' },
  lessons: { en: 'lessons', sk: 'lekcií' },

  // Theory lesson page
  introduction: { en: 'Introduction', sk: 'Úvod' },
  learning: { en: 'Learning', sk: 'Učivo' },
  funFacts: { en: 'Fun Facts', sk: 'Zaujímavosti' },
  realWorld: { en: 'Real World', sk: 'Reálny svet' },
  keyTakeaways: { en: 'Key Takeaways', sk: 'Zhrnutie' },
  loading: { en: 'Loading...', sk: 'Načítavam...' },
  lessonNotFound: { en: 'Lesson not found', sk: 'Lekcia nenájdená' },
  continueBtn: { en: 'Continue', sk: 'Pokračovať' },
  startQuiz: { en: 'Start Quiz', sk: 'Spustiť kvíz' },
  finish: { en: 'Finish', sk: 'Dokončiť' },
  trueLbl: { en: 'True', sk: 'Pravda' },
  falseLbl: { en: 'False', sk: 'Nepravda' },
  questionOf: { en: 'Question', sk: 'Otázka' },
  of: { en: 'of', sk: 'z' },
  correct: { en: 'Correct!', sk: 'Správne!' },
  notQuite: { en: 'Not quite', sk: 'Skúste znova' },
  nextQuestion: { en: 'Next Question', sk: 'Ďalšia otázka' },
  lessonComplete: { en: 'Lesson Complete!', sk: 'Lekcia dokončená!' },
  quizScore: { en: 'Quiz Score', sk: 'Skóre kvízu' },
  xpEarned: { en: 'XP Earned', sk: 'Získané XP' },
  backHome: { en: 'Back to Home', sk: 'Späť domov' },
  theoryQuiz: { en: 'Theory + Quiz', sk: 'Teória + Kvíz' },
  practice: { en: 'Practice', sk: 'Precvičovanie' },
  minusHeart: { en: '−1 heart', sk: '−1 srdce' },

  // Glossary
  abbreviations: { en: 'Abbreviations', sk: 'Skratky' },
  terms: { en: 'Terms', sk: 'Pojmy' },
  all: { en: 'All', sk: 'Všetko' },
  searchGlossary: { en: 'Search glossary...', sk: 'Hľadať v slovníku...' },
  results: { en: 'results', sk: 'výsledkov' },
  noResults: { en: 'No results for', sk: 'Žiadne výsledky pre' },

  // Workshop
  locker: { en: 'Locker', sk: 'Skrinka' },
  itemsUnlocked: { en: 'items unlocked', sk: 'predmetov odomknutých' },
  random: { en: 'Random', sk: 'Náhodne' },
  noEquipment: { en: 'No equipment — pick something below', sk: 'Žiadne vybavenie — vyber si niečo' },
  previewMode: { en: 'Preview Mode', sk: 'Náhľad' },
  backToEquipped: { en: 'Back to equipped', sk: 'Späť na nasadené' },
  completeLessonsToUnlock: { en: 'Complete lessons to unlock new items', sk: 'Dokonči lekcie a odomkni nové predmety' },
  allItems: { en: 'All', sk: 'Všetko' },
  hats: { en: 'Hats', sk: 'Čiapky' },
  glasses: { en: 'Glasses', sk: 'Okuliare' },
  accessories: { en: 'Acc', sk: 'Doplnky' },
  antennas: { en: 'Antenna', sk: 'Anténa' },
  auras: { en: 'Aura', sk: 'Aura' },

  // Reels
  videos: { en: 'videos', sk: 'videí' },
  noReels: { en: 'No reels yet.', sk: 'Zatiaľ žiadne reels.' },
  fullLesson: { en: 'Full lesson', sk: 'Celá lekcia' },

  // Result page
  streak: { en: 'Streak', sk: 'Streak' },
  days: { en: 'days', sk: 'dní' },
  openReward: { en: 'Open Reward', sk: 'Otvoriť odmenu' },
  nextLesson: { en: 'Next Lesson', sk: 'Ďalšia lekcia' },

  // NameModal
  heyImByte: { en: "Hi, I'm Coduy", sk: 'Čauko, ja som Coduy' },
  illTeachYou: { en: "I'm the small cute little code guy. I'll teach you how to code. But first — what's your name?", sk: 'Som malý, milý sprievodca svetom kódu. Naučím ťa programovať. Ale najprv — ako sa voláš?' },
  yourName: { en: 'Your name...', sk: 'Tvoje meno...' },
  letsGo: { en: "Let's go", sk: 'Poďme' },

  // Exercise components
  newConcept: { en: 'New concept', sk: 'Nový koncept' },
  understand: { en: 'I understand', sk: 'Rozumiem' },
  incorrect: { en: 'Not quite', sk: 'Nie celkom' },
  tryAgain: { en: 'Try again', sk: 'Skúsiť znova' },
  check: { en: 'Check', sk: 'Skontrolovať' },
  selectAnswer: { en: 'Select the correct answer:', sk: 'Vyber správnu odpoveď:' },
  runCode: { en: 'Run', sk: 'Spustiť' },
  running: { en: 'Running...', sk: 'Spúšťam...' },
  done: { en: 'Done', sk: 'Hotovo' },

  // Topics page
  myProjects: { en: 'My Projects', sk: 'Moje Projekty' },
  myProjectsDesc: { en: 'Pick topics from real projects you want to master.', sk: 'Vyber témy z reálnych projektov, ktoré chceš ovládať.' },
  startLessons: { en: 'Start lessons', sk: 'Začať lekcie' },
  topics: { en: 'topics', sk: 'tém' },
  selectOneTopic: { en: 'Select at least one topic to start learning.', sk: 'Vyber aspoň jednu tému a začni sa učiť z praxe.' },

  // Glossary
  glossarySubtitle: { en: 'Abbreviations, concepts and tools — explained simply.', sk: 'Skratky, koncepty a nástroje — vysvetlené jednoducho.' },

  // Write exercise
  testsPassed: { en: 'Tests passed', sk: 'Testy prešli' },
  testFailed: { en: 'Test failed', sk: 'Test neprešiel' },
  codeShouldContain: { en: 'Code should contain', sk: 'Kód by mal obsahovať' },

  // Workshop status badges
  equippedBadge: { en: 'EQUIPPED', sk: 'NASADENÉ' },
  lockedBadge: { en: 'LOCKED', sk: 'ZAMKNUTÉ' },

  // Tooltips
  switchLang: { en: 'Switch to Slovak', sk: 'Prepnúť na angličtinu' },
  streakTooltip: { en: 'Number of consecutive days you studied.', sk: 'Počet dní za sebou, kedy si sa učil.' },
  xpTooltip: { en: 'Experience points earned from lessons and exercises.', sk: 'Skúsenostné body za dokončené lekcie a cvičenia.' },
  lessonsTooltip: { en: 'Number of completed lessons.', sk: 'Počet dokončených lekcií.' },
  heartsTooltip: { en: 'Health — grows when you are active, drops when you miss a day.', sk: 'Zdravie — rastie keď si aktívny, klesá keď vynecháš deň.' },
  gemsTooltip: { en: 'Gems — virtual currency for rewards and purchases.', sk: 'Gemy — virtuálna mena za odmeny a nákupy.' },

  // Reward
  newWardrobeItem: { en: 'New wardrobe item!', sk: 'Nová vec do šatníka!' },
} as const;

export type StringKey = keyof typeof strings;

export function s(key: StringKey, locale: Locale): string {
  return strings[key][locale];
}

/** Slovak declension for "lekcia dokončená" */
export function skLessons(count: number, locale: Locale): string {
  if (locale === 'en') {
    return count === 1 ? '1 lesson completed' : `${count} lessons completed`;
  }
  if (count === 1) return '1 lekcia dokončená';
  if (count >= 2 && count <= 4) return `${count} lekcie dokončené`;
  return `${count} lekcií dokončených`;
}

/** Slovak declension for streak sidebar */
export function skStreak(count: number, locale: Locale): string {
  if (locale === 'en') {
    return count === 1 ? '1 day' : `${count} days`;
  }
  if (count === 1) return '1 deň';
  if (count >= 2 && count <= 4) return `${count} dni`;
  return `${count} dní`;
}

export default strings;
