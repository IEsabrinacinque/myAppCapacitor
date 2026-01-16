import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mycompany.myapp',
  appName: 'MyApp',
  webDir: 'dist/myAppCapacitor/browser',
  
  // 🔑 AGGIUNGI QUESTA SEZIONE
  plugins: {
    StatusBar: {
      style: 'dark',                    // 'light' o 'dark'
      backgroundColor: '#000000',        // Colore della status bar
      overlaysWebView: false             // 🔥 NON copre la webview
    },
    NavigationBar: {
      color: '#000000',                 // Colore della navigation bar (Android)
      darkBottomContent: false
    }
  }
};

export default config;