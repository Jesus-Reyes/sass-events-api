# Status Modelo Catalogo API

API para la gestión del catálogo de estados de modelos del sistema SASS.

## Descripción

## Endpoints

Base URL: `/status-modelo-catalogo`

### POST /status-modelo-catalogo
**Descripción**: Crear un nuevo status para modelos

**Body:**
```json
{
  "name": "En Revisión",
  "active": true
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 201,
  "data": {
    "id": 1,
    "name": "En Revisión",
    "active": true,
    "createdAt": "2025-08-20T10:00:00.000Z",
    "updatedAt": "2025-08-20T10:00:00.000Z"
  },
  "message": "Status Modelo creado exitosamente"
}
```

### GET /status-modelo-catalogo
**Descripción**: Obtener todos los status de modelos

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "En Revisión",
      "active": true,
      "createdAt": "2025-08-20T10:00:00.000Z",
      "updatedAt": "2025-08-20T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Aprobado",
      "active": true,
      "createdAt": "2025-08-20T10:05:00.000Z",
      "updatedAt": "2025-08-20T10:05:00.000Z"
    }
  ],
  "message": "Status Modelos obtenidos exitosamente",
  "count": 2
}
```

### GET /status-modelo-catalogo/active
**Descripción**: Obtener solo los status activos (útil para dropdowns)

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 2,
      "name": "Aprobado",
      "active": true,
      "createdAt": "2025-08-20T10:05:00.000Z",
      "updatedAt": "2025-08-20T10:05:00.000Z"
    },
    {
      "id": 1,
      "name": "En Revisión",
      "active": true,
      "createdAt": "2025-08-20T10:00:00.000Z",
      "updatedAt": "2025-08-20T10:00:00.000Z"
    }
  ],
  "message": "Status Modelos activos obtenidos exitosamente",
  "count": 2
}
```

### GET /status-modelo-catalogo/:id
**Descripción**: Obtener un status específico por ID

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "En Revisión",
    "active": true,
    "createdAt": "2025-08-20T10:00:00.000Z",
    "updatedAt": "2025-08-20T10:00:00.000Z"
  },
  "message": "Status Modelo obtenido exitosamente"
}
```

### PATCH /status-modelo-catalogo/:id
**Descripción**: Actualizar un status de modelo

**Body:**
```json
{
  "name": "En Proceso de Revisión",
  "active": true
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "En Proceso de Revisión",
    "active": true,
    "createdAt": "2025-08-20T10:00:00.000Z",
    "updatedAt": "2025-08-20T11:30:00.000Z"
  },
  "message": "Status Modelo actualizado exitosamente"
}
```

### PATCH /status-modelo-catalogo/:id/toggle-active
**Descripción**: Alternar estado activo/inactivo

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "En Proceso de Revisión",
    "active": false,
    "createdAt": "2025-08-20T10:00:00.000Z",
    "updatedAt": "2025-08-20T11:45:00.000Z"
  },
  "message": "Status Modelo desactivado exitosamente"
}
```

### DELETE /status-modelo-catalogo/:id
**Descripción**: Eliminar un status de modelo

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "message": "Status Modelo eliminado exitosamente",
  "data": {
    "id": 1,
    "name": "En Proceso de Revisión"
  }
}
```

## Validaciones

- **name**: Requerido, máximo 100 caracteres, único
- **active**: Opcional, por defecto `true`

## Estructura de Datos

```typescript
interface StatusModeloCatalogo {
  id: number;
  name: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Estados Típicos del Sistema

### Estados Estándar de Modelos
1. **"Borrador"** - Modelo en desarrollo inicial
2. **"En Revisión"** - Modelo pendiente de validación
3. **"Aprobado"** - Modelo validado y listo para implementación
4. **"Implementado"** - Modelo activo en producción
5. **"Pausado"** - Modelo temporalmente suspendido
6. **"Rechazado"** - Modelo que no pasó validación
7. **"Obsoleto"** - Modelo reemplazado o descontinuado

### Estados de Validación Técnica
1. **"Validación Técnica"** - En proceso de revisión técnica
2. **"Validación Negocio"** - En proceso de revisión de negocio
3. **"Validación Riesgos"** - En proceso de revisión de riesgos
4. **"Testing"** - En fase de pruebas
5. **"Pre-Producción"** - Listo para implementación

## Casos de Uso

1. **Dropdowns de selección**: Endpoint `/active` para interfaces de usuario
2. **Seguimiento de estados**: Controlar el ciclo de vida de modelos
3. **Workflows de aprobación**: Estados para procesos de validación
4. **Reportes y auditoría**: Historial de cambios de estado
5. **Gestión de catálogo**: Activar/desactivar estados según necesidades

## Endpoint Especializado: Estados Activos

El endpoint `GET /status-modelo-catalogo/active` es optimizado para:
- Poblar dropdowns en interfaces de usuario
- Evitar mostrar estados obsoletos o descontinuados
- Mejorar performance al filtrar en base de datos
- Mantener UI limpia con solo opciones válidas

## Códigos de Error Específicos

- `400`: Datos de entrada inválidos
- `404`: Status Modelo no encontrado
- `409`: Nombre de status ya existe
- `422`: No se puede eliminar status en uso por modelos activos

## Ejemplos de Uso

### Crear status nuevo
```bash
curl -X POST http://localhost:3000/status-modelo-catalogo \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Validación Técnica",
    "active": true
  }'
```

### Obtener estados activos para dropdown
```bash
curl -X GET http://localhost:3000/status-modelo-catalogo/active
```

### Alternar estado activo/inactivo
```bash
curl -X PATCH http://localhost:3000/status-modelo-catalogo/1/toggle-active
```

### Actualizar nombre del status
```bash
curl -X PATCH http://localhost:3000/status-modelo-catalogo/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "En Revisión Técnica Avanzada"
  }'
```

## Estructura de Base de Datos

```sql
CREATE TABLE status_modelo_catalogos (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Flujo de Trabajo con Modelos

1. **Crear estados iniciales**: Configurar estados básicos del sistema
2. **Asignar a modelos**: Los modelos referenciarán estos estados
3. **Transiciones de estado**: Cambiar estado de modelos según progreso
4. **Mantenimiento**: Activar/desactivar estados según evolución del sistema
5. **Auditoría**: Rastrear cambios de estado para compliance
  "message": "Status Modelo creado exitosamente"
}
```

### 2. Obtener Todos los Status
**GET** `/status-modelo-catalogo`

Obtiene todos los status modelos ordenados por fecha de creación (más reciente primero).

**Respuesta:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "En Revisión",
      "active": true,
      "createdAt": "2025-08-20T10:00:00.000Z",
      "updatedAt": "2025-08-20T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Aprobado",
      "active": true,
      "createdAt": "2025-08-20T10:05:00.000Z",
      "updatedAt": "2025-08-20T10:05:00.000Z"
    }
  ],
  "message": "Status Modelos obtenidos exitosamente",
  "count": 2
}
```

### 3. Obtener Solo Status Activos
**GET** `/status-modelo-catalogo/active`

Obtiene únicamente los status modelos que están marcados como activos, ordenados alfabéticamente.

**Respuesta:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 2,
      "name": "Aprobado",
      "active": true,
      "createdAt": "2025-08-20T10:05:00.000Z",
      "updatedAt": "2025-08-20T10:05:00.000Z"
    },
    {
      "id": 1,
      "name": "En Revisión",
      "active": true,
      "createdAt": "2025-08-20T10:00:00.000Z",
      "updatedAt": "2025-08-20T10:00:00.000Z"
    }
  ],
  "message": "Status Modelos activos obtenidos exitosamente",
  "count": 2
}
```

### 4. Obtener Status por ID
**GET** `/status-modelo-catalogo/:id`

Obtiene un status modelo específico por su ID.

**Respuesta:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "En Revisión",
    "active": true,
    "createdAt": "2025-08-20T10:00:00.000Z",
    "updatedAt": "2025-08-20T10:00:00.000Z"
  },
  "message": "Status Modelo obtenido exitosamente"
}
```

### 5. Actualizar Status Modelo
**PATCH** `/status-modelo-catalogo/:id`

Actualiza un status modelo existente. Puedes actualizar el nombre y/o el estado activo.

**Body:**
```json
{
  "name": "En Proceso de Revisión",
  "active": true
}
```

**Respuesta:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "En Proceso de Revisión",
    "active": true,
    "createdAt": "2025-08-20T10:00:00.000Z",
    "updatedAt": "2025-08-20T11:30:00.000Z"
  },
  "message": "Status Modelo actualizado exitosamente"
}
```

### 6. Alternar Estado Activo/Inactivo
**PATCH** `/status-modelo-catalogo/:id/toggle-active`

Cambia el estado activo/inactivo del status modelo.

**Respuesta:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "En Proceso de Revisión",
    "active": false,
    "createdAt": "2025-08-20T10:00:00.000Z",
    "updatedAt": "2025-08-20T11:45:00.000Z"
  },
  "message": "Status Modelo desactivado exitosamente"
}
```

### 7. Eliminar Status Modelo
**DELETE** `/status-modelo-catalogo/:id`

Elimina permanentemente un status modelo del catálogo.

**Respuesta:**
```json
{
  "status": 200,
  "message": "Status Modelo eliminado exitosamente",
  "data": {
    "id": 1,
    "name": "En Proceso de Revisión"
  }
}
```

## Validaciones

### Reglas de Validación

- **name**: 
  - Requerido
  - Tipo: string
  - Longitud mínima: 2 caracteres
  - Longitud máxima: 100 caracteres
  - Único en el sistema
  - Se normaliza automáticamente (trim)

- **active**: 
  - Opcional
  - Tipo: boolean
  - Valor por defecto: `true`

### Manejo de Errores

#### 400 - Bad Request
```json
{
  "message": "El nombre debe tener al menos 2 caracteres",
  "error": "Bad Request",
  "statusCode": 400
}
```

#### 404 - Not Found
```json
{
  "message": "Status Modelo con ID 99 no encontrado",
  "error": "Not Found",
  "statusCode": 404
}
```

#### 409 - Conflict
```json
{
  "message": "Ya existe un Status Modelo con el nombre 'Activo'",
  "error": "Conflict",
  "statusCode": 409
}
```

#### 500 - Internal Server Error
```json
{
  "message": "Error en la base de datos",
  "error": "Internal Server Error",
  "statusCode": 500
}
```

## Ejemplos de Uso con Postman

### Colección JSON para Postman

```json
{
  "info": {
    "name": "Status Modelo Catálogo",
    "description": "Endpoints para gestionar el catálogo de status de modelos"
  },
  "item": [
    {
      "name": "Crear Status Modelo",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"En Revisión\",\n  \"active\": true\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/status-modelo-catalogo",
          "host": ["{{baseUrl}}"],
          "path": ["status-modelo-catalogo"]
        }
      }
    },
    {
      "name": "Obtener Todos los Status",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{baseUrl}}/status-modelo-catalogo",
          "host": ["{{baseUrl}}"],
          "path": ["status-modelo-catalogo"]
        }
      }
    },
    {
      "name": "Obtener Status Activos",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{baseUrl}}/status-modelo-catalogo/active",
          "host": ["{{baseUrl}}"],
          "path": ["status-modelo-catalogo", "active"]
        }
      }
    },
    {
      "name": "Obtener Status por ID",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{baseUrl}}/status-modelo-catalogo/{{statusId}}",
          "host": ["{{baseUrl}}"],
          "path": ["status-modelo-catalogo", "{{statusId}}"]
        }
      }
    },
    {
      "name": "Actualizar Status Modelo",
      "request": {
        "method": "PATCH",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"En Proceso de Revisión\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/status-modelo-catalogo/{{statusId}}",
          "host": ["{{baseUrl}}"],
          "path": ["status-modelo-catalogo", "{{statusId}}"]
        }
      }
    },
    {
      "name": "Alternar Estado Activo",
      "request": {
        "method": "PATCH",
        "url": {
          "raw": "{{baseUrl}}/status-modelo-catalogo/{{statusId}}/toggle-active",
          "host": ["{{baseUrl}}"],
          "path": ["status-modelo-catalogo", "{{statusId}}", "toggle-active"]
        }
      }
    },
    {
      "name": "Eliminar Status Modelo",
      "request": {
        "method": "DELETE",
        "url": {
          "raw": "{{baseUrl}}/status-modelo-catalogo/{{statusId}}",
          "host": ["{{baseUrl}}"],
          "path": ["status-modelo-catalogo", "{{statusId}}"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    },
    {
      "key": "statusId",
      "value": "1"
    }
  ]
}
```

## Casos de Uso Comunes

### 1. Configuración Inicial del Sistema
```bash
# Crear status básicos
POST /status-modelo-catalogo { "name": "Borrador" }
POST /status-modelo-catalogo { "name": "En Revisión" }
POST /status-modelo-catalogo { "name": "Aprobado" }
POST /status-modelo-catalogo { "name": "Rechazado" }
POST /status-modelo-catalogo { "name": "Publicado" }
```

### 2. Obtener Status para Dropdown/Select
```bash
# Para mostrar en un formulario
GET /status-modelo-catalogo/active
```

### 3. Desactivar Status Temporalmente
```bash
# En lugar de eliminar, desactivar
PATCH /status-modelo-catalogo/3/toggle-active
```

### 4. Auditoría de Status
```bash
# Ver todos incluidos los inactivos
GET /status-modelo-catalogo
```

## Estructura de Base de Datos

### Tabla: status_modelo_catalogos

```sql
CREATE TABLE status_modelo_catalogos (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices recomendados
CREATE INDEX idx_status_modelo_name ON status_modelo_catalogos(name);
CREATE INDEX idx_status_modelo_active ON status_modelo_catalogos(active);
```

## Funcionalidades Especiales

### 1. Normalización Automática
- Los nombres se normalizan automáticamente con `trim()`
- Previene nombres con espacios en blanco al inicio/final

### 2. Endpoint de Status Activos
- Endpoint especial `/active` para obtener solo registros activos
- Útil para dropdowns y selects en formularios

### 3. Toggle de Estado
- Endpoint `/toggle-active` para cambiar estado sin necesidad de PATCH completo
- Útil para activar/desactivar rápidamente

### 4. Conteo de Registros
- Las respuestas incluyen `count` para facilitar paginación futura
- Información adicional para dashboards

## Integración con Otros Módulos

Este catálogo puede ser utilizado por otros módulos del sistema que necesiten asignar estados a sus modelos, como:

- Modelo de Eventos
- Modelo de Contribuyentes
- Procesos de Workflow
- Gestión de Documentos

## Próximas Mejoras

- [ ] Paginación para grandes volúmenes de datos
- [ ] Filtros por estado activo/inactivo
- [ ] Búsqueda por nombre
- [ ] Ordenamiento personalizable
- [ ] Soft delete en lugar de eliminación permanente
- [ ] Auditoría de cambios (quién y cuándo modificó)

## Notas Técnicas

- Utiliza TypeORM para la gestión de base de datos
- Implementa validaciones con class-validator
- Manejo de errores centralizado con excepciones personalizadas
- Logging automático de errores para debugging
- Respuestas consistentes con estructura estandarizada
