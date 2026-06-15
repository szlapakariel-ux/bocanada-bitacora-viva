import { Router } from "express";
import { prisma, parseJSON } from "../db.js";
import { requireFormador } from "../auth.js";

const router = Router();
router.use(requireFormador);

// Pulso del proceso: señales agregadas de un programa
router.get("/:programaId", async (req, res) => {
  const programa = await prisma.programa.findFirst({
    where: { id: req.params.programaId, formadorId: req.formadorId },
    include: {
      participantes: true,
      dias: {
        orderBy: { numero: "asc" },
        include: {
          bloques: {
            include: { recurso: true, respuestas: true },
          },
        },
      },
    },
  });
  if (!programa) return res.status(404).json({ error: "No encontrado" });

  const focos = {}; // selector_foco: opción -> conteo
  const checklist = {}; // opción -> conteo
  const escalas = []; // { titulo, promedio, n }
  const quizzes = []; // { titulo, promedio, n }
  const reflexiones = []; // { titulo, texto, fecha }
  const porDia = []; // participación por día

  for (const dia of programa.dias) {
    let respuestasDia = 0;
    for (const bloque of dia.bloques) {
      const tipo = bloque.recurso.tipo;
      const titulo = bloque.recurso.titulo;
      respuestasDia += bloque.respuestas.length;

      if (tipo === "selector_foco") {
        for (const r of bloque.respuestas) {
          const { opcion } = parseJSON(r.payload);
          if (opcion) focos[opcion] = (focos[opcion] || 0) + 1;
        }
      } else if (tipo === "checklist") {
        for (const r of bloque.respuestas) {
          const { seleccion = [] } = parseJSON(r.payload);
          for (const op of seleccion) checklist[op] = (checklist[op] || 0) + 1;
        }
      } else if (tipo === "escala") {
        const vals = bloque.respuestas
          .map((r) => Number(parseJSON(r.payload).valor))
          .filter((v) => !Number.isNaN(v));
        if (vals.length)
          escalas.push({
            titulo,
            promedio: +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2),
            n: vals.length,
          });
      } else if (tipo === "quiz" || tipo === "clasificar") {
        const vals = bloque.respuestas
          .map((r) => Number(parseJSON(r.payload).puntaje))
          .filter((v) => !Number.isNaN(v));
        if (vals.length)
          quizzes.push({
            titulo,
            promedio: +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(0),
            n: vals.length,
          });
      } else if (["reflexion", "compromiso"].includes(tipo)) {
        for (const r of bloque.respuestas) {
          const { texto } = parseJSON(r.payload);
          if (texto && texto.trim())
            reflexiones.push({ titulo, texto: texto.trim(), fecha: r.createdAt });
        }
      }
    }
    porDia.push({ numero: dia.numero, respuestas: respuestasDia, bloques: dia.bloques.length });
  }

  reflexiones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  res.json({
    programa: {
      id: programa.id,
      nombre: programa.nombre,
      codigoAcceso: programa.codigoAcceso,
      multiPorDia: programa.multiPorDia,
    },
    resumen: {
      participantes: programa.participantes.length,
      respuestas: porDia.reduce((a, d) => a + d.respuestas, 0),
    },
    focos,
    checklist,
    escalas,
    quizzes,
    reflexiones: reflexiones.slice(0, 30),
    porDia,
  });
});

export default router;
