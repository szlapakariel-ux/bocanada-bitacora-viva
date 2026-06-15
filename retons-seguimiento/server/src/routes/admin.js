import { Router } from "express";
import bcrypt from "bcryptjs";
import { customAlphabet } from "nanoid";
import { prisma } from "../db.js";
import { requireOwner } from "../auth.js";

const router = Router();
router.use(requireOwner);

const genPass = customAlphabet("abcdefghijkmnpqrstuvwxyz23456789", 10);

// Listar clientes (formadores) con métricas
router.get("/clientes", async (_req, res) => {
  const clientes = await prisma.formador.findMany({
    where: { rol: "formador" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, nombre: true, email: true, activo: true, createdAt: true,
      _count: { select: { programas: true, recursos: true } },
    },
  });

  // participantes totales por cliente
  const conParticipantes = await Promise.all(
    clientes.map(async (c) => {
      const participantes = await prisma.participante.count({
        where: { programa: { formadorId: c.id } },
      });
      return { ...c, participantes };
    })
  );
  res.json({ clientes: conParticipantes });
});

// Crear un cliente nuevo (cuenta de formador)
router.post("/clientes", async (req, res) => {
  const { nombre, email, password } = req.body || {};
  if (!nombre || !email) return res.status(400).json({ error: "Faltan nombre y email" });

  const existe = await prisma.formador.findUnique({ where: { email } });
  if (existe) return res.status(409).json({ error: "Ese email ya está en uso" });

  const claveFinal = (password && String(password).trim()) || genPass();
  const cliente = await prisma.formador.create({
    data: {
      nombre,
      email: String(email).toLowerCase().trim(),
      passwordHash: await bcrypt.hash(claveFinal, 10),
      rol: "formador",
    },
    select: { id: true, nombre: true, email: true, activo: true },
  });
  // Devolvemos la contraseña usada para que el dueño se la entregue al cliente
  res.json({ cliente, password: claveFinal });
});

// Habilitar / deshabilitar un cliente
router.put("/clientes/:id", async (req, res) => {
  const cliente = await prisma.formador.findFirst({
    where: { id: req.params.id, rol: "formador" },
  });
  if (!cliente) return res.status(404).json({ error: "No encontrado" });

  const { activo } = req.body || {};
  const actualizado = await prisma.formador.update({
    where: { id: cliente.id },
    data: { activo: typeof activo === "boolean" ? activo : cliente.activo },
    select: { id: true, activo: true },
  });
  res.json({ cliente: actualizado });
});

export default router;
