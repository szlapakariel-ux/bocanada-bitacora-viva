import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { prisma } from "./db.js";
import { sembrar } from "../prisma/seed.js";
import authRoutes from "./routes/auth.js";
import recursosRoutes from "./routes/recursos.js";
import programasRoutes from "./routes/programas.js";
import participanteRoutes from "./routes/participante.js";
import panelRoutes from "./routes/panel.js";
import iaRoutes from "./routes/ia.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json({ limit: "8mb" })); // 8mb para soportar logos en base64

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "retons-seguimiento" }));

app.use("/api/auth", authRoutes);
app.use("/api/recursos", recursosRoutes);
app.use("/api/programas", programasRoutes);
app.use("/api/part", participanteRoutes);
app.use("/api/panel", panelRoutes);
app.use("/api/ia", iaRoutes);

// Servir el cliente compilado en producción
const clientDist = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientDist));
app.get("*", (_req, res) => res.sendFile(path.join(clientDist, "index.html")));

// Siembra automática de datos demo si la base está vacía (útil en el deploy)
async function inicio() {
  try {
    const n = await prisma.formador.count();
    if (n === 0) await sembrar();
  } catch (e) {
    console.warn("No se pudo verificar/sembrar la base:", e.message);
  }
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`RETONS Seguimiento API en puerto ${PORT}`));
}

inicio();
