import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-secret-retons";

export const firmarToken = (formador) =>
  jwt.sign({ id: formador.id, email: formador.email }, SECRET, {
    expiresIn: "30d",
  });

// Middleware: exige formador autenticado y deja req.formadorId
export const requireFormador = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No autenticado" });
  try {
    const payload = jwt.verify(token, SECRET);
    req.formadorId = payload.id;
    next();
  } catch {
    return res.status(401).json({ error: "Sesión inválida" });
  }
};
