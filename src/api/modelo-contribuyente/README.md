# Modelo Contribuyente API

API para la gestión de modelos de contribuyentes del sistema SASS.

## Descripción

Este módulo proporciona endpoints para gestionar los modelos de contribuyentes que están asociados a los CFS y tienen un estado específico del catálogo de status. Los modelos de contribuyentes representan perfiles o tipos de clientes que utilizan los servicios financieros críticos.

## Endpoints

Base URL: `/modelo-contribuyente`

### POST /modelo-contribuyente
**Descripción**: Crear un nuevo modelo de contribuyente

**Body:**
```json
{
  "name": "Cliente Premium",
  "description": "Cliente con servicios premium y alto volumen de transacciones",
  "cfsId": 1,
  "statusModeloId": 2,
  "active": true
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 201,
  "data": {
    "id": 1,
    "name": "Cliente Premium",
    "description": "Cliente con servicios premium y alto volumen de transacciones",
    "cfsId": 1,
    "statusModeloId": 2,
    "active": true,
    "createdAt": "2025-08-20T10:00:00.000Z",
    "updatedAt": "2025-08-20T10:00:00.000Z"
  },
  "message": "Modelo de contribuyente creado exitosamente"
}
```

### GET /modelo-contribuyente
**Descripción**: Obtener todos los modelos de contribuyentes con sus relaciones

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "Cliente Premium",
      "description": "Cliente con servicios premium y alto volumen de transacciones",
      "cfsId": 1,
      "statusModeloId": 2,
      "cfsItem": {
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
      "statusModelo": {
        "id": 2,
        "name": "Aprobado",
        "active": true
      },
      "active": true,
      "createdAt": "2025-08-20T10:00:00.000Z",
      "updatedAt": "2025-08-20T10:00:00.000Z"
    }
  ],
  "message": "Modelos de contribuyente obtenidos exitosamente"
}
```

### GET /modelo-contribuyente/:id
**Descripción**: Obtener un modelo de contribuyente específico por ID

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "Cliente Premium",
    "description": "Cliente con servicios premium y alto volumen de transacciones",
    "cfsId": 1,
    "statusModeloId": 2,
    "cfsItem": {
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
    "statusModelo": {
      "id": 2,
      "name": "Aprobado",
      "active": true
    },
    "active": true,
    "createdAt": "2025-08-20T10:00:00.000Z",
    "updatedAt": "2025-08-20T10:00:00.000Z"
  },
  "message": "Modelo de contribuyente obtenido exitosamente"
}
```

### GET /modelo-contribuyente/by-cfs/:cfsId
**Descripción**: Obtener todos los modelos de contribuyente de un CFS específico

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "Cliente Premium",
      "description": "Cliente con servicios premium y alto volumen de transacciones",
      "statusModelo": {
        "id": 2,
        "name": "Aprobado",
        "active": true
      },
      "active": true,
      "createdAt": "2025-08-20T10:00:00.000Z",
      "updatedAt": "2025-08-20T10:00:00.000Z"
    }
  ],
  "message": "Modelos de contribuyente del CFS obtenidos exitosamente"
}
```

### GET /modelo-contribuyente/by-status/:statusId
**Descripción**: Obtener todos los modelos de contribuyente por estado específico

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "Cliente Premium",
      "description": "Cliente con servicios premium y alto volumen de transacciones",
      "cfsItem": {
        "id": 1,
        "name": "Pagos Digitales",
        "campoN1": "Servicios de Pago",
        "campoN2": "Digital"
      },
      "active": true,
      "createdAt": "2025-08-20T10:00:00.000Z",
      "updatedAt": "2025-08-20T10:00:00.000Z"
    }
  ],
  "message": "Modelos de contribuyente con estado 'Aprobado' obtenidos exitosamente"
}
```

### PATCH /modelo-contribuyente/:id
**Descripción**: Actualizar un modelo de contribuyente

**Body:**
```json
{
  "name": "Cliente Premium Plus",
  "description": "Cliente premium con servicios exclusivos y beneficios adicionales",
  "statusModeloId": 4,
  "active": true
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "Cliente Premium Plus",
    "description": "Cliente premium con servicios exclusivos y beneficios adicionales",
    "cfsId": 1,
    "statusModeloId": 4,
    "cfsItem": {
      "id": 1,
      "name": "Pagos Digitales",
      "campoN1": "Servicios de Pago",
      "campoN2": "Digital"
    },
    "statusModelo": {
      "id": 4,
      "name": "Implementado",
      "active": true
    },
    "active": true,
    "createdAt": "2025-08-20T10:00:00.000Z",
    "updatedAt": "2025-08-20T11:30:00.000Z"
  },
  "message": "Modelo de contribuyente actualizado exitosamente"
}
```

### PATCH /modelo-contribuyente/:id/change-status
**Descripción**: Cambiar solo el estado de un modelo de contribuyente

**Body:**
```json
{
  "statusModeloId": 3
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "Cliente Premium Plus",
    "statusModelo": {
      "id": 3,
      "name": "En Revisión",
      "active": true
    },
    "updatedAt": "2025-08-20T12:00:00.000Z"
  },
  "message": "Estado del modelo de contribuyente actualizado exitosamente"
}
```

### DELETE /modelo-contribuyente/:id
**Descripción**: Eliminar un modelo de contribuyente

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "message": "Modelo de contribuyente eliminado exitosamente",
  "data": {
    "id": 1,
    "name": "Cliente Premium Plus"
  }
}
```

## Validaciones

- **name**: Requerido, máximo 100 caracteres, único por CFS
- **description**: Opcional, máximo 500 caracteres
- **cfsId**: Requerido, debe existir en la base de datos
- **statusModeloId**: Requerido, debe existir y estar activo
- **active**: Opcional, por defecto `true`

## Estructura de Datos

```typescript
interface ModeloContribuyente {
  id: number;
  name: string;
  description?: string;
  cfsId: number;
  statusModeloId: number;
  cfsItem?: CfsItem;
  statusModelo?: StatusModeloCatalogo;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Relaciones

- **Pertenece a**: Un CFS (`CfsItem`)
- **Tiene un**: Estado del modelo (`StatusModeloCatalogo`)
- **A través de CFS**: Acceso a Business Unit y Geography

## Casos de Uso

1. **Segmentación de clientes**: Definir diferentes tipos de contribuyentes por servicio
2. **Gestión de ciclo de vida**: Controlar el estado de cada modelo
3. **Análisis por CFS**: Ver qué tipos de clientes usan cada servicio
4. **Workflows de aprobación**: Mover modelos a través de estados de validación
5. **Reportes de negocio**: Análisis de contribuyentes por geografía/BU

## Filtros Especializados

### Por CFS (`/by-cfs/:cfsId`)
- Ver todos los tipos de contribuyentes de un servicio específico
- Útil para análisis de segmentación por servicio
- Permite entender qué perfiles usan cada CFS

### Por Estado (`/by-status/:statusId`)
- Ver todos los modelos en un estado específico
- Útil para workflows de aprobación
- Permite gestionar modelos pendientes de revisión

## Flujo de Trabajo Típico

1. **Crear modelo**: Asociar a un CFS y estado inicial ("Borrador")
2. **Desarrollar**: Actualizar descripción y características
3. **Revisar**: Cambiar estado a "En Revisión"
4. **Aprobar/Rechazar**: Mover a estado correspondiente
5. **Implementar**: Estado "Implementado" para modelos en producción
6. **Mantener**: Actualizar según evolución del negocio

## Códigos de Error Específicos

- `400`: Datos de entrada inválidos
- `404`: Modelo de contribuyente, CFS o Status no encontrado
- `409`: Nombre de modelo ya existe para el mismo CFS
- `422`: Estado especificado no está activo
- `422`: No se puede eliminar modelo en uso

## Ejemplos de Uso

### Crear modelo de contribuyente
```bash
curl -X POST http://localhost:3000/modelo-contribuyente \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pyme Digital",
    "description": "Pequeña y mediana empresa que usa servicios digitales",
    "cfsId": 1,
    "statusModeloId": 1
  }'
```

### Obtener modelos por CFS
```bash
curl -X GET http://localhost:3000/modelo-contribuyente/by-cfs/1
```

### Cambiar estado del modelo
```bash
curl -X PATCH http://localhost:3000/modelo-contribuyente/1/change-status \
  -H "Content-Type: application/json" \
  -d '{
    "statusModeloId": 2
  }'
```

### Obtener modelos por estado
```bash
curl -X GET http://localhost:3000/modelo-contribuyente/by-status/2
```

## Estructura de Base de Datos

```sql
CREATE TABLE modelo_contribuyentes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  cfs_id INTEGER NOT NULL REFERENCES cfs_catalogos(id),
  status_modelo_id INTEGER NOT NULL REFERENCES status_modelo_catalogos(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(name, cfs_id) -- Nombre único por CFS
);
```

## Casos de Uso de Negocio

### 1. Segmentación por Servicio
```json
// Para CFS "Pagos Digitales"
{
  "name": "Cliente Retail",
  "description": "Cliente individual con pagos frecuentes"
}
{
  "name": "Cliente Corporate",
  "description": "Empresa con alto volumen de pagos"
}
```

### 2. Análisis de Riesgo
```json
// Para CFS "Bizum"
{
  "name": "Usuario Básico",
  "description": "Transferencias ocasionales, límites bajos"
}
{
  "name": "Usuario Avanzado", 
  "description": "Uso frecuente, límites altos"
}
```

### 3. Compliance y Regulación
```json
// Estados típicos para compliance
"En Validación KYC" -> "Aprobado Regulatorio" -> "Implementado"
```
