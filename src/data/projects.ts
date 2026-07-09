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
      // === Sign Up Screen ===
      {
        id: 'signup-screen',
        title: 'Build a Sign Up Screen',
        titleSk: 'Vytvor Sign Up obrazovku',
        subtitle: 'Registration form with name, email, password — step by step.',
        subtitleSk: 'Registracny formular s menom, emailom, heslom — krok po kroku.',
        duration: '20 min',
        level: 'Beginner',
        levelSk: 'Zaciatocnik',
        goal: 'You will build a complete registration screen that collects user info.',
        goalSk: 'Vytvoris kompletnu registracnu obrazovku, ktora zbiera udaje pouzivatela.',
        preIntro: 'This is very similar to the Login screen. If you completed that one, this will feel familiar. If not, no worries — every step is guided.',
        preIntroSk: 'Toto je velmi podobne Login obrazovke. Ak si ju dokoncil, bude ti to zname. Ak nie, ziadny problem — kazdy krok je vedeny.',
        icon: '📝',
        previewType: 'react-native',
        language: 'typescript',
        steps: [
          {
            id: 's1',
            title: 'Add a View',
            titleSk: 'Pridaj View',
            instruction: 'Inside return, add a <View> component.',
            instructionSk: 'Do return pridaj komponent <View>.',
            context: 'View is the container for everything on screen.',
            contextSk: 'View je kontajner pre vsetko na obrazovke.',
            starterCode: `export default function SignUpScreen() {\n  return (\n\n  )\n}`,
            validateFn: `code.includes('<View>') || code.includes('<View ')`,
            successMsg: 'Great start! View is ready to hold your form.',
            successMsgSk: 'Skvelý zaciatok! View je pripraveny na tvoj formular.',
            errorHints: ['The component is called View.', '<View>\n\n</View>'],
            errorHintsSk: ['Komponent sa vola View.', '<View>\n\n</View>'],
            previewAddition: '',
          },
          {
            id: 's2',
            title: 'Add title',
            titleSk: 'Pridaj nadpis',
            instruction: 'Inside the View, add a <Text> with "Create Account".',
            instructionSk: 'Vnutri View pridaj <Text> s textom "Create Account".',
            starterCode: `export default function SignUpScreen() {\n  return (\n    <View>\n\n    </View>\n  )\n}`,
            validateFn: `code.includes('Create Account')`,
            successMsg: 'The title tells users what this screen is for.',
            successMsgSk: 'Nadpis pouzivatelom hovori, na co je tato obrazovka.',
            errorHints: ['Write "Create Account" between <Text> tags.', '<Text>Create Account</Text>'],
            errorHintsSk: ['Napis "Create Account" medzi <Text> tagy.', '<Text>Create Account</Text>'],
            previewAddition: 'signup-title',
          },
          {
            id: 's3',
            title: 'Add name input',
            titleSk: 'Pridaj meno input',
            instruction: 'Add a <TextInput /> with placeholder="Full Name".',
            instructionSk: 'Pridaj <TextInput /> s placeholder="Full Name".',
            starterCode: `export default function SignUpScreen() {\n  return (\n    <View>\n      <Text>Create Account</Text>\n\n    </View>\n  )\n}`,
            validateFn: `code.includes('<TextInput') && code.includes('Full Name')`,
            successMsg: 'Name field added! Users can enter their name.',
            successMsgSk: 'Pole pre meno pridane! Pouzivatelia mozu zadat svoje meno.',
            errorHints: ['Use TextInput with placeholder prop.', '<TextInput placeholder="Full Name" />'],
            errorHintsSk: ['Pouzi TextInput s placeholder vlastnostou.', '<TextInput placeholder="Full Name" />'],
            previewAddition: 'signup-input-name',
          },
          {
            id: 's4',
            title: 'Add email input',
            titleSk: 'Pridaj email input',
            instruction: 'Add another <TextInput /> with placeholder="Email".',
            instructionSk: 'Pridaj dalsi <TextInput /> s placeholder="Email".',
            starterCode: `export default function SignUpScreen() {\n  return (\n    <View>\n      <Text>Create Account</Text>\n      <TextInput placeholder="Full Name" />\n\n    </View>\n  )\n}`,
            validateFn: `code.includes('Email') && (code.match(/<TextInput/g) || []).length >= 2`,
            successMsg: 'Email field is in. The form is growing!',
            successMsgSk: 'Emailove pole je na mieste. Formular rastie!',
            errorHints: ['Same as name, but placeholder="Email".', '<TextInput placeholder="Email" />'],
            errorHintsSk: ['Rovnako ako meno, ale placeholder="Email".', '<TextInput placeholder="Email" />'],
            previewAddition: 'signup-input-email',
          },
          {
            id: 's5',
            title: 'Add password input',
            titleSk: 'Pridaj heslo input',
            instruction: 'Add a <TextInput /> with placeholder="Password".',
            instructionSk: 'Pridaj <TextInput /> s placeholder="Password".',
            starterCode: `export default function SignUpScreen() {\n  return (\n    <View>\n      <Text>Create Account</Text>\n      <TextInput placeholder="Full Name" />\n      <TextInput placeholder="Email" />\n\n    </View>\n  )\n}`,
            validateFn: `code.includes('Password') && (code.match(/<TextInput/g) || []).length >= 3`,
            successMsg: 'Password field ready. Security first!',
            successMsgSk: 'Pole pre heslo pripravene. Bezpecnost na prvom mieste!',
            errorHints: ['<TextInput placeholder="Password" />'],
            errorHintsSk: ['<TextInput placeholder="Password" />'],
            previewAddition: 'signup-input-password',
          },
          {
            id: 's6',
            title: 'Add Sign Up button',
            titleSk: 'Pridaj Sign Up tlacidlo',
            instruction: 'Add a <Button /> with title="Sign Up".',
            instructionSk: 'Pridaj <Button /> s title="Sign Up".',
            starterCode: `export default function SignUpScreen() {\n  return (\n    <View>\n      <Text>Create Account</Text>\n      <TextInput placeholder="Full Name" />\n      <TextInput placeholder="Email" />\n      <TextInput placeholder="Password" />\n\n    </View>\n  )\n}`,
            validateFn: `code.includes('Button') && code.includes('Sign Up')`,
            successMsg: 'Sign Up button is live! Almost done.',
            successMsgSk: 'Sign Up tlacidlo je aktivne! Skoro hotovo.',
            errorHints: ['The component is Button with a title prop.', '<Button title="Sign Up" />'],
            errorHintsSk: ['Komponent je Button s title vlastnostou.', '<Button title="Sign Up" />'],
            previewAddition: 'signup-button',
          },
          {
            id: 's7',
            title: 'Add login link',
            titleSk: 'Pridaj login odkaz',
            instruction: 'Add text: "Already have an account? Login".',
            instructionSk: 'Pridaj text: "Already have an account? Login".',
            starterCode: `export default function SignUpScreen() {\n  return (\n    <View>\n      <Text>Create Account</Text>\n      <TextInput placeholder="Full Name" />\n      <TextInput placeholder="Email" />\n      <TextInput placeholder="Password" />\n      <Button title="Sign Up" />\n\n    </View>\n  )\n}`,
            validateFn: `code.includes('Already have an account') || code.includes('Login')`,
            successMsg: 'Complete Sign Up screen! Users can register or go back to login.',
            successMsgSk: 'Kompletna Sign Up obrazovka! Pouzivatelia sa mozu registrovat alebo sa vratit na login.',
            errorHints: ['<Text>Already have an account? Login</Text>'],
            errorHintsSk: ['<Text>Already have an account? Login</Text>'],
            previewAddition: 'signup-login-link',
          },
        ],
      },
    ],
  },
  // === SCREENS TOPIC ===
  {
    id: 'screens',
    title: 'Screens',
    titleSk: 'Obrazovky',
    description: 'Profile pages, settings, navigation screens',
    descriptionSk: 'Profilove stranky, nastavenia, navigacne obrazovky',
    icon: '📱',
    color: '#8b5cf6',
    lessons: [
      // === Profile Screen ===
      {
        id: 'profile-screen',
        title: 'Build a Profile Screen',
        titleSk: 'Vytvor profilovu obrazovku',
        subtitle: 'User profile with avatar, bio, and stats.',
        subtitleSk: 'Profil pouzivatela s avatarom, biom a statistikami.',
        duration: '25 min',
        level: 'Beginner',
        levelSk: 'Zaciatocnik',
        goal: 'Build a profile screen like Instagram or Twitter.',
        goalSk: 'Vytvor profilovu obrazovku ako Instagram alebo Twitter.',
        preIntro: 'Profile screens are everywhere. Every social app has one. You will build yours from scratch.',
        preIntroSk: 'Profilove obrazovky su vsade. Kazda socialna aplikacia ma jednu. Vytvoris si svoju od nuly.',
        icon: '👤',
        previewType: 'react-native',
        language: 'typescript',
        steps: [
          {
            id: 's1',
            title: 'Add a View',
            titleSk: 'Pridaj View',
            instruction: 'Start with a <View> inside return.',
            instructionSk: 'Zacni s <View> vnutri return.',
            starterCode: `export default function ProfileScreen() {\n  return (\n\n  )\n}`,
            validateFn: `code.includes('<View>') || code.includes('<View ')`,
            successMsg: 'View is your canvas. Everything goes inside.',
            successMsgSk: 'View je tvoje platno. Vsetko ide dovnutra.',
            errorHints: ['<View>\n\n</View>'],
            errorHintsSk: ['<View>\n\n</View>'],
            previewAddition: '',
          },
          {
            id: 's2',
            title: 'Add avatar',
            titleSk: 'Pridaj avatar',
            instruction: 'Add a <View> with style for a circle (the avatar placeholder). Use a comment {/* Avatar */} inside it.',
            instructionSk: 'Pridaj <View> so stylom pre kruh (placeholder avataru). Pouzi komentar {/* Avatar */} vnutri.',
            context: 'We use a styled View as a circle placeholder for the profile picture.',
            contextSk: 'Pouzivame stylizovany View ako kruhovy placeholder pre profilovy obrazok.',
            starterCode: `export default function ProfileScreen() {\n  return (\n    <View>\n\n    </View>\n  )\n}`,
            validateFn: `code.includes('Avatar') && (code.match(/<View/g) || []).length >= 2`,
            successMsg: 'Avatar circle added! It represents the user photo.',
            successMsgSk: 'Avatar kruh pridany! Reprezentuje fotku pouzivatela.',
            errorHints: ['Add a second <View> inside the first one.', '<View>{/* Avatar */}</View>'],
            errorHintsSk: ['Pridaj druhy <View> vnutri prveho.', '<View>{/* Avatar */}</View>'],
            previewAddition: 'profile-avatar',
          },
          {
            id: 's3',
            title: 'Add name',
            titleSk: 'Pridaj meno',
            instruction: 'Below the avatar, add <Text>John Doe</Text>.',
            instructionSk: 'Pod avatar pridaj <Text>John Doe</Text>.',
            starterCode: `export default function ProfileScreen() {\n  return (\n    <View>\n      <View>{/* Avatar */}</View>\n\n    </View>\n  )\n}`,
            validateFn: `code.includes('John Doe') || code.includes('<Text>')`,
            successMsg: 'Name displayed! The user knows whose profile this is.',
            successMsgSk: 'Meno zobrazene! Pouzivatel vie, ci profil to je.',
            errorHints: ['<Text>John Doe</Text>'],
            errorHintsSk: ['<Text>John Doe</Text>'],
            previewAddition: 'profile-name',
          },
          {
            id: 's4',
            title: 'Add bio',
            titleSk: 'Pridaj bio',
            instruction: 'Add another <Text> with a short bio: "Mobile developer & coffee lover".',
            instructionSk: 'Pridaj dalsi <Text> s kratkym biom: "Mobile developer & coffee lover".',
            starterCode: `export default function ProfileScreen() {\n  return (\n    <View>\n      <View>{/* Avatar */}</View>\n      <Text>John Doe</Text>\n\n    </View>\n  )\n}`,
            validateFn: `(code.match(/<Text>/g) || code.match(/<Text /g) || []).length >= 2 || code.includes('developer') || code.includes('coffee')`,
            successMsg: 'Bio gives personality to the profile!',
            successMsgSk: 'Bio dava profilu osobnost!',
            errorHints: ['Add a Text with the bio text inside.', '<Text>Mobile developer & coffee lover</Text>'],
            errorHintsSk: ['Pridaj Text s bio textom vnutri.', '<Text>Mobile developer & coffee lover</Text>'],
            previewAddition: 'profile-bio',
          },
          {
            id: 's5',
            title: 'Add stats row',
            titleSk: 'Pridaj riadok statistik',
            instruction: 'Add a <View> with three <Text> elements inside: "120 Posts", "4.5K Followers", "380 Following".',
            instructionSk: 'Pridaj <View> s tromi <Text> elementmi vnutri: "120 Posts", "4.5K Followers", "380 Following".',
            starterCode: `export default function ProfileScreen() {\n  return (\n    <View>\n      <View>{/* Avatar */}</View>\n      <Text>John Doe</Text>\n      <Text>Mobile developer & coffee lover</Text>\n\n    </View>\n  )\n}`,
            validateFn: `code.includes('Posts') && code.includes('Followers') && code.includes('Following')`,
            successMsg: 'Stats row complete! Shows social proof at a glance.',
            successMsgSk: 'Riadok statistik hotovy! Ukazuje socialny dokaz na prvy pohlad.',
            errorHints: ['Create a View with three Text children.', '<View>\n  <Text>120 Posts</Text>\n  <Text>4.5K Followers</Text>\n  <Text>380 Following</Text>\n</View>'],
            errorHintsSk: ['Vytvor View s tromi Text detmi.', '<View>\n  <Text>120 Posts</Text>\n  <Text>4.5K Followers</Text>\n  <Text>380 Following</Text>\n</View>'],
            previewAddition: 'profile-stats',
          },
          {
            id: 's6',
            title: 'Add Edit Profile button',
            titleSk: 'Pridaj Edit Profile tlacidlo',
            instruction: 'Add a <Button title="Edit Profile" />.',
            instructionSk: 'Pridaj <Button title="Edit Profile" />.',
            starterCode: `export default function ProfileScreen() {\n  return (\n    <View>\n      <View>{/* Avatar */}</View>\n      <Text>John Doe</Text>\n      <Text>Mobile developer & coffee lover</Text>\n      <View>\n        <Text>120 Posts</Text>\n        <Text>4.5K Followers</Text>\n        <Text>380 Following</Text>\n      </View>\n\n    </View>\n  )\n}`,
            validateFn: `code.includes('Button') && code.includes('Edit Profile')`,
            successMsg: 'Edit Profile button ready! Users can update their info.',
            successMsgSk: 'Tlacidlo Edit Profile pripravene! Pouzivatelia mozu aktualizovat svoje udaje.',
            errorHints: ['<Button title="Edit Profile" />'],
            errorHintsSk: ['<Button title="Edit Profile" />'],
            previewAddition: 'profile-edit-btn',
          },
          {
            id: 's7',
            title: 'Add posts grid label',
            titleSk: 'Pridaj label pre grid prispevkov',
            instruction: 'Add <Text>Posts</Text> as a section header for the grid below.',
            instructionSk: 'Pridaj <Text>Posts</Text> ako hlavicku sekcie pre grid nizsie.',
            starterCode: `export default function ProfileScreen() {\n  return (\n    <View>\n      <View>{/* Avatar */}</View>\n      <Text>John Doe</Text>\n      <Text>Mobile developer & coffee lover</Text>\n      <View>\n        <Text>120 Posts</Text>\n        <Text>4.5K Followers</Text>\n        <Text>380 Following</Text>\n      </View>\n      <Button title="Edit Profile" />\n\n    </View>\n  )\n}`,
            validateFn: `(code.match(/<Text>Posts<\\/Text>/g) || []).length >= 1 || (code.match(/Posts/g) || []).length >= 2`,
            successMsg: 'Profile screen complete! Avatar, stats, bio, and posts section — just like a real app.',
            successMsgSk: 'Profilova obrazovka hotova! Avatar, statistiky, bio a sekcia prispevkov — presne ako v realnej appke.',
            errorHints: ['Add <Text>Posts</Text> at the bottom.'],
            errorHintsSk: ['Pridaj <Text>Posts</Text> na spodok.'],
            previewAddition: 'profile-posts-grid',
          },
        ],
      },
      // === Settings Page ===
      {
        id: 'settings-page',
        title: 'Build a Settings Page',
        titleSk: 'Vytvor stranku Nastaveni',
        subtitle: 'Settings list with toggles and options.',
        subtitleSk: 'Zoznam nastaveni s prepinacmi a moznostami.',
        duration: '20 min',
        level: 'Beginner',
        levelSk: 'Zaciatocnik',
        goal: 'Build a settings screen with toggles and action rows.',
        goalSk: 'Vytvor obrazovku nastaveni s prepinacmi a akciami.',
        preIntro: 'Every app needs a settings page. You will build one with notification toggle, dark mode, language selection, and logout.',
        preIntroSk: 'Kazda aplikacia potrebuje stranku nastaveni. Vytvoris jednu s prepinacmi pre notifikacie, dark mode, vyber jazyka a odhlasenie.',
        icon: '⚙️',
        previewType: 'react-native',
        language: 'typescript',
        steps: [
          {
            id: 's1',
            title: 'Add a View',
            titleSk: 'Pridaj View',
            instruction: 'Start with a <View> component inside return.',
            instructionSk: 'Zacni s komponentom <View> vnutri return.',
            starterCode: `export default function SettingsScreen() {\n  return (\n\n  )\n}`,
            validateFn: `code.includes('<View>') || code.includes('<View ')`,
            successMsg: 'Container ready for settings items.',
            successMsgSk: 'Kontajner pripraveny pre polozky nastaveni.',
            errorHints: ['<View>\n\n</View>'],
            errorHintsSk: ['<View>\n\n</View>'],
            previewAddition: '',
          },
          {
            id: 's2',
            title: 'Add header',
            titleSk: 'Pridaj hlavicku',
            instruction: 'Add <Text>Settings</Text> as the page header.',
            instructionSk: 'Pridaj <Text>Settings</Text> ako hlavicku stranky.',
            starterCode: `export default function SettingsScreen() {\n  return (\n    <View>\n\n    </View>\n  )\n}`,
            validateFn: `code.includes('Settings') && code.includes('<Text')`,
            successMsg: 'Header set! Users know where they are.',
            successMsgSk: 'Hlavicka nastavena! Pouzivatelia vedia kde su.',
            errorHints: ['<Text>Settings</Text>'],
            errorHintsSk: ['<Text>Settings</Text>'],
            previewAddition: 'settings-header',
          },
          {
            id: 's3',
            title: 'Add notifications toggle',
            titleSk: 'Pridaj prepinac notifikacii',
            instruction: 'Add a <View> row with <Text>Notifications</Text> and <Switch /> inside.',
            instructionSk: 'Pridaj <View> riadok s <Text>Notifications</Text> a <Switch /> vnutri.',
            context: 'Switch is a toggle component in React Native, like a checkbox but prettier.',
            contextSk: 'Switch je prepinaci komponent v React Native, ako checkbox ale krajsi.',
            starterCode: `export default function SettingsScreen() {\n  return (\n    <View>\n      <Text>Settings</Text>\n\n    </View>\n  )\n}`,
            validateFn: `code.includes('Notifications') && code.includes('Switch')`,
            successMsg: 'Notifications toggle added! Users can control alerts.',
            successMsgSk: 'Prepinac notifikacii pridany! Pouzivatelia mozu ovladat upozornenia.',
            errorHints: ['Add a View with Text and Switch inside.', '<View>\n  <Text>Notifications</Text>\n  <Switch />\n</View>'],
            errorHintsSk: ['Pridaj View s Text a Switch vnutri.', '<View>\n  <Text>Notifications</Text>\n  <Switch />\n</View>'],
            previewAddition: 'settings-notifications',
          },
          {
            id: 's4',
            title: 'Add dark mode toggle',
            titleSk: 'Pridaj prepinac dark mode',
            instruction: 'Add another row: <Text>Dark Mode</Text> with <Switch />.',
            instructionSk: 'Pridaj dalsi riadok: <Text>Dark Mode</Text> so <Switch />.',
            starterCode: `export default function SettingsScreen() {\n  return (\n    <View>\n      <Text>Settings</Text>\n      <View>\n        <Text>Notifications</Text>\n        <Switch />\n      </View>\n\n    </View>\n  )\n}`,
            validateFn: `code.includes('Dark Mode') && (code.match(/Switch/g) || []).length >= 2`,
            successMsg: 'Dark mode toggle! Every modern app needs this.',
            successMsgSk: 'Prepinac dark mode! Kazda moderna appka toto potrebuje.',
            errorHints: ['Same pattern as notifications row.', '<View>\n  <Text>Dark Mode</Text>\n  <Switch />\n</View>'],
            errorHintsSk: ['Rovnaky vzor ako riadok s notifikaciami.', '<View>\n  <Text>Dark Mode</Text>\n  <Switch />\n</View>'],
            previewAddition: 'settings-darkmode',
          },
          {
            id: 's5',
            title: 'Add language row',
            titleSk: 'Pridaj riadok jazyka',
            instruction: 'Add a row with <Text>Language</Text> and <Text>English</Text>.',
            instructionSk: 'Pridaj riadok s <Text>Language</Text> a <Text>English</Text>.',
            starterCode: `export default function SettingsScreen() {\n  return (\n    <View>\n      <Text>Settings</Text>\n      <View>\n        <Text>Notifications</Text>\n        <Switch />\n      </View>\n      <View>\n        <Text>Dark Mode</Text>\n        <Switch />\n      </View>\n\n    </View>\n  )\n}`,
            validateFn: `code.includes('Language') && code.includes('English')`,
            successMsg: 'Language selector ready. Internationalization is important!',
            successMsgSk: 'Vyber jazyka pripraveny. Internacionalizacia je dolezita!',
            errorHints: ['<View>\n  <Text>Language</Text>\n  <Text>English</Text>\n</View>'],
            errorHintsSk: ['<View>\n  <Text>Language</Text>\n  <Text>English</Text>\n</View>'],
            previewAddition: 'settings-language',
          },
          {
            id: 's6',
            title: 'Add Log Out button',
            titleSk: 'Pridaj Log Out tlacidlo',
            instruction: 'Add a <Button title="Log Out" /> at the bottom.',
            instructionSk: 'Pridaj <Button title="Log Out" /> na spodok.',
            starterCode: `export default function SettingsScreen() {\n  return (\n    <View>\n      <Text>Settings</Text>\n      <View>\n        <Text>Notifications</Text>\n        <Switch />\n      </View>\n      <View>\n        <Text>Dark Mode</Text>\n        <Switch />\n      </View>\n      <View>\n        <Text>Language</Text>\n        <Text>English</Text>\n      </View>\n\n    </View>\n  )\n}`,
            validateFn: `code.includes('Log Out') && code.includes('Button')`,
            successMsg: 'Settings page complete! Notifications, dark mode, language, and logout — a full settings experience.',
            successMsgSk: 'Stranka nastaveni hotova! Notifikacie, dark mode, jazyk a odhlasenie — kompletny zazitok z nastaveni.',
            errorHints: ['<Button title="Log Out" />'],
            errorHintsSk: ['<Button title="Log Out" />'],
            previewAddition: 'settings-logout',
          },
        ],
      },
    ],
  },
  // === APPS TOPIC ===
  {
    id: 'apps',
    title: 'Mini Apps',
    titleSk: 'Mini Aplikacie',
    description: 'Todo lists, calculators, practical projects',
    descriptionSk: 'Todo zoznamy, kalkulacky, prakticke projekty',
    icon: '🧩',
    color: '#06b6d4',
    lessons: [
      // === Todo List ===
      {
        id: 'todo-list',
        title: 'Build a Todo List',
        titleSk: 'Vytvor Todo zoznam',
        subtitle: 'A command-line todo app in Python — add, show, complete tasks.',
        subtitleSk: 'Prikazovy riadok todo appka v Pythone — pridavaj, zobrazuj, dokoncuj ulohy.',
        duration: '20 min',
        level: 'Beginner',
        levelSk: 'Zaciatocnik',
        goal: 'Build a working todo list with add, show, and done functionality.',
        goalSk: 'Vytvor funkcny todo zoznam s pridavanim, zobrazovanim a dokoncovanim.',
        preIntro: 'Python is a great language for beginners. We will build a simple todo list step by step. Each step adds one piece.',
        preIntroSk: 'Python je skvelý jazyk pre zaciatocnikov. Vytvorime jednoduchy todo zoznam krok po kroku. Kazdy krok prida jednu cast.',
        icon: '✅',
        previewType: 'terminal',
        language: 'python',
        steps: [
          {
            id: 's1',
            title: 'Create empty list',
            titleSk: 'Vytvor prazdny zoznam',
            instruction: 'Create an empty list called todos.',
            instructionSk: 'Vytvor prazdny zoznam s nazvom todos.',
            context: 'In Python, an empty list is created with square brackets: []',
            contextSk: 'V Pythone sa prazdny zoznam vytvori hranatymi zatvorkami: []',
            starterCode: `# Todo List App\n\n___ = ___`,
            validateFn: `code.includes('todos') && code.includes('[]')`,
            successMsg: 'Empty list created! This will store all your tasks.',
            successMsgSk: 'Prazdny zoznam vytvoreny! Toto ulozi vsetky tvoje ulohy.',
            errorHints: ['The variable is called todos.', 'todos = []'],
            errorHintsSk: ['Premenna sa vola todos.', 'todos = []'],
            previewAddition: 'terminal-todos-empty',
          },
          {
            id: 's2',
            title: 'Add function',
            titleSk: 'Pridaj funkciu',
            instruction: 'Create a function add_todo(task) that appends the task to the todos list.',
            instructionSk: 'Vytvor funkciu add_todo(task), ktora prida ulohu do zoznamu todos.',
            context: 'Use .append() to add items to a list.',
            contextSk: 'Pouzi .append() na pridanie poloziek do zoznamu.',
            starterCode: `# Todo List App\ntodos = []\n\ndef add_todo(task):\n    ___`,
            validateFn: `code.includes('def add_todo') && code.includes('append') && code.includes('task')`,
            successMsg: 'Add function works! You can now add tasks to your list.',
            successMsgSk: 'Funkcia pre pridavanie funguje! Teraz mozes pridavat ulohy do zoznamu.',
            errorHints: ['Use todos.append(task) inside the function.', 'todos.append(task)'],
            errorHintsSk: ['Pouzi todos.append(task) vnutri funkcie.', 'todos.append(task)'],
            previewAddition: 'terminal-todos-add',
          },
          {
            id: 's3',
            title: 'Show function',
            titleSk: 'Funkcia zobrazenia',
            instruction: 'Create a function show_todos() that prints each todo with its number.',
            instructionSk: 'Vytvor funkciu show_todos(), ktora vypise kazdu ulohu s jej cislom.',
            starterCode: `# Todo List App\ntodos = []\n\ndef add_todo(task):\n    todos.append(task)\n\ndef show_todos():\n    for i, task in enumerate(todos):\n        ___`,
            validateFn: `code.includes('def show_todos') && code.includes('print') && code.includes('enumerate')`,
            successMsg: 'Show function ready! Tasks will be displayed with numbers.',
            successMsgSk: 'Funkcia zobrazenia pripravena! Ulohy sa zobrazia s cislami.',
            errorHints: ['Use print() with the index and task.', 'print(f"{i+1}. {task}")'],
            errorHintsSk: ['Pouzi print() s indexom a ulohou.', 'print(f"{i+1}. {task}")'],
            previewAddition: 'terminal-todos-show',
          },
          {
            id: 's4',
            title: 'Mark done function',
            titleSk: 'Funkcia dokoncenia',
            instruction: 'Create a function mark_done(index) that removes a task by index.',
            instructionSk: 'Vytvor funkciu mark_done(index), ktora odstrani ulohu podla indexu.',
            starterCode: `# Todo List App\ntodos = []\n\ndef add_todo(task):\n    todos.append(task)\n\ndef show_todos():\n    for i, task in enumerate(todos):\n        print(f"{i+1}. {task}")\n\ndef mark_done(index):\n    ___`,
            validateFn: `code.includes('def mark_done') && (code.includes('pop') || code.includes('remove') || code.includes('del'))`,
            successMsg: 'Tasks can be completed and removed! Almost there.',
            successMsgSk: 'Ulohy mozu byt dokoncene a odstranene! Skoro hotovo.',
            errorHints: ['Use todos.pop(index) to remove by index.', 'todos.pop(index)'],
            errorHintsSk: ['Pouzi todos.pop(index) na odstranenie podla indexu.', 'todos.pop(index)'],
            previewAddition: 'terminal-todos-done',
          },
          {
            id: 's5',
            title: 'Add menu loop',
            titleSk: 'Pridaj menu slucku',
            instruction: 'Add a while True loop that asks the user for a choice: "add", "show", or "done".',
            instructionSk: 'Pridaj while True slucku, ktora sa opytat pouzivatela na volbu: "add", "show", alebo "done".',
            starterCode: `# Todo List App\ntodos = []\n\ndef add_todo(task):\n    todos.append(task)\n\ndef show_todos():\n    for i, task in enumerate(todos):\n        print(f"{i+1}. {task}")\n\ndef mark_done(index):\n    todos.pop(index)\n\n___ True:\n    choice = input("Choose: add/show/done: ")\n    if choice == "add":\n        task = input("Task: ")\n        add_todo(task)`,
            validateFn: `code.includes('while') && code.includes('True') && code.includes('input') && code.includes('add_todo')`,
            successMsg: 'Todo List is complete! A working CLI app with add, show, and mark done. You built it yourself!',
            successMsgSk: 'Todo Zoznam je kompletny! Funkcia CLI appka s pridavanim, zobrazovanim a oznacovanim. Vytvoril si ju sam!',
            errorHints: ['Replace ___ with while.', 'while True:'],
            errorHintsSk: ['Nahrad ___ s while.', 'while True:'],
            previewAddition: 'terminal-todos-menu',
          },
        ],
      },
      // === Calculator ===
      {
        id: 'calculator',
        title: 'Build a Calculator',
        titleSk: 'Vytvor kalkulacku',
        subtitle: 'A Python calculator that handles +, -, *.',
        subtitleSk: 'Python kalkulacka, ktora zvlada +, -, *.',
        duration: '15 min',
        level: 'Beginner',
        levelSk: 'Zaciatocnik',
        goal: 'Build a calculator that takes two numbers and an operator, then prints the result.',
        goalSk: 'Vytvor kalkulacku, ktora vezme dve cisla a operator a potom vypise vysledok.',
        preIntro: 'Calculators are one of the most classic beginner projects. Simple but teaches you input, conditions, and math.',
        preIntroSk: 'Kalkulacky su jeden z najklasickejsich zaciatocnickych projektov. Jednoduche, ale naucia ta vstup, podmienky a matematiku.',
        icon: '🔢',
        previewType: 'terminal',
        language: 'python',
        steps: [
          {
            id: 's1',
            title: 'Get two numbers',
            titleSk: 'Ziskaj dve cisla',
            instruction: 'Use input() and float() to get two numbers: num1 and num2.',
            instructionSk: 'Pouzi input() a float() na ziskanie dvoch cisel: num1 a num2.',
            context: 'float() converts text input to a decimal number.',
            contextSk: 'float() konvertuje textovy vstup na desatinne cislo.',
            starterCode: `# Calculator\n\nnum1 = ___(input("First number: "))\nnum2 = ___(input("Second number: "))`,
            validateFn: `code.includes('num1') && code.includes('num2') && code.includes('float') && code.includes('input')`,
            successMsg: 'Two numbers captured! Now we need the operator.',
            successMsgSk: 'Dve cisla zachytene! Teraz potrebujeme operator.',
            errorHints: ['Replace ___ with float.', 'num1 = float(input("First number: "))'],
            errorHintsSk: ['Nahrad ___ za float.', 'num1 = float(input("First number: "))'],
            previewAddition: 'terminal-calc-input',
          },
          {
            id: 's2',
            title: 'Get operator',
            titleSk: 'Ziskaj operator',
            instruction: 'Ask the user for an operator using input() and store it in a variable called op.',
            instructionSk: 'Opytaj sa pouzivatela na operator pomocou input() a uloz ho do premennej op.',
            starterCode: `# Calculator\n\nnum1 = float(input("First number: "))\nnum2 = float(input("Second number: "))\n\n___ = input("Operator (+, -, *): ")`,
            validateFn: `code.includes('op') && code.includes('input') && code.includes('Operator')`,
            successMsg: 'Operator stored! Now we handle each case.',
            successMsgSk: 'Operator ulozeny! Teraz spracujeme kazdy pripad.',
            errorHints: ['Replace ___ with op.', 'op = input("Operator (+, -, *): ")'],
            errorHintsSk: ['Nahrad ___ za op.', 'op = input("Operator (+, -, *): ")'],
            previewAddition: 'terminal-calc-operator',
          },
          {
            id: 's3',
            title: 'Handle addition',
            titleSk: 'Spracuj scitanie',
            instruction: 'Add an if statement: if op == "+", set result = num1 + num2.',
            instructionSk: 'Pridaj if podmienku: ak op == "+", nastav result = num1 + num2.',
            starterCode: `# Calculator\n\nnum1 = float(input("First number: "))\nnum2 = float(input("Second number: "))\nop = input("Operator (+, -, *): ")\n\n___ op == "+":\n    result = num1 + num2`,
            validateFn: `code.includes('if') && code.includes('+') && code.includes('result') && code.includes('num1 + num2')`,
            successMsg: 'Addition works! Two more operators to go.',
            successMsgSk: 'Scitanie funguje! Este dva operatory.',
            errorHints: ['Replace ___ with if.', 'if op == "+":\n    result = num1 + num2'],
            errorHintsSk: ['Nahrad ___ za if.', 'if op == "+":\n    result = num1 + num2'],
            previewAddition: 'terminal-calc-add',
          },
          {
            id: 's4',
            title: 'Handle subtraction',
            titleSk: 'Spracuj odcitanie',
            instruction: 'Add elif for "-": result = num1 - num2.',
            instructionSk: 'Pridaj elif pre "-": result = num1 - num2.',
            starterCode: `# Calculator\n\nnum1 = float(input("First number: "))\nnum2 = float(input("Second number: "))\nop = input("Operator (+, -, *): ")\n\nif op == "+":\n    result = num1 + num2\n___ op == "-":\n    result = num1 - num2`,
            validateFn: `code.includes('elif') && code.includes('num1 - num2')`,
            successMsg: 'Subtraction handled!',
            successMsgSk: 'Odcitanie spracovane!',
            errorHints: ['Replace ___ with elif.', 'elif op == "-":\n    result = num1 - num2'],
            errorHintsSk: ['Nahrad ___ za elif.', 'elif op == "-":\n    result = num1 - num2'],
            previewAddition: 'terminal-calc-sub',
          },
          {
            id: 's5',
            title: 'Handle multiplication',
            titleSk: 'Spracuj nasobenie',
            instruction: 'Add elif for "*": result = num1 * num2.',
            instructionSk: 'Pridaj elif pre "*": result = num1 * num2.',
            starterCode: `# Calculator\n\nnum1 = float(input("First number: "))\nnum2 = float(input("Second number: "))\nop = input("Operator (+, -, *): ")\n\nif op == "+":\n    result = num1 + num2\nelif op == "-":\n    result = num1 - num2\n___`,
            validateFn: `code.includes('num1 * num2') && (code.match(/elif/g) || []).length >= 2`,
            successMsg: 'All three operations work!',
            successMsgSk: 'Vsetky tri operacie funguju!',
            errorHints: ['elif op == "*":\n    result = num1 * num2'],
            errorHintsSk: ['elif op == "*":\n    result = num1 * num2'],
            previewAddition: 'terminal-calc-mul',
          },
          {
            id: 's6',
            title: 'Print result',
            titleSk: 'Vypis vysledok',
            instruction: 'At the end, print the result using print().',
            instructionSk: 'Na konci vypis vysledok pomocou print().',
            starterCode: `# Calculator\n\nnum1 = float(input("First number: "))\nnum2 = float(input("Second number: "))\nop = input("Operator (+, -, *): ")\n\nif op == "+":\n    result = num1 + num2\nelif op == "-":\n    result = num1 - num2\nelif op == "*":\n    result = num1 * num2\n\n___`,
            validateFn: `code.includes('print') && code.includes('result')`,
            successMsg: 'Calculator complete! It takes two numbers, an operator, and prints the answer. Well done!',
            successMsgSk: 'Kalkulacka hotova! Vezme dve cisla, operator a vypise odpoved. Dobre spravene!',
            errorHints: ['print(result) or print(f"Result: {result}")'],
            errorHintsSk: ['print(result) alebo print(f"Result: {result}")'],
            previewAddition: 'terminal-calc-result',
          },
        ],
      },
    ],
  },
  // === BACKEND TOPIC ===
  {
    id: 'backend',
    title: 'Backend',
    titleSk: 'Backend',
    description: 'API routes, webhooks, server-side logic',
    descriptionSk: 'API routy, webhooky, serverova logika',
    icon: '🖥️',
    color: '#f43f5e',
    lessons: [
      // === API Endpoint ===
      {
        id: 'api-endpoint',
        title: 'Build an API Endpoint',
        titleSk: 'Vytvor API Endpoint',
        subtitle: 'A Next.js API route that fetches and returns data.',
        subtitleSk: 'Next.js API routa, ktora nacita a vrati data.',
        duration: '20 min',
        level: 'Intermediate',
        levelSk: 'Mierne pokrocily',
        goal: 'Build a GET endpoint that receives query params, queries a database, and returns JSON.',
        goalSk: 'Vytvor GET endpoint, ktory prijme query parametre, dopytuje databazu a vrati JSON.',
        preIntro: 'APIs are how apps talk to servers. Every button tap, every data load — it goes through an API. You will build one from scratch.',
        preIntroSk: 'API je sposob, akym appky komunikuju so servermi. Kazde kliknutie, kazde nacitanie dat — ide cez API. Vytvoris jedno od nuly.',
        icon: '🔌',
        previewType: 'terminal',
        language: 'typescript',
        steps: [
          {
            id: 's1',
            title: 'Import NextResponse',
            titleSk: 'Importuj NextResponse',
            instruction: 'Import NextResponse from "next/server".',
            instructionSk: 'Importuj NextResponse z "next/server".',
            context: 'NextResponse is how you send responses in Next.js API routes.',
            contextSk: 'NextResponse je sposob, akym posielate odpovede v Next.js API routach.',
            starterCode: `import { ___ } from "next/server"`,
            validateFn: `code.includes('NextResponse') && code.includes('import')`,
            successMsg: 'Import ready! NextResponse will help us send data back.',
            successMsgSk: 'Import pripraveny! NextResponse nam pomoze poslat data spat.',
            errorHints: ['The class is called NextResponse.', 'import { NextResponse } from "next/server"'],
            errorHintsSk: ['Trieda sa vola NextResponse.', 'import { NextResponse } from "next/server"'],
            previewAddition: 'terminal-api-import',
          },
          {
            id: 's2',
            title: 'Create GET handler',
            titleSk: 'Vytvor GET handler',
            instruction: 'Export an async function called GET that receives a request parameter.',
            instructionSk: 'Exportuj async funkciu s nazvom GET, ktora prijma parameter request.',
            starterCode: `import { NextResponse } from "next/server"\n\nexport async function ___(request: Request) {\n\n}`,
            validateFn: `code.includes('export') && code.includes('async') && code.includes('GET') && code.includes('request')`,
            successMsg: 'GET handler created! This runs when someone visits your API URL.',
            successMsgSk: 'GET handler vytvoreny! Toto sa spusti, ked niekto navstivi tvoju API URL.',
            errorHints: ['The function name must be GET (uppercase).', 'export async function GET(request: Request) {'],
            errorHintsSk: ['Nazov funkcie musi byt GET (velkymi).', 'export async function GET(request: Request) {'],
            previewAddition: 'terminal-api-handler',
          },
          {
            id: 's3',
            title: 'Parse query params',
            titleSk: 'Parsuj query parametre',
            instruction: 'Inside the function, get the search params from the URL. Extract a "name" parameter.',
            instructionSk: 'Vnutri funkcie ziskaj search parametre z URL. Extrahuj parameter "name".',
            starterCode: `import { NextResponse } from "next/server"\n\nexport async function GET(request: Request) {\n  const { searchParams } = new URL(request.url)\n  const name = searchParams.___(\"name\")\n}`,
            validateFn: `code.includes('searchParams') && code.includes('get') && code.includes('name')`,
            successMsg: 'Query params parsed! You can now use ?name=John in the URL.',
            successMsgSk: 'Query parametre rozparsovane! Teraz mozes pouzit ?name=John v URL.',
            errorHints: ['Use .get() to read a parameter.', 'searchParams.get("name")'],
            errorHintsSk: ['Pouzi .get() na precitanie parametra.', 'searchParams.get("name")'],
            previewAddition: 'terminal-api-params',
          },
          {
            id: 's4',
            title: 'Create data',
            titleSk: 'Vytvor data',
            instruction: 'Create a data object with the user info: { user: name, status: "active" }.',
            instructionSk: 'Vytvor datovy objekt s info o pouzivatelovi: { user: name, status: "active" }.',
            starterCode: `import { NextResponse } from "next/server"\n\nexport async function GET(request: Request) {\n  const { searchParams } = new URL(request.url)\n  const name = searchParams.get("name")\n\n  const data = { ___: name, status: \"active\" }\n}`,
            validateFn: `code.includes('user') && code.includes('name') && code.includes('status') && code.includes('active')`,
            successMsg: 'Data object created! This simulates a database response.',
            successMsgSk: 'Datovy objekt vytvoreny! Toto simuluje odpoved z databazy.',
            errorHints: ['Replace ___ with user.', 'const data = { user: name, status: "active" }'],
            errorHintsSk: ['Nahrad ___ za user.', 'const data = { user: name, status: "active" }'],
            previewAddition: 'terminal-api-data',
          },
          {
            id: 's5',
            title: 'Return JSON',
            titleSk: 'Vrat JSON',
            instruction: 'Return the data as JSON using NextResponse.json().',
            instructionSk: 'Vrat data ako JSON pomocou NextResponse.json().',
            starterCode: `import { NextResponse } from "next/server"\n\nexport async function GET(request: Request) {\n  const { searchParams } = new URL(request.url)\n  const name = searchParams.get("name")\n\n  const data = { user: name, status: "active" }\n\n  return ___.json(data)\n}`,
            validateFn: `code.includes('NextResponse.json') && code.includes('return') && code.includes('data')`,
            successMsg: 'API endpoint complete! It parses query params, builds a response, and returns JSON. This is how real APIs work.',
            successMsgSk: 'API endpoint kompletny! Parsuje query parametre, vytvara odpoved a vracia JSON. Takto funguju realne API.',
            errorHints: ['Replace ___ with NextResponse.', 'return NextResponse.json(data)'],
            errorHintsSk: ['Nahrad ___ za NextResponse.', 'return NextResponse.json(data)'],
            previewAddition: 'terminal-api-response',
          },
        ],
      },
      // === Discord Webhook ===
      {
        id: 'discord-webhook',
        title: 'Send a Discord Webhook',
        titleSk: 'Posli Discord Webhook',
        subtitle: 'Post an embed message to a Discord channel via webhook.',
        subtitleSk: 'Posli embed spravu do Discord kanalu cez webhook.',
        duration: '15 min',
        level: 'Intermediate',
        levelSk: 'Mierne pokrocily',
        goal: 'Send a rich embed message to Discord using a webhook URL and fetch.',
        goalSk: 'Posli bohatu embed spravu na Discord pomocou webhook URL a fetch.',
        preIntro: 'Discord webhooks let you send messages to channels without a bot. Perfect for notifications, alerts, or just fun.',
        preIntroSk: 'Discord webhooky ti umoznia posielat spravy do kanalov bez bota. Perfektne na notifikacie, upozornenia alebo len zabavu.',
        icon: '💬',
        previewType: 'terminal',
        language: 'typescript',
        steps: [
          {
            id: 's1',
            title: 'Set webhook URL',
            titleSk: 'Nastav webhook URL',
            instruction: 'Create a constant called WEBHOOK_URL and assign your webhook URL string.',
            instructionSk: 'Vytvor konstantu WEBHOOK_URL a prirad jej retazec s webhook URL.',
            starterCode: `// Discord Webhook Sender\n\nconst ___ = "https://discord.com/api/webhooks/..."`,
            validateFn: `code.includes('WEBHOOK_URL') && code.includes('discord.com')`,
            successMsg: 'Webhook URL set! This is where messages will be sent.',
            successMsgSk: 'Webhook URL nastavena! Tu sa budu posielat spravy.',
            errorHints: ['Replace ___ with WEBHOOK_URL.', 'const WEBHOOK_URL = "https://discord.com/api/webhooks/..."'],
            errorHintsSk: ['Nahrad ___ za WEBHOOK_URL.', 'const WEBHOOK_URL = "https://discord.com/api/webhooks/..."'],
            previewAddition: 'terminal-webhook-url',
          },
          {
            id: 's2',
            title: 'Create embed',
            titleSk: 'Vytvor embed',
            instruction: 'Create an embed object with title and description properties.',
            instructionSk: 'Vytvor embed objekt s vlastnostami title a description.',
            starterCode: `// Discord Webhook Sender\n\nconst WEBHOOK_URL = "https://discord.com/api/webhooks/..."\n\nconst embed = {\n  ___: "New Alert",\n  description: "Something happened!",\n  color: 0x00ff00\n}`,
            validateFn: `code.includes('title') && code.includes('description') && code.includes('embed')`,
            successMsg: 'Embed object ready! It has a title, description, and color.',
            successMsgSk: 'Embed objekt pripraveny! Ma nadpis, popis a farbu.',
            errorHints: ['Replace ___ with title.', 'title: "New Alert"'],
            errorHintsSk: ['Nahrad ___ za title.', 'title: "New Alert"'],
            previewAddition: 'terminal-webhook-embed',
          },
          {
            id: 's3',
            title: 'Add fields',
            titleSk: 'Pridaj polia',
            instruction: 'Add a fields array to the embed with one field: { name: "Status", value: "Online" }.',
            instructionSk: 'Pridaj pole fields do embeds s jednym polom: { name: "Status", value: "Online" }.',
            starterCode: `// Discord Webhook Sender\n\nconst WEBHOOK_URL = "https://discord.com/api/webhooks/..."\n\nconst embed = {\n  title: "New Alert",\n  description: "Something happened!",\n  color: 0x00ff00,\n  ___: [\n    { name: "Status", value: "Online" }\n  ]\n}`,
            validateFn: `code.includes('fields') && code.includes('Status') && code.includes('Online')`,
            successMsg: 'Fields added! They show as key-value pairs in the embed.',
            successMsgSk: 'Polia pridane! Zobrazuju sa ako key-value pary v embede.',
            errorHints: ['Replace ___ with fields.', 'fields: [\n  { name: "Status", value: "Online" }\n]'],
            errorHintsSk: ['Nahrad ___ za fields.', 'fields: [\n  { name: "Status", value: "Online" }\n]'],
            previewAddition: 'terminal-webhook-fields',
          },
          {
            id: 's4',
            title: 'Send POST request',
            titleSk: 'Posli POST poziadavku',
            instruction: 'Use fetch() to send a POST request to WEBHOOK_URL with the embed in the body.',
            instructionSk: 'Pouzi fetch() na poslanie POST poziadavky na WEBHOOK_URL s embedom v tele.',
            starterCode: `// Discord Webhook Sender\n\nconst WEBHOOK_URL = "https://discord.com/api/webhooks/..."\n\nconst embed = {\n  title: "New Alert",\n  description: "Something happened!",\n  color: 0x00ff00,\n  fields: [\n    { name: "Status", value: "Online" }\n  ]\n}\n\nconst response = await ___(WEBHOOK_URL, {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ embeds: [embed] })\n})`,
            validateFn: `code.includes('fetch') && code.includes('POST') && code.includes('JSON.stringify') && code.includes('embeds')`,
            successMsg: 'POST request sent! The message is on its way to Discord.',
            successMsgSk: 'POST poziadavka odoslana! Sprava je na ceste na Discord.',
            errorHints: ['Replace ___ with fetch.', 'await fetch(WEBHOOK_URL, {'],
            errorHintsSk: ['Nahrad ___ za fetch.', 'await fetch(WEBHOOK_URL, {'],
            previewAddition: 'terminal-webhook-send',
          },
          {
            id: 's5',
            title: 'Handle response',
            titleSk: 'Spracuj odpoved',
            instruction: 'Check if the response was ok and log the result.',
            instructionSk: 'Over ci bola odpoved ok a zaloguj vysledok.',
            starterCode: `// Discord Webhook Sender\n\nconst WEBHOOK_URL = "https://discord.com/api/webhooks/..."\n\nconst embed = {\n  title: "New Alert",\n  description: "Something happened!",\n  color: 0x00ff00,\n  fields: [\n    { name: "Status", value: "Online" }\n  ]\n}\n\nconst response = await fetch(WEBHOOK_URL, {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ embeds: [embed] })\n})\n\nif (response.___) {\n  console.log("Message sent!")\n}`,
            validateFn: `code.includes('response.ok') && code.includes('console.log') && code.includes('sent')`,
            successMsg: 'Discord webhook complete! You can now send rich embeds to any Discord channel. Add this to a cron job and you have automated notifications.',
            successMsgSk: 'Discord webhook kompletny! Teraz mozes posielat bohate embedy do akehokolvek Discord kanalu. Pridaj toto do cron jobu a mas automatizovane notifikacie.',
            errorHints: ['Replace ___ with ok.', 'if (response.ok) {'],
            errorHintsSk: ['Nahrad ___ za ok.', 'if (response.ok) {'],
            previewAddition: 'terminal-webhook-response',
          },
        ],
      },
    ],
  },
  // === STATE TOPIC ===
  {
    id: 'state',
    title: 'State Management',
    titleSk: 'Sprava stavu',
    description: 'Zustand stores, React state, persistence',
    descriptionSk: 'Zustand story, React stav, perzistencia',
    icon: '🗄️',
    color: '#a855f7',
    lessons: [
      // === Zustand Store ===
      {
        id: 'zustand-store',
        title: 'Build a Zustand Store',
        titleSk: 'Vytvor Zustand Store',
        subtitle: 'Global state management with Zustand — clean and simple.',
        subtitleSk: 'Globalna sprava stavu so Zustand — cista a jednoducha.',
        duration: '15 min',
        level: 'Intermediate',
        levelSk: 'Mierne pokrocily',
        goal: 'Create a typed Zustand store with state, actions, and persist middleware.',
        goalSk: 'Vytvor typovany Zustand store so stavom, akciami a persist middleware.',
        preIntro: 'Zustand is one of the simplest state management libraries for React. No boilerplate, no providers, just a function that returns your state.',
        preIntroSk: 'Zustand je jedna z najjednoduchsich kniznic na spravu stavu pre React. Ziadny boilerplate, ziadne providery, len funkcia ktora vrati tvoj stav.',
        icon: '🧠',
        previewType: 'terminal',
        language: 'typescript',
        steps: [
          {
            id: 's1',
            title: 'Import create',
            titleSk: 'Importuj create',
            instruction: 'Import the create function from "zustand".',
            instructionSk: 'Importuj funkciu create zo "zustand".',
            starterCode: `import { ___ } from "zustand"`,
            validateFn: `code.includes('create') && code.includes('zustand')`,
            successMsg: 'create imported! This is the only function you need from Zustand.',
            successMsgSk: 'create importovany! Toto je jedina funkcia, ktoru potrebujes zo Zustand.',
            errorHints: ['Replace ___ with create.', 'import { create } from "zustand"'],
            errorHintsSk: ['Nahrad ___ za create.', 'import { create } from "zustand"'],
            previewAddition: 'terminal-zustand-import',
          },
          {
            id: 's2',
            title: 'Define interface',
            titleSk: 'Definuj interface',
            instruction: 'Create an interface CounterStore with count (number) and increment (function returning void).',
            instructionSk: 'Vytvor interface CounterStore s count (number) a increment (funkcia vracajuca void).',
            starterCode: `import { create } from "zustand"\n\ninterface ___ {\n  count: number\n  increment: () => void\n}`,
            validateFn: `code.includes('interface') && code.includes('CounterStore') && code.includes('count') && code.includes('increment')`,
            successMsg: 'Interface defined! TypeScript now knows the shape of your store.',
            successMsgSk: 'Interface definovany! TypeScript teraz pozna tvar tvojho storu.',
            errorHints: ['Replace ___ with CounterStore.', 'interface CounterStore {'],
            errorHintsSk: ['Nahrad ___ za CounterStore.', 'interface CounterStore {'],
            previewAddition: 'terminal-zustand-interface',
          },
          {
            id: 's3',
            title: 'Create store',
            titleSk: 'Vytvor store',
            instruction: 'Use create<CounterStore> to create the store with initial count: 0.',
            instructionSk: 'Pouzi create<CounterStore> na vytvorenie storu s pociatocnym count: 0.',
            starterCode: `import { create } from "zustand"\n\ninterface CounterStore {\n  count: number\n  increment: () => void\n}\n\nexport const useCounterStore = ___<CounterStore>((set) => ({\n  count: 0,\n}))`,
            validateFn: `code.includes('create') && code.includes('useCounterStore') && code.includes('count: 0') && code.includes('set')`,
            successMsg: 'Store created with initial state! count starts at 0.',
            successMsgSk: 'Store vytvoreny s pociatocnym stavom! count zacina na 0.',
            errorHints: ['Replace ___ with create.', 'export const useCounterStore = create<CounterStore>((set) => ({'],
            errorHintsSk: ['Nahrad ___ za create.', 'export const useCounterStore = create<CounterStore>((set) => ({'],
            previewAddition: 'terminal-zustand-store',
          },
          {
            id: 's4',
            title: 'Add action',
            titleSk: 'Pridaj akciu',
            instruction: 'Add the increment action that uses set() to update count by +1.',
            instructionSk: 'Pridaj akciu increment, ktora pouzi set() na aktualizaciu count o +1.',
            starterCode: `import { create } from "zustand"\n\ninterface CounterStore {\n  count: number\n  increment: () => void\n}\n\nexport const useCounterStore = create<CounterStore>((set) => ({\n  count: 0,\n  increment: () => set((state) => ({ count: state.___ + 1 })),\n}))`,
            validateFn: `code.includes('increment') && code.includes('set') && code.includes('state.count') && code.includes('+ 1')`,
            successMsg: 'Action added! increment will increase count by 1 every time.',
            successMsgSk: 'Akcia pridana! increment zvysi count o 1 zakazdym.',
            errorHints: ['Replace ___ with count.', 'set((state) => ({ count: state.count + 1 }))'],
            errorHintsSk: ['Nahrad ___ za count.', 'set((state) => ({ count: state.count + 1 }))'],
            previewAddition: 'terminal-zustand-action',
          },
          {
            id: 's5',
            title: 'Add persist',
            titleSk: 'Pridaj persist',
            instruction: 'Import persist from "zustand/middleware" and wrap the store function with persist().',
            instructionSk: 'Importuj persist z "zustand/middleware" a obal store funkciu persist().',
            starterCode: `import { create } from "zustand"\nimport { ___ } from "zustand/middleware"\n\ninterface CounterStore {\n  count: number\n  increment: () => void\n}\n\nexport const useCounterStore = create<CounterStore>()(\n  persist(\n    (set) => ({\n      count: 0,\n      increment: () => set((state) => ({ count: state.count + 1 })),\n    }),\n    { name: "counter-storage" }\n  )\n)`,
            validateFn: `code.includes('persist') && code.includes('zustand/middleware') && code.includes('counter-storage')`,
            successMsg: 'Zustand store with persist! State will survive page refreshes. This is real production-grade state management.',
            successMsgSk: 'Zustand store s persist! Stav prezije obnovu stranky. Toto je realna produkcna sprava stavu.',
            errorHints: ['Replace ___ with persist.', 'import { persist } from "zustand/middleware"'],
            errorHintsSk: ['Nahrad ___ za persist.', 'import { persist } from "zustand/middleware"'],
            previewAddition: 'terminal-zustand-persist',
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
