# DacsShowcase (versión sencilla)

Esta app de ejemplo muestra un flujo completo de sorteos online pensado para principiantes en Angular. Incluye una lista de sorteos, una pantalla de detalle donde se compran números y un panel básico de administración. El código está escrito con funciones cortas, nombres claros y sin dependencias externas para que puedas explicar cada parte en una exposición oral.

## Cómo ejecutar el proyecto

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Inicia el servidor de desarrollo:
   ```bash
   npm run start
   ```
   Abre `http://localhost:4200` para ver la app.
3. Construye para producción:
   ```bash
   npm run build
   ```

## Estructura rápida de carpetas
- `src/app/raffle/list/` – Lista de sorteos con búsqueda simple (`raffle-list.ts` y `.html`).
- `src/app/raffle/detail/` – Pantalla de detalle, selección de número y modal de compra.
- `src/app/admin/` – Panel de administración, estadísticas y exportación a CSV.
- `src/app/components/` – Piezas reutilizables (countdown, grilla de números, modal de compra, tablas, etc.).
- `src/app/core/services/` – Servicios que guardan estado y lógica de negocio.
- `src/app/core/models/` – Interfaces de datos usadas en toda la app.

## Resumen de la experiencia de usuario
- **Lista de sorteos**: el usuario ve todas las opciones y puede filtrar por nombre u organizador.
- **Detalle**: muestra la descripción, un contador regresivo hasta la fecha del sorteo, la grilla de números y el modal de compra.
- **Pago con Mercado Pago**: al elegir un número se abre el modal, se completan los datos y se envía un pago de prueba a Mercado Pago con las credenciales de sandbox. El número pasa por los estados `available → processing → sold`.
- **Admin**: permite ver métricas básicas (vendidos, en proceso, disponibles, recaudación), editar datos y descargar compradores en CSV.

## Componentes clave explicados
- `RaffleListComponent` (`src/app/raffle/list/raffle-list.ts`):
  - Guarda todas las rifas en `allRaffles` y las filtradas en `raffles`.
  - `onSearch` actualiza el filtro con un `toLowerCase` sencillo.
  - `viewRaffle` navega al detalle usando `Router`.

- `RaffleDetailComponent` (`src/app/raffle/detail/raffle-detail.ts`):
  - `loadRaffle` busca el sorteo por ID desde la ruta y lo guarda en memoria.
  - `pickNumber` abre el modal con el número seleccionado.
  - `submitPurchase` marca el número como "processing", llama al gateway de Mercado Pago y decide si confirma o libera el número.

- `CountdownComponent` (`src/app/components/countdown/countdown.ts`):
  - Recibe una fecha ISO y actualiza un reloj `{days, hours, minutes, seconds}` cada segundo.
  - Limpia el `setInterval` en `ngOnDestroy` para evitar fugas de memoria.

- `NumberGridComponent` (`src/app/components/number-grid/number-grid.ts`):
  - Recibe los números y emite `select` cuando se hace clic en alguno.

- `PurchaseModalComponent` (`src/app/components/purchase-modal/purchase-modal.ts`):
  - Muestra un formulario mínimo con `name`, `email` y `phone` y notifica con `submit` o `cancel`.
  - Usa `loading` para deshabilitar el botón y mostrar "Procesando pago..." mientras se habla con Mercado Pago.

- `AdminComponent` (`src/app/admin/admin.ts`):
  - Usa el estado actual para mostrar métricas y descargar el CSV de compradores con `downloadBuyersCsv`.

## Servicios y datos
- `RaffleStateService` (`src/app/core/services/raffle-state.service.ts`):
  - Mantiene la lista de sorteos y el sorteo actual.
  - `createNumbers`, `updateNumberStatus` y `refreshBuyers` mantienen sincronizados números y compradores.
  - `getStats` calcula vendidos, en proceso, disponibles y recaudación.

- `MercadoPagoService` (`src/app/core/services/mercado-pago.service.ts`):
  - Envía una solicitud `POST` al endpoint de OAuth de Mercado Pago con credenciales de prueba.
  - Si hay red, valida que exista un `access_token`. Si no hay red, simula un éxito local para seguir el flujo en demos.

### Nota sobre credenciales de Mercado Pago
- Las claves incluidas en el servicio son **solo de sandbox** y permiten ver el flujo completo sin mover dinero real.
- Cuando tengas tus claves reales, reemplaza `client_id`, `client_secret` y `public_key` en `MercadoPagoService`.

- `ToastService` (`src/app/core/services/toast.service.ts`) y `TermsConsentService` (`src/app/core/services/terms-consent.service.ts`):
  - Guardan avisos y el consentimiento de términos de manera simple.

## Cómo contar la arquitectura en una exposición
1. **Flujo principal**: explica cómo `RaffleList` carga datos del `RaffleStateService`, pasa al `RaffleDetail` y cómo las acciones de compra actualizan el servicio.
2. **Componentes pequeños**: cada pieza hace una sola cosa (mostrar countdown, dibujar la grilla, abrir modal, etc.) y se comunica con `@Input`/`@Output` básicos.
3. **Estado centralizado**: el servicio de estado es la única fuente de verdad; los componentes sólo leen o piden cambios.
4. **Rutas**: `/raffle` muestra la lista, `/raffle/:id` muestra el detalle y `/admin/:id` abre el panel.
5. **Datos de ejemplo**: los sorteos se generan en memoria con compradores y fechas futuras para que todo funcione sin backend.

## Pruebas rápidas
- `npm run build` valida que los componentes y servicios compilen juntos.
- También puedes abrir la app y verificar manualmente: buscar en la lista, comprar un número y bajar el CSV en admin.
