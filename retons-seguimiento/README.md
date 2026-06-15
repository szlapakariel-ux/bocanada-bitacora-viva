# RETONS Seguimiento

Plataforma de acompañamiento entre encuentros: recorridos diarios para el
participante y un panel con el **pulso del proceso** para el formador.

> Proyecto **nuevo e independiente**. Bocanada fue solo inspiración metodológica;
> acá el código, los textos y el diseño son propios y aplican el manual de marca RETONS.

---

## Idea en una línea

Un formador arma un **programa de N días** (default 6) eligiendo recursos de su
**biblioteca** (video, audio, meditación, reflexión, gamificación…). El
participante recorre una estación por día. Cada interacción devuelve **señales**
al panel del formador.

- **Default:** 1 recurso por día.
- **Premium:** flag `multiPorDia` → más de un recurso por día. La infraestructura
  ya lo soporta; es solo un switch por programa.
- **Multi-profesional:** cada formador tiene su cuenta y ve únicamente sus datos.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React + Vite (PWA) + Recharts |
| Backend | Node.js + Express (REST API) |
| ORM / DB | Prisma · SQLite (dev) / PostgreSQL (prod) |
| Auth | JWT (formador) + código/clave (participante) |

---

## Correr en local

```bash
# 1) Backend
cd server
cp .env.example .env
npm install
npm run db:reset      # crea la DB y siembra datos demo
npm start             # API en http://localhost:4000

# 2) Frontend (otra terminal)
cd client
npm install
npm run dev           # app en http://localhost:5173 (proxy /api → :4000)
```

### Credenciales demo
- **Formador:** `demo@retons.com` / `demo1234`
- **Participante:** código `LIDER1`, nombre libre, clave a elección.

---

## Cómo probar

**Como participante:** http://localhost:5173 → *Entrar a mi recorrido* → código
`LIDER1` → recorré los días, completá las estaciones.

**Como formador:** *Soy formador/a* → login demo → entrá a un programa → armá los
días desde la biblioteca → mirá **Ver pulso** (gráfico de Foco de gestión,
participación por día, palabras limitantes y señales suaves).

---

## Estructura

```
retons-seguimiento/
├── server/
│   ├── prisma/schema.prisma     # modelo de datos
│   ├── prisma/seed.js           # biblioteca + programa demo
│   └── src/
│       ├── index.js             # Express + sirve el cliente compilado
│       ├── catalogo.js          # tipos de recurso
│       └── routes/              # auth, recursos, programas, participante, panel
└── client/
    └── src/
        ├── pages/               # Home, Entrar, Viaje, Dia, Formador, Biblioteca, Programa, Panel
        ├── components/          # Bloque (renderer), ConfigEditor
        └── theme.css            # tokens de marca RETONS
```

---

## Deploy en Railway (producción)

Guía completa paso a paso en **[DEPLOY-RAILWAY.md](./DEPLOY-RAILWAY.md)**.

Resumen: un solo servicio (el server sirve la app compilada), SQLite sobre un
volumen persistente en `/data`, y siembra automática de datos demo en el primer
arranque. Variables: `DATABASE_URL=file:/data/prod.db` y `JWT_SECRET`.

---

## Catálogo de recursos

**Contenido:** video · audio · meditación · micro-lectura · imagen
**Interacción:** reflexión escrita · respuesta en voz · checklist · selector de
foco · escala · formulario guiado
**Gamificación:** quiz · flashcards · clasificar · reto del día · compromiso
si–entonces

Cada tipo de interacción define qué señal devuelve al panel.
