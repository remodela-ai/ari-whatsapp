export function convertirANumero(str: string): number {
  // Verificar si el string es un número
  if (!isNaN(parseInt(str))) {
    // Convertir a número
    return parseInt(str);
  } else {
    // Dejar como null si no es un número
    return null;
  }
}
