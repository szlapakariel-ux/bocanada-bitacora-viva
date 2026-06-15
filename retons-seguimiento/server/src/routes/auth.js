import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../db.js";
import { firmarToken, requireFormador } from "../auth.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { nombre, email, password } = req.body || {};
  if (!nombre || !email || !password)
    return res.status(400).json({ error: "Faltan datos" });

  const existe = await prisma.formador.findUnique({ where: { email } });
  if (existe) return res.status(409).json({ error: "Ese email ya está registrado" });

  const passwordHash = await bcrypt.hash(password, 10);
  const formador = await prisma.formador.create({
    data: { nombre, email, passwordHash },
  });
  res.json({
    token: firmarToken(formador),
    formador: { id: formador.id, nombre, email, rol: formador.rol },
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  const formador = await prisma.formador.findUnique({ where: { email } });
  if (!formador) return res.status(401).json({ error: "Credenciales inválidas" });
  if (!formador.activo) return res.status(403).json({ error: "Cuenta deshabilitada" });

  const ok = await bcrypt.compare(password, formador.passwordHash);
  if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

  res.json({
    token: firmarToken(formador),
    formador: { id: formador.id, nombre: formador.nombre, email: formador.email, rol: formador.rol },
  });
});

router.get("/me", requireFormador, async (req, res) => {
  const formador = await prisma.formador.findUnique({
    where: { id: req.formadorId },
    select: { id: true, nombre: true, email: true, rol: true },
  });
  res.json({ formador });
});

export default router;
