/**
 * Utilitários para decodificação de caracteres UTF-8
 */

/**
 * Decodifica uma string que pode ter caracteres UTF-8 mal codificados
 * @param str String a ser decodificada
 * @returns String decodificada corretamente
 */
export function decodeUTF8(str: string): string {
  if (!str) return str;
  
  try {
    // Tenta decodificar usando decodeURIComponent para caracteres percent-encoded
    return decodeURIComponent(escape(str));
  } catch (error) {
    // Se falhar, retorna a string original
    console.warn('Erro ao decodificar UTF-8:', error);
    return str;
  }
}

/**
 * Decodifica uma string base64 com suporte a UTF-8
 * @param base64 String base64
 * @returns String decodificada
 */
export function decodeBase64UTF8(base64: string): string {
  try {
    // Decodificar base64
    const binaryString = atob(base64);
    
    // Converter para UTF-8
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Decodificar usando TextDecoder
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(bytes);
  } catch (error) {
    console.warn('Erro ao decodificar base64 UTF-8:', error);
    return base64;
  }
}

