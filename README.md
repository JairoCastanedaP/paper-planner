# Paper Planner

Calendario mensual para llevar el control de actividades, inspirado en el calendario de papel:
vista de todo el mes, categorías por color y un **marcador** para resaltar actividades con el dedo,
el lápiz de la tablet o el mouse.

## Funcionalidades

- **Vista mensual** de domingo a sábado, con el día de hoy marcado.
- **Festivos de Colombia** calculados para cualquier año (Ley Emiliani y fechas según la Pascua):
  el día se pinta como domingo y muestra el motivo (p. ej. "Independencia de Cartagena").
- **Categorías con color**: Académico (naranja), Inglés (verde), Económico (rosado),
  Cumpleaños (👑) y Proyecto (azul).
- **Marcador**: deslizar de lado a lado sobre una actividad la resalta; repetir el trazo la borra.
- **Panel del día**: notas completas sin límite de espacio, editar, eliminar y resaltar.
- **Actividades que se repiten**: cada semana (eligiendo los días), cada mes o cada año, con fecha de fin opcional.
  Se puede eliminar un solo día o toda la serie.
- **Notas del mes**: objetivos con casilla y **contadores automáticos**
  (p. ej. "Clases con IA 8/25" cuenta las actividades resaltadas que coinciden).
- **Compromisos económicos**: total del mes por moneda (USD / COP).
- **PWA**: se instala en celular, tablet y computador, y funciona sin conexión.
- **Vista anual**: los 12 meses con mini calendario (festivos, puntos por categoría, ⭐ importantes)
  y lo más relevante de cada mes: objetivos, actividades muy importantes, cumpleaños y total económico.
- **Actividades muy importantes** (⭐) con **recordatorio en ventana modal**: en el momento, 15 min, 1 h,
  3 h o 1 día antes. Se puede posponer 10 minutos o marcar como visto.
- **Temas de color**: Estándar (los colores del calendario de papel), Pastel, Océano, Bosque y Nocturno.
  El tema se guarda en cada dispositivo.
- **Inicio de sesión** y **cerrar sesión**. Por ahora hay una cuenta temporal (`admin` / `admin`) validada
  en el navegador: es solo una puerta de entrada, no protege los datos. El **registro** es visual y aún
  no crea cuentas; ambos se conectarán con Firebase Auth.

Los datos se guardan por ahora en el navegador (`localStorage`). La sincronización entre dispositivos
llegará con Firebase.

## Stack

- Angular 22 (componentes standalone, signals, sin zone.js)
- SCSS
- `@angular/service-worker` para la PWA

## Ejecutar en local

```bash
npm install
npm start            # http://localhost:4200
npm run start:lan    # también accesible desde el celular o la tablet en la misma red Wi-Fi
```

Con `start:lan`, la consola muestra una dirección `Network: http://192.168.x.x:4200/` para abrir desde otro dispositivo.

### Datos propios en local

El repositorio no incluye datos personales: el primer uso arranca solo con las categorías.
Para desarrollar con datos propios, crea `src/app/core/seed-data.local.ts` (ignorado por git)
exportando `createSeedData()` igual que [`seed-data.ts`](src/app/core/seed-data.ts), y levanta:

```bash
npm run start:local  # usa seed-data.local.ts y queda accesible en la red local
```

Los datos de ejemplo solo se cargan la primera vez; después la app usa lo guardado en el navegador.

Para probar la PWA instalable (el service worker solo funciona con el build de producción):

```bash
npm run preview:pwa  # http://localhost:8080
```

## Estructura

```
src/app/
├── core/                 # modelo, fechas, repeticiones, estado y almacenamiento
│   ├── auth.ts           # sesión temporal y guards de rutas
│   ├── models.ts
│   ├── reminders.ts      # recordatorios de actividades muy importantes
│   ├── themes.ts         # temas de color
│   ├── planner-store.ts  # estado único con signals; se guarda solo
│   ├── planner-storage.ts# localStorage hoy, Firebase después
│   ├── recurrence.ts
│   └── seed-data.ts      # datos del primer uso (solo categorías)
└── features/
    ├── auth/             # login y registro
    ├── calendar-page/    # pantalla principal: vista mes / año
    ├── year-view/        # los 12 meses del año
    ├── theme-picker/     # selector de colores
    ├── reminder-modal/   # ventana de recordatorio
    ├── month-grid/       # la cuadrícula del mes
    ├── event-chip/       # una actividad + gesto de marcador
    ├── month-goals/      # notas, objetivos y totales del mes
    ├── day-panel/        # detalle del día
    └── event-form/       # crear / editar actividad
```

## Flujo de ramas

- `main`: versión publicada.
- `develop`: versiones estables.
- `feature/<nombre>`: cada funcionalidad nueva; se une a `develop` cuando está probada.
