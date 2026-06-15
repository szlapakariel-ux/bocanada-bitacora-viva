// Catálogo de tipos de recurso (lado cliente): etiqueta, ícono y grupo.
export const CATALOGO = {
  video: { label: "Video", icon: "🎬", grupo: "Contenido" },
  audio: { label: "Audio / Podcast", icon: "🎧", grupo: "Contenido" },
  meditacion: { label: "Meditación guiada", icon: "🧘", grupo: "Contenido" },
  lectura: { label: "Micro-lectura / Frase", icon: "📖", grupo: "Contenido" },
  imagen: { label: "Imagen / Infografía", icon: "🖼️", grupo: "Contenido" },

  reflexion: { label: "Reflexión escrita", icon: "✍️", grupo: "Interacción" },
  voz: { label: "Respuesta en voz", icon: "🎙️", grupo: "Interacción" },
  checklist: { label: "Checklist / Hábitos", icon: "✅", grupo: "Interacción" },
  selector_foco: { label: "Selector de foco", icon: "🎯", grupo: "Interacción" },
  escala: { label: "Escala / Encuesta", icon: "📊", grupo: "Interacción" },
  formulario: { label: "Formulario guiado", icon: "🧩", grupo: "Interacción" },

  quiz: { label: "Quiz / Trivia", icon: "❓", grupo: "Gamificación" },
  flashcards: { label: "Flashcards", icon: "🃏", grupo: "Gamificación" },
  clasificar: { label: "Clasificar / Ordenar", icon: "🔀", grupo: "Gamificación" },
  reto: { label: "Reto del día", icon: "🏆", grupo: "Gamificación" },
  compromiso: { label: "Compromiso si–entonces", icon: "🤝", grupo: "Gamificación" },
};

export const GRUPOS = ["Contenido", "Interacción", "Gamificación"];
export const tipoMeta = (t) => CATALOGO[t] || { label: t, icon: "•", grupo: "—" };
