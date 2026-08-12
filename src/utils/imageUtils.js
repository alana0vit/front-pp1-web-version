const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
 
export function getImageUrl(nomeArquivo) {
  if (!nomeArquivo || typeof nomeArquivo !== 'string' || !nomeArquivo.trim()) {
    return null;
  }
  return `${BASE_URL}/api/images/${nomeArquivo.trim()}`;
}
