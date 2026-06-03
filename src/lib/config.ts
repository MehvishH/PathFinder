// Backend base URL. Set EXPO_PUBLIC_API_URL in a .env file.
// On a physical device, localhost won't reach your computer — use your machine's
// LAN IP (e.g. http://192.168.1.50:8787). On the Android emulator use 10.0.2.2.
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8787';
