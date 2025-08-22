# Status Medición API

Este módulo gestiona los status de medición en el sistema SASS Eventos API.

## Descripción

El módulo Status Medición permite gestionar los diferentes estados que puede tener una medición en el sistema. Cada status tiene un nombre único y puede estar activo o inactivo.

## Estructura de la entidad

```typescript
{
  id: number,           // ID único autogenerado
  nombre: string,       // Nombre del status (único, máx. 100 caracteres)
  active: boolean,      // Estado activo/inactivo (por defecto: true)
  createdAt: Date,      // Fecha de creación
  updatedAt: Date       // Fecha de última actualización
}
```

## Endpoints disponibles

### 1. Crear Status Medición
- **POST** `/status-medicion`
- **Body**: 
  ```json
  {
    "nombre": "En proceso",
    "active": true  // opcional, por defecto true
  }
  ```
- **Respuesta exitosa (201)**:
  ```json
  {
    "status": 201,
    "data": {
      "id": 1,
      "nombre": "En proceso",
      "active": true,
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-01T10:00:00Z"
    },
    "message": "Status Medición creado exitosamente"
  }
  ```

### 2. Obtener todos los Status Mediciones
- **GET** `/status-medicion`
- **Respuesta exitosa (200)**:
  ```json
  {
    "status": 200,
    "data": [
      {
        "id": 1,
        "nombre": "En proceso",
        "active": true,
        "createdAt": "2024-01-01T10:00:00Z",
        "updatedAt": "2024-01-01T10:00:00Z"
      }
    ],
    "message": "Status Mediciones obtenidos exitosamente",
    "count": 1
  }
  ```

### 3. Obtener Status Mediciones activos
- **GET** `/status-medicion/active`
- **Respuesta**: Similar al endpoint anterior pero solo registros con `active: true`

### 4. Obtener Status Medición por ID
- **GET** `/status-medicion/:id`
- **Parámetros**: `id` (number) - ID del status medición
- **Respuesta exitosa (200)**:
  ```json
  {
    "status": 200,
    "data": {
      "id": 1,
      "nombre": "En proceso",
      "active": true,
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-01T10:00:00Z"
    },
    "message": "Status Medición obtenido exitosamente"
  }
  ```

### 5. Actualizar Status Medición
- **PATCH** `/status-medicion/:id`
- **Parámetros**: `id` (number) - ID del status medición
- **Body**: 
  ```json
  {
    "nombre": "Completado",  // opcional
    "active": false          // opcional
  }
  ```
- **Respuesta exitosa (200)**:
  ```json
  {
    "status": 200,
    "data": {
      "id": 1,
      "nombre": "Completado",
      "active": false,
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-01T10:30:00Z"
    },
    "message": "Status Medición actualizado exitosamente"
  }
  ```

### 6. Activar/Desactivar Status Medición
- **PATCH** `/status-medicion/:id/toggle-active`
- **Parámetros**: `id` (number) - ID del status medición
- **Respuesta exitosa (200)**:
  ```json
  {
    "status": 200,
    "data": {
      "id": 1,
      "nombre": "En proceso",
      "active": false,
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-01T10:30:00Z"
    },
    "message": "Status Medición desactivado exitosamente"
  }
  ```

### 7. Eliminar Status Medición
- **DELETE** `/status-medicion/:id`
- **Parámetros**: `id` (number) - ID del status medición
- **Respuesta exitosa (200)**:
  ```json
  {
    "status": 200,
    "message": "Status Medición eliminado exitosamente",
    "data": {
      "id": 1,
      "nombre": "En proceso"
    }
  }
  ```

## Validaciones

### Crear/Actualizar Status Medición
- **nombre**: 
  - Requerido (al crear)
  - Tipo: string
  - Longitud mínima: 2 caracteres
  - Longitud máxima: 100 caracteres
  - Debe ser único en la base de datos
  - Se normaliza automáticamente (trim)

- **active**: 
  - Opcional
  - Tipo: boolean
  - Valor por defecto: true

## Códigos de error

- **400 Bad Request**: Datos inválidos (validaciones fallidas)
- **404 Not Found**: Status Medición no encontrado
- **409 Conflict**: Ya existe un Status Medición con el mismo nombre
- **500 Internal Server Error**: Error en la base de datos

## Ejemplos de uso

### Crear un nuevo status
```bash
curl -X POST http://localhost:3000/status-medicion \
  -H "Content-Type: application/json" \
  -d '{"nombre": "En revisión"}'
```

### Obtener todos los status activos
```bash
curl -X GET http://localhost:3000/status-medicion/active
```

### Actualizar un status
```bash
curl -X PATCH http://localhost:3000/status-medicion/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Finalizado"}'
```

### Desactivar un status
```bash
curl -X PATCH http://localhost:3000/status-medicion/1/toggle-active
```

## Notas técnicas

- La tabla en base de datos se llama `status_mediciones`
- Se utiliza TypeORM como ORM
- Los timestamps se manejan automáticamente
- El campo `nombre` tiene un índice único en base de datos
- Se implementa validación a nivel de aplicación y base de datos
