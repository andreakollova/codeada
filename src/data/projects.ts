export interface ProjectStep {
  id: string;
  title: string;
  titleSk: string;
  explanation: string;
  explanationSk: string;
  hint?: string;
  hintSk?: string;
  starterCode: string;
  solution: string;
  testFn: string; // JS code that returns true/false
  previewType: 'react-native' | 'browser' | 'terminal' | 'database' | 'api' | 'discord';
  highlightLines?: number[]; // lines to highlight in preview after success
}

export interface ProjectLesson {
  id: string;
  title: string;
  titleSk: string;
  description: string;
  descriptionSk: string;
  goal: string;
  goalSk: string;
  icon: string;
  previewType: 'react-native' | 'browser' | 'terminal' | 'database' | 'api' | 'discord';
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
    id: 'react-native',
    title: 'React Native',
    titleSk: 'React Native',
    description: 'Build mobile apps for iOS and Android',
    descriptionSk: 'Tvorba mobilných aplikácií pre iOS a Android',
    icon: '📱',
    color: '#61dafb',
    lessons: [
      {
        id: 'rn-login',
        title: 'Build a Login Screen',
        titleSk: 'Vytvor prihlasovací screen',
        description: 'Create a beautiful login screen with email and password fields.',
        descriptionSk: 'Vytvor pekný prihlasovací screen s poliami pre email a heslo.',
        goal: 'Today we will build a complete login screen with input fields, a button, and styling.',
        goalSk: 'Dnes vytvoríme kompletný prihlasovací screen so vstupnými poliami, tlačidlom a štýlovaním.',
        icon: '🔐',
        previewType: 'react-native',
        language: 'typescript',
        steps: [
          {
            id: 'rn-login-1',
            title: 'Create the container',
            titleSk: 'Vytvor kontajner',
            explanation: 'Every screen starts with a View component. This is like a div in HTML — it wraps everything inside.',
            explanationSk: 'Každý screen začína komponentom View. Je to ako div v HTML — obalí všetko vnútri.',
            starterCode: `import { View, StyleSheet } from 'react-native';

export default function LoginScreen() {
  return (
    // Add a View with styles.container
    ___
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    padding: 24,
  },
});`,
            solution: `import { View, StyleSheet } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    padding: 24,
  },
});`,
            testFn: `code.includes('<View') && code.includes('styles.container')`,
            previewType: 'react-native',
            hint: 'Use <View style={styles.container}> to create the container.',
            hintSk: 'Použi <View style={styles.container}> na vytvorenie kontajnera.',
          },
          {
            id: 'rn-login-2',
            title: 'Add a title',
            titleSk: 'Pridaj nadpis',
            explanation: 'Now add a Text component inside the View to show "Welcome back" as the screen title.',
            explanationSk: 'Teraz pridaj komponent Text vnútri View, ktorý zobrazí "Vitaj späť" ako nadpis screenu.',
            starterCode: `import { View, Text, StyleSheet } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      {/* Add a Text component with styles.title */}
      ___
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 32,
  },
});`,
            solution: `import { View, Text, StyleSheet } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 32,
  },
});`,
            testFn: `code.includes('<Text') && code.includes('styles.title')`,
            previewType: 'react-native',
            hint: 'Use <Text style={styles.title}>Welcome back</Text>',
            hintSk: 'Použi <Text style={styles.title}>Vitaj späť</Text>',
          },
          {
            id: 'rn-login-3',
            title: 'Add email input',
            titleSk: 'Pridaj email input',
            explanation: 'Add a TextInput for the email address. TextInput is like an <input> in HTML.',
            explanationSk: 'Pridaj TextInput pre emailovú adresu. TextInput je ako <input> v HTML.',
            starterCode: `import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      {/* Add TextInput for email */}
      ___
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: '700', color: '#fff', marginBottom: 32 },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
});`,
            solution: `import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        keyboardType="email-address"
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: '700', color: '#fff', marginBottom: 32 },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
});`,
            testFn: `code.includes('<TextInput') && code.includes('styles.input')`,
            previewType: 'react-native',
          },
          {
            id: 'rn-login-4',
            title: 'Add password input and button',
            titleSk: 'Pridaj heslo a tlačidlo',
            explanation: 'Now add a password TextInput (with secureTextEntry) and a TouchableOpacity button to complete the form.',
            explanationSk: 'Teraz pridaj TextInput pre heslo (s secureTextEntry) a tlačidlo TouchableOpacity na dokončenie formulára.',
            starterCode: `import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#666" />
      {/* Add password TextInput with secureTextEntry */}
      ___
      {/* Add login button */}
      ___
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: '700', color: '#fff', marginBottom: 32 },
  input: { backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, fontSize: 16, color: '#fff', marginBottom: 12, borderWidth: 1, borderColor: '#333' },
  button: { backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { fontSize: 16, fontWeight: '700', color: '#000' },
});`,
            solution: `import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#666" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#666" secureTextEntry />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: '700', color: '#fff', marginBottom: 32 },
  input: { backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, fontSize: 16, color: '#fff', marginBottom: 12, borderWidth: 1, borderColor: '#333' },
  button: { backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { fontSize: 16, fontWeight: '700', color: '#000' },
});`,
            testFn: `code.includes('secureTextEntry') && code.includes('TouchableOpacity') && code.includes('Sign In')`,
            previewType: 'react-native',
          },
        ],
      },
    ],
  },
  {
    id: 'supabase',
    title: 'Supabase',
    titleSk: 'Supabase',
    description: 'Backend with database, auth and storage',
    descriptionSk: 'Backend s databázou, autentifikáciou a úložiskom',
    icon: '🗄',
    color: '#3ecf8e',
    lessons: [
      {
        id: 'sb-query',
        title: 'Your First Query',
        titleSk: 'Tvoj prvý dotaz',
        description: 'Learn to read data from a Supabase database.',
        descriptionSk: 'Nauč sa čítať dáta zo Supabase databázy.',
        goal: 'Today we will fetch users from a database and display them.',
        goalSk: 'Dnes načítame používateľov z databázy a zobrazíme ich.',
        icon: '📊',
        previewType: 'database',
        language: 'typescript',
        steps: [
          {
            id: 'sb-query-1',
            title: 'Import Supabase client',
            titleSk: 'Importuj Supabase klienta',
            explanation: 'First, import the Supabase client. This is your connection to the database.',
            explanationSk: 'Najprv importuj Supabase klienta. Toto je tvoje spojenie s databázou.',
            starterCode: `// Import the supabase client
___

async function getUsers() {
  // We'll add the query here
}`,
            solution: `import { supabase } from './lib/supabase';

async function getUsers() {
  // We'll add the query here
}`,
            testFn: `code.includes('import') && code.includes('supabase')`,
            previewType: 'database',
          },
          {
            id: 'sb-query-2',
            title: 'Write a SELECT query',
            titleSk: 'Napíš SELECT dotaz',
            explanation: 'Use supabase.from("users").select("*") to get all users. The result comes back as { data, error }.',
            explanationSk: 'Použi supabase.from("users").select("*") na získanie všetkých používateľov. Výsledok príde ako { data, error }.',
            starterCode: `import { supabase } from './lib/supabase';

async function getUsers() {
  // Write a SELECT query to get all users
  const { data, error } = await ___

  if (error) {
    console.error('Error:', error.message);
    return [];
  }

  return data;
}`,
            solution: `import { supabase } from './lib/supabase';

async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    console.error('Error:', error.message);
    return [];
  }

  return data;
}`,
            testFn: `code.includes(".from(") && code.includes(".select(")`,
            previewType: 'database',
          },
        ],
      },
    ],
  },
];

export function getProject(id: string): ProjectTopic | undefined {
  return projects.find(p => p.id === id);
}

export function getProjectLesson(topicId: string, lessonId: string): ProjectLesson | undefined {
  return getProject(topicId)?.lessons.find(l => l.id === lessonId);
}
