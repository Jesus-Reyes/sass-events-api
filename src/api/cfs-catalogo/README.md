# CFS Catalogo API

API para la gestión del catálogo de CFS (Critical Financial Services) del sistema SASS.

## Descripción

Este módulo proporciona endpoints para gestionar los CFS (Critical Financial Services) que pertenecen a cada Business Unit. Los CFS son servicios financieros críticos que pueden ser agrupados en disciplinas.

## Endpoints

Base URL: `/cfs-catalogo`

### POST /cfs-catalogo
**Descripción**: Crear un nuevo CFS

**Body:**
```json
{
  "name": "Pagos Digitales",
  "campoN1": "Servicios de Pago",
  "campoN2": "Digital",
  "buId": 1,
  "active": true
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 201,
  "data": {
    "id": 1,
    "name": "Pagos Digitales",
    "campoN1": "Servicios de Pago",
    "campoN2": "Digital",
    "buId": 1,
    "active": true,
    "createdAt": "2025-08-19T10:30:00.000Z",
    "updatedAt": "2025-08-19T10:30:00.000Z"
  },
  "message": "CFS creado exitosamente"
}
```

### GET /cfs-catalogo
**Descripción**: Obtener todos los CFS con sus relaciones

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "Pagos Digitales",
      "campoN1": "Servicios de Pago",
      "campoN2": "Digital",
      "buId": 1,
      "buCatalogo": {
        "id": 1,
        "name": "Digital Banking Spain",
        "geography": {
          "id": 1,
          "name": "España",
          "code": "ES"
        }
      },
      "active": true,
      "createdAt": "2025-08-19T10:30:00.000Z",
      "updatedAt": "2025-08-19T10:30:00.000Z"
    }
  ],
  "message": "CFS obtenidos exitosamente"
}
```

### GET /cfs-catalogo/:id
**Descripción**: Obtener un CFS específico por ID

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "Pagos Digitales",
    "campoN1": "Servicios de Pago",
    "campoN2": "Digital",
    "buId": 1,
    "buCatalogo": {
      "id": 1,
      "name": "Digital Banking Spain",
      "geography": {
        "id": 1,
        "name": "España",
        "code": "ES"
      }
    },
    "active": true,
    "createdAt": "2025-08-19T10:30:00.000Z",
    "updatedAt": "2025-08-19T10:30:00.000Z"
  },
  "message": "CFS obtenido exitosamente"
}
```

### GET /cfs-catalogo/by-bu/:buId
**Descripción**: Obtener todos los CFS de una Business Unit específica (Filtro por BU)

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "Pagos Digitales",
      "campoN1": "Servicios de Pago",
      "campoN2": "Digital",
      "buId": 1,
      "buCatalogo": {
        "id": 1,
        "name": "Digital Banking Spain",
        "geography": {
          "id": 1,
          "name": "España",
          "code": "ES"
        }
      },
      "active": true,
      "createdAt": "2025-08-19T10:30:00.000Z",
      "updatedAt": "2025-08-19T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "Bizum",
      "campoN1": "Transferencias P2P",
      "campoN2": "Instantáneo",
      "buId": 1,
      "buCatalogo": {
        "id": 1,
        "name": "Digital Banking Spain",
        "geography": {
          "id": 1,
          "name": "España",
          "code": "ES"
        }
      },
      "active": true,
      "createdAt": "2025-08-19T10:35:00.000Z",
      "updatedAt": "2025-08-19T10:35:00.000Z"
    }
  ],
  "message": "CFS de la Business Unit Digital Banking Spain obtenidos exitosamente"
}
```

### PATCH /cfs-catalogo/:id
**Descripción**: Actualizar un CFS

**Body:**
```json
{
  "name": "Pagos Digitales Avanzados",
  "campoN1": "Servicios de Pago Premium",
  "campoN2": "Digital Premium"
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "Pagos Digitales Avanzados",
    "campoN1": "Servicios de Pago Premium",
    "campoN2": "Digital Premium",
    "buId": 1,
    "buCatalogo": {
      "id": 1,
      "name": "Digital Banking Spain",
      "geography": {
        "id": 1,
        "name": "España",
        "code": "ES"
      }
    },
    "active": true,
    "createdAt": "2025-08-19T10:30:00.000Z",
    "updatedAt": "2025-08-19T12:00:00.000Z"
  },
  "message": "CFS actualizado exitosamente"
}
```

### DELETE /cfs-catalogo/:id
**Descripción**: Eliminar un CFS

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "message": "CFS eliminado exitosamente"
}
```

## Validaciones

- **name**: Requerido, máximo 100 caracteres, único
- **campoN1**: Requerido, máximo 100 caracteres (categoría principal)
- **campoN2**: Requerido, máximo 100 caracteres (subcategoría)
- **buId**: Requerido, debe ser un número positivo y existir en la base de datos
- **active**: Opcional, por defecto `true`

## Estructura de Datos

```typescript
interface CfsItem {
  id: number;
  name: string;
  campoN1: string;
  campoN2: string;
  buId: number;
  buCatalogo?: BusinessUnit;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  disciplinas?: Disciplina[];
}
```

## Relaciones

- **Pertenece a**: Una Business Unit (`BusinessUnit`)
- **Puede pertenecer a**: Múltiples disciplinas (`Disciplina`)

## Casos de Uso

1. **Catalogar servicios**: Registrar nuevos servicios financieros críticos
2. **Filtrar por BU**: Ver CFS específicos de una unidad de negocio
3. **Categorizar servicios**: Usar campoN1 y campoN2 para clasificación
4. **Agrupar en disciplinas**: Asociar múltiples CFS a disciplinas de riesgo
5. **Gestionar ciclo de vida**: Activar/desactivar servicios según disponibilidad

## Endpoint Especializado: Filtro por BU

El endpoint `GET /cfs-catalogo/by-bu/:buId` es especialmente útil para:

- **Interfaces de usuario**: Populate dropdowns filtrados
- **Selección jerárquica**: Geografia → BU → CFS
- **Reportes específicos**: Análisis por unidad de negocio
- **Workflows de aprobación**: Procesos específicos por BU

### Flujo de Trabajo Típico

1. Usuario selecciona una geografía
2. Se cargan las BUs de esa geografía
3. Usuario selecciona una BU específica
4. Se cargan los CFS usando `/by-bu/:buId`

## Códigos de Error Específicos

- `400`: Datos de entrada inválidos
- `404`: CFS o Business Unit no encontrada
- `409`: Nombre de CFS ya existe
- `422`: No se puede eliminar CFS que pertenece a disciplinas activas

## Ejemplos de Uso

### Crear CFS
```bash
curl -X POST http://localhost:3000/cfs-catalogo \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bizum",
    "campoN1": "Transferencias Instantáneas",
    "campoN2": "P2P",
    "buId": 1
  }'
```

### Obtener CFS por Business Unit
```bash
curl -X GET http://localhost:3000/cfs-catalogo/by-bu/1
```

### Actualizar CFS
```bash
curl -X PATCH http://localhost:3000/cfs-catalogo/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bizum Premium",
    "campoN1": "Transferencias Premium",
    "campoN2": "P2P Empresarial"
  }'
```

### Obtener todos los CFS
```bash
curl -X GET http://localhost:3000/cfs-catalogo
```

## Estructura de Base de Datos

```sql
CREATE TABLE cfs_catalogos (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  campo_n1 VARCHAR(100) NOT NULL,
  campo_n2 VARCHAR(100) NOT NULL,
  bu_id INTEGER NOT NULL REFERENCES bu_catalogos(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Estructura de Base de Datos

### Script SQL para crear la tabla

```sql
-- Crear tabla cfs_catalogos
CREATE TABLE IF NOT EXISTS cfs_catalogos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    campo_n1 VARCHAR(100) NOT NULL,
    campo_n2 VARCHAR(100) NOT NULL,
    bu_id INTEGER NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    CONSTRAINT fk_cfs_bu_id FOREIGN KEY (bu_id) REFERENCES bu_catalogos(id) ON DELETE CASCADE,
    
    -- Unique constraint para evitar nombres duplicados
    CONSTRAINT uk_cfs_name UNIQUE (name)
);

-- Crear índice para mejorar performance en consultas por BU
CREATE INDEX IF NOT EXISTS idx_cfs_bu_id ON cfs_catalogos(bu_id);
CREATE INDEX IF NOT EXISTS idx_cfs_active ON cfs_catalogos(active);
```

## Endpoints Disponibles

### 1. Crear CFS
- **POST** `/cfs-catalogo`
- **Body:**
```json
{
  "name": "Nombre del CFS",
  "campoN1": "Valor Campo N1",
  "campoN2": "Valor Campo N2",
  "buId": 1,
  "active": true
}
```

### 2. Obtener todos los CFS
- **GET** `/cfs-catalogo`

### 3. Obtener CFS por ID
- **GET** `/cfs-catalogo/:id`

### 4. Obtener CFS por Business Unit
- **GET** `/cfs-catalogo/by-bu/:buId`
- Este endpoint permite filtrar todos los CFS que pertenecen a una BU específica

### 5. Actualizar CFS
- **PATCH** `/cfs-catalogo/:id`
- **Body:** (todos los campos son opcionales)
```json
{
  "name": "Nuevo nombre",
  "campoN1": "Nuevo valor N1",
  "campoN2": "Nuevo valor N2",
  "buId": 2,
  "active": false
}
```

### 6. Eliminar CFS
- **DELETE** `/cfs-catalogo/:id`

## Características Implementadas

### Validaciones
- **Nombre único**: No se permite crear CFS con nombres duplicados
- **Business Unit válida**: Verifica que la BU exista y esté activa antes de crear/actualizar un CFS
- **Validaciones de entrada**: Todos los campos obligatorios son validados
- **Longitud de campos**: Máximo 100 caracteres para campos de texto

### Relaciones
- **ManyToOne** con `BuCatalogo`: Cada CFS pertenece a una Business Unit
- **Eager loading**: Incluye automáticamente la información de la BU y geografía en las consultas

### Manejo de Errores
- Excepciones personalizadas para diferentes tipos de error
- Logging detallado para debugging
- Respuestas consistentes con código de estado HTTP apropiado

### Funcionalidad de Filtrado
El endpoint `GET /cfs-catalogo/by-bu/:buId` permite:
- Obtener todos los CFS que pertenecen a una Business Unit específica
- Verificar que la BU existe antes de hacer la consulta
- Retornar información completa incluyendo BU y geografía
- Ordenar por fecha de creación (más recientes primero)

## Uso del Filtro por Business Unit

Para implementar un select en el frontend que muestre todas las BU y permita filtrar los CFS:

1. **Obtener todas las BU**: `GET /bu-catalogo`
2. **Seleccionar una BU del dropdown**
3. **Obtener CFS filtrados**: `GET /cfs-catalogo/by-bu/{selectedBuId}`

### Ejemplo de respuesta del filtro:
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "CFS Service 1",
      "campoN1": "Valor 1",
      "campoN2": "Valor 2",
      "buId": 1,
      "buCatalogo": {
        "id": 1,
        "name": "Business Unit Name",
        "geography": {
          "id": 1,
          "name": "Geografia Name",
          "code": "GEO_CODE"
        }
      },
      "active": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "CFS de la Business Unit Business Unit Name obtenidos exitosamente"
}
```

## Estructura de Archivos Creados

```
src/api/cfs-catalogo/
├── dto/
│   ├── create-cfs-catalogo.dto.ts
│   └── update-cfs-catalogo.dto.ts
├── entities/
│   └── cfs-catalogo.entity.ts
├── exceptions/
│   └── cfs-catalogo.exceptions.ts
├── cfs-catalogo.controller.ts
├── cfs-catalogo.service.ts
└── cfs-catalogo.module.ts
```

El módulo ha sido agregado automáticamente al `app.module.ts` y está listo para usar.
