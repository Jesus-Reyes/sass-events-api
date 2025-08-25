# Operativas Catálogo API

Este módulo proporciona endpoints para gestionar el catálogo de operativas del sistema, que son las diferentes tipos de operaciones que pueden estar relacionadas con las incidencias.

## Descripción

Las Operativas representan los diferentes tipos de operaciones o acciones que pueden estar asociadas con incidencias en el sistema. Cada operativa tiene un nombre, descripción y tipo que la categoriza.

## Estructura de la Entidad

```typescript
interface OperativaCatalogo {
  id: number;
  name: string;
  description?: string;
  tipo?: string; // Ej: "Comunicación", "Seguridad", "Información"
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Endpoints Disponibles

### 1. Crear Operativa
```
POST /operativas-catalogo
```

**Body:**
```json
{
  "name": "Envío de mensajes",
  "description": "Operativa relacionada con el envío de mensajes del sistema",
  "tipo": "Comunicación"
}
```

**Respuesta:**
```json
{
  "status": 201,
  "data": {
    "id": 1,
    "name": "Envío de mensajes",
    "description": "Operativa relacionada con el envío de mensajes del sistema",
    "tipo": "Comunicación",
    "active": true,
    "createdAt": "2025-08-25T10:00:00Z",
    "updatedAt": "2025-08-25T10:00:00Z"
  },
  "message": "Operativa creada exitosamente"
}
```

### 2. Obtener Todas las Operativas
```
GET /operativas-catalogo
```

**Respuesta:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "Envío de mensajes",
      "description": "Operativa relacionada con el envío de mensajes del sistema",
      "tipo": "Comunicación",
      "active": true,
      "createdAt": "2025-08-25T10:00:00Z",
      "updatedAt": "2025-08-25T10:00:00Z"
    }
  ],
  "message": "Operativas obtenidas exitosamente"
}
```

### 3. Obtener Operativa por ID
```
GET /operativas-catalogo/:id
```

### 4. Actualizar Operativa
```
PATCH /operativas-catalogo/:id
```

### 5. Eliminar Operativa
```
DELETE /operativas-catalogo/:id
```

## Validaciones

- **name**: Requerido, máximo 100 caracteres, único
- **description**: Opcional, máximo 200 caracteres
- **tipo**: Opcional, máximo 50 caracteres
- **active**: Opcional, por defecto `true`

## Tipos de Operativas Predefinidas

El seed incluye las siguientes operativas:

1. **Envío de mensajes** (Comunicación)
2. **Acceso** (Seguridad)
3. **Consulta** (Información)
4. **Cambio** (Modificación)
5. **Procesamiento** (Transaccional)
6. **Validación** (Control)
7. **Sincronización** (Integración)
8. **Backup** (Mantenimiento)
9. **Monitoreo** (Supervisión)
10. **Autenticación** (Seguridad)

## Casos de Uso

1. **Clasificación de incidencias**: Cada incidencia debe tener asociada una operativa
2. **Filtrado por tipo**: Agrupar incidencias por tipo de operativa
3. **Reportes**: Análisis de incidencias por operativa
4. **Configuración**: Gestión del catálogo de operativas disponibles

## Manejo de Errores

- **400 Bad Request**: Datos de entrada inválidos
- **404 Not Found**: Operativa no encontrada
- **409 Conflict**: Operativa con nombre duplicado
- **500 Internal Server Error**: Error interno del servidor

## Relaciones

- **Uno a Muchos**: Una operativa puede tener múltiples incidencias asociadas
