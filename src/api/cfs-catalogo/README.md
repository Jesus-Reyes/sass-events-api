# CFS Catálogo - CRUD

Este módulo implementa un CRUD completo para el catálogo de CFS (Customer Facing Service) que está relacionado con Business Units.

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
