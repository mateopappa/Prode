# Prode Niagara - RGP

App web para hacer predicciones sobre el nombre de una nueva camioneta del proyecto interno RGP.

## 🚀 Setup

```bash
npm install
```

## 📝 Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Admin password
ADMIN_PASSWORD=mateop

# Vercel KV (obligatorio para producción)
KV_URL=tu_kv_url
KV_REST_API_URL=tu_rest_api_url
KV_REST_API_TOKEN=tu_token
```

## 🧪 Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy a Vercel

1. Push a GitHub
2. Conecta en [Vercel](https://vercel.com)
3. Agrega las variables de entorno
4. Deploy

## 📐 Arquitectura

- **Frontend:** Next.js 15 + React + Tailwind CSS
- **UI:** Shadcn UI con estética liquid glass
- **Base de datos:** Vercel KV (Redis)
- **Algoritmo:** Levenshtein distance para similitud de strings
- **Scoring:** 0-100 puntos por respuesta

## 🎯 Reglas

1. Cada participante propone 3 nombres
2. El lunes se revela el nombre correcto
3. Se calcula puntuación 0-100 para cada respuesta
4. Se toma el puntaje más alto de las 3
5. Ranking final ordenado por puntuación

## 🔐 Admin
- URL: `/admin`
- Contraseña: `mateop`
- Revelar respuesta
- Resetear app
- Ver estado

## ⚠️ Aviso

Esta es una página no oficial de RGP. No existe vínculo, patrocinio ni aprobación por parte de la empresa.
