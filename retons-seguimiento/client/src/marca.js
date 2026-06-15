// Aplica la marca del cliente al recorrido del participante.
// Sobrescribe los tokens CSS con los colores del programa.
export function aplicarMarca(marca) {
  if (!marca) return;
  const root = document.documentElement.style;
  if (marca.colorPrimario) root.setProperty("--azul", marca.colorPrimario);
  if (marca.colorSecundario) root.setProperty("--verde", marca.colorSecundario);
  if (marca.colorAcento) root.setProperty("--rojo", marca.colorAcento);
  if (marca.tipografia)
    root.setProperty("--sans", `"${marca.tipografia}", -apple-system, sans-serif`);
}

// Restaura los tokens default de la plataforma (al salir del recorrido).
export function restaurarMarca() {
  const root = document.documentElement.style;
  ["--azul", "--verde", "--rojo", "--sans"].forEach((v) => root.removeProperty(v));
}
