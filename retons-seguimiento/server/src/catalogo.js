// Catálogo de tipos de recurso disponibles en la biblioteca.
// Cada tipo define cómo se consume (contenido) o qué señal devuelve (interacción).

export const TIPOS = {
  // ── Contenido ──
  video: { label: "Video", grupo: "contenido", senal: null },
  audio: { label: "Audio / Podcast", grupo: "contenido", senal: null },
  meditacion: { label: "Meditación guiada", grupo: "contenido", senal: null },
  lectura: { label: "Micro-lectura / Frase", grupo: "contenido", senal: null },
  imagen: { label: "Imagen / Infografía", grupo: "contenido", senal: null },

  // ── Interacción (devuelve señal al panel) ──
  reflexion: { label: "Reflexión escrita", grupo: "interaccion", senal: "texto" },
  voz: { label: "Respuesta en voz", grupo: "interaccion", senal: "audio" },
  checklist: { label: "Checklist / Hábitos", grupo: "interaccion", senal: "opciones" },
  selector_foco: { label: "Selector de foco", grupo: "interaccion", senal: "opcion" },
  escala: { label: "Escala / Encuesta", grupo: "interaccion", senal: "numero" },
  formulario: { label: "Formulario guiado", grupo: "interaccion", senal: "campos" },

  // ── Gamificación ──
  quiz: { label: "Quiz / Trivia", grupo: "gamificacion", senal: "puntaje" },
  flashcards: { label: "Flashcards", grupo: "gamificacion", senal: "completado" },
  clasificar: { label: "Clasificar / Ordenar", grupo: "gamificacion", senal: "puntaje" },
  reto: { label: "Reto del día", grupo: "gamificacion", senal: "completado" },
  compromiso: { label: "Compromiso si–entonces", grupo: "gamificacion", senal: "texto" },
};

export const esTipoValido = (tipo) => Object.prototype.hasOwnProperty.call(TIPOS, tipo);
