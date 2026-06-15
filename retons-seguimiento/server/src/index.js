import express from "express";
import cors from "cors";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

import { prisma } from "./db.js";
import { sembrar } from "../prisma/seed.js";
import authRoutes from "./routes/auth.js";
import recursosRoutes from "./routes/recursos.js";
import programasRoutes from "./routes/programas.js";
import participanteRoutes from "./routes/participante.js";
import panelRoutes from "./routes/panel.js";
import iaRoutes from "./routes/ia.js";
import adminRoutes from "./routes/admin.js";

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
app.use("/api/admin", adminRoutes);

// Servir el cliente compilado en producción
const clientDist = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientDist));
app.get("*", (_req, res) => res.sendFile(path.join(clientDist, "index.html")));

// Crea/sincroniza las tablas en el volumen (prisma db push) en segundo plano.
function pushDB() {
  return new Promise((resolve) => {
    const p = spawn("npx", ["prisma", "db", "push", "--skip-generate"], {
      stdio: "inherit",
      shell: true,
    });
    p.on("close", (code) => {
      if (code !== 0) console.warn("prisma db push terminó con código", code);
      resolve();
    });
    p.on("error", (e) => {
      console.warn("No se pudo correr prisma db push:", e.message);
      resolve();
    });
  });
}

// Siembra datos demo si la base está vacía
async function ensureSeed() {
  try {
    const n = await prisma.formador.count();
    if (n === 0) await sembrar();
  } catch (e) {
    console.warn("No se pudo verificar/sembrar la base:", e.message);
  }
}

// Abrimos el puerto PRIMERO (para que el healthcheck pase al instante) y
// preparamos la base en segundo plano. Evita que un db push lento cuelgue el deploy.
function inicio() {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, "0.0.0.0", async () => {
    console.log(`RETONS Seguimiento API en puerto ${PORT}`);
    await pushDB();
    await ensureSeed();
    console.log("Base de datos lista.");
  });
}

inicio();
