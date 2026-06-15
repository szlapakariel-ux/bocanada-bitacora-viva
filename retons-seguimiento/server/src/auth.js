import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-secret-retons";

export const firmarToken = (formador) =>
  jwt.sign(
    { id: formador.id, email: formador.email, rol: formador.rol || "formador" },
    SECRET,
    { expiresIn: "30d" }
  );

// Middleware: exige sesión válida; deja req.formadorId y req.rol
export const requireFormador = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No autenticado" });
  try {
    const payload = jwt.verify(token, SECRET);
    req.formadorId = payload.id;
    req.rol = payload.rol || "formador";
    next();
  } catch {
    return res.status(401).json({ error: "Sesión inválida" });
  }
};

// Middleware: exige rol "owner" (dueño del producto)
export const requireOwner = (req, res, next) => {
  requireFormador(req, res, () => {
    if (req.rol !== "owner") return res.status(403).json({ error: "Solo el dueño" });
    next();
  });
};
