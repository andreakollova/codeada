import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'sk.coduy.app',
  appName: 'Coduy',
  webDir: 'public',
  server: {
    url: 'https://www.coduy.sk',
    cleartext: false,
    allowNavigation: [
      '*.supabase.co',
      'coduy.sk',
      '*.coduy.sk',
      'coduy.com',
      '*.coduy.com',
    ],
  },
  ios: {
    scheme: 'Coduy',
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scrollEnabled: false,
    allowsLinkPreview: false,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      launchShowDuration: 0,
      backgroundColor: '#0F0F0F',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
