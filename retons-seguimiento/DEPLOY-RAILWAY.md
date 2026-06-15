# Deploy en Railway — paso a paso

RETONS Seguimiento se deploya como **un solo servicio**: Railway compila el
cliente React y arranca el server Express, que sirve la app y la API. La base es
SQLite sobre un **volumen persistente** (sin necesidad de Postgres para empezar).

> El server crea las tablas en el build y **siembra los datos demo
> automáticamente** en el primer arranque si la base está vacía.

---

## 1. Crear el proyecto

1. Entrá a [railway.app](https://railway.app) y logueate con GitHub.
2. **New Project → Deploy from GitHub repo**.
3. Elegí el repo `bocanada-bitacora-viva` y la rama `claude/cool-curie-lzkdla`.

## 2. Apuntar al subdirectorio del proyecto

El código vive en la carpeta `retons-seguimiento/`. En el servicio:

1. **Settings → Build** → **Root Directory**: escribí `retons-seguimiento`.
2. Railway detecta `nixpacks.toml` y usa esa configuración de build.

## 3. Agregar el volumen (base de datos)

1. En el servicio: **Settings → Volumes → New Volume**.
2. **Mount path**: `/data`.

## 4. Variables de entorno

En **Variables**, agregá:

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | `file:/data/prod.db` |
| `JWT_SECRET` | un texto largo y aleatorio (ej: generá uno con un gestor de contraseñas) |

`PORT` lo inyecta Railway solo, no lo toques.

## 5. Deploy y URL pública

1. Railway hace el primer deploy automáticamente.
2. **Settings → Networking → Generate Domain** para obtener una URL pública
   `https://...up.railway.app`.
3. Abrí esa URL en el celular o navegador.

---

## Probar

- **Participante:** *Entrar a mi recorrido* → código `LIDER1`.
- **Formador:** *Soy formador/a* → `demo@retons.com` / `demo1234`.

## Notas

- **Redeploys** no borran datos (el volumen persiste y el seed solo corre si la
  base está vacía).
- Para empezar de cero: borrá el archivo del volumen o el volumen, y redeployá.
- Si más adelante querés migrar a **PostgreSQL** (mayor escala), se cambia el
  `provider` en `server/prisma/schema.prisma` a `postgresql` y se apunta
  `DATABASE_URL` a la base Postgres de Railway.
