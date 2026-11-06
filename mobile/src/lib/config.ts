import { Platform } from 'react-native';

// Backend base URL.
// - Website (Vercel): the AI endpoints live on the same domain under /api, so no setup needed.
// - Mobile: set EXPO_PUBLIC_API_URL in a .env file. On a physical device, localhost won't
//   reach your computer — use your machine's LAN IP (e.g. http://192.168.1.50:8787),
//   or point it at your deployed site (e.g. https://your-site.vercel.app/api).
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? (Platform.OS === 'web' ? '/api' : 'http://localhost:8787');
