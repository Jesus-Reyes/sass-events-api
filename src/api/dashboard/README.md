# Dashboard API

API para la gestión de dashboards del sistema SASS.

## Descripción

Este módulo proporciona endpoints para gestionar los dashboards del sistema SASS. Los dashboards permiten configurar visualizaciones personalizadas que integran información de múltiples fuentes como Business Units, disciplinas, estados de modelo y elementos CFS, proporcionando una vista consolidada para diferentes perfiles de usuario.

## Endpoints

Base URL: `/dashboard`

### POST /dashboard
**Descripción**: Crear un nuevo dashboard

**Body:**
```json
{
  "nombreDashboard": "Dashboard Digital Banking Q1 2025",
  "idBU": 1,
  "ordenTablero": 1,
  "idDisciplina": 2,
  "ordenDisciplinas": [1, 2, 3],
  "clasificacionCriticidad": true,
  "idStatusModelo": 1,
  "idStatusMedicion": 2,
  "idItemsCfs": [1, 2, 3, 4],
  "ordenCfs": [1, 2, 3, 4],
  "perfil": ["admin", "viewer"],
  "fechaInicio": "2025-01-01",
  "fechaFin": "2025-03-31",
  "active": true
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 201,
  "data": {
    "id": 1,
    "nombreDashboard": "Dashboard Digital Banking Q1 2025",
    "idBU": 1,
    "ordenTablero": 1,
    "idDisciplina": 2,
    "ordenDisciplinas": [1, 2, 3],
    "clasificacionCriticidad": true,
    "idStatusModelo": 1,
    "idStatusMedicion": 2,
    "idItemsCfs": [1, 2, 3, 4],
    "ordenCfs": [1, 2, 3, 4],
    "perfil": ["admin", "viewer"],
    "fechaInicio": "2025-01-01",
    "fechaFin": "2025-03-31",
    "active": true,
    "createdAt": "2025-08-30T10:15:00.000Z",
    "updatedAt": "2025-08-30T10:15:00.000Z",
    "buCatalogo": {
      "id": 1,
      "name": "Digital Banking Spain",
      "geographyId": 1,
      "active": true
    },
    "disciplinaCatalogo": {
      "id": 2,
      "name": "Backend Development",
      "active": true
    },
    "statusModeloCatalogo": {
      "id": 1,
      "name": "En desarrollo",
      "active": true
    }
  },
  "message": "Dashboard creado exitosamente"
}
```

### GET /dashboard
**Descripción**: Obtener todos los dashboards con sus relaciones

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "nombreDashboard": "Dashboard Digital Banking Q1 2025",
      "idBU": 1,
      "ordenTablero": 1,
      "idDisciplina": 2,
      "ordenDisciplinas": [1, 2, 3],
      "clasificacionCriticidad": true,
      "idStatusModelo": 1,
      "idStatusMedicion": 2,
      "idItemsCfs": [1, 2, 3, 4],
      "ordenCfs": [1, 2, 3, 4],
      "perfil": ["admin", "viewer"],
      "fechaInicio": "2025-01-01",
      "fechaFin": "2025-03-31",
      "active": true,
      "createdAt": "2025-08-30T10:15:00.000Z",
      "updatedAt": "2025-08-30T10:15:00.000Z",
      "buCatalogo": {
        "id": 1,
        "name": "Digital Banking Spain",
        "geographyId": 1,
        "active": true
      },
      "disciplinaCatalogo": {
        "id": 2,
        "name": "Backend Development",
        "active": true
      },
      "statusModeloCatalogo": {
        "id": 1,
        "name": "En desarrollo",
        "active": true
      }
    }
  ],
  "message": "Dashboards obtenidos exitosamente"
}
```

### GET /dashboard/search/by-bu/:idBU
**Descripción**: Obtener dashboards filtrados por Business Unit

**Parámetros:**
- `idBU` (number): ID de la Business Unit

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "nombreDashboard": "Dashboard Digital Banking Q1 2025",
      "idBU": 1,
      "buCatalogo": {
        "id": 1,
        "name": "Digital Banking Spain",
        "geographyId": 1,
        "active": true
      },
      "ordenTablero": 1,
      "active": true,
      "createdAt": "2025-08-30T10:15:00.000Z",
      "updatedAt": "2025-08-30T10:15:00.000Z"
    }
  ],
  "message": "Dashboards de la BU Digital Banking Spain obtenidos exitosamente"
}
```

### GET /dashboard/search/by-disciplina/:idDisciplina
**Descripción**: Obtener dashboards filtrados por disciplina

**Parámetros:**
- `idDisciplina` (number): ID de la disciplina

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "nombreDashboard": "Dashboard Digital Banking Q1 2025",
      "idDisciplina": 2,
      "disciplinaCatalogo": {
        "id": 2,
        "name": "Backend Development",
        "active": true
      },
      "ordenTablero": 1,
      "active": true,
      "createdAt": "2025-08-30T10:15:00.000Z",
      "updatedAt": "2025-08-30T10:15:00.000Z"
    }
  ],
  "message": "Dashboards de la disciplina Backend Development obtenidos exitosamente"
}
```

### GET /dashboard/:id
**Descripción**: Obtener un dashboard específico por ID con todas sus relaciones

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "nombreDashboard": "Dashboard Digital Banking Q1 2025",
    "idBU": 1,
    "ordenTablero": 1,
    "idDisciplina": 2,
    "ordenDisciplinas": [1, 2, 3],
    "clasificacionCriticidad": true,
    "idStatusModelo": 1,
    "idStatusMedicion": 2,
    "idItemsCfs": [1, 2, 3, 4],
    "ordenCfs": [1, 2, 3, 4],
    "perfil": ["admin", "viewer"],
    "fechaInicio": "2025-01-01",
    "fechaFin": "2025-03-31",
    "active": true,
    "createdAt": "2025-08-30T10:15:00.000Z",
    "updatedAt": "2025-08-30T10:15:00.000Z",
    "buCatalogo": {
      "id": 1,
      "name": "Digital Banking Spain",
      "geographyId": 1,
      "active": true
    },
    "disciplinaCatalogo": {
      "id": 2,
      "name": "Backend Development",
      "active": true
    },
    "statusModeloCatalogo": {
      "id": 1,
      "name": "En desarrollo",
      "active": true
    }
  },
  "message": "Dashboard obtenido exitosamente"
}
```

### PATCH /dashboard/:id
**Descripción**: Actualizar un dashboard

**Body:**
```json
{
  "nombreDashboard": "Dashboard Digital Banking Q1 2025 - Actualizado",
  "ordenTablero": 2,
  "clasificacionCriticidad": false,
  "perfil": ["admin", "viewer", "analyst"],
  "fechaFin": "2025-04-30"
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "nombreDashboard": "Dashboard Digital Banking Q1 2025 - Actualizado",
    "idBU": 1,
    "ordenTablero": 2,
    "idDisciplina": 2,
    "ordenDisciplinas": [1, 2, 3],
    "clasificacionCriticidad": false,
    "idStatusModelo": 1,
    "idStatusMedicion": 2,
    "idItemsCfs": [1, 2, 3, 4],
    "ordenCfs": [1, 2, 3, 4],
    "perfil": ["admin", "viewer", "analyst"],
    "fechaInicio": "2025-01-01",
    "fechaFin": "2025-04-30",
    "active": true,
    "createdAt": "2025-08-30T10:15:00.000Z",
    "updatedAt": "2025-08-30T11:45:00.000Z"
  },
  "message": "Dashboard actualizado exitosamente"
}
```

### DELETE /dashboard/:id
**Descripción**: Eliminar un dashboard

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "message": "Dashboard eliminado exitosamente"
}
```

## Validaciones

- **nombreDashboard**: Requerido, mínimo 3 caracteres, máximo 200 caracteres
- **idBU**: Requerido, número positivo, debe existir en bu_catalogo
- **ordenTablero**: Requerido, número positivo
- **idDisciplina**: Requerido, número positivo, debe existir en disciplinas_catalogo
- **ordenDisciplinas**: Requerido, array de números, no puede estar vacío
- **clasificacionCriticidad**: Requerido, boolean
- **idStatusModelo**: Requerido, número positivo, debe existir en status_modelo_catalogo
- **idStatusMedicion**: Opcional, número positivo
- **idItemsCfs**: Requerido, array de números, no puede estar vacío
- **ordenCfs**: Requerido, array de números, no puede estar vacío
- **perfil**: Requerido, array de strings, no puede estar vacío
- **fechaInicio**: Requerido, formato de fecha (YYYY-MM-DD)
- **fechaFin**: Requerido, formato de fecha (YYYY-MM-DD)
- **active**: Opcional, por defecto `true`

## Estructura de Datos

```typescript
interface Dashboard {
  id: number;
  nombreDashboard: string;
  idBU: number;
  ordenTablero: number;
  idDisciplina: number;
  ordenDisciplinas: number[];
  clasificacionCriticidad: boolean;
  idStatusModelo: number;
  idStatusMedicion?: number;
  idItemsCfs: number[];
  ordenCfs: number[];
  perfil: string[];
  fechaInicio: string;
  fechaFin: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relaciones
  buCatalogo?: BuCatalogo;
  disciplinaCatalogo?: DisciplinaCatalogo;
  statusModeloCatalogo?: StatusModeloCatalogo;
}
```

## Relaciones

- **Pertenece a**: Una Business Unit (`BuCatalogo`)
- **Pertenece a**: Una disciplina principal (`DisciplinaCatalogo`)
- **Pertenece a**: Un estado de modelo (`StatusModeloCatalogo`)
- **Referencia**: Múltiples elementos CFS a través de `idItemsCfs`
- **Referencia**: Múltiples disciplinas ordenadas a través de `ordenDisciplinas`

## Casos de Uso

1. **Dashboards por BU**: Crear visualizaciones específicas para cada unidad de negocio
2. **Dashboards por disciplina**: Mostrar métricas específicas de una disciplina
3. **Dashboards temporales**: Configurar visualizaciones para periodos específicos
4. **Control de acceso**: Gestionar perfiles que pueden acceder al dashboard
5. **Ordenamiento personalizado**: Configurar orden de elementos y disciplinas
6. **Clasificación crítica**: Identificar dashboards críticos para el negocio

## Flujo de Trabajo Típico

1. **Prerequisitos**: Deben existir BU, disciplinas y status de modelo
2. **Crear dashboard**: Configurar nombre, periodo y elementos a mostrar
3. **Configurar acceso**: Definir perfiles que pueden ver el dashboard
4. **Ordenar elementos**: Establecer prioridades de visualización
5. **Activar/desactivar**: Gestionar disponibilidad según necesidades

## Códigos de Error Específicos

- `400`: Datos de entrada inválidos
- `404`: Dashboard, BU, disciplina o status modelo no encontrado
- `422`: Referencias inválidas o fechas inconsistentes

## Campos Especiales

### ordenDisciplinas vs idDisciplina
- **idDisciplina**: Disciplina principal del dashboard
- **ordenDisciplinas**: Array con el orden de visualización de múltiples disciplinas

### idItemsCfs vs ordenCfs
- **idItemsCfs**: IDs de los elementos CFS a incluir
- **ordenCfs**: Orden de visualización de los elementos CFS

### Perfiles de Usuario
Array de strings que define qué perfiles pueden acceder al dashboard:
- `"admin"`: Administradores del sistema
- `"viewer"`: Usuarios de solo lectura
- `"analyst"`: Analistas de datos
- `"manager"`: Gerentes y supervisores
- `"owner"`: Propietarios del dashboard

## Filtros de Búsqueda

### Por Business Unit
Útil para:
- Mostrar dashboards específicos de una BU
- Análisis organizacional por unidad
- Control de acceso por departamento

### Por Disciplina
Útil para:
- Dashboards técnicos específicos
- Análisis por área de expertise
- Métricas especializadas

## Ejemplos de Uso

### Crear Dashboard
```bash
curl -X POST http://localhost:3000/dashboard \
  -H "Content-Type: application/json" \
  -d '{
    "nombreDashboard": "Dashboard Digital Banking Q1 2025",
    "idBU": 1,
    "ordenTablero": 1,
    "idDisciplina": 2,
    "ordenDisciplinas": [1, 2, 3],
    "clasificacionCriticidad": true,
    "idStatusModelo": 1,
    "idStatusMedicion": 2,
    "idItemsCfs": [1, 2, 3, 4],
    "ordenCfs": [1, 2, 3, 4],
    "perfil": ["admin", "viewer"],
    "fechaInicio": "2025-01-01",
    "fechaFin": "2025-03-31",
    "active": true
  }'
```

### Obtener todos los Dashboards
```bash
curl -X GET http://localhost:3000/dashboard
```

### Obtener Dashboards por BU
```bash
curl -X GET http://localhost:3000/dashboard/search/by-bu/1
```

### Obtener Dashboards por Disciplina
```bash
curl -X GET http://localhost:3000/dashboard/search/by-disciplina/2
```

### Actualizar Dashboard
```bash
curl -X PATCH http://localhost:3000/dashboard/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombreDashboard": "Dashboard Actualizado",
    "clasificacionCriticidad": false,
    "perfil": ["admin", "viewer", "analyst"]
  }'
```

### Obtener Dashboard específico
```bash
curl -X GET http://localhost:3000/dashboard/1
```

## Configuración de Dashboards Típicos

### Dashboard Ejecutivo
```json
{
  "nombreDashboard": "Executive Overview Q1 2025",
  "clasificacionCriticidad": true,
  "perfil": ["admin", "manager"],
  "ordenTablero": 1
}
```

### Dashboard Técnico
```json
{
  "nombreDashboard": "Technical Metrics - Backend Services",
  "clasificacionCriticidad": false,
  "perfil": ["admin", "analyst", "owner"],
  "ordenTablero": 2
}
```

### Dashboard de Seguimiento
```json
{
  "nombreDashboard": "Project Tracking Dashboard",
  "clasificacionCriticidad": true,
  "perfil": ["admin", "manager", "owner"],
  "ordenTablero": 1
}
```

## Consideraciones de Performance

### Eager Loading
Las relaciones principales (BU, disciplina, status modelo) se cargan automáticamente para evitar N+1 queries.

### Índices Recomendados
- `idBU`: Para filtros por Business Unit
- `idDisciplina`: Para filtros por disciplina
- `active`: Para obtener solo dashboards activos
- `fechaInicio, fechaFin`: Para filtros temporales

### Paginación
Para grandes volúmenes de dashboards, considerar implementar paginación en endpoints de listado.

## Integración con Frontend

### Configuración de Visualización
Los arrays `ordenDisciplinas` y `ordenCfs` permiten al frontend:
- Mostrar elementos en orden específico
- Crear layouts personalizados
- Priorizar información importante

### Control de Acceso
El campo `perfil` permite implementar:
- Autenticación basada en roles
- Vistas específicas por tipo de usuario
- Restricciones de funcionalidad
