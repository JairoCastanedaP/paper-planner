# Paper Planner

Calendario mensual para llevar el control de actividades, inspirado en el calendario de papel:
vista de todo el mes, categorías por color y un **marcador** para resaltar actividades con el dedo,
el lápiz de la tablet o el mouse.

## Funcionalidades

- **Vista mensual** de domingo a sábado, con el día de hoy marcado.
  Al bajar, el encabezado (mes, búsqueda, vistas y filtro) y la fila de días quedan fijos arriba.
- **Vista del día**: agenda por horas, actividades de todo el día y el detalle completo; se navega día a día.
- **Imagen de fondo por día**: se reduce automáticamente (~50–150 KB) y se ve en el mes, el panel y la vista del día.
- **Días conmemorativos**: 🎃 Halloween, 🕯️ Día de las Velitas, 🎄 Nochebuena, 💐 Día de la Madre, entre otros,
  más **días especiales propios** con su emoji (una vez o cada año).
- **Filtro por categoría**: ver solo ciertas categorías en el mes, el año o el día, con el conteo de actividades
  y cuántas se resaltaron.
- **Guía de bienvenida**: un recorrido la primera vez que entra cada usuario (se puede omitir y repetir con ❔ Guía).
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
  Cada objetivo tiene su casilla: al marcarlo queda pintado con **resaltador verde**.
  Un clic en el nombre abre el **editor del objetivo** (nombre, meta, qué cuenta y detalle);
  el detalle aparece como nota al pasar el cursor.
- **Categorías propias**: crear, renombrar, cambiar color o icono y eliminar (sus actividades pasan a otra
  categoría). Un color elegido a mano se mantiene aunque cambies de tema.
- **Deshacer**: al eliminar una actividad, un objetivo o una categoría aparece el aviso "Deshacer" durante 8 segundos.
- **Buscar** (botón 🔍, tecla `/` o `Ctrl+K`): actividades, notas, categorías y objetivos, un año hacia atrás y
  hacia adelante, con la última vez y la próxima vez de lo buscado.
- **Compromisos económicos**: total del mes por moneda (USD / COP).
- **PWA**: se instala en celular, tablet y computador, y funciona sin conexión.
- **Vista anual**: los 12 meses con mini calendario (festivos, puntos por categoría, ⭐ importantes)
  y lo más relevante de cada mes: objetivos, actividades muy importantes, cumpleaños y total económico.
- **Actividades muy importantes** (⭐) con **recordatorio en ventana modal**: en el momento, 15 min, 1 h,
  3 h o 1 día antes. Se puede posponer 10 minutos o marcar como visto.
- **Temas de color**: Estándar (los colores del calendario de papel), Pastel, Océano, Bosque y Nocturno.
  El tema se guarda en cada dispositivo.
- **Pantalla de bienvenida** (`/`): presenta la app y lleva a iniciar sesión o crear cuenta. Al cerrar sesión se vuelve a ella;
  con sesión iniciada, `/` lleva directo al calendario (`/calendario`).
- **Cuentas con Firebase Authentication**: registro, inicio y cierre de sesión con correo y contraseña,
  y recuperación de contraseña por correo. La sesión se mantiene al recargar.
- **Demo sin cuenta**: "Ver la demo sin cuenta" (en la bienvenida y en el login) entra como invitado con
  los datos de ejemplo.

**Datos de ejemplo:** el primer uso arranca con un calendario de demostración (rutina de gimnasio, clases,
pagos, cumpleaños y objetivos como "10 días de gimnasio: 4/10"), calculado a partir de la fecha actual.
Un aviso permite **conservarlos** o **empezar en blanco** (y deshacerlo).

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

El repositorio no incluye datos personales: el primer uso arranca con datos de ejemplo genéricos.
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
│   ├── firebase.ts       # configuración web del proyecto de Firebase
│   ├── auth.ts           # Firebase Auth, modo invitado y guards de rutas
│   ├── commemorations.ts # fechas conmemorativas
│   ├── demo-data.ts      # calendario de ejemplo del primer uso
│   ├── images.ts         # compresión de imágenes de fondo
│   ├── models.ts
│   ├── reminders.ts      # recordatorios de actividades muy importantes
│   ├── themes.ts         # temas de color
│   ├── tour.ts           # pasos de la guía
│   ├── planner-store.ts  # estado único con signals; se guarda solo
│   ├── planner-storage.ts# localStorage hoy, Firebase después
│   ├── recurrence.ts
│   └── seed-data.ts      # datos del primer uso (los de ejemplo)
└── features/
    ├── landing/          # pantalla de bienvenida
    ├── auth/             # login y registro
    ├── calendar-page/    # pantalla principal: vista mes / año
    ├── year-view/        # los 12 meses del año
    ├── day-view/         # agenda de un día
    ├── day-detail/       # actividades y personalización de un día
    ├── filter-bar/       # filtro por categoría
    ├── tour-overlay/     # guía de bienvenida
    ├── theme-picker/     # selector de colores
    ├── category-manager/ # crear y editar categorías
    ├── search-panel/     # buscador
    ├── undo-toast/       # aviso "Deshacer"
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
