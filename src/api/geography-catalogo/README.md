# Geography Catalogo API

API para la gestión del catálogo de geografías del sistema SASS.

## Descripción

Este módulo proporciona endpoints para gestionar las geografías (países/regiones) donde opera BBVA. Cada geografía puede tener múltiples Business Units asociadas.

## Endpoints

Base URL: `/geography`

### GET /geography
**Descripción**: Obtener todas las geografías

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "España",
      "code": "ES",
      "active": true,
      "createdAt": "2025-08-19T10:00:00.000Z",
      "updatedAt": "2025-08-19T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "México",
      "code": "MX",
      "active": true,
      "createdAt": "2025-08-19T10:05:00.000Z",
      "updatedAt": "2025-08-19T10:05:00.000Z"
    }
  ],
  "message": "Geografías obtenidas exitosamente"
}
```

### POST /geography
**Descripción**: Crear una nueva geografía

**Body:**
```json
{
  "name": "Colombia",
  "code": "CO",
  "active": true
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 201,
  "data": {
    "id": 3,
    "name": "Colombia",
    "code": "CO",
    "active": true,
    "createdAt": "2025-08-19T10:30:00.000Z",
    "updatedAt": "2025-08-19T10:30:00.000Z"
  },
  "message": "Geografía creada exitosamente"
}
```

### GET /geography/:id
**Descripción**: Obtener una geografía por ID con sus Business Units asociadas

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "España",
    "code": "ES",
    "active": true,
    "createdAt": "2025-08-19T10:00:00.000Z",
    "updatedAt": "2025-08-19T10:00:00.000Z",
    "businessUnits": [
      {
        "id": 1,
        "name": "BBVA Digital España",
        "active": true
      },
      {
        "id": 2,
        "name": "BBVA Corporate España",
        "active": true
      }
    ]
  },
  "message": "Geografía obtenida exitosamente"
}
```

### PATCH /geography/:id
**Descripción**: Actualizar una geografía

**Body:**
```json
{
  "name": "España Updated",
  "active": true
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "España Updated",
    "code": "ES",
    "active": true,
    "createdAt": "2025-08-19T10:00:00.000Z",
    "updatedAt": "2025-08-19T11:30:00.000Z"
  },
  "message": "Geografía actualizada exitosamente"
}
```

### DELETE /geography/:id
**Descripción**: Eliminar una geografía

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "message": "Geografía eliminada exitosamente"
}
```

## Validaciones

- **name**: Requerido, máximo 100 caracteres, único
- **code**: Requerido, máximo 10 caracteres, único (código de país/región ISO)
- **active**: Opcional, por defecto `true`

## Estructura de Datos

```typescript
interface Geography {
  id: number;
  name: string;
  code: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  businessUnits?: BusinessUnit[];
}
```

## Casos de Uso

1. **Listar geografías**: Para poblar dropdowns de selección de país/región
2. **Crear geografía**: Cuando se expande operaciones a nuevos países
3. **Actualizar geografía**: Cambios en nombre o estado activo
4. **Consultar geografía específica**: Ver detalles y Business Units asociadas
5. **Eliminar geografía**: Cuando se descontinúan operaciones (cuidado con dependencias)

## Códigos de Error Específicos

- `400`: Datos de entrada inválidos (formato de código incorrecto)
- `404`: Geografía no encontrada
- `409`: Nombre o código ya existe
- `422`: No se puede eliminar geografía con Business Units activas

## Ejemplos de Uso

### Crear geografía nueva
```bash
curl -X POST http://localhost:3000/geography \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Argentina",
    "code": "AR",
    "active": true
  }'
```

### Obtener todas las geografías
```bash
curl -X GET http://localhost:3000/geography
```

### Actualizar geografía
```bash
curl -X PATCH http://localhost:3000/geography/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Reino de España",
    "active": true
  }'
```
