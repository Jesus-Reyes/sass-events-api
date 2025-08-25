# Incidencias API

Este módulo proporciona endpoints para gestionar las incidencias del sistema, que incluyen información completa sobre incidentes operacionales y sus hallazgos asociados.

## Descripción

Las Incidencias representan eventos operacionales (con códigos como INC######) que han afectado el sistema. Cada incidencia incluye información sobre el hallazgo, la ventana de tiempo del incidente, y referencias a las operativas, BUs, CFS y métricas de impacto relacionadas.

## Estructura de la Entidad

```typescript
interface Incidencia {
  id: number;
  incidentId: string; // Ej: "INC000001045873"
  operativaId: number;
  hallazgo: HallazgoData;
  buId: number;
  cfsId: number;
  occurrenceDate: string; // Fecha de ocurrencia
  windowStart: string; // Ventana de inicio (ISO string)
  windowEnd: string; // Ventana de fin (ISO string)
  metricsId: string; // ID de la métrica de impacto (referencia al id de metricas_impacto)
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relaciones
  buCatalogo: BuCatalogo;
  cfsCatalogo: CfsCatalogo;
  operativaCatalogo: OperativaCatalogo;
}

interface HallazgoData {
  start: string; // Hora de inicio del hallazgo (ISO string)
  end: string;   // Hora de fin del hallazgo (ISO string)
  severity: 'low' | 'medium' | 'high' | 'critical';
}
```

## Endpoints Disponibles

### 1. Crear Incidencia
```
POST /incidencias
```

**Body:**
```json
{
  "incidentId": "INC000001045873",
  "operativaId": 1,
  "hallazgo": {
    "start": "2025-07-31T09:10:00Z",
    "end": "2025-07-31T10:05:00Z",
    "severity": "high"
  },
  "buId": 1,
  "cfsId": 1,
  "occurrenceDate": "2025-07-31",
  "windowStart": "2025-07-31T08:43:00Z",
  "windowEnd": "2025-07-31T10:15:00Z",
  "metricsId": "1"
}
```

**Respuesta:**
```json
{
  "status": 201,
  "data": {
    "id": 1,
    "incidentId": "INC000001045873",
    "operativaId": 1,
    "hallazgo": {
      "start": "2025-07-31T09:10:00Z",
      "end": "2025-07-31T10:05:00Z",
      "severity": "high"
    },
    "buId": 1,
    "cfsId": 1,
    "occurrenceDate": "2025-07-31",
    "windowStart": "2025-07-31T08:43:00Z",
    "windowEnd": "2025-07-31T10:15:00Z",
    "metricsId": "1",
    "active": true,
    "createdAt": "2025-08-25T10:00:00Z",
    "updatedAt": "2025-08-25T10:00:00Z"
  },
  "message": "Incidencia creada exitosamente"
}
```

### 2. Obtener Todas las Incidencias
```
GET /incidencias
```

**Respuesta con relaciones completas:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "incidentId": "INC000001045873",
      "operativaId": 1,
      "hallazgo": {
        "start": "2025-07-31T09:10:00Z",
        "end": "2025-07-31T10:05:00Z",
        "severity": "high"
      },
      "buId": 1,
      "cfsId": 1,
      "occurrenceDate": "2025-07-31",
      "windowStart": "2025-07-31T08:43:00Z",
      "windowEnd": "2025-07-31T10:15:00Z",
      "metricsId": "IMPACT_SERIES_001",
      "buCatalogo": {
        "id": 1,
        "name": "BBVA México / Swift Alliance",
        "geography": {
          "id": 1,
          "name": "México",
          "code": "MX"
        }
      },
      "cfsCatalogo": {
        "id": 1,
        "name": "Plataforma Cobranza",
        "campoN1": "Debt Collection",
        "campoN2": "DC001"
      },
      "operativaCatalogo": {
        "id": 1,
        "name": "Envío de mensajes",
        "tipo": "Comunicación"
      },
      "active": true,
      "createdAt": "2025-08-25T10:00:00Z",
      "updatedAt": "2025-08-25T10:00:00Z"
    }
  ],
  "message": "Incidencias obtenidas exitosamente"
}
```

### 3. Obtener Incidencias para Frontend
```
GET /incidencias/frontend
```

**Respuesta optimizada para el frontend (formato de la tabla):**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "incidentId": "INC000001045873",
      "operativaId": 1,
      "hallazgo": {
        "start": "2025-07-31T09:10:00Z",
        "end": "2025-07-31T10:05:00Z",
        "severity": "high"
      },
      "buId": 1,
      "cfsId": 1,
      "occurrenceDate": "2025-07-31",
      "windowStart": "2025-07-31T08:43:00Z",
      "windowEnd": "2025-07-31T10:15:00Z",
      "metricsId": "IMPACT_SERIES_001"
    }
  ],
  "message": "Incidencias para frontend obtenidas exitosamente"
}
```

### 4. Obtener Incidencia por ID
```
GET /incidencias/:id
```

### 5. Actualizar Incidencia
```
PATCH /incidencias/:id
```

### 6. Eliminar Incidencia
```
DELETE /incidencias/:id
```

## Validaciones

- **incidentId**: Requerido, máximo 50 caracteres, único
- **operativaId**: Requerido, debe existir en operativas_catalogos
- **hallazgo**: Requerido, objeto con estructura HallazgoData
- **hallazgo.start**: Requerido, formato ISO 8601
- **hallazgo.end**: Requerido, formato ISO 8601
- **hallazgo.severity**: Requerido, uno de: 'low', 'medium', 'high', 'critical'
- **buId**: Requerido, debe existir en bu_catalogos
- **cfsId**: Requerido, debe existir en cfs_catalogos
- **occurrenceDate**: Requerido, formato fecha ISO
- **windowStart**: Requerido, formato ISO 8601
- **windowEnd**: Requerido, formato ISO 8601
- **metricsId**: Requerido, máximo 100 caracteres, debe ser el ID de una métrica de impacto existente

## Incidencias Predefinidas

El seed incluye las siguientes incidencias de ejemplo:

1. **INC000001045873** - Envío de mensajes (severidad: high)
2. **CRQ000001045874** - Cambio (severidad: medium)
3. **INC000001045875** - Acceso (severidad: critical)
4. **INC000001045876** - Consulta (severidad: low)

## Casos de Uso

1. **Gestión de incidentes**: Registrar y seguir incidencias operacionales
2. **Análisis de impacto**: Relacionar incidencias con métricas de impacto
3. **Reportes por BU/CFS**: Filtrar incidencias por unidad de negocio o servicio
4. **Dashboard operacional**: Visualizar incidencias en tiempo real
5. **Análisis de severidad**: Categorizar y priorizar incidencias

## Integración con Otros Módulos

- **BU Catálogo**: Cada incidencia pertenece a una Business Unit
- **CFS Catálogo**: Cada incidencia afecta a un servicio específico
- **Operativas Catálogo**: Cada incidencia está categorizada por tipo de operativa
- **Métricas de Impacto**: Cada incidencia referencia métricas para análisis gráfico

## Formato Frontend vs Backend

### Frontend (tabla de incidencias)
El endpoint `/incidencias/frontend` retorna solo los datos esenciales para la tabla:
```json
{
  "id": "XXXXXX",
  "incidentId": "INC000001045873",
  "operativaId": "XXXX",
  "hallazgo": {
    "start": "2025-07-31T09:10:00Z",
    "end": "2025-07-31T10:05:00Z",
    "severity": "high"
  },
  "buId": "XXXX",
  "cfsId": "XXXXX",
  "occurrenceDate": "2025-07-31",
  "windowStart": "2025-07-31T08:43:00Z",
  "windowEnd": "2025-07-31T10:15:00Z",
  "metricsId": "1"
}
```

### Backend (gestión completa)
El endpoint `/incidencias` incluye todas las relaciones expandidas para gestión.

## Manejo de Errores

- **400 Bad Request**: Datos de entrada inválidos
- **404 Not Found**: Incidencia, BU, CFS u Operativa no encontrada
- **409 Conflict**: Incidencia con incidentId duplicado
- **500 Internal Server Error**: Error interno del servidor

## Relaciones

- **ManyToOne**: BuCatalogo (una BU puede tener múltiples incidencias)
- **ManyToOne**: CfsCatalogo (un CFS puede tener múltiples incidencias)
- **ManyToOne**: OperativaCatalogo (una operativa puede tener múltiples incidencias)
- **Referencia**: MetricaImpacto (por metricsId)
