/**
 * Utilidad para gestionar enlaces de afiliados de Amazon.
 */

const AMAZON_TAG = process.env.EXPO_PUBLIC_AMAZON_TAG || 'mobimanten-21'; // Tag por defecto o configurable

/**
 * Añade el tag de afiliado a una URL de Amazon si no lo tiene.
 */
export const getAffiliateLink = (url: string): string => {
  if (!url) return '';
  
  // Verificar si es una URL de Amazon
  const isAmazon = url.includes('amazon.es') || url.includes('amazon.com') || url.includes('amzn.to');
  
  if (!isAmazon) return url;
  
  // Si ya tiene un tag, no lo cambiamos (o podríamos reemplazarlo)
  if (url.includes('tag=')) return url;
  
  // Limpiar la URL y añadir el tag
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}tag=${AMAZON_TAG}`;
};

/**
 * Determina si un enlace es de Amazon para aplicar estilos visuales.
 */
export const isAmazonLink = (url: string): boolean => {
  if (!url) return false;
  return url.includes('amazon.es') || url.includes('amazon.com') || url.includes('amzn.to');
};
