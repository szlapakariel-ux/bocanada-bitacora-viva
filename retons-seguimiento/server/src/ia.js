// Infraestructura IA (sin costo hoy): arma un prompt profesional para que un
// agente cree/busque una propuesta de contenido para un recurso, usando la
// marca del cliente, el briefing del programa y la definición del día.
//
// A futuro: con una ANTHROPIC_API_KEY, routes/ia.js puede mandar este prompt a
// Claude y devolver la propuesta ya generada. Hoy devolvemos el prompt listo
// para copiar y pegar en cualquier herramienta de IA.

import { TIPOS } from "./catalogo.js";

// Guía por tipo: qué producir y con qué esquema JSON debe responder el agente.
const TIPO_GUIA = {
  video: { que: "una idea de video corto (guion + sugerencia de búsqueda)", esquema: `{ "url": "", "guion": "" }` },
  audio: { que: "una idea de audio/podcast breve (guion locutado)", esquema: `{ "url": "", "guion": "" }` },
  meditacion: { que: "una meditación guiada", esquema: `{ "instrucciones": "", "duracionSeg": 120 }` },
  lectura: { que: "una micro-lectura o frase ancla potente", esquema: `{ "texto": "", "autor": "" }` },
  imagen: { que: "el concepto de una imagen/infografía (descripción para generarla)", esquema: `{ "url": "", "alt": "" }` },
  reflexion: { que: "una consigna de reflexión escrita", esquema: `{ "consigna": "" }` },
  voz: { que: "una consigna para respuesta en voz", esquema: `{ "consigna": "" }` },
  checklist: { que: "una lista de chequeo de hábitos/conductas observables", esquema: `{ "opciones": ["", ""] }` },
  selector_foco: { que: "4 focos posibles donde puede estar la energía del día", esquema: `{ "opciones": [{ "id": "", "label": "", "desc": "", "color": "#1B56D6" }] }` },
  escala: { que: "una pregunta de autoevaluación en escala", esquema: `{ "min": 1, "max": 5, "etiquetaMin": "", "etiquetaMax": "" }` },
  formulario: { que: "un formulario guiado de 2 a 4 pasos", esquema: `{ "pasos": [{ "label": "", "placeholder": "" }] }` },
  quiz: { que: "un mini quiz de 1 a 3 preguntas", esquema: `{ "preguntas": [{ "pregunta": "", "opciones": ["", ""], "correcta": 0 }] }` },
  flashcards: { que: "un set de flashcards de conceptos clave", esquema: `{ "tarjetas": [{ "frente": "", "dorso": "" }] }` },
  clasificar: { que: "un ejercicio de clasificar/ordenar conceptos", esquema: `{ "consigna": "", "items": [""] }` },
  reto: { que: "un micro-reto concreto y accionable para el día", esquema: `{ "texto": "" }` },
  compromiso: { que: "una plantilla de compromiso si–entonces", esquema: `{ "plantilla": "Si ____, entonces yo ____." }` },
};

const linea = (label, val) => (val ? `- ${label}: ${val}\n` : "");

export function construirPrompt({ programa, dia, tipo, titulo }) {
  const meta = TIPOS[tipo] || { label: tipo };
  const guia = TIPO_GUIA[tipo] || { que: "el contenido del recurso", esquema: "{}" };

  return `Sos un especialista en diseño instruccional y comunicación de marca.
Tu tarea es proponer ${guia.que} para un programa de acompañamiento diario.

## Contexto del programa
${linea("Programa", programa.nombre)}${linea("Objetivo general", programa.objetivoGeneral)}${linea("Público objetivo", programa.publicoObjetivo)}${linea("Tono de comunicación", programa.tono)}${linea("Qué se quiere transmitir (briefing)", programa.briefing)}
## Marca del cliente
${linea("Color primario", programa.colorPrimario)}${linea("Color secundario", programa.colorSecundario)}${linea("Color de acento", programa.colorAcento)}${linea("Tipografía", programa.tipografia)}${linea("Notas de marca", programa.manualNotas)}
## Día ${dia.numero}
${linea("Título del día", dia.titulo)}${linea("Tema a tratar", dia.tema)}${linea("Intención (qué transmitir ese día)", dia.intencion)}
## Recurso a producir
- Tipo: ${meta.label}
${linea("Título de trabajo", titulo)}
## Instrucciones
1. Respetá estrictamente el tono y la identidad de marca indicados.
2. Alineá el contenido con el tema y la intención del día.
3. Sé concreto, humano y sin relleno: "una pausa en medio del caos".
4. Devolvé ÚNICAMENTE un JSON válido con esta estructura:
${guia.esquema}`;
}
