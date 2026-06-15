import { Router } from "express";
import { prisma } from "../db.js";
import { requireFormador } from "../auth.js";
import { esTipoValido } from "../catalogo.js";
import { construirPrompt } from "../ia.js";

const router = Router();
router.use(requireFormador);

// Genera el prompt para crear/buscar una propuesta de contenido de un recurso.
// Hoy devuelve el prompt listo para copiar. Si en el futuro se define
// ANTHROPIC_API_KEY, acá se puede enchufar la llamada real al agente.
router.post("/prompt", async (req, res) => {
  const { programaId, numero, tipo, titulo } = req.body || {};
  if (!esTipoValido(tipo)) return res.status(400).json({ error: "Tipo inválido" });

  const programa = await prisma.programa.findFirst({
    where: { id: programaId, formadorId: req.formadorId },
  });
  if (!programa) return res.status(404).json({ error: "Programa no encontrado" });

  const dia = await prisma.diaPrograma.findFirst({
    where: { programaId: programa.id, numero: parseInt(numero) },
  });

  const prompt = construirPrompt({
    programa,
    dia: dia || { numero },
    tipo,
    titulo: titulo || "",
  });

  // Hook para el agente futuro:
  // if (process.env.ANTHROPIC_API_KEY) { const propuesta = await llamarAgente(prompt); ... }
  res.json({
    prompt,
    propuesta: null,
    nota: "Copiá este prompt en tu herramienta de IA. (El agente automático se conecta en una fase futura.)",
  });
});

export default router;
