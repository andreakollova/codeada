import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'sk.coduy.app',
  appName: 'Coduy',
  webDir: 'public',
  server: {
    // In production: load the deployed web app
    url: 'https://coduy.sk',
    cleartext: false,
  },
  ios: {
    scheme: 'Coduy',
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 1500,
      backgroundColor: '#0F0F0F',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
