import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

import authRoutes from "./routes/auth.js";
import recursosRoutes from "./routes/recursos.js";
import programasRoutes from "./routes/programas.js";
import participanteRoutes from "./routes/participante.js";
import panelRoutes from "./routes/panel.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "retons-seguimiento" }));

app.use("/api/auth", authRoutes);
app.use("/api/recursos", recursosRoutes);
app.use("/api/programas", programasRoutes);
app.use("/api/part", participanteRoutes);
app.use("/api/panel", panelRoutes);

// Servir el cliente compilado en producción
const clientDist = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientDist));
app.get("*", (_req, res) => res.sendFile(path.join(clientDist, "index.html")));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`RETONS Seguimiento API en http://localhost:${PORT}`));
