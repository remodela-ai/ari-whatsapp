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

export const remodelaPrompt = `Aquí tienes el prompt engineer para generar el render de remodelación del dormitorio:

Tarea: Generar un render realista de remodelación de un dormitorio a partir de una foto proporcionada por el usuario.

Entrada:

Imagen del dormitorio a remodelar proporcionada por el usuario.
Respuestas del usuario a las siguientes preguntas:
Tipo de habitación: [room].
Estilo preferido: [style].
Colores preferidos: [colors].
Dato Extra: [extraPrompt].

Restricciones:
Mantener la estructura general de la habitación existente visible en el render.
Aplicar el estilo [style] preferido por el usuario, utilizando muebles y elementos decorativos acordes.
Integrar los colores preferidos del usuario de manera armoniosa en la remodelación.
Respetar las proporciones y la distribución del espacio original.

Métricas de Evaluación:
Realismo visual: Evaluación subjetiva de la calidad visual del render en comparación con la fotografía original.
Coherencia estilística: Verificar que los elementos de diseño y decoración reflejen el estilo moderno solicitado.
Integración de colores: Comprobar que los tonos neutros y el toque de azul se integren de manera adecuada en la escena.
Instrucciones para la Plataforma de IA Generativa:

Utilizar la foto proporcionada por el usuario como referencia para la remodelación del dormitorio.
Incorporar muebles y elementos decorativos que reflejen un estilo moderno.
Aplicar los colores preferidos del usuario ([colors]) de manera equilibrada en la escena.
Mantener la coherencia estilística y la proporcionalidad en la distribución de los elementos dentro del espacio.
Generar un render final que refleje fielmente la visión del usuario para la remodelación de su dormitorio.
Nota: La calidad del render final dependerá de la precisión en la interpretación de las preferencias del usuario y la habilidad para integrarlas de manera armoniosa en la escena remodelada.
`;
