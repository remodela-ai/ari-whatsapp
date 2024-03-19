export const roomType = [
  "Sala",
  "Dormitorio",
  "Cocina",
  "Comedor",
  "Baño",
  "Oficina",
];

export const roomStyle = [
  "Moderno",
  "Escandinavo",
  "Industrial",
  "Medio siglo",
  "Lujo",
  "Casa de Campo",
  "Costero",
  "Estándar",
];

export const remodelaPrompt = `PROMPT: Tarea: Generar un render realista de remodelación de un [ROOM] a partir de una foto proporcionada por el usuario.

  Entrada:
  
  Imagen de [ROOM]  a remodelar proporcionada por el usuario.
  Respuestas del usuario a las siguientes preguntas:
  Tipo de habitación: [ROOM].
  Estilo preferido: [STYLE].
  Colores preferidos: [COLORS].
  ILUMINACION DE LEDS.. 
  
  Restricciones:
  * Mantener la estructura general de la habitación existente visible en el render.
  * Aplicar el estilo [STYLE] preferido por el usuario, utilizando muebles y elementos decorativos acordes.
  * Integrar los colores [COLORS] preferidos del usuario de manera armoniosa en la remodelación.
  * Respetar las proporciones y la distribución del espacio original.
      - Nota si hay ventanas, Nota si es una cocina y si hay refrigeradores 
  Métricas de Evaluación:
  * Realismo visual: Evaluación subjetiva de la calidad visual del render en comparación con la fotografía original.
  * Coherencia estilística: Verificar que los elementos de diseño y decoración reflejen el estilo [STYLE] solicitado.
  * Integración de colores: Comprobar que los tonos neutros y el toque de azul se integren de manera adecuada en la escena.
`;
