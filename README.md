# PabloCocina — Frontend

Aplicación web de pedidos gastronómicos con panel de administración en tiempo real. Angular 21 standalone, zoneless, Signals, Tailwind CSS.

---

## Stack

| Tecnología | Versión |
|---|---|
| Angular | 21 (standalone, zoneless) |
| TypeScript | 5.8 |
| Tailwind CSS | v3 (CDN + `darkMode: 'class'`) |
| STOMP.js + SockJS | 7.0.0 / 1.6.1 |
| Build | Angular CLI + Vite |
| Hosting | Firebase (`pablococina-test`) |

---

## Requisitos

- Node.js 18+
- npm

---

## Desarrollo

```powershell
npm install
npm run dev        # http://localhost:3000
```

---

## Build de Producción

```powershell
npm run build      # output en dist/
npm run preview    # preview local del build
```

---

## Configuración

### API URL

Por defecto `http://localhost:8080/api/pablococina`. Sobrescribible vía `window.__ENV__.API_BASE_URL`.

### Modo Demo

**Activado por defecto.** La app funciona completamente con datos mock sin backend.

```javascript
// Desactivar modo demo (conectar a backend real)
localStorage.setItem('pablo_cocina_demo_mode', 'false');
location.reload();
```

---

## Arquitectura

```
src/app/
├── core/               # auth, config, demo, interceptors, models, services
├── features/           # admin, auth, cart, menu, profile
└── shared/components/  # header, product-card, order-card, toast, skeletons, etc.
```

| Aspecto | Decisión |
|---|---|
| **Sin Router** | 3 vistas (menu/admin/profile) controladas por `UiService.currentView` (signal) |
| **Reactividad** | Signals nativas (`signal()`, `computed()`) |
| **Zoneless** | `provideZonelessChangeDetection()` — sin NgZone |
| **Interceptores** | `demoInterceptor → authInterceptor → loadingInterceptor` |
| **Dark mode** | Fijo (no hay toggle). Config: `darkMode: 'class'` + `class="dark"` en `<html>` |
| **CDN v3** | `cdn.tailwindcss.com` evita conflicto con PostCSS interno de Angular |

---

## Tiempo Real (WebSocket)

| Topic | Evento |
|---|---|
| `/topic/admin/new-order` | Nuevo pedido (animación + sonido) |
| `/topic/product/stock-update` | Cambio de stock |
| `/topic/menu/update` | CRUD de productos |

---

## Deploy (Firebase)

```powershell
npm install -g firebase-tools
firebase login
firebase deploy --only hosting
```

CI/CD: GitHub Actions → push a `staging`.

---

## Notas

- **Bootstrap desde `index.tsx`** (convención AI Studio). No renombrar.
- **Importmap**: Dependencias (Angular, RxJS, STOMP) servidas desde `esm.sh`.
- Este directorio contiene solo el frontend. El backend (Spring Boot) está en `../PabloCocina-API/`.
