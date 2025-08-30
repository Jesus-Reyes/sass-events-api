# Service Owners Catalogo API

API para la gestión del catálogo de Service Owners del sistema SASS.

## Descripción

Este módulo proporciona endpoints para gestionar los responsables de servicios (Service Owners) del sistema. Permite mantener un catálogo centralizado de las personas responsables de diferentes servicios, incluyendo su información de contacto, área y cargo.

## Endpoints

Base URL: `/service-owners-catalogo`

### POST /service-owners-catalogo
**Descripción**: Crear un nuevo Service Owner

**Body:**
```json
{
  "name": "Juan Carlos Pérez",
  "email": "juan.perez@bbva.com",
  "area": "Digital Banking",
  "cargo": "Senior Software Engineer",
  "active": true
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 201,
  "data": {
    "id": 1,
    "name": "Juan Carlos Pérez",
    "email": "juan.perez@bbva.com",
    "area": "Digital Banking",
    "cargo": "Senior Software Engineer",
    "active": true,
    "createdAt": "2025-08-30T10:15:00.000Z",
    "updatedAt": "2025-08-30T10:15:00.000Z"
  },
  "message": "Service Owner creado exitosamente"
}
```

### GET /service-owners-catalogo
**Descripción**: Obtener todos los Service Owners

**Query Parameters:**
- `active` (string): "true" para obtener solo activos
- `area` (string): Filtrar por área específica

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "Juan Carlos Pérez",
      "email": "juan.perez@bbva.com",
      "area": "Digital Banking",
      "cargo": "Senior Software Engineer",
      "active": true,
      "createdAt": "2025-08-30T10:15:00.000Z",
      "updatedAt": "2025-08-30T10:15:00.000Z"
    },
    {
      "id": 2,
      "name": "María Fernanda García",
      "email": "maria.garcia@bbva.com",
      "area": "Data Analytics",
      "cargo": "Data Scientist",
      "active": true,
      "createdAt": "2025-08-30T10:20:00.000Z",
      "updatedAt": "2025-08-30T10:20:00.000Z"
    }
  ],
  "message": "Service Owners obtenidos exitosamente"
}
```

### GET /service-owners-catalogo/active
**Descripción**: Obtener solo los Service Owners activos

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "Juan Carlos Pérez",
      "email": "juan.perez@bbva.com",
      "area": "Digital Banking",
      "cargo": "Senior Software Engineer",
      "active": true,
      "createdAt": "2025-08-30T10:15:00.000Z",
      "updatedAt": "2025-08-30T10:15:00.000Z"
    }
  ],
  "message": "Service Owners activos obtenidos exitosamente"
}
```

### GET /service-owners-catalogo/by-area/:area
**Descripción**: Obtener Service Owners por área específica

**Parámetros:**
- `area` (string): Nombre del área a filtrar

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "Juan Carlos Pérez",
      "email": "juan.perez@bbva.com",
      "area": "Digital Banking",
      "cargo": "Senior Software Engineer",
      "active": true,
      "createdAt": "2025-08-30T10:15:00.000Z",
      "updatedAt": "2025-08-30T10:15:00.000Z"
    }
  ],
  "message": "Service Owners del área Digital Banking obtenidos exitosamente"
}
```

### GET /service-owners-catalogo/:id
**Descripción**: Obtener un Service Owner específico por ID

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "Juan Carlos Pérez",
    "email": "juan.perez@bbva.com",
    "area": "Digital Banking",
    "cargo": "Senior Software Engineer",
    "active": true,
    "createdAt": "2025-08-30T10:15:00.000Z",
    "updatedAt": "2025-08-30T10:15:00.000Z"
  },
  "message": "Service Owner obtenido exitosamente"
}
```

### PATCH /service-owners-catalogo/:id
**Descripción**: Actualizar un Service Owner

**Body:**
```json
{
  "name": "Juan Carlos Pérez López",
  "area": "Innovation Lab",
  "cargo": "Tech Lead"
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "Juan Carlos Pérez López",
    "email": "juan.perez@bbva.com",
    "area": "Innovation Lab",
    "cargo": "Tech Lead",
    "active": true,
    "createdAt": "2025-08-30T10:15:00.000Z",
    "updatedAt": "2025-08-30T11:45:00.000Z"
  },
  "message": "Service Owner actualizado exitosamente"
}
```

### PATCH /service-owners-catalogo/:id/toggle-active
**Descripción**: Alternar el estado activo/inactivo del Service Owner

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "Juan Carlos Pérez López",
    "email": "juan.perez@bbva.com",
    "area": "Innovation Lab",
    "cargo": "Tech Lead",
    "active": false,
    "createdAt": "2025-08-30T10:15:00.000Z",
    "updatedAt": "2025-08-30T12:00:00.000Z"
  },
  "message": "Estado del Service Owner actualizado exitosamente"
}
```

### DELETE /service-owners-catalogo/:id
**Descripción**: Eliminar un Service Owner

**Respuesta:**
```
Status: 204 No Content
```

## Validaciones

- **name**: Requerido, máximo 100 caracteres
- **email**: Requerido, formato de email válido, máximo 150 caracteres, único
- **area**: Opcional, máximo 100 caracteres
- **cargo**: Opcional, máximo 100 caracteres
- **active**: Opcional, por defecto `true`

## Estructura de Datos

```typescript
interface ServiceOwner {
  id: number;
  name: string;
  email: string;
  area?: string;
  cargo?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Relaciones

- **Usado por**: Modelos de eventos, dashboards y sistemas que requieren asignación de responsabilidades

## Casos de Uso

1. **Asignación de responsabilidades**: Asignar owners a servicios y componentes
2. **Filtrado por área**: Encontrar responsables de un área específica
3. **Contacto directo**: Obtener información de contacto para escalaciones
4. **Organización departamental**: Gestionar estructura organizacional
5. **Auditoría**: Rastrear cambios de responsabilidad

## Flujo de Trabajo Típico

1. **Registrar Service Owner**: Crear perfil con información de contacto
2. **Asignar área y cargo**: Clasificar según estructura organizacional
3. **Asignar a servicios**: Vincular con componentes del sistema
4. **Mantener actualizado**: Actualizar información cuando cambie de área/cargo
5. **Gestionar estado**: Activar/desactivar según disponibilidad

## Códigos de Error Específicos

- `400`: Datos de entrada inválidos
- `404`: Service Owner no encontrado
- `409`: Email ya existe en el sistema
- `422`: No se puede eliminar Service Owner con servicios asignados

## Filtros Disponibles

### Por Estado Activo
```bash
# Solo Service Owners activos
GET /service-owners-catalogo?active=true
# Equivale a:
GET /service-owners-catalogo/active
```

### Por Área
```bash
# Filtrar por área específica
GET /service-owners-catalogo?area=Digital Banking
# Equivale a:
GET /service-owners-catalogo/by-area/Digital Banking
```

## Ejemplos de Uso

### Crear Service Owner
```bash
curl -X POST http://localhost:3000/service-owners-catalogo \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Carlos Pérez",
    "email": "juan.perez@bbva.com",
    "area": "Digital Banking",
    "cargo": "Senior Software Engineer",
    "active": true
  }'
```

### Obtener todos los Service Owners
```bash
curl -X GET http://localhost:3000/service-owners-catalogo
```

### Obtener Service Owners activos
```bash
curl -X GET http://localhost:3000/service-owners-catalogo/active
```

### Obtener Service Owners por área
```bash
curl -X GET "http://localhost:3000/service-owners-catalogo/by-area/Digital Banking"
```

### Actualizar Service Owner
```bash
curl -X PATCH http://localhost:3000/service-owners-catalogo/1 \
  -H "Content-Type: application/json" \
  -d '{
    "area": "Innovation Lab",
    "cargo": "Tech Lead"
  }'
```

### Alternar estado activo
```bash
curl -X PATCH http://localhost:3000/service-owners-catalogo/1/toggle-active
```

### Obtener Service Owner específico
```bash
curl -X GET http://localhost:3000/service-owners-catalogo/1
```

## Áreas Típicas del Sistema

### Áreas de Tecnología
- "Digital Banking"
- "Data Analytics"
- "Innovation Lab" 
- "Platform Engineering"
- "Security & Compliance"
- "Mobile Development"
- "Backend Services"

### Áreas de Negocio
- "Risk Management"
- "Product Management"
- "Customer Experience"
- "Operations"
- "Business Intelligence"
- "Compliance"

## Cargos Típicos

### Tecnología
- "Senior Software Engineer"
- "Tech Lead"
- "Solution Architect"
- "DevOps Engineer"
- "Data Scientist"
- "Product Owner"

### Gestión
- "Engineering Manager"
- "Product Manager"
- "Business Analyst"
- "Project Manager"
- "Scrum Master"
