# Partnership Catalogo API

API para la gestión del catálogo de Partnerships del sistema SASS.

## Descripción

Este módulo proporciona endpoints para gestionar las asociaciones y partnerships que pueden existir en el sistema. Permite clasificar los diferentes tipos de colaboraciones (Interno, Externo, No Aplica) y mantener un catálogo centralizado de partnerships con sus respectivas descripciones.

## Endpoints

Base URL: `/partnership-catalogo`

### POST /partnership-catalogo
**Descripción**: Crear un nuevo Partnership

**Body:**
```json
{
  "name": "External Payment Provider",
  "description": "Proveedor externo de servicios de pago",
  "tipo": "Externo",
  "active": true
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 201,
  "data": {
    "id": 1,
    "name": "External Payment Provider",
    "description": "Proveedor externo de servicios de pago",
    "tipo": "Externo",
    "active": true,
    "createdAt": "2025-08-30T10:15:00.000Z",
    "updatedAt": "2025-08-30T10:15:00.000Z"
  },
  "message": "Partnership creado exitosamente"
}
```

### GET /partnership-catalogo
**Descripción**: Obtener todos los Partnerships

**Query Parameters:**
- `active` (string): "true" para obtener solo activos
- `tipo` (string): Filtrar por tipo específico

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "External Payment Provider",
      "description": "Proveedor externo de servicios de pago",
      "tipo": "Externo",
      "active": true,
      "createdAt": "2025-08-30T10:15:00.000Z",
      "updatedAt": "2025-08-30T10:15:00.000Z"
    },
    {
      "id": 2,
      "name": "Internal Data Service",
      "description": "Servicio interno de gestión de datos",
      "tipo": "Interno",
      "active": true,
      "createdAt": "2025-08-30T10:20:00.000Z",
      "updatedAt": "2025-08-30T10:20:00.000Z"
    },
    {
      "id": 3,
      "name": "NA",
      "description": "No aplica partnership",
      "tipo": "No Aplica",
      "active": true,
      "createdAt": "2025-08-30T10:25:00.000Z",
      "updatedAt": "2025-08-30T10:25:00.000Z"
    }
  ],
  "message": "Partnerships obtenidos exitosamente"
}
```

### GET /partnership-catalogo/active
**Descripción**: Obtener solo los Partnerships activos

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "External Payment Provider",
      "description": "Proveedor externo de servicios de pago",
      "tipo": "Externo",
      "active": true,
      "createdAt": "2025-08-30T10:15:00.000Z",
      "updatedAt": "2025-08-30T10:15:00.000Z"
    },
    {
      "id": 2,
      "name": "Internal Data Service",
      "description": "Servicio interno de gestión de datos",
      "tipo": "Interno",
      "active": true,
      "createdAt": "2025-08-30T10:20:00.000Z",
      "updatedAt": "2025-08-30T10:20:00.000Z"
    }
  ],
  "message": "Partnerships activos obtenidos exitosamente"
}
```

### GET /partnership-catalogo/by-type/:tipo
**Descripción**: Obtener Partnerships por tipo específico

**Parámetros:**
- `tipo` (string): Tipo de partnership ("Interno", "Externo", "No Aplica")

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "External Payment Provider",
      "description": "Proveedor externo de servicios de pago",
      "tipo": "Externo",
      "active": true,
      "createdAt": "2025-08-30T10:15:00.000Z",
      "updatedAt": "2025-08-30T10:15:00.000Z"
    }
  ],
  "message": "Partnerships de tipo Externo obtenidos exitosamente"
}
```

### GET /partnership-catalogo/:id
**Descripción**: Obtener un Partnership específico por ID

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "External Payment Provider",
    "description": "Proveedor externo de servicios de pago",
    "tipo": "Externo",
    "active": true,
    "createdAt": "2025-08-30T10:15:00.000Z",
    "updatedAt": "2025-08-30T10:15:00.000Z"
  },
  "message": "Partnership obtenido exitosamente"
}
```

### PATCH /partnership-catalogo/:id
**Descripción**: Actualizar un Partnership

**Body:**
```json
{
  "name": "Enhanced Payment Provider",
  "description": "Proveedor mejorado de servicios de pago con nuevas funcionalidades",
  "tipo": "Externo"
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "Enhanced Payment Provider",
    "description": "Proveedor mejorado de servicios de pago con nuevas funcionalidades",
    "tipo": "Externo",
    "active": true,
    "createdAt": "2025-08-30T10:15:00.000Z",
    "updatedAt": "2025-08-30T11:45:00.000Z"
  },
  "message": "Partnership actualizado exitosamente"
}
```

### PATCH /partnership-catalogo/:id/toggle-active
**Descripción**: Alternar el estado activo/inactivo del Partnership

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "Enhanced Payment Provider",
    "description": "Proveedor mejorado de servicios de pago con nuevas funcionalidades",
    "tipo": "Externo",
    "active": false,
    "createdAt": "2025-08-30T10:15:00.000Z",
    "updatedAt": "2025-08-30T12:00:00.000Z"
  },
  "message": "Estado del Partnership actualizado exitosamente"
}
```

### DELETE /partnership-catalogo/:id
**Descripción**: Eliminar un Partnership

**Respuesta:**
```
Status: 204 No Content
```

## Validaciones

- **name**: Requerido, máximo 100 caracteres, único
- **description**: Opcional, máximo 255 caracteres
- **tipo**: Requerido, máximo 50 caracteres
- **active**: Opcional, por defecto `true`

## Estructura de Datos

```typescript
interface Partnership {
  id: number;
  name: string;
  description?: string;
  tipo: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Tipos de Partnership

### Tipos Estándar
1. **"Interno"**: Partnerships con otros departamentos o áreas internas de BBVA
2. **"Externo"**: Partnerships con proveedores, vendors o entidades externas
3. **"No Aplica"**: Para casos donde no hay partnership involucrado

### Ejemplos por Tipo

#### Partnerships Internos
- "Área de Riesgos"
- "Departamento Legal"
- "Data Analytics Team"
- "Security Operations"
- "Compliance Department"

#### Partnerships Externos
- "Payment Service Providers"
- "Cloud Infrastructure Providers"
- "Third-party APIs"
- "External Data Providers"
- "Consulting Services"

#### No Aplica
- "NA" (registro por defecto)
- "Self-managed Service"
- "Direct Implementation"

## Relaciones

- **Usado por**: Modelos de eventos, servicios y componentes que requieren clasificación de partnerships

## Casos de Uso

1. **Clasificación de servicios**: Identificar si un servicio es interno o externo
2. **Gestión de dependencies**: Rastrear dependencias externas
3. **Compliance y auditoría**: Identificar partnerships para cumplimiento normativo
4. **Análisis de riesgos**: Evaluar riesgos asociados a partnerships externos
5. **Reporting**: Generar reportes por tipo de partnership

## Flujo de Trabajo Típico

1. **Crear tipos básicos**: Configurar tipos estándar (Interno, Externo, No Aplica)
2. **Registrar partnerships**: Agregar partnerships específicos con descripción
3. **Clasificar servicios**: Asignar partnerships a servicios y componentes
4. **Mantener catálogo**: Actualizar información según cambios organizacionales
5. **Gestionar estado**: Activar/desactivar según disponibilidad

## Códigos de Error Específicos

- `400`: Datos de entrada inválidos
- `404`: Partnership no encontrado
- `409`: Nombre de partnership ya existe
- `422`: No se puede eliminar partnership con servicios asociados

## Filtros Disponibles

### Por Estado Activo
```bash
# Solo Partnerships activos
GET /partnership-catalogo?active=true
# Equivale a:
GET /partnership-catalogo/active
```

### Por Tipo
```bash
# Filtrar por tipo específico
GET /partnership-catalogo?tipo=Externo
# Equivale a:
GET /partnership-catalogo/by-type/Externo
```

## Ejemplos de Uso

### Crear Partnership
```bash
curl -X POST http://localhost:3000/partnership-catalogo \
  -H "Content-Type: application/json" \
  -d '{
    "name": "External Payment Provider",
    "description": "Proveedor externo de servicios de pago",
    "tipo": "Externo",
    "active": true
  }'
```

### Obtener todos los Partnerships
```bash
curl -X GET http://localhost:3000/partnership-catalogo
```

### Obtener Partnerships activos
```bash
curl -X GET http://localhost:3000/partnership-catalogo/active
```

### Obtener Partnerships por tipo
```bash
curl -X GET http://localhost:3000/partnership-catalogo/by-type/Externo
```

### Actualizar Partnership
```bash
curl -X PATCH http://localhost:3000/partnership-catalogo/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Enhanced Payment Provider",
    "description": "Proveedor mejorado con nuevas funcionalidades"
  }'
```

### Alternar estado activo
```bash
curl -X PATCH http://localhost:3000/partnership-catalogo/1/toggle-active
```

### Obtener Partnership específico
```bash
curl -X GET http://localhost:3000/partnership-catalogo/1
```

## Configuración Inicial Recomendada

### Partnerships Básicos
```json
[
  {
    "name": "NA",
    "description": "No aplica partnership",
    "tipo": "No Aplica"
  },
  {
    "name": "Internal Services",
    "description": "Servicios internos de BBVA",
    "tipo": "Interno"
  },
  {
    "name": "External Providers",
    "description": "Proveedores externos genéricos",
    "tipo": "Externo"
  }
]
```

### Partnerships Específicos por Área
```json
[
  {
    "name": "AWS Cloud Services",
    "description": "Servicios de infraestructura en la nube",
    "tipo": "Externo"
  },
  {
    "name": "Data Analytics Team",
    "description": "Equipo interno de análisis de datos",
    "tipo": "Interno"
  },
  {
    "name": "Third-party Payment APIs",
    "description": "APIs externas para procesamiento de pagos",
    "tipo": "Externo"
  }
]
```

## Consideraciones de Seguridad

### Partnerships Externos
- Requieren mayor escrutinio de seguridad
- Deben cumplir con políticas de compliance
- Necesitan contratos y SLAs específicos
- Auditorías periódicas de seguridad

### Partnerships Internos
- Sujetos a políticas internas de BBVA
- Menor riesgo de compliance
- Control directo sobre disponibilidad
- Facilidad de escalación interna

## Integración con Governance

Este catálogo facilita:
- **Risk Assessment**: Identificación de riesgos por tipo de partnership
- **Compliance Reporting**: Clasificación para reportes regulatorios
- **Vendor Management**: Gestión centralizada de proveedores externos
- **Internal Coordination**: Mapeo de dependencies internas
