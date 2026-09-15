# Impostor Fútbol

Juego web multijugador online de deducción social basado en futbolistas de élite y leyendas históricas.

## Características

- **Multijugador en tiempo real**: Sincronización instantánea mediante WebSockets (Socket.IO).
- **Seguridad estricta**: Los roles y nombres secretos nunca son expuestos en el payload del impostor.
- **Pista táctica permanente para el impostor**: El impostor siempre recibe una pista estratégica confidencial (posición general, región/época o logro clave) para formular pistas creíbles sin saber el nombre exacto.
- **Sin emojis**: Interfaz pulida con iconografía FontAwesome y dorsales tácticos.
- **Diseño táctico de estadio**: Arquitectura Doppelrand (doble bisel), modo oscuro inmersivo y microinteracciones fluidas.
- **Efectos de audio sintetizados**: Silbato de árbitro, cronómetro de tensión, tarjeta secreta y ovaciones mediante Web Audio API (con botón de silencio).

---

## Cómo Ejecutar Localmente

1. Clonar el repositorio e instalar dependencias:
   ```bash
   git clone https://github.com/nsh1z/impostor.git
   cd impostor
   npm install
   ```

2. Compilar el frontend:
   ```bash
   npm run build
   ```

3. Iniciar el servidor:
   ```bash
   npm start
   ```
   Abrir en el navegador: `http://localhost:3000`

---

## Despliegue en Vercel & Backend

- **Frontend (Vercel)**:
  El proyecto incluye `vercel.json` configurado para Vite. En Vercel puedes configurar la variable de entorno `VITE_SERVER_URL` apuntando a la URL del servidor WebSocket.
- **Backend (Render / Railway / VPS)**:
  Ejecuta `node server/server.js` en cualquier servicio con soporte de WebSockets persistentes (como Render.com, Railway.app o Fly.io).
