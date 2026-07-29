import { InteractiveProject } from '@/types';

export const todoListProject: InteractiveProject = {
  id: 'todo-list',
  title: 'To-Do List',
  subtitle: 'Vytvor interaktívnu aplikáciu na zapisovanie úloh.',
  description: `V tomto projekte vytvoríš interaktívnu aplikáciu na zapisovanie úloh. Používateľ bude môcť napísať novú úlohu, pridať ju do zoznamu, označiť ako dokončenú, odstrániť ju a zobraziť počet zostávajúcich úloh.`,
  difficulty: 'beginner',
  estimatedMinutes: 60,
  skills: [
    'vytvárať zoznamy',
    'pridávať a odstraňovať položky',
    'pracovať s indexmi',
    'používať slovníky',
    'vytvárať funkcie',
    'používať podmienky a cykly',
    'spracovať vstup používateľa',
    'meniť stav aplikácie',
  ],
  icon: '📝',
  color: '#3b82f6',
  totalSteps: 10,
  sections: [
    {
      id: 'theory',
      title: 'Teória',
      steps: [
        {
          id: 'theory-lists',
          type: 'theory',
          title: 'Zoznamy v Pythone',
          theoryContent: `# Čo je zoznam?

Zoznam je dátová štruktúra, ktorá dokáže uchovávať viac hodnôt naraz. V Pythone sa nazýva \`list\`.

\`\`\`python
tasks = []  # prázdny zoznam
\`\`\`

Do zoznamu môžeme uložiť viac úloh:

\`\`\`python
tasks = ["Dokončiť projekt", "Kúpiť potraviny", "Poslať e-mail"]
\`\`\`

## Indexy

Každá položka má svoju pozíciu (index). Python začína počítať od nuly:

\`\`\`text
Index 0 → Dokončiť projekt
Index 1 → Kúpiť potraviny
Index 2 → Poslať e-mail
\`\`\`

## Pridávanie a odstraňovanie

\`\`\`python
tasks.append("Nová úloha")  # pridá na koniec
tasks.pop(1)                 # odstráni podľa indexu
len(tasks)                   # počet položiek
\`\`\``,
          xp: 5,
        },
        {
          id: 'theory-dicts',
          type: 'theory',
          title: 'Slovníky a stav úlohy',
          theoryContent: `# Slovníky

Samotný text nestačí — potrebujeme vedieť aj či je úloha dokončená. Použijeme slovník:

\`\`\`python
task = {
    "title": "Dokončiť projekt",
    "completed": False
}
\`\`\`

\`False\` znamená "úloha ešte nie je dokončená". \`True\` znamená "dokončená".

## Zoznam slovníkov

\`\`\`python
tasks = [
    {"title": "Dokončiť projekt", "completed": False},
    {"title": "Poslať e-mail", "completed": True}
]
\`\`\`

Prístup k údajom:

\`\`\`python
tasks[0]["title"]      # "Dokončiť projekt"
tasks[0]["completed"]  # False
\`\`\``,
          xp: 5,
        },
        {
          id: 'theory-functions',
          type: 'theory',
          title: 'Funkcie pre aplikáciu',
          theoryContent: `# Funkcie v To-Do Liste

Postupne vytvoríme niekoľko funkcií:

- \`add_task()\` — pridá novú úlohu
- \`complete_task()\` / \`toggle_task()\` — zmení stav úlohy
- \`remove_task()\` — odstráni úlohu
- \`count_remaining_tasks()\` — spočíta nedokončené úlohy

Každá funkcia zodpovedá jednej akcii v aplikácii. Keď používateľ klikne na tlačidlo, frontend zavolá príslušnú Python funkciu.

\`\`\`python
def add_task(task_title):
    if task_title:
        tasks.append({"title": task_title, "completed": False})
\`\`\``,
          xp: 5,
        },
      ],
    },
    {
      id: 'quiz',
      title: 'Kvíz',
      steps: [
        {
          id: 'quiz-1', type: 'quiz', title: 'Prázdny zoznam',
          quizQuestion: 'Ktorý zápis vytvorí prázdny zoznam?',
          quizOptions: [
            { text: 'tasks = ""', correct: false },
            { text: 'tasks = []', correct: true },
            { text: 'tasks = {}', correct: false },
            { text: 'tasks = 0', correct: false },
          ],
          xp: 10,
        },
        {
          id: 'quiz-2', type: 'quiz', title: 'Metóda append',
          quizQuestion: 'Čo robí tasks.append("Nakúpiť")?',
          quizOptions: [
            { text: 'Odstráni úlohu.', correct: false },
            { text: 'Pridá novú úlohu do zoznamu.', correct: true },
            { text: 'Spočíta úlohy.', correct: false },
            { text: 'Premenuje zoznam.', correct: false },
          ],
          xp: 10,
        },
        {
          id: 'quiz-3', type: 'quiz', title: 'Indexy',
          quizQuestion: 'Aký index má prvá položka zoznamu?',
          quizOptions: [
            { text: '0', correct: true },
            { text: '1', correct: false },
            { text: '-1', correct: false },
            { text: 'Nemá index.', correct: false },
          ],
          xp: 10,
        },
        {
          id: 'quiz-4', type: 'quiz', title: 'Completed False',
          quizQuestion: 'Čo znamená "completed": False?',
          quizOptions: [
            { text: 'Úloha bola odstránená.', correct: false },
            { text: 'Úloha ešte nie je dokončená.', correct: true },
            { text: 'Úloha nemá názov.', correct: false },
            { text: 'Úloha je dokončená.', correct: false },
          ],
          xp: 10,
        },
      ],
    },
    {
      id: 'step-1',
      title: 'Krok 1 - Prázdny zoznam',
      steps: [{
        id: 'code-1', type: 'fill', title: 'Vytvor prázdny zoznam úloh',
        prompt: 'Vytvor premennú tasks s prázdnym zoznamom.',
        fillCode: 'tasks = __',
        fillBlanks: [{ id: 'b1', answer: '[]' }],
        previewState: 'step-1-done',
        xp: 40,
      }],
    },
    {
      id: 'step-2',
      title: 'Krok 2 - Prvá úloha',
      steps: [{
        id: 'code-2', type: 'fill', title: 'Pridaj prvú úlohu',
        prompt: 'Použi metódu na pridanie textu "Dokončiť Python projekt" do zoznamu tasks.',
        fillCode: 'tasks = []\n\ntasks.___("Dokončiť Python projekt")',
        fillBlanks: [{ id: 'b1', answer: 'append' }],
        previewState: 'step-2-done',
        xp: 50,
      }],
    },
    {
      id: 'step-3',
      title: 'Krok 3 - Počet úloh',
      steps: [{
        id: 'code-3', type: 'write', title: 'Spočítaj počet úloh',
        prompt: 'Vytvor premennú task_count a ulož do nej počet položiek v zozname tasks pomocou funkcie len().',
        starterCode: 'tasks = []\n\ntasks.append("Dokončiť Python projekt")\n\ntask_count = ___',
        solution: 'tasks = []\n\ntasks.append("Dokončiť Python projekt")\n\ntask_count = len(tasks)',
        tests: [
          { description: 'Premenná task_count existuje', code: '"task_count" in globals()', expected: 'True' },
          { description: 'Hodnota je správna', code: 'task_count == len(tasks)', expected: 'True' },
          { description: 'Je to číslo', code: 'isinstance(task_count, int)', expected: 'True' },
        ],
        hints: [
          { text: 'Počet položiek zisťujeme funkciou len().' },
          { text: 'Do zátvoriek vlož tasks.' },
          { text: 'Doplň:', code: 'len(tasks)' },
        ],
        previewState: 'step-3-done',
        xp: 60,
      }],
    },
    {
      id: 'step-4',
      title: 'Krok 4 - Funkcia add_task',
      steps: [{
        id: 'code-4', type: 'write', title: 'Vytvor funkciu add_task()',
        prompt: 'Vytvor funkciu add_task s parametrom task_title, ktorá pridá text do zoznamu tasks pomocou append.',
        starterCode: 'tasks = []\n\n\ndef ___(task_title):\n    tasks.___(task_title)\n\n\nadd_task("Dokončiť Python projekt")\n\ntask_count = len(tasks)',
        solution: 'tasks = []\n\n\ndef add_task(task_title):\n    tasks.append(task_title)\n\n\nadd_task("Dokončiť Python projekt")\n\ntask_count = len(tasks)',
        tests: [
          { description: 'Funkcia add_task existuje', code: '"add_task" in globals()', expected: 'True' },
          { description: 'Je to funkcia', code: 'callable(add_task)', expected: 'True' },
          { description: 'Pridáva úlohu', code: 'tasks.clear(); add_task("Test"); len(tasks) == 1', expected: 'True' },
          { description: 'Pridáva rôzne úlohy', code: 'tasks.clear(); add_task("A"); add_task("B"); tasks == ["A", "B"]', expected: 'True' },
        ],
        hints: [
          { text: 'Funkciu vytvoríš pomocou def.' },
          { text: 'Názov funkcie je add_task.' },
          { text: 'Vo funkcii použi tasks.append(task_title).' },
        ],
        previewState: 'step-4-done',
        xp: 80,
      }],
    },
    {
      id: 'step-5',
      title: 'Krok 5 - Validácia',
      steps: [{
        id: 'code-5', type: 'write', title: 'Zabráň pridaniu prázdnej úlohy',
        prompt: 'Pridaj do funkcie add_task podmienku if, ktorá pridá úlohu iba ak task_title nie je prázdny.',
        starterCode: 'tasks = []\n\n\ndef add_task(task_title):\n    __ task_title:\n        tasks.append(task_title)\n\n\nadd_task("Dokončiť Python projekt")\nadd_task("")\n\ntask_count = len(tasks)',
        solution: 'tasks = []\n\n\ndef add_task(task_title):\n    if task_title:\n        tasks.append(task_title)\n\n\nadd_task("Dokončiť Python projekt")\nadd_task("")\n\ntask_count = len(tasks)',
        tests: [
          { description: 'Neprázdna úloha sa pridá', code: 'tasks.clear(); add_task("Test"); len(tasks) == 1', expected: 'True' },
          { description: 'Prázdna úloha sa nepridá', code: 'tasks.clear(); add_task(""); tasks == []', expected: 'True' },
          { description: 'Existujúce úlohy zostanú', code: 'tasks.clear(); add_task("A"); add_task(""); add_task("B"); tasks == ["A", "B"]', expected: 'True' },
        ],
        hints: [
          { text: 'Na rozhodovanie použi if.' },
          { text: 'Prázdny text "" sa v podmienke správa ako False.' },
          { text: 'Doplň:', code: 'if task_title:' },
        ],
        previewState: 'step-5-done',
        xp: 80,
      }],
    },
    {
      id: 'step-6',
      title: 'Krok 6 - Slovníky',
      steps: [{
        id: 'code-6', type: 'write', title: 'Ulož úlohu ako slovník',
        prompt: 'Uprav funkciu add_task aby namiesto textu pridávala slovník s kľúčmi "title" a "completed" (False).',
        starterCode: 'tasks = []\n\n\ndef add_task(task_title):\n    if task_title:\n        task = {\n            "___": task_title,\n            "___": False\n        }\n\n        tasks.append(___)\n\n\nadd_task("Dokončiť Python projekt")\n\ntask_count = len(tasks)',
        solution: 'tasks = []\n\n\ndef add_task(task_title):\n    if task_title:\n        task = {\n            "title": task_title,\n            "completed": False\n        }\n\n        tasks.append(task)\n\n\nadd_task("Dokončiť Python projekt")\n\ntask_count = len(tasks)',
        tests: [
          { description: 'Prvá položka je slovník', code: 'tasks.clear(); add_task("Test"); isinstance(tasks[0], dict)', expected: 'True' },
          { description: 'Obsahuje title', code: 'tasks.clear(); add_task("Test"); "title" in tasks[0]', expected: 'True' },
          { description: 'Obsahuje completed', code: 'tasks.clear(); add_task("Test"); "completed" in tasks[0]', expected: 'True' },
          { description: 'Title je správny', code: 'tasks.clear(); add_task("Test"); tasks[0]["title"] == "Test"', expected: 'True' },
          { description: 'Completed je False', code: 'tasks.clear(); add_task("Test"); tasks[0]["completed"] is False', expected: 'True' },
        ],
        hints: [
          { text: 'Prvý kľúč je "title".' },
          { text: 'Druhý kľúč je "completed".' },
          { text: 'Do zoznamu pridaj celý slovník: tasks.append(task)' },
        ],
        previewState: 'step-6-done',
        xp: 100,
      }],
    },
    {
      id: 'step-7',
      title: 'Krok 7 - Dokončenie úlohy',
      steps: [{
        id: 'code-7', type: 'write', title: 'Označ úlohu ako dokončenú',
        prompt: 'Vytvor funkciu complete_task(task_index), ktorá zmení completed na True pre úlohu na danom indexe.',
        starterCode: 'def complete_task(task_index):\n    tasks[___]["___"] = ___',
        solution: 'def complete_task(task_index):\n    tasks[task_index]["completed"] = True',
        tests: [
          { description: 'Funkcia existuje', code: 'callable(complete_task)', expected: 'True' },
          { description: 'Dokončí prvú úlohu', code: 'tasks.clear(); add_task("Test"); complete_task(0); tasks[0]["completed"] is True', expected: 'True' },
          { description: 'Dokončí správnu úlohu', code: 'tasks.clear(); add_task("A"); add_task("B"); complete_task(1); tasks[0]["completed"] is False and tasks[1]["completed"] is True', expected: 'True' },
        ],
        hints: [
          { text: 'Použi task_index na výber úlohy: tasks[task_index]' },
          { text: 'Kľúč je "completed".' },
          { text: 'Nastav na True.', code: 'tasks[task_index]["completed"] = True' },
        ],
        previewState: 'step-7-done',
        xp: 110,
      }],
    },
    {
      id: 'step-8',
      title: 'Krok 8 - Odstránenie úlohy',
      steps: [{
        id: 'code-8', type: 'write', title: 'Odstráň vybranú úlohu',
        prompt: 'Vytvor funkciu remove_task(task_index), ktorá odstráni úlohu zo zoznamu pomocou metódy pop().',
        starterCode: 'def remove_task(task_index):\n    tasks.___(___)',
        solution: 'def remove_task(task_index):\n    tasks.pop(task_index)',
        tests: [
          { description: 'Funkcia existuje', code: 'callable(remove_task)', expected: 'True' },
          { description: 'Odstráni úlohu', code: 'tasks.clear(); add_task("A"); add_task("B"); remove_task(0); len(tasks) == 1', expected: 'True' },
          { description: 'Správna úloha zostane', code: 'tasks.clear(); add_task("A"); add_task("B"); remove_task(0); tasks[0]["title"] == "B"', expected: 'True' },
        ],
        hints: [
          { text: 'Metóda pop() odstráni položku podľa indexu.' },
          { text: 'Doplň:', code: 'tasks.pop(task_index)' },
        ],
        previewState: 'step-8-done',
        xp: 110,
      }],
    },
    {
      id: 'step-9',
      title: 'Krok 9 - Zostávajúce úlohy',
      steps: [{
        id: 'code-9', type: 'write', title: 'Spočítaj zostávajúce úlohy',
        prompt: 'Vytvor funkciu count_remaining_tasks(), ktorá pomocou cyklu spočíta iba úlohy s completed = False a vráti ich počet.',
        starterCode: 'def count_remaining_tasks():\n    remaining_count = 0\n\n    for task in tasks:\n        if ___ task["completed"]:\n            remaining_count += 1\n\n    return remaining_count',
        solution: 'def count_remaining_tasks():\n    remaining_count = 0\n\n    for task in tasks:\n        if not task["completed"]:\n            remaining_count += 1\n\n    return remaining_count',
        tests: [
          { description: 'Funkcia existuje', code: 'callable(count_remaining_tasks)', expected: 'True' },
          { description: 'Prázdny zoznam = 0', code: 'tasks.clear(); count_remaining_tasks() == 0', expected: 'True' },
          { description: 'Jedna nedokončená = 1', code: 'tasks.clear(); add_task("A"); count_remaining_tasks() == 1', expected: 'True' },
          { description: 'Dokončená sa nezapočíta', code: 'tasks.clear(); add_task("A"); complete_task(0); count_remaining_tasks() == 0', expected: 'True' },
          { description: 'Mix = správny počet', code: 'tasks.clear(); add_task("A"); add_task("B"); add_task("C"); complete_task(1); count_remaining_tasks() == 2', expected: 'True' },
        ],
        hints: [
          { text: 'Operátor not obráti logickú hodnotu.' },
          { text: 'not False = True, not True = False' },
          { text: 'Doplň:', code: 'if not task["completed"]:' },
        ],
        previewState: 'step-9-done',
        xp: 130,
      }],
    },
    {
      id: 'step-10',
      title: 'Krok 10 - Finálna aplikácia',
      steps: [{
        id: 'code-10', type: 'write', title: 'Dokonči aplikáciu',
        prompt: 'Doplň chýbajúce časti finálneho kódu: strip(), False, append, not, pop, += 1, len.',
        starterCode: `tasks = []


def add_task(task_title):
    task_title = task_title.___()

    if task_title:
        task = {
            "title": task_title,
            "completed": ___
        }

        tasks.___(task)
        return True

    return False


def toggle_task(task_index):
    if 0 <= task_index < len(tasks):
        tasks[task_index]["completed"] = ___ tasks[task_index]["completed"]
        return True

    return False


def remove_task(task_index):
    if 0 <= task_index < len(tasks):
        removed_task = tasks.___(task_index)
        return removed_task

    return None


def count_remaining_tasks():
    remaining_tasks = 0

    for task in tasks:
        if not task["completed"]:
            remaining_tasks += _

    return remaining_tasks


def get_app_data():
    return {
        "tasks": tasks,
        "total_tasks": ___(tasks),
        "remaining_tasks": count_remaining_tasks()
    }


add_task("Dokončiť Python projekt")
add_task("Prečítať novú kapitolu")
add_task("Poslať e-mail")

toggle_task(1)

app_data = get_app_data()`,
        solution: `tasks = []


def add_task(task_title):
    task_title = task_title.strip()

    if task_title:
        task = {
            "title": task_title,
            "completed": False
        }

        tasks.append(task)
        return True

    return False


def toggle_task(task_index):
    if 0 <= task_index < len(tasks):
        tasks[task_index]["completed"] = not tasks[task_index]["completed"]
        return True

    return False


def remove_task(task_index):
    if 0 <= task_index < len(tasks):
        removed_task = tasks.pop(task_index)
        return removed_task

    return None


def count_remaining_tasks():
    remaining_tasks = 0

    for task in tasks:
        if not task["completed"]:
            remaining_tasks += 1

    return remaining_tasks


def get_app_data():
    return {
        "tasks": tasks,
        "total_tasks": len(tasks),
        "remaining_tasks": count_remaining_tasks()
    }


add_task("Dokončiť Python projekt")
add_task("Prečítať novú kapitolu")
add_task("Poslať e-mail")

toggle_task(1)

app_data = get_app_data()`,
        tests: [
          { description: 'add_task funguje', code: 'tasks.clear(); add_task("Test"); len(tasks) == 1', expected: 'True' },
          { description: 'strip() funguje', code: 'tasks.clear(); add_task("  Test  "); tasks[0]["title"] == "Test"', expected: 'True' },
          { description: 'Prázdny vstup odmietnutý', code: 'tasks.clear(); add_task("   ") is False', expected: 'True' },
          { description: 'toggle funguje', code: 'tasks.clear(); add_task("A"); toggle_task(0); tasks[0]["completed"] is True', expected: 'True' },
          { description: 'toggle späť', code: 'tasks.clear(); add_task("A"); toggle_task(0); toggle_task(0); tasks[0]["completed"] is False', expected: 'True' },
          { description: 'remove funguje', code: 'tasks.clear(); add_task("A"); add_task("B"); remove_task(0); tasks[0]["title"] == "B"', expected: 'True' },
          { description: 'count funguje', code: 'tasks.clear(); add_task("A"); add_task("B"); toggle_task(0); count_remaining_tasks() == 1', expected: 'True' },
          { description: 'get_app_data funguje', code: 'tasks.clear(); add_task("A"); d = get_app_data(); d["total_tasks"] == 1 and d["remaining_tasks"] == 1', expected: 'True' },
        ],
        hints: [
          { text: 'strip() odstráni medzery.' },
          { text: 'Nová úloha je False.' },
          { text: 'Pridaj pomocou append.' },
          { text: 'not obráti True/False.' },
          { text: 'pop odstráni podľa indexu.' },
          { text: '+= 1 zvýši počítadlo.' },
          { text: 'len(tasks) vráti počet.' },
        ],
        previewState: 'step-10-done',
        xp: 300,
      }],
    },
  ],

  finalCode: `tasks = []


def add_task(task_title):
    task_title = task_title.strip()

    if task_title:
        task = {
            "title": task_title,
            "completed": False
        }

        tasks.append(task)
        return True

    return False


def toggle_task(task_index):
    if 0 <= task_index < len(tasks):
        tasks[task_index]["completed"] = not tasks[task_index]["completed"]
        return True

    return False


def remove_task(task_index):
    if 0 <= task_index < len(tasks):
        removed_task = tasks.pop(task_index)
        return removed_task

    return None


def count_remaining_tasks():
    remaining_tasks = 0

    for task in tasks:
        if not task["completed"]:
            remaining_tasks += 1

    return remaining_tasks


def get_app_data():
    return {
        "tasks": tasks,
        "total_tasks": len(tasks),
        "remaining_tasks": count_remaining_tasks()
    }`,
};
