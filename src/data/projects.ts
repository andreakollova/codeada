export interface ProjectStep {
  id: string;
  title: string;
  titleSk: string;
  instruction: string;       // Short — what to do
  instructionSk: string;
  context?: string;          // Short — why (optional, 1-2 sentences max)
  contextSk?: string;
  starterCode: string;       // Code with ___ blanks or empty spots
  validateFn: string;        // JS: (code) => true/false
  successMsg: string;        // AI says after success
  successMsgSk: string;
  errorHints: string[];      // Progressive hints for errors
  errorHintsSk: string[];
  previewAddition: string;   // What appears in preview after this step
}

export interface ProjectLesson {
  id: string;
  title: string;
  titleSk: string;
  subtitle: string;
  subtitleSk: string;
  duration: string;
  level: string;
  levelSk: string;
  goal: string;
  goalSk: string;
  preIntro: string;          // "Before we start" text
  preIntroSk: string;
  icon: string;
  previewType: 'react-native' | 'browser' | 'terminal' | 'database';
  language: string;
  steps: ProjectStep[];
}

export interface ProjectTopic {
  id: string;
  title: string;
  titleSk: string;
  description: string;
  descriptionSk: string;
  icon: string;
  color: string;
  lessons: ProjectLesson[];
}

export const projects: ProjectTopic[] = [
  {
    id: 'auth',
    title: 'Authentication',
    titleSk: 'Autentifikácia',
    description: 'Login screens, OAuth, session management',
    descriptionSk: 'Prihlasovacie obrazovky, OAuth, správa sessions',
    icon: '🔐',
    color: '#f59e0b',
    lessons: [
      {
        id: 'login-screen',
        title: 'Build your first Login Screen',
        titleSk: 'Vytvor svoju prvú Login obrazovku',
        subtitle: 'From empty screen to working login — step by step.',
        subtitleSk: 'Od prázdneho screenu po funkčný login — krok po kroku.',
        duration: '25 min',
        level: 'Beginner',
        levelSk: 'Začiatočník',
        goal: 'At the end you will have your own Login screen similar to what thousands of apps use.',
        goalSk: 'Na konci budeš mať vlastnú Login obrazovku podobnú tej, ktorú používajú tisíce aplikácií.',
        preIntro: "Maybe you've never seen React Native. That's perfectly fine. You won't need to know anything. We'll explain every line. Every step has hints. When you make a mistake, AI will explain why. Not just that it's wrong.",
        preIntroSk: 'Možno si nikdy nevidel React Native. To je úplne v poriadku. Nebudeš potrebovať nič vedieť. Každý riadok si vysvetlíme. Každý krok bude mať nápovedy. Keď spravíš chybu, AI ti vysvetlí prečo. Nie iba že je zle.',
        icon: '🔐',
        previewType: 'react-native',
        language: 'typescript',
        steps: [
          // Step 1: Add View
          {
            id: 's1',
            title: 'Add a View',
            titleSk: 'Pridaj View',
            instruction: 'Inside return, add a <View> component. Write it yourself.',
            instructionSk: 'Do return pridaj komponent <View>. Napíš ho sám.',
            context: 'Every React Native screen returns what should be displayed. Right now it returns nothing — that\'s why the preview is empty.',
            contextSk: 'Každá React Native obrazovka vracia to, čo sa má zobraziť. Momentálne nevracia nič — preto je preview prázdne.',
            starterCode: `export default function LoginScreen() {
  return (

  )
}`,
            validateFn: `code.includes('<View>') || code.includes('<View ')`,
            successMsg: 'View is like an empty room. It doesn\'t show anything yet — but everything will go inside it.',
            successMsgSk: 'View je ako prázdna miestnosť. Zatiaľ nič nezobrazuje — ale všetko pôjde dovnútra.',
            errorHints: [
              'The component is called View.',
              'View needs opening and closing tags.',
              '<View>\n\n</View>',
            ],
            errorHintsSk: [
              'Komponent sa volá View.',
              'View potrebuje otvárací aj zatvárací tag.',
              '<View>\n\n</View>',
            ],
            previewAddition: '',
          },
          // Step 2: Add Text (empty)
          {
            id: 's2',
            title: 'Add Text',
            titleSk: 'Pridaj Text',
            instruction: 'Inside the View, add a <Text> component.',
            instructionSk: 'Vnútri View pridaj komponent <Text>.',
            starterCode: `export default function LoginScreen() {
  return (
    <View>

    </View>
  )
}`,
            validateFn: `code.includes('<Text>') || code.includes('<Text ')`,
            successMsg: 'Text is empty for now. Nothing appears because there\'s no content between the tags.',
            successMsgSk: 'Text je zatiaľ prázdny. Nič sa nezobrazuje, pretože medzi značkami nie je žiadny obsah.',
            errorHints: [
              'The component is called Text.',
              'Every Text needs opening and closing tags.',
              '<Text>\n</Text>',
            ],
            errorHintsSk: [
              'Komponent sa volá Text.',
              'Každý Text potrebuje otvárací aj zatvárací tag.',
              '<Text>\n</Text>',
            ],
            previewAddition: '',
          },
          // Step 3: Write "Welcome Back 👋"
          {
            id: 's3',
            title: 'Write the title',
            titleSk: 'Napíš nadpis',
            instruction: 'Write "Welcome Back 👋" between the Text tags.',
            instructionSk: 'Napíš "Welcome Back 👋" medzi značky Text.',
            starterCode: `export default function LoginScreen() {
  return (
    <View>
      <Text>

      </Text>
    </View>
  )
}`,
            validateFn: `code.includes('Welcome Back') || code.includes('Vitaj späť')`,
            successMsg: 'You just created your first component! Click on "Text" in the code to learn more.',
            successMsgSk: 'Práve si vytvoril svoj prvý komponent!',
            errorHints: [
              'Write the text between <Text> and </Text>.',
              '<Text>Welcome Back 👋</Text>',
            ],
            errorHintsSk: [
              'Napíš text medzi <Text> a </Text>.',
              '<Text>Welcome Back 👋</Text>',
            ],
            previewAddition: 'title',
          },
          // Step 4: Add TextInput for email
          {
            id: 's4',
            title: 'Add email input',
            titleSk: 'Pridaj email input',
            instruction: 'Below the Text, add a <TextInput /> component. Don\'t look at the hint.',
            instructionSk: 'Pod Text pridaj komponent <TextInput />. Nepozeraj hint.',
            context: 'TextInput is like an <input> in HTML. In React Native, it\'s a self-closing component.',
            contextSk: 'TextInput je ako <input> v HTML. V React Native sa zapisuje ako samouzatvárací komponent.',
            starterCode: `export default function LoginScreen() {
  return (
    <View>
      <Text>Welcome Back 👋</Text>

    </View>
  )
}`,
            validateFn: `code.includes('<TextInput') && code.includes('/')`,
            successMsg: 'An input field appeared! But we don\'t know what it\'s for yet.',
            successMsgSk: 'Objavilo sa vstupné pole! Ale ešte nevieme na čo je.',
            errorHints: [
              'The component is called TextInput.',
              'TextInput is self-closing: <TextInput />',
              'Add it below the </Text> line.',
            ],
            errorHintsSk: [
              'Komponent sa volá TextInput.',
              'TextInput je samouzatvárací: <TextInput />',
              'Pridaj ho pod riadok </Text>.',
            ],
            previewAddition: 'input-empty',
          },
          // Step 5: Add placeholder
          {
            id: 's5',
            title: 'Add placeholder',
            titleSk: 'Pridaj placeholder',
            instruction: 'Add placeholder="Email" to the TextInput.',
            instructionSk: 'Pridaj placeholder="Email" do TextInput.',
            context: 'Placeholder is the gray text that shows what to type.',
            contextSk: 'Placeholder je sivý text, ktorý ukazuje čo treba napísať.',
            starterCode: `export default function LoginScreen() {
  return (
    <View>
      <Text>Welcome Back 👋</Text>
      <TextInput />
    </View>
  )
}`,
            validateFn: `code.includes('placeholder') && code.includes('Email')`,
            successMsg: 'Now the user knows this field is for email.',
            successMsgSk: 'Teraz používateľ vie, že toto pole je pre email.',
            errorHints: [
              'Add it inside the <TextInput /> tag.',
              '<TextInput placeholder="Email" />',
            ],
            errorHintsSk: [
              'Pridaj to vnútri <TextInput /> tagu.',
              '<TextInput placeholder="Email" />',
            ],
            previewAddition: 'input-email',
          },
          // Step 6: Add password input (on your own)
          {
            id: 's6',
            title: 'Add password input',
            titleSk: 'Pridaj heslo input',
            instruction: 'Now create a second TextInput for Password. On your own — no hints this time.',
            instructionSk: 'Teraz vytvor druhý TextInput pre heslo. Sám — tentokrát bez hintov.',
            starterCode: `export default function LoginScreen() {
  return (
    <View>
      <Text>Welcome Back 👋</Text>
      <TextInput placeholder="Email" />

    </View>
  )
}`,
            validateFn: `code.includes('Password') && (code.match(/<TextInput/g) || []).length >= 2`,
            successMsg: 'Two inputs! The form is taking shape.',
            successMsgSk: 'Dva inputy! Formulár dostáva tvar.',
            errorHints: [
              'Same as email, but with placeholder="Password".',
            ],
            errorHintsSk: [
              'Rovnako ako email, ale s placeholder="Password".',
            ],
            previewAddition: 'input-password',
          },
          // Step 7: Add login button
          {
            id: 's7',
            title: 'Add Login button',
            titleSk: 'Pridaj Login tlačidlo',
            instruction: 'Add a Button component with title="Login".',
            instructionSk: 'Pridaj komponent Button s title="Login".',
            starterCode: `export default function LoginScreen() {
  return (
    <View>
      <Text>Welcome Back 👋</Text>
      <TextInput placeholder="Email" />
      <TextInput placeholder="Password" />

    </View>
  )
}`,
            validateFn: `code.includes('Button') && code.includes('Login')`,
            successMsg: 'Login button appeared! The screen is almost complete.',
            successMsgSk: 'Objavilo sa Login tlačidlo! Screen je skoro hotový.',
            errorHints: [
              'The component is called Button.',
              'Button uses a property called title.',
              '<Button title="Login" />',
            ],
            errorHintsSk: [
              'Komponent sa volá Button.',
              'Button používa property title.',
              '<Button title="Login" />',
            ],
            previewAddition: 'button-login',
          },
          // Step 8: Forgot Password (on your own)
          {
            id: 's8',
            title: 'Add "Forgot Password?"',
            titleSk: 'Pridaj "Forgot Password?"',
            instruction: 'Below the button, add "Forgot Password?" as text. No hints. You already know how.',
            instructionSk: 'Pod tlačidlo pridaj "Forgot Password?" ako text. Bez hintov. Už vieš ako.',
            starterCode: `export default function LoginScreen() {
  return (
    <View>
      <Text>Welcome Back 👋</Text>
      <TextInput placeholder="Email" />
      <TextInput placeholder="Password" />
      <Button title="Login" />

    </View>
  )
}`,
            validateFn: `code.includes('Forgot Password') || code.includes('Zabudnuté heslo')`,
            successMsg: 'Perfect. You added it without any help!',
            successMsgSk: 'Perfektné. Pridal si to úplne sám!',
            errorHints: ['<Text>Forgot Password?</Text>'],
            errorHintsSk: ['<Text>Forgot Password?</Text>'],
            previewAddition: 'forgot-password',
          },
          // Step 9: Google button (fully on your own)
          {
            id: 's9',
            title: 'Add "Continue with Google"',
            titleSk: 'Pridaj "Continue with Google"',
            instruction: 'Add a second button: "Continue with Google". AI won\'t help this time.',
            instructionSk: 'Pridaj druhé tlačidlo: "Continue with Google". AI tentokrát nepomôže.',
            starterCode: `export default function LoginScreen() {
  return (
    <View>
      <Text>Welcome Back 👋</Text>
      <TextInput placeholder="Email" />
      <TextInput placeholder="Password" />
      <Button title="Login" />
      <Text>Forgot Password?</Text>

    </View>
  )
}`,
            validateFn: `code.includes('Google') && ((code.match(/Button/g) || []).length >= 2 || (code.match(/<Text/g) || []).length >= 3)`,
            successMsg: '🎉 You built a complete Login screen! Every component was written by your own hands. No copy-paste. In the next lesson, we\'ll make it respond to user taps.',
            successMsgSk: '🎉 Vytvoril si kompletnú Login obrazovku! Každý komponent si napísal vlastnými rukami. Bez copy-paste. V ďalšej lekcii ju naučíme reagovať na kliknutia.',
            errorHints: ['<Button title="Continue with Google" />'],
            errorHintsSk: ['<Button title="Continue with Google" />'],
            previewAddition: 'button-google',
          },
        ],
      },
    ],
  },
];

export function getProjectLesson(lessonId: string): { topic: ProjectTopic; lesson: ProjectLesson } | undefined {
  for (const topic of projects) {
    const lesson = topic.lessons.find(l => l.id === lessonId);
    if (lesson) return { topic, lesson };
  }
  return undefined;
}
