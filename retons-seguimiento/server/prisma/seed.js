import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { prisma, stringifyJSON } from "../src/db.js";

const S = stringifyJSON;

export async function sembrar() {
  console.log("Sembrando datos demo…");

  // Limpieza (orden por dependencias)
  await prisma.respuesta.deleteMany();
  await prisma.bloqueDia.deleteMany();
  await prisma.diaPrograma.deleteMany();
  await prisma.participante.deleteMany();
  await prisma.programa.deleteMany();
  await prisma.recurso.deleteMany();
  await prisma.formador.deleteMany();

  // Dueño de la plataforma (rol owner): da de alta clientes
  await prisma.formador.create({
    data: {
      nombre: "Dueño Bitácora Viva",
      email: "dueno@bitacoraviva.app",
      passwordHash: await bcrypt.hash("admin1234", 10),
      rol: "owner",
    },
  });

  // Cliente demo de la plataforma (RETONS es un cliente, no la plataforma)
  const formador = await prisma.formador.create({
    data: {
      nombre: "RETONS (cliente demo)",
      email: "demo@retons.com",
      passwordHash: await bcrypt.hash("demo1234", 10),
      rol: "formador",
    },
  });

  // ── Biblioteca de recursos ──
  const r = {};
  const crear = async (key, tipo, titulo, descripcion, config) => {
    r[key] = await prisma.recurso.create({
      data: { formadorId: formador.id, tipo, titulo, descripcion, config: S(config) },
    });
  };

  await crear("frase", "lectura", "Anclaje del día", "Frase eje del programa", {
    texto: "Somos lo que hacemos repetidamente.",
    autor: "Aristóteles",
  });
  await crear("video", "video", "Hábitos que sostienen", "Video introductorio", {
    url: "https://www.youtube.com/embed/U_nzqnXWvSo",
  });
  await crear("podcast", "audio", "El poder del proceso", "Audio de 6 minutos", {
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  });
  await crear("medita", "meditacion", "Respiración 4·7·8", "Una pausa en medio del caos", {
    duracionSeg: 120,
    instrucciones: "Inhalá 4 segundos, sostené 7, exhalá 8. Repetí el ciclo.",
  });
  await crear("formula", "formulario", "La huella de hoy", "Fórmula del Resultado", {
    pasos: [
      { label: "¿Qué Resultado obtuviste hoy (bueno o malo)?", placeholder: "El resultado fue…" },
      { label: "¿Qué Acción tomaste y qué Emoción te impulsó?", placeholder: "Hice… sintiendo…" },
      { label: "Un paso más atrás… ¿Qué Pensamiento o Creencia tenías?", placeholder: "Creía que…" },
    ],
  });
  await crear("filtro", "checklist", "Filtro de comunicación", "Palabras limitantes que usé hoy", {
    opciones: [
      'El uso del "Pero"',
      'Generalizaciones ("Siempre", "Nunca", "Todos", "Ninguno")',
      'Imposiciones ("Deberías")',
      'Uso constante del "NO"',
    ],
  });
  await crear("foco", "selector_foco", "Foco de gestión", "¿Dónde estuvo tu energía hoy?", {
    opciones: [
      { id: "posibilidad", label: "Posibilidad", desc: "Impacto en el futuro", color: "#1B56D6" },
      { id: "aventura", label: "Aventura", desc: "Acción y soluciones inmediatas", color: "#D63030" },
      { id: "agua", label: "Agua", desc: "Relaciones y bienestar del equipo", color: "#1A7A3C" },
      { id: "tierra", label: "Tierra", desc: "Defender el entorno y el paso a paso", color: "#13152A" },
    ],
  });
  await crear("energia", "escala", "¿Cómo está tu energía?", "Del 1 al 5", {
    min: 1,
    max: 5,
    etiquetaMin: "En reserva",
    etiquetaMax: "A pleno",
  });
  await crear("reto", "reto", "Reto del día", "Un micro-desafío concreto", {
    texto: "Hoy, en tu próxima conversación, eliminá el 'pero' y reemplazalo por 'y'.",
  });
  await crear("compromiso", "compromiso", "Compromiso si–entonces", "Intención de implementación", {
    plantilla: "Si ____, entonces yo ____.",
  });
  await crear("flash", "flashcards", "Conceptos clave", "Tarjetas para repasar", {
    tarjetas: [
      { frente: "Resultado", dorso: "La consecuencia visible de una acción." },
      { frente: "Acción", dorso: "Lo que hacés, impulsado por una emoción." },
      { frente: "Pensamiento", dorso: "La creencia que está detrás de la emoción." },
    ],
  });
  await crear("quiz", "quiz", "Mini quiz", "Repaso rápido", {
    preguntas: [
      {
        pregunta: "¿Qué está detrás de la emoción según la fórmula?",
        opciones: ["El resultado", "El pensamiento/creencia", "El clima"],
        correcta: 1,
      },
    ],
  });

  // ── Programa demo (6 días, 1 recurso por día = default) ──
  const programa = await prisma.programa.create({
    data: {
      formadorId: formador.id,
      nombre: "Módulo de Liderazgo — Demo",
      descripcion: "Recorrido de 6 días para sostener la capacitación entre encuentros.",
      codigoAcceso: "LIDER1",
      duracionDias: 6,
      multiPorDia: false,
      fraseAncla: "Somos lo que hacemos repetidamente",
      // Marca de ejemplo (editable desde el constructor)
      colorPrimario: "#1B56D6",
      colorSecundario: "#1A7A3C",
      colorAcento: "#D63030",
      tipografia: "Nunito Sans",
      manualNotas: "Estética 'pausa en medio del caos': limpio, minimalista, mucho espacio en blanco.",
      // Briefing de ejemplo (alimenta a los futuros agentes IA)
      publicoObjetivo: "Mandos medios en formación de liderazgo.",
      tono: "Directo, humano, intelectual, sin rodeos, en primera persona.",
      objetivoGeneral: "Sostener la capacitación entre encuentros con micro-interacciones diarias.",
      briefing: "Queremos transmitir que el liderazgo se construye con hábitos pequeños y repetidos.",
      dias: {
        create: [
          { numero: 1, titulo: "Anclaje", tema: "El poder de lo repetido", intencion: "Instalar la frase eje del programa." },
          { numero: 2, titulo: "La huella de hoy", tema: "Fórmula del Resultado", intencion: "Bajar a tierra una situación real del día." },
          { numero: 3, titulo: "Filtro de comunicación", tema: "Hábitos mínimos del lenguaje", intencion: "Tomar conciencia de las palabras limitantes." },
          { numero: 4, titulo: "Foco de gestión", tema: "¿Dónde pongo mi energía?", intencion: "Detectar el patrón de foco del equipo." },
          { numero: 5, titulo: "Pausa", tema: "Respiración y registro", intencion: "Crear una pausa en medio del caos." },
          { numero: 6, titulo: "Cierre", tema: "Compromiso hacia adelante", intencion: "Proyectar una intención de implementación." },
        ],
      },
    },
    include: { dias: true },
  });

  const dia = (n) => programa.dias.find((d) => d.numero === n);
  const asignar = (n, recurso, orden = 0) =>
    prisma.bloqueDia.create({ data: { diaId: dia(n).id, recursoId: recurso.id, orden } });

  const b1 = await asignar(1, r.frase);
  const b2 = await asignar(2, r.formula);
  const b3 = await asignar(3, r.filtro);
  const b4 = await asignar(4, r.foco);
  const b5 = await asignar(5, r.medita);
  const b6 = await asignar(6, r.compromiso);

  // ── Participantes demo + respuestas para poblar el panel ──
  const focos = ["aventura", "aventura", "posibilidad", "agua", "aventura", "tierra", "posibilidad"];
  for (let i = 0; i < 7; i++) {
    const p = await prisma.participante.create({
      data: { programaId: programa.id, nombre: `Participante ${i + 1}`, clave: `100${i}` },
    });
    await prisma.respuesta.create({
      data: { participanteId: p.id, bloqueId: b1.id, payload: S({ leido: true }) },
    });
    if (i < 5)
      await prisma.respuesta.create({
        data: {
          participanteId: p.id,
          bloqueId: b2.id,
          payload: S({ campos: ["Cerré una venta", "Insistí con confianza", "Creía que podía"] }),
        },
      });
    if (i < 6)
      await prisma.respuesta.create({
        data: {
          participanteId: p.id,
          bloqueId: b3.id,
          payload: S({ seleccion: i % 2 ? ['El uso del "Pero"'] : ['Imposiciones ("Deberías")', 'Uso constante del "NO"'] }),
        },
      });
    await prisma.respuesta.create({
      data: { participanteId: p.id, bloqueId: b4.id, payload: S({ opcion: focos[i] }) },
    });
  }

  console.log("✔ Listo.");
  console.log("  Dueño:       dueno@bitacoraviva.app / admin1234");
  console.log("  Cliente:     demo@retons.com / demo1234");
  console.log("  Participante: código LIDER1, nombre libre, clave 1000");
}

// Ejecución directa por CLI (npm run db:seed)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  sembrar()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
