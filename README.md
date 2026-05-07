# BOCANADA — Bitácora viva

Demo conceptual para Pía Numer y Clara Detang.

Una bitácora digital mobile-first que sostiene la experiencia entre encuentros, devuelve señales suaves a las facilitadoras y acompaña sin reemplazar.

---

## Correr localmente

```bash
npm install
npm start
```

Abrí http://localhost:3000 desde tu celular o navegador.

---

## Cómo probar

### Como participante
1. Abrí http://localhost:3000
2. Tocá **Entrar a mi bitácora**
3. Escribí tu nombre → rol **Participante** → entrar
4. Elegí qué necesitás hoy (Calma, Foco, Orden, Refugio, Energía)
5. Recorrí las 5 estaciones, tocá las acciones
6. Dejá una huella en el campo final → Guardar

### Como facilitadora
1. Login con cualquier nombre → rol **Facilitadora**
2. Clave: `bocanada21`
3. El panel muestra señales del grupo con datos demo precargados

### Panel y logs
- El panel combina datos demo (demo-data.json) con acciones reales
- Cada interacción se guarda en `data/logs.json`
- El endpoint `GET /api/panel` requiere el header `x-facilitator-pass`

---

## Estructura

```
bocanada-bitacora-viva/
├── server.js           # Express API + servir estáticos
├── package.json
├── data/
│   ├── demo-data.json  # participantes y logs ficticios
│   └── logs.json       # se crea automáticamente al usar la app
├── public/
│   ├── index.html      # SPA completa
│   ├── styles.css      # diseño mobile-first
│   └── app.js          # lógica de la app
└── README.md
```

---

## Deploy en Railway

1. Subí el repositorio a GitHub
2. En Railway: **New Project → Deploy from GitHub repo**
3. Seleccioná el repo → Railway detecta Node.js automáticamente
4. Variables de entorno opcionales:
   - `PORT` (Railway lo asigna solo)
   - `FACILITATOR_PASS` (default: `bocanada21`)
5. Deploy → Railway genera una URL pública

La app corre con `npm start` sin build step.

---

## Variables de entorno

| Variable           | Default       | Descripción                   |
|--------------------|---------------|-------------------------------|
| `PORT`             | `3000`        | Puerto del servidor           |
| `FACILITATOR_PASS` | `bocanada21`  | Clave del panel facilitadoras |

---

*Demo conceptual. Los contenidos reales los diseñan Pía y Clara.*
