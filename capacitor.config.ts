import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.motokah.app',
  appName: 'Motokah',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0F0F0F',
      showSpinner: false,
    },
    StatusBar: {
      style: 'Light',
      backgroundColor: '#0066CC',
    },
  },
};

export default config;
