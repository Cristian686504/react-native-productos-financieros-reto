const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error('Falta configurar EXPO_PUBLIC_API_BASE_URL en el archivo .env');
}

export const API_BASE_URL = apiBaseUrl;
