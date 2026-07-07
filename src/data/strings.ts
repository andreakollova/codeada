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
  workshop: { en: 'Workshop', sk: 'Dielňa' },

  // CodingPath
  coding: { en: 'Coding', sk: 'Programovanie' },
  exercisesCompleted: { en: 'exercises completed', sk: 'cvičení dokončených' },
  exercises: { en: 'exercises', sk: 'cvičení' },

  // TheoryHub
  theory: { en: 'Theory', sk: 'Teória' },
  readingMaterial: { en: 'Reading material', sk: 'Učebný materiál' },
  lessons: { en: 'lessons', sk: 'lekcií' },
  read: { en: 'Read', sk: 'Čítať' },

  // Lesson page
  introduction: { en: 'Introduction', sk: 'Úvod' },
  learning: { en: 'Learning', sk: 'Teória' },
  funFact: { en: 'Fun Fact', sk: 'Zaujímavosť' },
  realWorld: { en: 'Real World', sk: 'Reálny svet' },
  keyTakeaways: { en: 'Key Takeaways', sk: 'Zhrnutie' },
  challenge: { en: 'Challenge', sk: 'Výzva' },
  commonMistakes: { en: 'Common Mistakes', sk: 'Časté chyby' },
  bestPractices: { en: 'Best Practices', sk: 'Najlepšie postupy' },
  startExercises: { en: 'Start Exercises', sk: 'Začni cvičenia' },
  backToTheory: { en: 'Back to Theory', sk: 'Späť na teóriu' },

  // Glossary
  abbreviations: { en: 'Abbreviations', sk: 'Skratky' },
  terms: { en: 'Terms', sk: 'Pojmy' },
  all: { en: 'All', sk: 'Všetko' },
  searchGlossary: { en: 'Search glossary...', sk: 'Hľadať v slovníku...' },

  // Workshop
  allItems: { en: 'All', sk: 'Všetko' },
  hats: { en: 'Hats', sk: 'Čiapky' },
  glasses: { en: 'Glasses', sk: 'Okuliare' },
  accessories: { en: 'Acc', sk: 'Doplnky' },
  antennas: { en: 'Antenna', sk: 'Anténa' },
  auras: { en: 'Aura', sk: 'Aura' },
  equipped: { en: 'Equipped', sk: 'Nasadené' },
  equip: { en: 'Equip', sk: 'Nasadiť' },
  locked: { en: 'Locked', sk: 'Zamknuté' },
  randomize: { en: 'Randomize', sk: 'Náhodne' },

  // Reels
  watchReels: { en: 'Watch Reels', sk: 'Pozerať Reels' },
  noReels: { en: 'No reels yet', sk: 'Zatiaľ žiadne reels' },

  // Exercise types
  explain: { en: 'Explanation', sk: 'Vysvetlenie' },
  multipleChoice: { en: 'Multiple Choice', sk: 'Výber odpovede' },
  fillIn: { en: 'Fill in the blank', sk: 'Doplň chýbajúce' },
  writeCode: { en: 'Write code', sk: 'Napíš kód' },
  check: { en: 'Check', sk: 'Skontrolovať' },
  next: { en: 'Next', sk: 'Ďalej' },
  correct: { en: 'Correct!', sk: 'Správne!' },
  incorrect: { en: 'Incorrect', sk: 'Nesprávne' },
  tryAgain: { en: 'Try again', sk: 'Skús znova' },

  // Result
  lessonComplete: { en: 'Lesson Complete!', sk: 'Lekcia dokončená!' },
  xpEarned: { en: 'XP earned', sk: 'XP získané' },
  continueBtn: { en: 'Continue', sk: 'Pokračovať' },
  backHome: { en: 'Back to Home', sk: 'Späť domov' },
} as const;

export type StringKey = keyof typeof strings;

export function s(key: StringKey, locale: Locale): string {
  return strings[key][locale];
}

export default strings;
