# Disciplinas Catalogo API

API para la gestión del catálogo de disciplinas del sistema SASS que agrupan múltiples CFS.

## Descripción

Este módulo proporciona endpoints para gestionar las disciplinas, que son agrupaciones lógicas de múltiples CFS (Critical Financial Services). Una disciplina puede contener varios CFS de diferentes Business Units y se utiliza para categorizar servicios por áreas de riesgo o gestión.

## Endpoints

Base URL: `/disciplinas-catalogo`

### POST /disciplinas-catalogo
**Descripción**: Crear una nueva disciplina con múltiples CFS asociados

**Body:**
```json
{
  "name": "Risk Management",
  "cfsIds": [1, 2, 3],
  "active": true
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 201,
  "data": {
    "id": 1,
    "name": "Risk Management",
    "active": true,
    "cfsItems": [
      {
        "id": 1,
        "name": "Pagos Digitales",
        "campoN1": "Servicios de Pago",
        "campoN2": "Digital",
        "buCatalogo": {
          "id": 1,
          "name": "Digital Banking Spain",
          "geography": {
            "id": 1,
            "name": "España",
            "code": "ES"
          }
        }
      },
      {
        "id": 2,
        "name": "Bizum",
        "campoN1": "Transferencias P2P",
        "campoN2": "Instantáneo",
        "buCatalogo": {
          "id": 1,
          "name": "Digital Banking Spain",
          "geography": {
            "id": 1,
            "name": "España",
            "code": "ES"
          }
        }
      }
    ],
    "createdAt": "2025-08-19T12:00:00.000Z",
    "updatedAt": "2025-08-19T12:00:00.000Z"
  },
  "message": "Disciplina creada exitosamente"
}
```

### GET /disciplinas-catalogo
**Descripción**: Obtener todas las disciplinas con sus CFS asociados

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "Risk Management",
      "active": true,
      "cfsItems": [
        {
          "id": 1,
          "name": "Pagos Digitales",
          "campoN1": "Servicios de Pago",
          "campoN2": "Digital",
          "buCatalogo": {
            "id": 1,
            "name": "Digital Banking Spain",
            "geography": {
              "id": 1,
              "name": "España",
              "code": "ES"
            }
          }
        }
      ],
      "createdAt": "2025-08-19T12:00:00.000Z",
      "updatedAt": "2025-08-19T12:00:00.000Z"
    }
  ],
  "message": "Disciplinas obtenidas exitosamente"
}
```

### GET /disciplinas-catalogo/:id
**Descripción**: Obtener una disciplina específica por ID con todos sus CFS

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "Risk Management",
    "active": true,
    "cfsItems": [
      {
        "id": 1,
        "name": "Pagos Digitales",
        "campoN1": "Servicios de Pago",
        "campoN2": "Digital",
        "buCatalogo": {
          "id": 1,
          "name": "Digital Banking Spain",
          "geography": {
            "id": 1,
            "name": "España",
            "code": "ES"
          }
        }
      }
    ],
    "createdAt": "2025-08-19T12:00:00.000Z",
    "updatedAt": "2025-08-19T12:00:00.000Z"
  },
  "message": "Disciplina obtenida exitosamente"
}
```

### PATCH /disciplinas-catalogo/:id
**Descripción**: Actualizar una disciplina (nombre y/o CFS asociados)

**Body:**
```json
{
  "name": "Advanced Risk Management",
  "cfsIds": [1, 2, 3, 4]
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "Advanced Risk Management",
    "active": true,
    "cfsItems": [
      {
        "id": 1,
        "name": "Pagos Digitales",
        "campoN1": "Servicios de Pago",
        "campoN2": "Digital",
        "buCatalogo": {
          "id": 1,
          "name": "Digital Banking Spain",
          "geography": {
            "id": 1,
            "name": "España",
            "code": "ES"
          }
        }
      }
    ],
    "createdAt": "2025-08-19T12:00:00.000Z",
    "updatedAt": "2025-08-19T12:30:00.000Z"
  },
  "message": "Disciplina actualizada exitosamente"
}
```

### DELETE /disciplinas-catalogo/:id
**Descripción**: Eliminar una disciplina

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "message": "Disciplina eliminada exitosamente"
}
```

## Validaciones

- **name**: Requerido, máximo 100 caracteres, único
- **cfsIds**: Requerido, array de números positivos, mínimo 1 elemento, todos deben existir y estar activos en la base de datos
- **active**: Opcional, por defecto `true`

## Estructura de Datos

```typescript
interface Disciplina {
  id: number;
  name: string;
  active: boolean;
  cfsItems: CfsItem[];
  createdAt: Date;
  updatedAt: Date;
}

interface CfsItem {
  id: number;
  name: string;
  campoN1: string;
  campoN2: string;
  buCatalogo: BusinessUnit;
}
```

## Relaciones

- **Tiene muchos**: CFS (`CfsItem`) - Relación muchos a muchos
- **Los CFS pertenecen a**: Business Units que pertenecen a geografías

## Casos de Uso

1. **Agrupación de servicios**: Crear disciplinas para categorizar CFS por áreas de negocio
2. **Gestión de riesgos**: Agrupar CFS por tipos de riesgo operacional
3. **Análisis transversal**: Ver servicios relacionados de múltiples BUs
4. **Reportes consolidados**: Generar reportes por disciplinas
5. **Workflows de aprobación**: Procesos específicos por área de disciplina

## Flujo de Trabajo para Crear Disciplinas

1. **Prerequisitos**: Deben existir CFS activos en el sistema
2. **Seleccionar CFS**: Identificar qué CFS pertenecen a la disciplina
3. **Crear disciplina**: Asociar múltiples CFS a una nueva disciplina
4. **Gestionar relaciones**: Agregar/quitar CFS de disciplinas existentes
5. **Mantenimiento**: Activar/desactivar disciplinas según necesidades

## Casos de Uso Específicos

### 1. Disciplina de Riesgo Operacional
```json
{
  "name": "Operational Risk",
  "cfsIds": [1, 2, 5, 8]  // CFS de diferentes BUs con riesgo operacional
}
```

### 2. Disciplina de Pagos Digitales
```json
{
  "name": "Digital Payments",
  "cfsIds": [3, 4, 7]  // Todos los CFS relacionados con pagos digitales
}
```

### 3. Disciplina de Servicios al Cliente
```json
{
  "name": "Customer Services",
  "cfsIds": [6, 9, 10, 11]  // CFS de cara al cliente final
}
```

## Códigos de Error Específicos

- `400`: Datos de entrada inválidos
- `404`: Disciplina no encontrada
- `409`: Nombre de disciplina ya existe
- `422`: Algún CFS especificado no existe o está inactivo
- `422`: No se puede eliminar disciplina con dependencias activas

## Ejemplos de Uso

### Crear disciplina con múltiples CFS
```bash
curl -X POST http://localhost:3000/disciplinas-catalogo \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Compliance & Risk",
    "cfsIds": [1, 3, 5, 7]
  }'
```

### Obtener todas las disciplinas
```bash
curl -X GET http://localhost:3000/disciplinas-catalogo
```

### Actualizar disciplina (agregar más CFS)
```bash
curl -X PATCH http://localhost:3000/disciplinas-catalogo/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Enhanced Risk Management",
    "cfsIds": [1, 2, 3, 4, 5, 6]
  }'
```

### Obtener disciplina específica
```bash
curl -X GET http://localhost:3000/disciplinas-catalogo/1
```

## Estructura de Base de Datos

```sql
-- Tabla principal de disciplinas
CREATE TABLE disciplinas_catalogos (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de relación muchos a muchos
CREATE TABLE disciplina_cfs (
  disciplina_id INTEGER NOT NULL REFERENCES disciplinas_catalogos(id) ON DELETE CASCADE,
  cfs_id INTEGER NOT NULL REFERENCES cfs_catalogos(id) ON DELETE CASCADE,
  PRIMARY KEY (disciplina_id, cfs_id)
);
```

## Ventajas del Modelo de Disciplinas

1. **Flexibilidad**: Un CFS puede pertenecer a múltiples disciplinas
2. **Transversalidad**: Ver servicios relacionados de diferentes BUs/geografías
3. **Categorización**: Múltiples formas de agrupar los mismos servicios
4. **Escalabilidad**: Fácil agregar nuevas disciplinas sin afectar CFS existentes
5. **Reporting**: Análisis por diferentes dimensiones del negocio
