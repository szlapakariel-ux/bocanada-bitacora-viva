import { Router } from "express";
import { customAlphabet } from "nanoid";
import { prisma, parseJSON } from "../db.js";
import { requireFormador } from "../auth.js";

const router = Router();
router.use(requireFormador);

const codigo = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

const propio = async (id, formadorId) =>
  prisma.programa.findFirst({ where: { id, formadorId } });

// Listar programas del formador
router.get("/", async (req, res) => {
  const programas = await prisma.programa.findMany({
    where: { formadorId: req.formadorId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { participantes: true } } },
  });
  res.json({ programas });
});

// Crear programa + sus días vacíos
router.post("/", async (req, res) => {
  const { nombre, descripcion, duracionDias, fraseAncla, multiPorDia } = req.body || {};
  if (!nombre) return res.status(400).json({ error: "Falta el nombre" });
  const dias = Math.min(Math.max(parseInt(duracionDias) || 6, 1), 30);

  const programa = await prisma.programa.create({
    data: {
      formadorId: req.formadorId,
      nombre,
      descripcion: descripcion || null,
      codigoAcceso: codigo(),
      duracionDias: dias,
      multiPorDia: Boolean(multiPorDia),
      fraseAncla: fraseAncla || "Somos lo que hacemos repetidamente",
      dias: { create: Array.from({ length: dias }, (_, i) => ({ numero: i + 1 })) },
    },
  });
  res.json({ programa });
});

// Detalle con días, bloques y recursos
router.get("/:id", async (req, res) => {
  const programa = await prisma.programa.findFirst({
    where: { id: req.params.id, formadorId: req.formadorId },
    include: {
      dias: {
        orderBy: { numero: "asc" },
        include: {
          bloques: { orderBy: { orden: "asc" }, include: { recurso: true } },
        },
      },
    },
  });
  if (!programa) return res.status(404).json({ error: "No encontrado" });

  // deserializar config de cada recurso
  programa.dias.forEach((d) =>
    d.bloques.forEach((b) => (b.recurso.config = parseJSON(b.recurso.config)))
  );
  res.json({ programa });
});

// Campos editables del programa (incluye marca y briefing)
const CAMPOS_PROGRAMA = [
  "nombre", "descripcion", "fraseAncla", "multiPorDia", "activo",
  "logoData", "colorPrimario", "colorSecundario", "colorAcento", "tipografia", "manualNotas",
  "publicoObjetivo", "tono", "objetivoGeneral", "briefing",
];

router.put("/:id", async (req, res) => {
  const actual = await propio(req.params.id, req.formadorId);
  if (!actual) return res.status(404).json({ error: "No encontrado" });

  const data = {};
  for (const c of CAMPOS_PROGRAMA)
    if (req.body && c in req.body) data[c] = req.body[c];

  const programa = await prisma.programa.update({ where: { id: actual.id }, data });
  res.json({ programa });
});

// Definir el día: nombre, tema a tratar e intención (qué se quiere transmitir)
router.put("/:id/dias/:numero", async (req, res) => {
  const programa = await propio(req.params.id, req.formadorId);
  if (!programa) return res.status(404).json({ error: "No encontrado" });

  const dia = await prisma.diaPrograma.findFirst({
    where: { programaId: programa.id, numero: parseInt(req.params.numero) },
  });
  if (!dia) return res.status(404).json({ error: "Día inexistente" });

  const { titulo, tema, intencion } = req.body || {};
  const actualizado = await prisma.diaPrograma.update({
    where: { id: dia.id },
    data: {
      titulo: titulo ?? dia.titulo,
      tema: tema ?? dia.tema,
      intencion: intencion ?? dia.intencion,
    },
  });
  res.json({ dia: actualizado });
});

// Asignar un recurso a un día
router.post("/:id/dias/:numero/bloques", async (req, res) => {
  const programa = await propio(req.params.id, req.formadorId);
  if (!programa) return res.status(404).json({ error: "No encontrado" });

  const { recursoId } = req.body || {};
  const recurso = await prisma.recurso.findFirst({
    where: { id: recursoId, formadorId: req.formadorId },
  });
  if (!recurso) return res.status(400).json({ error: "Recurso inválido" });

  const dia = await prisma.diaPrograma.findFirst({
    where: { programaId: programa.id, numero: parseInt(req.params.numero) },
    include: { bloques: true },
  });
  if (!dia) return res.status(404).json({ error: "Día inexistente" });

  // Default del producto: 1 recurso por día. multiPorDia (premium) lo libera.
  if (!programa.multiPorDia && dia.bloques.length >= 1)
    return res.status(403).json({
      error: "Este programa permite 1 recurso por día. Activá multi-recurso (premium) para sumar más.",
      code: "MULTI_REQUIRED",
    });

  const bloque = await prisma.bloqueDia.create({
    data: { diaId: dia.id, recursoId, orden: dia.bloques.length },
  });
  res.json({ bloque });
});

router.delete("/bloques/:bloqueId", async (req, res) => {
  const bloque = await prisma.bloqueDia.findUnique({
    where: { id: req.params.bloqueId },
    include: { dia: { include: { programa: true } } },
  });
  if (!bloque || bloque.dia.programa.formadorId !== req.formadorId)
    return res.status(404).json({ error: "No encontrado" });
  await prisma.bloqueDia.delete({ where: { id: bloque.id } });
  res.json({ ok: true });
});

export default router;
