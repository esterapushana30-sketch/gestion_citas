<div align="center">

# 📋 Manual de Usuario

## Sistema de Gestión de Citas SENA Bienestar

---

**Versión:** 2.0  
**Fecha:** Julio 2026  
**Documento interno — Servicios de Bienestar**

</div>

---

## 📌 Índice

1. [Introducción](#1-introducción)
2. [Requisitos del Sistema](#2-requisitos-del-sistema)
3. [Autenticación](#3-autenticación)
4. [Panel del Aprendiz](#4-panel-del-aprendiz)
5. [Panel del Profesional](#5-panel-del-profesional)
6. [Panel de Coordinación](#6-panel-de-coordinación)
7. [Panel de Administración](#7-panel-de-administración)
8. [Gestión de Perfil](#8-gestión-de-perfil)
9. [Navegación Móvil](#9-navegación-móvil)
10. [Solución de Problemas](#10-solución-de-problemas)
11. [Credenciales de Prueba](#11-credenciales-de-prueba)

---

## 1. Introducción

El **Sistema de Gestión de Citas SENA Bienestar** es una plataforma web diseñada para optimizar la gestión de citas de bienestar en los centros de formación del SENA. Permite a los aprendices agendar citas con profesionales de Psicología, Enfermería y Trabajo Social, facilitando el seguimiento y gestión de estas por parte de los profesionales y coordinadores.

### 1.1 Características Principales

- ✅ Agendamiento de citas en línea 24/7
- ✅ Gestión por dependencias (Psicología, Enfermería, Trabajo Social)
- ✅ Panel de administración para coordinadores
- ✅ Reportes y métricas en tiempo real
- ✅ Diseño responsive (escritorio y móvil)
- ✅ Sistema de notificaciones

---

## 2. Requisitos del Sistema

### 2.1 Navegadores Soportados

| Navegador | Versión Mínima |
|-----------|----------------|
| Google Chrome | 90+ |
| Mozilla Firefox | 88+ |
| Apple Safari | 14+ |
| Microsoft Edge | 90+ |

### 2.2 Dispositivos

- **Escritorio:** Resolución mínima 1024×768
- **Móvil:** Resolución mínima 375px de ancho
- **Tablet:** iPad o equivalente (1024×768 o superior)

### 2.3 Conexión

- Conexión a internet estable requerida
- Velocidad mínima recomendada: 1 Mbps

---

## 3. Autenticación

### 3.1 Iniciar Sesión

1. Acceda a la URL del sistema
2. Ingrese su **correo electrónico** registrado
3. Ingrese su **contraseña**
4. Haga clic en **Iniciar Sesión**

> ⚠️ Si las credenciales son incorrectas, verá un mensaje de error. Verifique sus datos o contacte al administrador.

### 3.2 Registrar Cuenta de Aprendiz

1. En la página de login, haga clic en **Regístrate aquí**
2. Complete el formulario con:
   - Nombre completo
   - Número de documento
   - Correo electrónico institucional
   - Contraseña (mínimo 8 caracteres)
   - Confirmar contraseña
3. Haga clic en **Crear cuenta**
4. Revise su correo para confirmar la cuenta

### 3.3 Registrar Cuenta Profesional

1. Acceda a la ruta `/register-professional`
2. Complete el formulario con:
   - Nombre completo
   - Documento de identidad
   - Teléfono (opcional)
   - Correo institucional
   - Profesión / Cargo
   - Especialidad (si aplica)
   - Contraseña
3. Haga clic en **Crear Cuenta Profesional**

### 3.4 Recuperar Contraseña

1. En la página de login, haga clic en **¿Olvidaste tu contraseña?**
2. Ingrese su correo electrónico
3. Haga clic en **Enviar instrucciones**
4. Revise su correo y siga las instrucciones para restablecer

---

## 4. Panel del Aprendiz

### 4.1 Vista General

Al iniciar sesión como aprendiz, accede a **Mis Citas de Bienestar** donde puede:

- 📊 Ver resumen de sus citas
- 📅 Filtrar por estado: Todas, Pendientes, Confirmadas, Completadas, Canceladas
- ➕ Agendar nuevas citas
- ❌ Cancelar citas pendientes

### 4.2 Solicitar Nueva Cita

1. Haga clic en **Nueva Cita** (botón verde con ícono +)
2. Complete el formulario:

| Campo | Descripción |
|-------|-------------|
| **Número de Ficha** | Número de grupo de formación |
| **Programa de Formación** | Nombre del programa técnico/tecnológico |
| **Dependencia** | Seleccione: Psicología, Enfermería o Trabajo Social |
| **Fecha** | Fecha deseada (no fines de semana, mínimo 24h adelante) |
| **Hora** | Hora disponible (08:00 - 16:00) |
| **Motivo** | Descripción breve del motivo de consulta |

3. Haga clic en **Solicitar Cita**

> 📌 **Reglas importantes:**
> - Máximo **2 citas pendientes** simultáneas
> - Solo horario laboral: **08:00 - 17:00**
> - No se agendan **fines de semana**
> - Mínimo **24 horas** de anticipación

### 4.3 Cancelar una Cita

1. Encuentre la cita con estado **Pendiente**
2. Haga clic en **Cancelar**
3. Confirme la acción

> ⚠️ Solo puede cancelar citas pendientes. Las confirmadas o completadas no se pueden cancelar desde este panel.

---

## 5. Panel del Profesional

### 5.1 Dashboard

Al iniciar sesión como profesional, accede al dashboard de su dependencia con:

- 📊 **KPIs del día**: Citas de hoy, pendientes, confirmadas
- 📅 **Próxima cita**: Banner con la siguiente cita programada
- 🔍 **Filtros**: Pendientes, Confirmadas, Historial

### 5.2 Gestionar Citas Pendientes

Para cada cita pendiente puede realizar las siguientes acciones:

| Acción | Descripción |
|--------|-------------|
| **Confirmar** | Acepta la cita y cambia estado a "Confirmada" |
| **Reprogramar** | Cambia fecha y hora de la cita |
| **No asistió** | Marca que el aprendiz no se presentó |

### 5.3 Gestionar Citas Confirmadas

| Acción | Descripción |
|--------|-------------|
| **Completar Atención** | Marca la cita como atendida |
| **Observaciones** | Agrega notas sobre la atención brindada |

### 5.4 Ver Historial

1. Haga clic en **Historial** en el header
2. Se muestra una tabla con todas las citas atendidas
3. Información disponible: fecha, hora, aprendiz, estado, observaciones

### 5.5 Gestionar Disponibilidad

1. Haga clic en **Mi Horario** en el header
2. Configure su horario para cada día de la semana:
   - Marque/desmarque días para activar/desactivar
   - Defina hora de inicio y fin por día
3. Haga clic en **Guardar Disponibilidad**

---

## 6. Panel de Coordinación

### 6.1 Dashboard

El dashboard de coordinación proporciona una vista completa del centro de bienestar:

- 📈 **Tasa de cumplimiento**: Porcentaje de citas completadas
- 📊 **Estadísticas**: Total, pendientes, completadas, canceladas
- 📉 **Gráfica de tendencia**: Evolución mensual de citas
- 🏢 **Progreso por dependencia**: Avance de cada área
- ⚡ **Acciones rápidas**: Top profesionales, distribución por horario, reportes

### 6.2 Filtrar por Fecha

1. Seleccione el rango de fechas en los campos **Desde** y **Hasta**
2. Los datos se actualizan automáticamente

### 6.3 Filtrar por Dependencia

1. Haga clic en el botón de filtro de dependencia
2. Seleccione: Todas, Psicología, Enfermería o Trabajo Social
3. Los datos se filtran automáticamente

### 6.4 Exportar Reportes

1. Haga clic en **Reporte rápido**
2. Se descarga un archivo CSV con los datos del período seleccionado

---

## 7. Panel de Administración

### 7.1 Gestión de Usuarios

**Ver usuarios:**
1. Acceda a la pestaña **Usuarios**
2. Use los filtros de búsqueda o seleccione un rol
3. Navegue entre páginas con la paginación

**Crear usuario:**
1. Haga clic en **Nuevo Usuario**
2. Complete: nombre, email, contraseña, rol, dependencia
3. Haga clic en **Crear Usuario**

**Editar usuario:**
1. Haga clic en el ícono de acciones (⋮) del usuario
2. Seleccione **Editar rol**
3. Modifique los campos necesarios
4. Haga clic en **Guardar Cambios**

**Activar/Desactivar usuario:**
1. Haga clic en el estado (Activo/Inactivo) del usuario
2. Se cambia automáticamente el estado

### 7.2 Gestión de Citas

1. Acceda a la pestaña **Citas**
2. Filtre por: estado, dependencia, búsqueda de texto
3. Visualice todas las citas del sistema

### 7.3 Roles y Permisos

1. Acceda a la pestaña **Roles**
2. Visualice los roles configurados en el sistema
3. Permisos asignados por rol

### 7.4 Dependencias

1. Acceda a la pestaña **Dependencias**
2. Gestione las áreas de bienestar (Psicología, Enfermería, Trabajo Social)
3. Configure colores y nombres

### 7.5 Auditoría

1. Acceda a la pestaña **Auditoría**
2. Revise los logs de actividad del sistema
3. Filtre por: acción, usuario, rango de fechas

### 7.6 Configuración del Sistema

| Sección | Configuración |
|---------|---------------|
| **General** | Nombre del sistema, duración de citas, máximo diario |
| **Horario Laboral** | Hora inicio/fin, días laborales |
| **Permisos** | Auto-registro, verificación de email, notificaciones |

---

## 8. Gestión de Perfil

### 8.1 Ver Perfil

1. Haga clic en su nombre/avatar en el sidebar
2. Se abre el panel de perfil con:
   - Información personal (nombre, email, documento, teléfono)
   - Profesión / Cargo (si está registrado)
   - Especialidad (para profesionales)
   - Dependencia asignada
   - Fecha de registro

### 8.2 Editar Perfil

1. Haga clic en **Editar perfil**
2. Modifique los campos deseados:
   - Nombre completo
   - Número de documento
   - Teléfono
   - Profesión / Cargo
   - Especialidad (solo profesionales)
3. Haga clic en **Guardar**

### 8.3 Cerrar Sesión

1. Haga clic en **Salir** en el sidebar
2. O en **Perfil** → **Cerrar Sesión**

---

## 9. Navegación Móvil

En dispositivos móviles, la interfaz se adapta automáticamente:

| Elemento | Comportamiento |
|----------|----------------|
| **Sidebar** | Se oculta, reemplazado por bottom navigation |
| **Bottom Nav** | Acceso rápido: Inicio, Mis Citas, Alertas, Perfil |
| **Filtros** | Scrollables horizontalmente |
| **Tarjetas** | Se apilan verticalmente |
| **Modales** | Se deslizan desde abajo |

---

## 10. Solución de Problemas

| Problema | Solución |
|----------|----------|
| No puedo iniciar sesión | Verifique email y contraseña. Revise su correo para confirmar cuenta |
| No veo mis citas | Verifique que tiene el rol correcto. Contacte al administrador |
| Error al agendar cita | Verifique horario disponible. No exceda el límite de 2 pendientes |
| La página no carga | Verifique conexión a internet. Limpie caché del navegador |
| Los colores no se ven | Use un navegador actualizado (Chrome, Firefox, Edge) |
| No puedo cancelar cita | Solo puede cancelar citas con estado "Pendiente" |

---

## 11. Credenciales de Prueba

> ⚠️ Estas credenciales son solo para pruebas. Cambiar en producción.

| Rol | Correo Electrónico | Contraseña |
|-----|-------------------|------------|
| Aprendiz | aprendiz@test.com | Test1234! |
| Psicología | psicologia@test.com | Test1234! |
| Enfermería | enfermeria@test.com | Test1234! |
| Trabajo Social | trabajosocial@test.com | Test1234! |
| Coordinación | coordinacion@test.com | Test1234! |
| Administrador | admin@test.com | Test1234! |

---

<div align="center">

**Manual de Usuario v2.0**  
**Sistema de Gestión de Citas SENA Bienestar**  
© 2026 SENA — Servicios de Bienestar

</div>
