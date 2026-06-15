import { Router } from "express";
import { customAlphabet } from "nanoid";
import { prisma, parseJSON, stringifyJSON } from "../db.js";

const router = Router();
const claveAuto = customAlphabet("0123456789", 4);

// Ingreso: código del programa + nombre + clave personal
router.post("/join", async (req, res) => {
  const { codigo, nombre, clave } = req.body || {};
  if (!codigo || !nombre) return res.status(400).json({ error: "Faltan datos" });

  const programa = await prisma.programa.findUnique({
    where: { codigoAcceso: String(codigo).toUpperCase().trim() },
  });
  if (!programa || !programa.activo)
    return res.status(404).json({ error: "Código inválido o programa inactivo" });

  const claveFinal = (clave && String(clave).trim()) || claveAuto();

  let participante = await prisma.participante.findFirst({
    where: { programaId: programa.id, clave: claveFinal },
  });
  if (!participante) {
    participante = await prisma.participante.create({
      data: { programaId: programa.id, nombre, clave: claveFinal },
    });
  }

  res.json({
    participante: { id: participante.id, nombre: participante.nombre, clave: participante.clave },
    programa: {
      id: programa.id,
      nombre: programa.nombre,
      fraseAncla: programa.fraseAncla,
      duracionDias: programa.duracionDias,
    },
  });
});

// Progreso del recorrido (qué días están completos)
router.get("/:participanteId/progreso", async (req, res) => {
  const participante = await prisma.participante.findUnique({
    where: { id: req.params.participanteId },
    include: { programa: { include: { dias: { include: { bloques: true } } } } },
  });
  if (!participante) return res.status(404).json({ error: "No encontrado" });

  const respuestas = await prisma.respuesta.findMany({
    where: { participanteId: participante.id },
    select: { bloqueId: true },
  });
  const hechos = new Set(respuestas.map((r) => r.bloqueId));

  const dias = participante.programa.dias
    .sort((a, b) => a.numero - b.numero)
    .map((d) => {
      const total = d.bloques.length;
      const completos = d.bloques.filter((b) => hechos.has(b.id)).length;
      return {
        numero: d.numero,
        titulo: d.titulo,
        total,
        completos,
        completo: total > 0 && completos >= total,
        vacio: total === 0,
      };
    });

  res.json({
    programa: { nombre: participante.programa.nombre, fraseAncla: participante.programa.fraseAncla },
    dias,
  });
});

// Bloques de un día + respuestas previas
router.get("/:participanteId/dia/:numero", async (req, res) => {
  const participante = await prisma.participante.findUnique({
    where: { id: req.params.participanteId },
  });
  if (!participante) return res.status(404).json({ error: "No encontrado" });

  const dia = await prisma.diaPrograma.findFirst({
    where: { programaId: participante.programaId, numero: parseInt(req.params.numero) },
    include: { bloques: { orderBy: { orden: "asc" }, include: { recurso: true } } },
  });
  if (!dia) return res.status(404).json({ error: "Día inexistente" });

  const respuestas = await prisma.respuesta.findMany({
    where: {
      participanteId: participante.id,
      bloqueId: { in: dia.bloques.map((b) => b.id) },
    },
  });
  const porBloque = Object.fromEntries(
    respuestas.map((r) => [r.bloqueId, parseJSON(r.payload)])
  );

  res.json({
    dia: {
      numero: dia.numero,
      titulo: dia.titulo,
      bloques: dia.bloques.map((b) => ({
        id: b.id,
        tipo: b.recurso.tipo,
        titulo: b.recurso.titulo,
        descripcion: b.recurso.descripcion,
        config: parseJSON(b.recurso.config),
        respuesta: porBloque[b.id] || null,
      })),
    },
  });
});

// Guardar respuesta a un bloque (upsert)
router.post("/:participanteId/respuesta", async (req, res) => {
  const { bloqueId, payload } = req.body || {};
  const participante = await prisma.participante.findUnique({
    where: { id: req.params.participanteId },
  });
  if (!participante) return res.status(404).json({ error: "No encontrado" });

  const bloque = await prisma.bloqueDia.findUnique({
    where: { id: bloqueId },
    include: { dia: true },
  });
  if (!bloque || bloque.dia.programaId !== participante.programaId)
    return res.status(400).json({ error: "Bloque inválido" });

  const respuesta = await prisma.respuesta.upsert({
    where: { participanteId_bloqueId: { participanteId: participante.id, bloqueId } },
    create: {
      participanteId: participante.id,
      bloqueId,
      payload: stringifyJSON(payload || {}),
    },
    update: { payload: stringifyJSON(payload || {}) },
  });
  res.json({ ok: true, id: respuesta.id });
});

export default router;
