# Métricas de Impacto API

Este módulo proporciona endpoints para gestionar las métricas de impacto de las incidencias, incluyendo series temporales para el análisis gráfico del impacto.

## Descripción

Las Métricas de Impacto almacenan datos de series temporales que permiten visualizar y comparar el impacto de las incidencias a lo largo del tiempo. Cada métrica incluye datos horarios para el día de impacto y días de comparación.

## Estructura de la Entidad

```typescript
interface MetricaImpacto {
  id: number;
  metricsId: string; // Identificador único de la métrica
  fechaImpacto: string; // Fecha del día de impacto
  series: SeriesData[]; // Array de series temporales
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SeriesData {
  fecha: string; // Fecha de la serie
  tipo: 'impacto' | 'comparado'; // Para diferenciar color en frontend
  data: ActivityData[]; // Datos por hora
}

interface ActivityData {
  hora: string; // Formato "HH:mm"
  actividad: number; // Valor de actividad
}
```

## Endpoints Disponibles

### 1. Crear Métrica de Impacto
```
POST /metricas-impacto
```

**Body:**
```json
{
  "metricsId": "IMPACT_SERIES_001",
  "fechaImpacto": "2025-07-17",
  "series": [
    {
      "fecha": "2025-07-17",
      "tipo": "impacto",
      "data": [
        { "hora": "00:00", "actividad": 1000 },
        { "hora": "01:00", "actividad": 800 },
        { "hora": "02:00", "actividad": 600 }
      ]
    },
    {
      "fecha": "2025-06-19",
      "tipo": "comparado",
      "data": [
        { "hora": "00:00", "actividad": 900 },
        { "hora": "01:00", "actividad": 700 }
      ]
    }
  ]
}
```

### 2. Obtener Todas las Métricas
```
GET /metricas-impacto
```

### 3. Obtener Métrica por ID
```
GET /metricas-impacto/:id
```

### 4. Obtener Métrica por metricsId
```
GET /metricas-impacto/metrics/:metricsId
```

**Respuesta específica para frontend:**
```json
{
  "status": 200,
  "data": {
    "metricsId": "IMPACT_SERIES_001",
    "fechaImpacto": "2025-07-17",
    "series": [
      {
        "fecha": "2025-07-17",
        "tipo": "impacto",
        "data": [
          { "hora": "00:00", "actividad": 1000 },
          { "hora": "01:00", "actividad": 800 }
        ]
      }
    ]
  },
  "message": "Métrica de impacto obtenida exitosamente"
}
```

### 5. Actualizar Métrica
```
PATCH /metricas-impacto/:id
```

### 6. Eliminar Métrica
```
DELETE /metricas-impacto/:id
```

## Validaciones

- **metricsId**: Requerido, máximo 100 caracteres, único
- **fechaImpacto**: Requerido, formato fecha ISO
- **series**: Requerido, array de objetos SeriesData
- **series.fecha**: Requerido, formato fecha ISO
- **series.tipo**: Requerido, debe ser 'impacto' o 'comparado'
- **series.data**: Requerido, array de objetos ActivityData
- **data.hora**: Requerido, formato "HH:mm"
- **data.actividad**: Requerido, valor numérico

## Métricas Predefinidas

El seed incluye las siguientes métricas de ejemplo:

1. **IMPACT_SERIES_001** - Para fecha 2025-07-17
2. **IMPACT_SERIES_002** - Para fecha 2025-07-31
3. **IMPACT_SERIES_003** - Para fecha 2025-08-15

Cada métrica incluye:
- Serie de impacto (día del incidente)
- 3 series de comparación (días anteriores)
- Datos horarios completos (24 horas)

## Casos de Uso

1. **Visualización de impacto**: Mostrar gráficas del impacto de incidencias
2. **Análisis comparativo**: Comparar el día de impacto con días anteriores
3. **Detección de patrones**: Identificar patrones en los datos de actividad
4. **Métricas de negocio**: Generar reportes de impacto

## Integración con Frontend

El endpoint `/metricas-impacto/metrics/:metricsId` está optimizado para el frontend y retorna exactamente la estructura necesaria para las gráficas:

```typescript
// Estructura optimizada para Chart.js o similar
{
  metricsId: string,
  fechaImpacto: string,
  series: [
    {
      fecha: string,
      tipo: "impacto" | "comparado", // Para asignar colores
      data: [
        { hora: "HH:mm", actividad: number }
      ]
    }
  ]
}
```

## Manejo de Errores

- **400 Bad Request**: Datos de entrada inválidos
- **404 Not Found**: Métrica no encontrada
- **409 Conflict**: Métrica con metricsId duplicado
- **500 Internal Server Error**: Error interno del servidor

## Relaciones

- **Referenciada por**: Las incidencias referencian las métricas a través del campo `metricsId`
