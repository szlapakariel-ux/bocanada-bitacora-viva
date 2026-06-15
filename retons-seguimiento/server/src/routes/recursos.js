import { Router } from "express";
import { prisma, parseJSON, stringifyJSON } from "../db.js";
import { requireFormador } from "../auth.js";
import { TIPOS, esTipoValido } from "../catalogo.js";

const router = Router();
router.use(requireFormador);

const serializar = (r) => ({ ...r, config: parseJSON(r.config) });

// Catálogo de tipos disponibles
router.get("/catalogo", (_req, res) => res.json({ tipos: TIPOS }));

// Listar la biblioteca del formador
router.get("/", async (req, res) => {
  const recursos = await prisma.recurso.findMany({
    where: { formadorId: req.formadorId },
    orderBy: { createdAt: "desc" },
  });
  res.json({ recursos: recursos.map(serializar) });
});

router.post("/", async (req, res) => {
  const { tipo, titulo, descripcion, config } = req.body || {};
  if (!esTipoValido(tipo)) return res.status(400).json({ error: "Tipo inválido" });
  if (!titulo) return res.status(400).json({ error: "Falta el título" });

  const recurso = await prisma.recurso.create({
    data: {
      formadorId: req.formadorId,
      tipo,
      titulo,
      descripcion: descripcion || null,
      config: stringifyJSON(config || {}),
    },
  });
  res.json({ recurso: serializar(recurso) });
});

router.put("/:id", async (req, res) => {
  const actual = await prisma.recurso.findFirst({
    where: { id: req.params.id, formadorId: req.formadorId },
  });
  if (!actual) return res.status(404).json({ error: "No encontrado" });

  const { titulo, descripcion, config } = req.body || {};
  const recurso = await prisma.recurso.update({
    where: { id: actual.id },
    data: {
      titulo: titulo ?? actual.titulo,
      descripcion: descripcion ?? actual.descripcion,
      config: config ? stringifyJSON(config) : actual.config,
    },
  });
  res.json({ recurso: serializar(recurso) });
});

router.delete("/:id", async (req, res) => {
  const actual = await prisma.recurso.findFirst({
    where: { id: req.params.id, formadorId: req.formadorId },
  });
  if (!actual) return res.status(404).json({ error: "No encontrado" });
  await prisma.recurso.delete({ where: { id: actual.id } });
  res.json({ ok: true });
});

export default router;
