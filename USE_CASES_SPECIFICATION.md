# Casos de Uso - Sistema de Gestion de Parqueo

## 1. Objetivo del documento
Definir de forma detallada los casos de uso del sistema de parqueo, a nivel funcional, para guiar analisis, implementacion y evaluacion del proyecto final.

## 2. Alcance funcional cubierto
El documento cubre:
- autenticacion y control por rol
- operacion de entrada y salida de vehiculos
- cobro segun tiempo y metodo de pago
- gestion completa de espacios numerados
- gestion de reservas
- configuracion general y tarifaria del parqueo
- historial y reportes basicos
- gestion basica de usuarios

## 3. Actores
- Administrador: configura el sistema, gestiona usuarios, espacios, parametros de cobro y consulta reportes.
- Operador de caja: registra entradas, salidas, cobros, reservas y consultas operativas.
- Sistema (proceso interno): aplica reglas automaticas (calculo de tarifa, cambio de estados, expiracion de reserva, numeracion de espacios).

## 4. Reglas de negocio base (RN)
- RN-01: El parqueo admite carros y motos.
- RN-02: Cada espacio es numerado y solo puede tener un estado activo a la vez.
- RN-03: No se permite entrada si no hay espacios disponibles para el tipo de vehiculo.
- RN-04: Una placa no puede tener mas de un ticket activo.
- RN-05: Cada entrada genera un ticket unico.
- RN-06: Al finalizar salida pagada, el espacio pasa a estado libre.
- RN-07: Cobro por fraccion configurable de tiempo.
- RN-08: Tarifa diferenciada por tipo de vehiculo.
- RN-09: Tolerancia de salida configurable.
- RN-10: Cobro minimo configurable.
- RN-11: Reserva con ventana maxima de espera de 15 minutos; luego expira.
- RN-12: Todas las acciones relevantes quedan registradas en historial.
- RN-13: En entrada, el operador selecciona manualmente un espacio libre compatible.
- RN-14: El ticket de entrada puede imprimirse con formato operativo.
- RN-15: En pago en efectivo, el monto recibido debe ser mayor o igual al total y el sistema calcula cambio.
- RN-16: En pago con tarjeta, la confirmacion de cobro es directa sin ingreso de monto recibido.
- RN-17: Solo se permite eliminar espacios en estado libre.
- RN-18: La numeracion de nuevos espacios es automatica y correlativa.
- RN-19: El modulo de configuracion incluye dos pestañas: General y Tarifas.

## 5. Catalogo de casos de uso
- CU-01: Iniciar sesion
- CU-02: Cerrar sesion
- CU-03: Consultar dashboard operativo
- CU-04: Registrar entrada de vehiculo sin reserva (con seleccion manual de espacio)
- CU-05: Registrar salida y cobro (efectivo/tarjeta)
- CU-06: Crear reserva
- CU-07: Confirmar llegada de reserva (check-in)
- CU-08: Cancelar reserva
- CU-09: Expirar reserva por no presentacion
- CU-10: Configurar parametros generales y tarifas
- CU-11: Consultar historial y reportes basicos
- CU-12: Gestionar usuarios
- CU-13: Gestionar espacios (consultar, editar estado, agregar y eliminar)

---

## CU-01 - Iniciar sesion
- Actor principal: Administrador, Operador de caja
- Objetivo: Acceder al sistema segun rol autorizado.
- Disparador: Usuario abre la pantalla de login y envia credenciales.
- Precondiciones:
1. El usuario existe y esta activo.
2. El sistema esta disponible.
- Postcondiciones:
1. Se crea sesion valida.
2. Se redirige al dashboard correspondiente.
- Reglas relacionadas: RN-12
- Flujo principal:
1. El usuario ingresa nombre de usuario y contrasena.
2. El sistema valida credenciales.
3. El sistema identifica el rol.
4. El sistema inicia sesion y muestra dashboard.
- Flujos alternos y excepciones:
1. Credenciales invalidas: el sistema rechaza acceso y muestra mensaje.
2. Usuario inactivo: el sistema bloquea inicio de sesion.
3. Error interno: el sistema notifica fallo temporal.
- Prioridad: Alta

## CU-02 - Cerrar sesion
- Actor principal: Administrador, Operador de caja
- Objetivo: Finalizar sesion activa de forma segura.
- Disparador: Usuario presiona opcion "Cerrar sesion".
- Precondiciones:
1. Existe una sesion activa.
- Postcondiciones:
1. Sesion invalidada.
2. Retorno a pantalla de login.
- Reglas relacionadas: RN-12
- Flujo principal:
1. Usuario selecciona cerrar sesion.
2. Sistema elimina sesion/token local.
3. Sistema redirige a login.
- Flujos alternos y excepciones:
1. Sesion ya expirada: el sistema redirige a login sin error.
- Prioridad: Media

## CU-03 - Consultar dashboard operativo
- Actor principal: Administrador, Operador de caja
- Objetivo: Visualizar estado actual del parqueo e ingresos del dia.
- Disparador: Usuario ingresa al inicio del sistema.
- Precondiciones:
1. Usuario autenticado.
- Postcondiciones:
1. Informacion visible para toma de decisiones operativas.
- Reglas relacionadas: RN-12
- Flujo principal:
1. Sistema carga cupos totales.
2. Sistema muestra cupos libres, ocupados y reservados.
3. Sistema muestra vehiculos activos e ingresos del dia.
- Flujos alternos y excepciones:
1. Sin movimientos del dia: mostrar valores en cero.
- Prioridad: Alta

## CU-04 - Registrar entrada de vehiculo sin reserva (con seleccion manual de espacio)
- Actor principal: Operador de caja
- Actores secundarios: Sistema
- Objetivo: Registrar ingreso de un vehiculo y asignar manualmente un espacio libre.
- Disparador: Llega vehiculo sin reserva previa.
- Precondiciones:
1. Usuario autenticado como operador o administrador.
2. Existen espacios disponibles para el tipo de vehiculo.
3. La placa no tiene ticket activo.
- Postcondiciones:
1. Entrada registrada con fecha/hora.
2. Espacio seleccionado cambia a ocupado.
3. Ticket unico generado con opcion de impresion.
- Reglas relacionadas: RN-01, RN-02, RN-03, RN-04, RN-05, RN-13, RN-14
- Flujo principal:
1. Operador abre pantalla de entrada.
2. Selecciona tipo de vehiculo.
3. Sistema muestra grid de espacios con colores por estado.
4. Operador selecciona manualmente un espacio libre.
5. Operador ingresa placa y confirma registro.
6. Sistema valida placa activa y disponibilidad del espacio.
7. Sistema registra hora de entrada y genera ticket.
8. Sistema permite imprimir ticket.
- Flujos alternos y excepciones:
1. Sin cupos: sistema bloquea registro y notifica parqueo lleno.
2. Placa ya activa: sistema bloquea registro por duplicidad.
3. Espacio no seleccionado: sistema solicita seleccionar espacio.
4. Espacio cambia a no disponible antes de confirmar: sistema pide seleccionar otro.
- Prioridad: Alta

## CU-05 - Registrar salida y cobro (efectivo/tarjeta)
- Actor principal: Operador de caja
- Actores secundarios: Sistema
- Objetivo: Finalizar estancia, calcular monto, registrar pago y liberar espacio.
- Disparador: Cliente solicita salida.
- Precondiciones:
1. Usuario autenticado.
2. Existe ticket activo asociado a placa o codigo.
3. Parametros tarifarios vigentes configurados.
- Postcondiciones:
1. Ticket cerrado con fecha/hora de salida.
2. Pago registrado con metodo.
3. Espacio liberado.
4. Transaccion almacenada en historial.
- Reglas relacionadas: RN-06, RN-07, RN-08, RN-09, RN-10, RN-12, RN-15, RN-16
- Flujo principal:
1. Operador busca ticket por codigo o placa.
2. Sistema recupera hora de entrada y tipo de vehiculo.
3. Sistema calcula tiempo total y monto final.
4. Operador selecciona metodo de pago (efectivo o tarjeta).
5. Si es efectivo, operador ingresa monto recibido y sistema calcula cambio.
6. Operador confirma cobro.
7. Sistema registra salida, pago y libera espacio.
- Flujos alternos y excepciones:
1. Ticket no encontrado: sistema informa que no existe ticket activo.
2. Tarifa faltante para tipo de vehiculo: sistema bloquea cobro y alerta configuracion.
3. Monto efectivo insuficiente: sistema bloquea confirmacion.
4. Cancelacion antes de confirmar pago: no se modifica estado del ticket.
- Prioridad: Alta

## CU-06 - Crear reserva
- Actor principal: Operador de caja, Administrador
- Actores secundarios: Sistema
- Objetivo: Reservar un espacio para una fecha y hora especifica.
- Disparador: Cliente solicita reserva.
- Precondiciones:
1. Usuario autenticado.
2. Existe espacio disponible para el horario solicitado.
- Postcondiciones:
1. Reserva registrada con estado "reservada".
2. Espacio marcado como reservado para el periodo.
- Reglas relacionadas: RN-01, RN-02, RN-11, RN-12
- Flujo principal:
1. Usuario abre modulo de reservas.
2. Ingresa placa, tipo de vehiculo, fecha y hora estimada.
3. Sistema valida disponibilidad para el periodo.
4. Sistema asigna espacio numerado.
5. Sistema guarda reserva y entrega codigo de reserva.
- Flujos alternos y excepciones:
1. Sin disponibilidad en horario: sistema rechaza reserva.
2. Datos invalidos: sistema solicita correccion.
- Prioridad: Media

## CU-07 - Confirmar llegada de reserva (check-in)
- Actor principal: Operador de caja
- Actores secundarios: Sistema
- Objetivo: Convertir una reserva en ingreso activo del parqueo.
- Disparador: Cliente llega con reserva.
- Precondiciones:
1. Usuario autenticado.
2. Reserva existe y esta vigente.
3. Llegada dentro de la ventana permitida.
- Postcondiciones:
1. Reserva cambia a estado "utilizada".
2. Se genera ticket activo de entrada.
3. Espacio queda en estado ocupado.
- Reglas relacionadas: RN-05, RN-11, RN-12
- Flujo principal:
1. Operador busca reserva por codigo o placa.
2. Sistema valida vigencia de la reserva.
3. Operador confirma llegada.
4. Sistema registra hora real de entrada.
5. Sistema genera ticket y marca espacio como ocupado.
- Flujos alternos y excepciones:
1. Reserva no encontrada: sistema informa error.
2. Reserva expirada: sistema impide check-in.
3. Cliente llega fuera de ventana: sistema trata como ingreso normal (si hay cupo).
- Prioridad: Media

## CU-08 - Cancelar reserva
- Actor principal: Operador de caja, Administrador
- Objetivo: Anular una reserva antes de su uso.
- Disparador: Cliente solicita cancelacion o usuario detecta cambio.
- Precondiciones:
1. Reserva existente en estado "reservada".
- Postcondiciones:
1. Reserva marcada como cancelada.
2. Espacio vuelve a disponible en el horario correspondiente.
- Reglas relacionadas: RN-02, RN-12
- Flujo principal:
1. Usuario localiza reserva.
2. Solicita cancelar reserva.
3. Sistema solicita confirmacion.
4. Sistema actualiza estado a cancelada.
- Flujos alternos y excepciones:
1. Reserva ya utilizada: sistema no permite cancelar.
2. Reserva ya expirada: sistema informa estado final.
- Prioridad: Media

## CU-09 - Expirar reserva por no presentacion
- Actor principal: Sistema (automatico), Administrador (manual)
- Objetivo: Liberar reservas no atendidas dentro de la ventana permitida.
- Disparador: Superacion de tiempo limite de espera.
- Precondiciones:
1. Reserva en estado "reservada".
2. Hora actual supera hora programada + ventana de 15 minutos.
- Postcondiciones:
1. Reserva marcada como expirada.
2. Espacio vuelve a estado disponible.
- Reglas relacionadas: RN-02, RN-11, RN-12
- Flujo principal:
1. Sistema identifica reservas vencidas.
2. Sistema actualiza estado a expirada.
3. Sistema registra evento en historial.
- Flujos alternos y excepciones:
1. Check-in realizado antes de expirar: no se ejecuta expiracion.
- Prioridad: Media

## CU-10 - Configurar parametros generales y tarifas
- Actor principal: Administrador
- Objetivo: Mantener la configuracion institucional del parqueo y politicas de cobro.
- Disparador: Administrador ingresa al modulo de configuracion.
- Precondiciones:
1. Usuario autenticado con rol administrador.
- Postcondiciones:
1. Parametros generales guardados.
2. Tarifas y reglas de cobro actualizadas.
3. Cambios disponibles para nuevas operaciones y tickets.
- Reglas relacionadas: RN-07, RN-08, RN-09, RN-10, RN-19
- Flujo principal:
1. Administrador abre modulo de configuracion.
2. En tab General, actualiza nombre, RUC/NIT, direccion, telefono y email.
3. Sistema muestra vista previa de la informacion para tickets.
4. En tab Tarifas, define tarifa para carro y moto, fraccion, tolerancia y cobro minimo.
5. Sistema muestra ejemplos de calculo en tiempo real.
6. Administrador guarda cambios.
- Flujos alternos y excepciones:
1. Valor invalido (negativo o cero): sistema rechaza guardado.
2. Falta tarifa de un tipo: sistema impide guardar configuracion tarifaria.
- Prioridad: Alta

## CU-11 - Consultar historial y reportes basicos
- Actor principal: Administrador, Operador de caja
- Objetivo: Revisar operaciones y metricas basicas del parqueo.
- Disparador: Usuario abre modulo de historial/reportes.
- Precondiciones:
1. Usuario autenticado.
- Postcondiciones:
1. Reporte consultado o filtrado segun criterio.
- Reglas relacionadas: RN-12
- Flujo principal:
1. Usuario selecciona rango de fechas.
2. Opcionalmente filtra por placa o ticket.
3. Sistema muestra movimientos de entradas, salidas, cobros y reservas.
4. Sistema muestra ingresos diarios y vehiculos atendidos.
- Flujos alternos y excepciones:
1. Sin resultados: sistema muestra lista vacia con mensaje informativo.
- Prioridad: Alta

## CU-12 - Gestionar usuarios
- Actor principal: Administrador
- Objetivo: Mantener cuentas de acceso del personal autorizado.
- Disparador: Administrador entra al modulo de usuarios.
- Precondiciones:
1. Usuario autenticado con rol administrador.
- Postcondiciones:
1. Usuario creado, editado, activado o desactivado segun accion.
- Reglas relacionadas: RN-12
- Flujo principal:
1. Administrador visualiza listado de usuarios.
2. Selecciona accion: crear, editar datos, cambiar rol, activar/desactivar.
3. Sistema valida datos.
4. Sistema guarda cambios.
- Flujos alternos y excepciones:
1. Nombre de usuario duplicado: sistema rechaza creacion.
2. Intento de eliminar ultimo administrador activo: sistema bloquea operacion.
- Prioridad: Media

## CU-13 - Gestionar espacios (consultar, editar estado, agregar y eliminar)
- Actor principal: Administrador
- Objetivo: Administrar espacios del parqueo en tiempo real.
- Disparador: Administrador abre modulo de espacios.
- Precondiciones:
1. Usuario autenticado con rol administrador.
2. Existen espacios registrados.
- Postcondiciones:
1. Espacios actualizados de forma reactiva sin recargar pagina.
2. Se mantienen estados coherentes segun reglas.
- Reglas relacionadas: RN-02, RN-12, RN-17, RN-18
- Flujo principal:
1. Administrador visualiza espacios por tabs (carros/motos) y estadisticas.
2. Para editar estado, selecciona accion de configuracion sobre un espacio.
3. Sistema permite cambiar estado y guardar.
4. Para agregar espacios, administrador indica cantidad de carros y motos.
5. Sistema crea nuevos espacios con numeracion automatica.
6. Para eliminar, administrador selecciona un espacio libre y confirma.
7. Sistema actualiza vista inmediatamente.
- Flujos alternos y excepciones:
1. Intento de eliminar espacio ocupado o reservado: sistema bloquea operacion.
2. Cantidad invalida al agregar espacios: sistema solicita correccion.
3. Cambio de estado inconsistente con ticket activo: sistema alerta y exige confirmacion.
- Prioridad: Alta

---

## 6. Trazabilidad recomendada
- MVP obligatorio: CU-01, CU-03, CU-04, CU-05, CU-10, CU-13
- Segunda fase: CU-06, CU-07, CU-08, CU-09, CU-11, CU-12

## 7. Criterios globales de aceptacion
1. Ningun flujo critico permite estados inconsistentes de espacios.
2. Todo cobro se calcula con reglas vigentes y queda auditado.
3. Toda transaccion operativa deja rastro en historial.
4. Los roles restringen correctamente acciones administrativas.
5. La configuracion general impacta correctamente la informacion mostrada en tickets.
