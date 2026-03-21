# User Level Specification - Sistema de Gestion de Parqueo

## 1. Proposito
Definir funcionalidades a nivel de usuario para administrar un parqueo de forma simple, confiable y completa para un proyecto final universitario.

## 2. Alcance del sistema
El sistema permite:
- Registrar entradas y salidas de vehiculos.
- Calcular cobros automaticamente segun tiempo de estancia y metodo de pago.
- Gestionar espacios numerados (libres, ocupados, reservados) con operaciones administrativas.
- Administrar reservas.
- Emitir ticket con numero o codigo unico e impresion directa.
- Configurar datos generales del parqueo y reglas de cobro.
- Consultar historial y reportes basicos.

## 3. Tipos de usuario
### 3.1 Administrador
Puede configurar datos generales y tarifas, gestionar usuarios, ver reportes e historial y administrar espacios.

### 3.2 Operador de caja
Puede registrar entradas, registrar salidas y cobros, gestionar reservas y consultar dashboard operativo.

## 4. Reglas de negocio principales
1. El parqueo admite carros y motos.
2. Los espacios son numerados y cada vehiculo ocupa un solo espacio.
3. No se puede registrar entrada si no hay espacio libre compatible.
4. Una placa no puede tener mas de un ticket activo al mismo tiempo.
5. Cada ingreso genera un ticket unico.
6. Un espacio no puede estar ocupado y reservado a la vez.
7. Al confirmar salida pagada, el espacio se libera automaticamente.
8. En entrada, el operador debe seleccionar manualmente un espacio disponible.
9. En pago en efectivo, el monto recibido debe ser suficiente y se calcula el cambio.
10. En pago con tarjeta, el cobro se confirma sin ingreso de monto recibido.
11. Solo se pueden eliminar espacios libres.
12. Los nuevos espacios se numeran automaticamente.
13. Toda accion relevante queda en historial.

## 5. Politica de cobro recomendada
- Cobro por fraccion de tiempo configurable.
- Tarifa diferenciada por tipo de vehiculo (carro o moto).
- Tolerancia configurable en salida.
- Cobro minimo configurable.
- Soporte de metodos de pago: efectivo y tarjeta.

## 6. Modulos funcionales
1. Autenticacion: inicio y cierre de sesion, control por rol.
2. Dashboard: cupos, ocupacion e ingresos del dia.
3. Registro de entrada: placa, tipo, seleccion manual de espacio en grid y ticket imprimible.
4. Registro de salida y cobro: busqueda por ticket o placa, calculo, pago en efectivo/tarjeta y cambio.
5. Gestion de espacios: vista por tipo, estadisticas, cambio de estado, agregar y eliminar espacios.
6. Gestion de reservas: crear, confirmar llegada, cancelar y expirar.
7. Configuracion: tab General (datos del parqueo) y tab Tarifas (reglas de cobro).
8. Historial y reportes basicos.

## 7. Flujos criticos
1. Entrada normal: seleccionar espacio, registrar, generar ticket e imprimir.
2. Salida y cobro: buscar ticket, calcular monto, seleccionar metodo de pago, confirmar y liberar espacio.
3. Reserva con llegada: crear reserva, confirmar check-in, convertir a ingreso activo.
4. Administracion de espacios: editar estado, agregar lotes y eliminar espacios libres.
5. Parqueo lleno: bloquear entrada y notificar sin cupos.

## 8. Pantallas minimas
1. Login.
2. Dashboard.
3. Nueva entrada redisenada (grid de espacios + formulario lateral).
4. Salida y cobro.
5. Espacios numerados con acciones administrativas.
6. Reservas.
7. Historial y reportes.
8. Configuracion (General + Tarifas).
9. Gestion de usuarios (admin).

## 9. Criterios de aceptacion
1. Flujo completo entrada-salida-cobro funciona sin errores.
2. Calculo de tarifa correcto en casos normales.
3. Estados de espacios consistentes despues de editar/agregar/eliminar.
4. Reservas funcionales (crear, confirmar, cancelar o expirar).
5. Modulo de configuracion guarda y refleja cambios generales y tarifarios.
6. Reportes basicos visibles y entendibles.
7. Control de acceso por roles activo.

## 10. Prioridad de implementacion (MVP)
Fase 1 (obligatoria): autenticacion, entradas-salidas-cobro, espacios, ticket, configuracion.
Fase 2 (si hay tiempo): reservas completas, reportes ampliados y mejoras de UX.

---
Documento orientado a nivel usuario (no tecnico) para guiar analisis, diseno funcional y defensa academica del sistema.
