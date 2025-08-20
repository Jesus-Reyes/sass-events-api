# BU Catalogo API

API para la gestión del catálogo de Business Units del sistema SASS.

## Descripción

Este módulo proporciona endpoints para gestionar las Business Units (Unidades de Negocio) que pertenecen a cada geografía. Cada BU está asociada a una geografía específica y puede tener múltiples CFS.

## Endpoints

Base URL: `/bu-catalogo`

### POST /bu-catalogo
**Descripción**: Crear un nuevo Business Unit

**Body:**
```json
{
  "name": "Digital Banking Spain",
  "geographyId": 1,
  "active": true
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 201,
  "data": {
    "id": 1,
    "name": "Digital Banking Spain",
    "geographyId": 1,
    "active": true,
    "createdAt": "2025-08-19T10:15:00.000Z",
    "updatedAt": "2025-08-19T10:15:00.000Z"
  },
  "message": "Business Unit creado exitosamente"
}
```

### GET /bu-catalogo
**Descripción**: Obtener todos los Business Units con sus relaciones

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "Digital Banking Spain",
      "geographyId": 1,
      "geography": {
        "id": 1,
        "name": "España",
        "code": "ES"
      },
      "active": true,
      "createdAt": "2025-08-19T10:15:00.000Z",
      "updatedAt": "2025-08-19T10:15:00.000Z"
    },
    {
      "id": 2,
      "name": "Corporate Banking Mexico",
      "geographyId": 2,
      "geography": {
        "id": 2,
        "name": "México",
        "code": "MX"
      },
      "active": true,
      "createdAt": "2025-08-19T10:20:00.000Z",
      "updatedAt": "2025-08-19T10:20:00.000Z"
    }
  ],
  "message": "Business Units obtenidos exitosamente"
}
```

### GET /bu-catalogo/:id
**Descripción**: Obtener un Business Unit específico por ID

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "Digital Banking Spain",
    "geographyId": 1,
    "geography": {
      "id": 1,
      "name": "España",
      "code": "ES"
    },
    "active": true,
    "createdAt": "2025-08-19T10:15:00.000Z",
    "updatedAt": "2025-08-19T10:15:00.000Z"
  },
  "message": "Business Unit obtenido exitosamente"
}
```

### PATCH /bu-catalogo/:id
**Descripción**: Actualizar un Business Unit

**Body:**
```json
{
  "name": "Digital Banking Spain Updated",
  "active": true
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "Digital Banking Spain Updated",
    "geographyId": 1,
    "geography": {
      "id": 1,
      "name": "España",
      "code": "ES"
    },
    "active": true,
    "createdAt": "2025-08-19T10:15:00.000Z",
    "updatedAt": "2025-08-19T11:45:00.000Z"
  },
  "message": "Business Unit actualizado exitosamente"
}
```

### DELETE /bu-catalogo/:id
**Descripción**: Eliminar un Business Unit

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "message": "Business Unit eliminado exitosamente"
}
```

## Validaciones

- **name**: Requerido, máximo 100 caracteres, único
- **geographyId**: Requerido, debe existir en la base de datos
- **active**: Opcional, por defecto `true`

## Estructura de Datos

```typescript
interface BusinessUnit {
  id: number;
  name: string;
  geographyId: number;
  geography?: Geography;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  cfsItems?: CFS[];
}
```

## Relaciones

- **Pertenece a**: Una geografía (`Geography`)
- **Tiene muchos**: CFS (`CfsItem`)

## Casos de Uso

1. **Listar Business Units**: Para poblar dropdowns organizacionales
2. **Crear Business Unit**: Cuando se establecen nuevas unidades de negocio
3. **Filtrar por geografía**: Ver BUs específicas de un país/región
4. **Actualizar Business Unit**: Cambios en estructura organizacional
5. **Consultar BU específica**: Ver detalles y CFS asociados

## Flujo de Trabajo Típico

1. **Prerequisito**: Debe existir al menos una geografía
2. **Crear BU**: Asociarla a una geografía existente
3. **Asignar CFS**: Los CFS se crearán posteriormente asociados a esta BU
4. **Gestionar estado**: Activar/desactivar según necesidades operativas

## Códigos de Error Específicos

- `400`: Datos de entrada inválidos
- `404`: Business Unit o geografía no encontrada
- `409`: Nombre de Business Unit ya existe
- `422`: No se puede eliminar BU con CFS activos

## Ejemplos de Uso

### Crear Business Unit
```bash
curl -X POST http://localhost:3000/bu-catalogo \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Retail Banking Colombia",
    "geographyId": 3,
    "active": true
  }'
```

### Obtener todas las Business Units
```bash
curl -X GET http://localhost:3000/bu-catalogo
```

### Actualizar Business Unit
```bash
curl -X PATCH http://localhost:3000/bu-catalogo/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Digital & Innovation Spain",
    "active": true
  }'
```

### Obtener Business Unit específica
```bash
curl -X GET http://localhost:3000/bu-catalogo/1
```
