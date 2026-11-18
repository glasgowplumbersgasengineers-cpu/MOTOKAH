import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.motokah.app',
  appName: 'Motokah',
  webDir: 'dist',
  zoomEnabled: false,
  server: {
    androidScheme: 'https',
    allowNavigation: ['www.motokah.com'],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#014DC5',
      showSpinner: false,
    },
    StatusBar: {
      style: 'Light',
      backgroundColor: '#0066CC',
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
