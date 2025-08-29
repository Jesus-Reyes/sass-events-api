# Modelo Contribuyente API

API para la gestión de modelos de contribuyentes del sistema SASS.

## Descripción

Este módulo proporciona endpoints para gestionar los modelos de contribuyentes, que representan las configuraciones específicas de los modelos asociados a diferentes CFS (Critical Financial Services) y estados de modelo. Cada modelo tiene fechas de ciclo de vida, versión, y una lista de contribuyentes asociados.

## Endpoints

Base URL: `/modelo-contribuyente`

### POST /modelo-contribuyente
**Descripción**: Crear un nuevo modelo contribuyente

**Body:**
```json
{
  "idCFS": 1,
  "idStatusModelo": 2,
  "fechaAlta": "2024-01-15",
  "fechaActivacion": "2024-01-20",
  "fechaInicioVersion": "2024-02-01",
  "fechaInactivacion": "2024-12-31",
  "version": "1.0.0",
  "contribuyentes": ["BBVA_ES", "BBVA_MX", "BBVA_AR"]
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 201,
  "data": {
    "id": 1,
    "idCFS": 1,
    "idStatusModelo": 2,
    "fechaAlta": "2024-01-15",
    "fechaActivacion": "2024-01-20",
    "fechaInicioVersion": "2024-02-01",
    "fechaInactivacion": "2024-12-31",
    "version": "1.0.0",
    "contribuyentes": ["BBVA_ES", "BBVA_MX", "BBVA_AR"],
    "active": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Modelo Contribuyente creado exitosamente"
}
```

### GET /modelo-contribuyente
**Descripción**: Obtener todos los modelos contribuyentes con sus relaciones

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "idCFS": 1,
      "idStatusModelo": 2,
      "cfsCatalogo": {
        "id": 1,
        "name": "Pagos Digitales",
        "campoN1": "Servicios de Pago",
        "campoN2": "Digital"
      },
      "statusModeloCatalogo": {
        "id": 2,
        "name": "Activo"
      },
      "fechaAlta": "2024-01-15",
      "fechaActivacion": "2024-01-20",
      "fechaInicioVersion": "2024-02-01",
      "fechaInactivacion": "2024-12-31",
      "version": "1.0.0",
      "contribuyentes": ["BBVA_ES", "BBVA_MX", "BBVA_AR"],
      "active": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "message": "Modelos Contribuyentes obtenidos exitosamente"
}
```

### GET /modelo-contribuyente/:id
**Descripción**: Obtener un modelo contribuyente específico por ID

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "idCFS": 1,
    "idStatusModelo": 2,
    "cfsCatalogo": {
      "id": 1,
      "name": "Pagos Digitales",
      "campoN1": "Servicios de Pago",
      "campoN2": "Digital"
    },
    "statusModeloCatalogo": {
      "id": 2,
      "name": "Activo"
    },
    "fechaAlta": "2024-01-15",
    "fechaActivacion": "2024-01-20",
    "fechaInicioVersion": "2024-02-01",
    "fechaInactivacion": "2024-12-31",
    "version": "1.0.0",
    "contribuyentes": ["BBVA_ES", "BBVA_MX", "BBVA_AR"],
    "active": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Modelo Contribuyente obtenido exitosamente"
}
```

### GET /modelo-contribuyente/by-version?version=:version
**Descripción**: Obtener modelos contribuyentes por versión específica

**Query Parameters:**
- `version` (string): Versión del modelo (ej: "1.0.0")

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "idCFS": 1,
      "idStatusModelo": 2,
      "cfsCatalogo": {
        "id": 1,
        "name": "Pagos Digitales",
        "campoN1": "Servicios de Pago",
        "campoN2": "Digital"
      },
      "statusModeloCatalogo": {
        "id": 2,
        "name": "Activo"
      },
      "fechaAlta": "2024-01-15",
      "fechaActivacion": "2024-01-20",
      "fechaInicioVersion": "2024-02-01",
      "fechaInactivacion": "2024-12-31",
      "version": "1.0.0",
      "contribuyentes": ["BBVA_ES", "BBVA_MX", "BBVA_AR"],
      "active": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "message": "Modelos Contribuyentes con versión 1.0.0 obtenidos exitosamente"
}
```

### GET /modelo-contribuyente/by-cfs/:idCFS
**Descripción**: Obtener modelos contribuyentes por CFS específico

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "idCFS": 1,
      "idStatusModelo": 2,
      "cfsCatalogo": {
        "id": 1,
        "name": "Pagos Digitales",
        "campoN1": "Servicios de Pago",
        "campoN2": "Digital"
      },
      "statusModeloCatalogo": {
        "id": 2,
        "name": "Activo"
      },
      "fechaAlta": "2024-01-15",
      "fechaActivacion": "2024-01-20",
      "fechaInicioVersion": "2024-02-01",
      "fechaInactivacion": "2024-12-31",
      "version": "1.0.0",
      "contribuyentes": ["BBVA_ES", "BBVA_MX", "BBVA_AR"],
      "active": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "message": "Modelos Contribuyentes del CFS 1 obtenidos exitosamente"
}
```

### GET /modelo-contribuyente/by-status/:idStatusModelo
**Descripción**: Obtener modelos contribuyentes por estado de modelo específico

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "idCFS": 1,
      "idStatusModelo": 2,
      "cfsCatalogo": {
        "id": 1,
        "name": "Pagos Digitales",
        "campoN1": "Servicios de Pago",
        "campoN2": "Digital"
      },
      "statusModeloCatalogo": {
        "id": 2,
        "name": "Activo"
      },
      "fechaAlta": "2024-01-15",
      "fechaActivacion": "2024-01-20",
      "fechaInicioVersion": "2024-02-01",
      "fechaInactivacion": "2024-12-31",
      "version": "1.0.0",
      "contribuyentes": ["BBVA_ES", "BBVA_MX", "BBVA_AR"],
      "active": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "message": "Modelos Contribuyentes del Status 2 obtenidos exitosamente"
}
```

### PATCH /modelo-contribuyente/:id
**Descripción**: Actualizar un modelo contribuyente

**Body:**
```json
{
  "version": "1.1.0",
  "contribuyentes": ["BBVA_ES", "BBVA_MX", "BBVA_AR", "BBVA_CO"],
  "fechaInactivacion": "2025-12-31"
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "idCFS": 1,
    "idStatusModelo": 2,
    "cfsCatalogo": {
      "id": 1,
      "name": "Pagos Digitales",
      "campoN1": "Servicios de Pago",
      "campoN2": "Digital"
    },
    "statusModeloCatalogo": {
      "id": 2,
      "name": "Activo"
    },
    "fechaAlta": "2024-01-15",
    "fechaActivacion": "2024-01-20",
    "fechaInicioVersion": "2024-02-01",
    "fechaInactivacion": "2025-12-31",
    "version": "1.1.0",
    "contribuyentes": ["BBVA_ES", "BBVA_MX", "BBVA_AR", "BBVA_CO"],
    "active": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  },
  "message": "Modelo Contribuyente actualizado exitosamente"
}
```

### DELETE /modelo-contribuyente/:id
**Descripción**: Eliminar un modelo contribuyente (eliminación lógica)

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "message": "Modelo Contribuyente eliminado exitosamente"
}
```

## Validaciones

### Campos Obligatorios
- **idCFS**: Requerido, debe ser un número positivo y existir en la base de datos
- **idStatusModelo**: Requerido, debe ser un número positivo y existir en la base de datos
- **fechaAlta**: Requerida, formato YYYY-MM-DD
- **fechaActivacion**: Requerida, formato YYYY-MM-DD
- **fechaInicioVersion**: Requerida, formato YYYY-MM-DD
- **version**: Requerida, string máximo 50 caracteres
- **contribuyentes**: Requerido, array de strings no vacío

### Campos Opcionales
- **fechaInactivacion**: Opcional, formato YYYY-MM-DD

### Validaciones de Negocio
- **Secuencia de fechas**: Las fechas deben seguir la secuencia lógica:
  - `fechaActivacion >= fechaAlta`
  - `fechaInicioVersion >= fechaActivacion`
  - `fechaInactivacion > fechaInicioVersion` (si se proporciona)

## Estructura de Datos

```typescript
interface ModeloContribuyente {
  id: number;
  idCFS: number;
  idStatusModelo: number;
  fechaAlta: string;
  fechaActivacion: string;
  fechaInicioVersion: string;
  fechaInactivacion?: string;
  version: string;
  contribuyentes: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  cfsCatalogo?: CfsCatalogo;
  statusModeloCatalogo?: StatusModeloCatalogo;
}
```

## Relaciones

- **Pertenece a**: Un CFS (`CfsCatalogo`)
- **Pertenece a**: Un estado de modelo (`StatusModeloCatalogo`)

## Casos de Uso

1. **Gestión de versiones**: Crear y gestionar diferentes versiones de modelos de contribuyentes
2. **Filtrar por CFS**: Ver modelos asociados a un servicio financiero específico
3. **Filtrar por estado**: Ver modelos según su estado actual (activo, inactivo, etc.)
4. **Filtrar por versión**: Obtener modelos de una versión específica
5. **Gestión del ciclo de vida**: Controlar fechas de alta, activación, inicio de versión e inactivación
6. **Gestión de contribuyentes**: Mantener listas de entidades contribuyentes por modelo

## Endpoints Especializados

### Filtro por CFS
El endpoint `GET /modelo-contribuyente/by-cfs/:idCFS` es útil para:
- Obtener todos los modelos asociados a un CFS específico
- Implementar interfaces que muestren modelos por servicio
- Análisis de modelos por servicio financiero

### Filtro por Estado de Modelo
El endpoint `GET /modelo-contribuyente/by-status/:idStatusModelo` permite:
- Filtrar modelos por su estado actual
- Generar reportes de modelos activos/inactivos
- Workflows de gestión por estado

### Filtro por Versión
El endpoint `GET /modelo-contribuyente/by-version?version=:version` facilita:
- Comparar modelos de la misma versión
- Gestión de releases de modelos
- Análisis de evolución por versión

## Códigos de Error Específicos

- `400`: Datos de entrada inválidos o secuencia de fechas incorrecta
- `404`: Modelo contribuyente, CFS o Status de Modelo no encontrado
- `422`: Error de validación de datos de entrada

## Ejemplos de Uso

### Crear Modelo Contribuyente
```bash
curl -X POST http://localhost:3000/modelo-contribuyente \
  -H "Content-Type: application/json" \
  -d '{
    "idCFS": 1,
    "idStatusModelo": 2,
    "fechaAlta": "2024-01-15",
    "fechaActivacion": "2024-01-20",
    "fechaInicioVersion": "2024-02-01",
    "fechaInactivacion": "2024-12-31",
    "version": "1.0.0",
    "contribuyentes": ["BBVA_ES", "BBVA_MX", "BBVA_AR"]
  }'
```

### Obtener Modelos por CFS
```bash
curl -X GET http://localhost:3000/modelo-contribuyente/by-cfs/1
```

### Obtener Modelos por Versión
```bash
curl -X GET http://localhost:3000/modelo-contribuyente/by-version?version=1.0.0
```

### Actualizar Modelo Contribuyente
```bash
curl -X PATCH http://localhost:3000/modelo-contribuyente/1 \
  -H "Content-Type: application/json" \
  -d '{
    "version": "1.1.0",
    "contribuyentes": ["BBVA_ES", "BBVA_MX", "BBVA_AR", "BBVA_CO"]
  }'
```

### Obtener todos los Modelos Contribuyentes
```bash
curl -X GET http://localhost:3000/modelo-contribuyente
```

## Estructura de Base de Datos

```sql
CREATE TABLE IF NOT EXISTS modelo_contribuyentes (
    id SERIAL PRIMARY KEY,
    id_cfs INTEGER NOT NULL,
    id_status_modelo INTEGER NOT NULL,
    fecha_alta DATE NOT NULL,
    fecha_activacion DATE NOT NULL,
    fecha_inicio_version DATE NOT NULL,
    fecha_inactivacion DATE,
    version VARCHAR(50) NOT NULL,
    contribuyentes TEXT[] NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT fk_modelo_cfs_id FOREIGN KEY (id_cfs) REFERENCES cfs_catalogos(id) ON DELETE CASCADE,
    CONSTRAINT fk_modelo_status_id FOREIGN KEY (id_status_modelo) REFERENCES status_modelo_catalogos(id) ON DELETE CASCADE,
    
    -- Check constraints para validar secuencia de fechas
    CONSTRAINT chk_fecha_activacion CHECK (fecha_activacion >= fecha_alta),
    CONSTRAINT chk_fecha_inicio_version CHECK (fecha_inicio_version >= fecha_activacion),
    CONSTRAINT chk_fecha_inactivacion CHECK (fecha_inactivacion IS NULL OR fecha_inactivacion > fecha_inicio_version)
);

-- Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_modelo_cfs_id ON modelo_contribuyentes(id_cfs);
CREATE INDEX IF NOT EXISTS idx_modelo_status_id ON modelo_contribuyentes(id_status_modelo);
CREATE INDEX IF NOT EXISTS idx_modelo_version ON modelo_contribuyentes(version);
CREATE INDEX IF NOT EXISTS idx_modelo_active ON modelo_contribuyentes(active);
```

## Flujos de Trabajo Típicos

### 1. Creación de Nuevo Modelo
1. Seleccionar CFS de la lista disponible
2. Seleccionar estado de modelo
3. Definir fechas del ciclo de vida
4. Especificar versión y contribuyentes
5. Crear modelo con validaciones automáticas

### 2. Gestión por CFS
1. Listar todos los CFS disponibles
2. Seleccionar CFS específico
3. Obtener todos los modelos asociados using `/by-cfs/:idCFS`
4. Analizar o gestionar modelos específicos

### 3. Gestión por Versión
1. Identificar versión objetivo
2. Obtener todos los modelos de esa versión using `/by-version?version=:version`
3. Comparar o actualizar modelos de la misma versión

## Características Implementadas

### Validaciones
- **Secuencia de fechas**: Validación automática del orden lógico de fechas
- **Relaciones válidas**: Verifica que CFS y Status de Modelo existan
- **Formato de fechas**: Validación estricta del formato YYYY-MM-DD
- **Contribuyentes**: Validación de array no vacío

### Relaciones
- **ManyToOne** con `CfsCatalogo`: Cada modelo pertenece a un CFS
- **ManyToOne** con `StatusModeloCatalogo`: Cada modelo tiene un estado
- **Eager loading**: Incluye automáticamente información de CFS y estado en consultas

### Manejo de Errores
- Excepciones personalizadas para diferentes tipos de error
- Logging detallado para debugging
- Respuestas consistentes con código de estado HTTP apropiado
- Validación de secuencia de fechas con mensajes específicos

### Funcionalidades de Filtrado
- **Por CFS**: Filtrar modelos de un servicio específico
- **Por Estado**: Filtrar modelos por su estado actual
- **Por Versión**: Filtrar modelos de una versión específica
- **Eliminación lógica**: Los modelos se marcan como inactivos en lugar de eliminarse

## Estructura de Archivos

```
src/api/modelo-contribuyente/
├── dto/
│   ├── create-modelo-contribuyente.dto.ts
│   └── update-modelo-contribuyente.dto.ts
├── entities/
│   └── modelo-contribuyente.entity.ts
├── exceptions/
│   └── modelo-contribuyente.exceptions.ts
├── seeds/
├── modelo-contribuyente.controller.ts
├── modelo-contribuyente.service.ts
├── modelo-contribuyente.module.ts
├── index.ts
└── README.md
```

El módulo está integrado en el sistema y listo para usar con todas las validaciones y funcionalidades implementadas.
