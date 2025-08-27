# Módulo Modelo Eventos

Este módulo gestiona los modelos de eventos del sistema SASS, permitiendo configurar y mantener toda la información relacionada con los modelos de medición por eventos.

## Estructura de Datos

### Datos CFS (Pertenencia)
- **buId**: ID de la Business Unit a la que pertenece el modelo
- **cfsId**: ID del servicio CFS asociado
- **serviceOwnerId**: ID del responsable del servicio

### Datos Medición (Inicialización)
- **estatusModeloId**: Estado actual del modelo (Borrador, Activo, etc.)
- **estatusMedicionId**: Estado de la medición (Período de garantía, Oficial, etc.)
- **modelo**: Tipo de modelo (Eventos | Batch)
- **fuente**: Fuente de datos (Helix | INFOCENTER)
- **metaDisponibilidad**: Meta de disponibilidad (0-100%)

### Partnership (Configuraciones adicionales)
- **partnershipId**: ID del partnership asociado
- **estatusMedicionPartnership**: Estado específico del partnership
- **metaPartnershipExpectedSLA**: SLA esperado del partnership
- **metaPartnershipMinimumSLA**: SLA mínimo del partnership
- **metaPartnershipStretchedSLA**: SLA extendido del partnership
- **definirFuncionalidadDependencia**: Definición de dependencias funcionales

### Fechas (Registro)
- **fechaAlta**: Fecha de registro del modelo
- **fechaActivacion**: Fecha de activación
- **fechaInicioPeriodoGarantia**: Inicio del período de garantía
- **fechaInicioOficial**: Inicio oficial de medición
- **version**: Versión del modelo
- **fechaInicioVersion**: Fecha de inicio de la versión actual
- **fechaInactivacion**: Fecha de inactivación (opcional)

## Endpoints Disponibles

### CRUD Básico
- `POST /modelo-eventos` - Crear nuevo modelo de evento
- `GET /modelo-eventos` - Listar todos los modelos activos
- `GET /modelo-eventos/:id` - Obtener modelo específico por ID
- `PATCH /modelo-eventos/:id` - Actualizar modelo existente
- `DELETE /modelo-eventos/:id` - Eliminar modelo (soft delete)

### Búsquedas Específicas
- `GET /modelo-eventos/by-bu/:buId` - Filtrar por Business Unit
- `GET /modelo-eventos/by-cfs/:cfsId` - Filtrar por CFS
- `GET /modelo-eventos/by-version/:version` - Filtrar por versión
- `GET /modelo-eventos/by-status-modelo/:estatusModeloId` - Filtrar por estado del modelo

## Validaciones

### Validaciones de Relaciones
- Verifica la existencia y estado activo de todas las entidades relacionadas
- Business Unit, CFS, Service Owner, Status Modelo, Status Medición, Partnership

### Validaciones de Fechas
- `fechaAlta` ≤ `fechaActivacion`
- `fechaActivacion` ≤ `fechaInicioPeriodoGarantia`
- `fechaInicioPeriodoGarantia` ≤ `fechaInicioOficial`
- `fechaInicioVersion` ≥ `fechaActivacion`
- `fechaInactivacion` > `fechaInicioOficial` (si existe)

### Validaciones de Datos
- **modelo**: Solo acepta "Eventos" o "Batch"
- **fuente**: Solo acepta "Helix" o "INFOCENTER"
- **metaDisponibilidad**: Valor entre 0 y 100 con máximo 2 decimales
- **SLA Partnership**: Valores entre 0 y 100 con máximo 2 decimales
- **version**: Valor decimal con máximo 1 decimal, mínimo 1.0

## Estructura de Respuesta

Todas las respuestas siguen el formato estándar:

```json
{
  "status": 200,
  "data": {
    "id": 1,
    "datosCFS": {
      "buId": 1,
      "buNombre": "México",
      "cfsId": 1,
      "cfsNombre": "Servicio XYZ",
      "serviceOwnerId": 1,
      "serviceOwnerNombre": "Juan Pérez"
    },
    "datosMedicion": {
      "estatusModeloId": 1,
      "estatusModeloNombre": "Borrador",
      "estatusMedicionId": 1,
      "estatusMedicionNombre": "Período de garantía",
      "modelo": "Eventos",
      "fuente": "Helix",
      "metaDisponibilidad": 99.92
    },
    "partnership": {
      "partnershipId": 1,
      "partnershipNombre": "NA",
      "estatusMedicionPartnership": "Initial",
      "metaPartnershipExpectedSLA": 0.0,
      "metaPartnershipMinimumSLA": 0.0,
      "metaPartnershipStretchedSLA": 0.0,
      "definirFuncionalidadDependencia": ""
    },
    "fechas": {
      "fechaAlta": "2025-08-25",
      "fechaActivacion": "2025-08-25",
      "fechaInicioPeriodoGarantia": "2025-08-25",
      "fechaInicioOficial": "2025-08-25",
      "version": 1.0,
      "fechaInicioVersion": "2025-08-25",
      "fechaInactivacion": null
    },
    "active": true,
    "createdAt": "2025-08-27T10:00:00.000Z",
    "updatedAt": "2025-08-27T10:00:00.000Z"
  },
  "message": "Operación exitosa"
}
```

## Excepciones

El módulo maneja las siguientes excepciones específicas:

- `ModeloEventoNotFoundException`: Cuando no se encuentra el modelo solicitado
- `BuCatalogoNotFoundException`: BU no encontrada o inactiva
- `CfsCatalogoNotFoundException`: CFS no encontrado o inactivo
- `ServiceOwnerNotFoundException`: Service Owner no encontrado o inactivo
- `StatusModeloNotFoundException`: Status de modelo no encontrado o inactivo
- `StatusMedicionNotFoundException`: Status de medición no encontrado o inactivo
- `PartnershipNotFoundException`: Partnership no encontrado o inactivo
- `InvalidDateRangeException`: Secuencia de fechas inválida
- `DatabaseException`: Error interno del servidor

## Soft Delete

El módulo implementa soft delete, marcando los registros como inactivos en lugar de eliminarlos físicamente de la base de datos. Esto preserva la integridad referencial y el historial de datos.
