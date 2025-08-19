# SASS Eventos API

API para la gestión de catálogos de eventos SASS con soporte para geografías, business units y CFS.

## Descripción

Esta API proporciona endpoints para gestionar:
- **Geography Catalogo**: Catálogo de geografías
- **BU Catalogo**: Catálogo de Business Units
- **CFS Catalogo**: Catálogo de CFS (Critical Financial Services)
- **Disciplinas Catalogo**: Catálogo de disciplinas que agrupan múltiples CFS

## Instalación

```bash
npm install
```

## Configuración de Base de Datos

Asegúrate de tener PostgreSQL configurado y actualiza las variables de entorno en `src/environments/environment.dev.ts`.

## Ejecutar la aplicación

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod
```

## Endpoints y Ejemplos de Postman

### 1. Geography Catalogo

#### GET /geography
**Descripción**: Obtener todas las geografías
```
GET http://localhost:3000/geography
```

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "España",
      "code": "ES",
      "active": true,
      "createdAt": "2025-08-19T10:00:00.000Z",
      "updatedAt": "2025-08-19T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "México",
      "code": "MX",
      "active": true,
      "createdAt": "2025-08-19T10:05:00.000Z",
      "updatedAt": "2025-08-19T10:05:00.000Z"
    }
  ],
  "message": "Geografías obtenidas exitosamente"
}
```

#### POST /geography
**Descripción**: Crear una nueva geografía
```
POST http://localhost:3000/geography
Content-Type: application/json

{
  "name": "Colombia",
  "code": "CO",
  "active": true
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 201,
  "data": {
    "id": 3,
    "name": "Colombia",
    "code": "CO",
    "active": true,
    "createdAt": "2025-08-19T10:30:00.000Z",
    "updatedAt": "2025-08-19T10:30:00.000Z"
  },
  "message": "Geografía creada exitosamente"
}
```

#### GET /geography/:id
**Descripción**: Obtener una geografía por ID
```
GET http://localhost:3000/geography/1
```

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "España",
    "code": "ES",
    "active": true,
    "createdAt": "2025-08-19T10:00:00.000Z",
    "updatedAt": "2025-08-19T10:00:00.000Z",
    "businessUnits": [
      {
        "id": 1,
        "name": "BBVA Digital España",
        "active": true
      },
      {
        "id": 2,
        "name": "BBVA Corporate España",
        "active": true
      }
    ]
  },
  "message": "Geografía obtenida exitosamente"
}
```

#### PATCH /geography/:id
**Descripción**: Actualizar una geografía
```
PATCH http://localhost:3000/geography/1
Content-Type: application/json

{
  "name": "España Updated",
  "active": true
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "España Updated",
    "code": "ES",
    "active": true,
    "createdAt": "2025-08-19T10:00:00.000Z",
    "updatedAt": "2025-08-19T11:30:00.000Z"
  },
  "message": "Geografía actualizada exitosamente"
}
```

#### DELETE /geography/:id
**Descripción**: Eliminar una geografía
```
DELETE http://localhost:3000/geography/1
```

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "message": "Geografía eliminada exitosamente"
}
```

### 2. BU Catalogo (Business Units)

#### POST /bu-catalogo
**Descripción**: Crear un nuevo Business Unit
```
POST http://localhost:3000/bu-catalogo
Content-Type: application/json

{
  "name": "Digital Banking Spain",
  "geographyId": 1,
  "active": true
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 201,
  "data": {
    "id": 1,
    "name": "Digital Banking Spain",
    "geographyId": 1,
    "active": true,
    "createdAt": "2025-08-19T10:15:00.000Z",
    "updatedAt": "2025-08-19T10:15:00.000Z"
  },
  "message": "Business Unit creado exitosamente"
}
```

#### GET /bu-catalogo
**Descripción**: Obtener todos los Business Units
```
GET http://localhost:3000/bu-catalogo
```

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "Digital Banking Spain",
      "geographyId": 1,
      "geography": {
        "id": 1,
        "name": "España",
        "code": "ES"
      },
      "active": true,
      "createdAt": "2025-08-19T10:15:00.000Z",
      "updatedAt": "2025-08-19T10:15:00.000Z"
    },
    {
      "id": 2,
      "name": "Corporate Banking Mexico",
      "geographyId": 2,
      "geography": {
        "id": 2,
        "name": "México",
        "code": "MX"
      },
      "active": true,
      "createdAt": "2025-08-19T10:20:00.000Z",
      "updatedAt": "2025-08-19T10:20:00.000Z"
    }
  ],
  "message": "Business Units obtenidos exitosamente"
}
```

#### GET /bu-catalogo/:id
**Descripción**: Obtener un Business Unit por ID
```
GET http://localhost:3000/bu-catalogo/1
```

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "Digital Banking Spain",
    "geographyId": 1,
    "geography": {
      "id": 1,
      "name": "España",
      "code": "ES"
    },
    "active": true,
    "createdAt": "2025-08-19T10:15:00.000Z",
    "updatedAt": "2025-08-19T10:15:00.000Z"
  },
  "message": "Business Unit obtenido exitosamente"
}
```

#### PATCH /bu-catalogo/:id
**Descripción**: Actualizar un Business Unit
```
PATCH http://localhost:3000/bu-catalogo/1
Content-Type: application/json

{
  "name": "Digital Banking Spain Updated",
  "active": true
}
```

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "Digital Banking Spain Updated",
    "geographyId": 1,
    "geography": {
      "id": 1,
      "name": "España",
      "code": "ES"
    },
    "active": true,
    "createdAt": "2025-08-19T10:15:00.000Z",
    "updatedAt": "2025-08-19T11:45:00.000Z"
  },
  "message": "Business Unit actualizado exitosamente"
}
```

#### DELETE /bu-catalogo/:id
**Descripción**: Eliminar un Business Unit
```
DELETE http://localhost:3000/bu-catalogo/1
```

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "message": "Business Unit eliminado exitosamente"
}
```

### 3. CFS Catalogo (Critical Financial Services)

#### POST /cfs-catalogo
**Descripción**: Crear un nuevo CFS
```
POST http://localhost:3000/cfs-catalogo
Content-Type: application/json

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

#### GET /cfs-catalogo
**Descripción**: Obtener todos los CFS
```
GET http://localhost:3000/cfs-catalogo
```

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
  "message": "CFS obtenidos exitosamente"
}
```

#### GET /cfs-catalogo/:id
**Descripción**: Obtener un CFS por ID
```
GET http://localhost:3000/cfs-catalogo/1
```

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

#### GET /cfs-catalogo/by-bu/:buId
**Descripción**: Obtener todos los CFS de una Business Unit específica (Filtro por BU)
```
GET http://localhost:3000/cfs-catalogo/by-bu/1
```

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

#### PATCH /cfs-catalogo/:id
**Descripción**: Actualizar un CFS
```
PATCH http://localhost:3000/cfs-catalogo/1
Content-Type: application/json

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

#### DELETE /cfs-catalogo/:id
**Descripción**: Eliminar un CFS
```
DELETE http://localhost:3000/cfs-catalogo/1
```

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "message": "CFS eliminado exitosamente"
}
```

### 4. Disciplinas Catalogo

#### POST /disciplinas-catalogo
**Descripción**: Crear una nueva disciplina con múltiples CFS asociados
```
POST http://localhost:3000/disciplinas-catalogo
Content-Type: application/json

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

#### GET /disciplinas-catalogo
**Descripción**: Obtener todas las disciplinas con sus CFS asociados
```
GET http://localhost:3000/disciplinas-catalogo
```

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

#### GET /disciplinas-catalogo/:id
**Descripción**: Obtener una disciplina por ID con todos sus CFS
```
GET http://localhost:3000/disciplinas-catalogo/1
```

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

#### PATCH /disciplinas-catalogo/:id
**Descripción**: Actualizar una disciplina (nombre y/o CFS asociados)
```
PATCH http://localhost:3000/disciplinas-catalogo/1
Content-Type: application/json

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

#### DELETE /disciplinas-catalogo/:id
**Descripción**: Eliminar una disciplina
```
DELETE http://localhost:3000/disciplinas-catalogo/1
```

**Respuesta Ejemplo:**
```json
{
  "status": 200,
  "message": "Disciplina eliminada exitosamente"
}
```

## Ejemplos de Flujo Completo

### Escenario 1: Crear CFS desde cero

1. **Crear Geography (si no existe)**
```
POST http://localhost:3000/geography-catalogo
Content-Type: application/json

{
  "name": "España",
  "code": "ES"
}
```

2. **Crear Business Unit**
```
POST http://localhost:3000/bu-catalogo
Content-Type: application/json

{
  "name": "BBVA Digital España",
  "geographyId": 1
}
```

3. **Crear CFS**
```
POST http://localhost:3000/cfs-catalogo
Content-Type: application/json

{
  "name": "Bizum",
  "campoN1": "Transferencias Instantáneas",
  "campoN2": "P2P",
  "buId": 1
}
```

### Escenario 2: Filtrar CFS por Business Unit

1. **Obtener todas las Business Units disponibles**
```
GET http://localhost:3000/bu-catalogo
```

2. **Seleccionar una BU y obtener sus CFS**
```
GET http://localhost:3000/cfs-catalogo/by-bu/1
```

### Escenario 3: Crear Disciplina con múltiples CFS

1. **Obtener todos los CFS disponibles**
```
GET http://localhost:3000/cfs-catalogo
```

2. **Crear disciplina con CFS seleccionados**
```
POST http://localhost:3000/disciplinas-catalogo
Content-Type: application/json

{
  "name": "Operational Risk",
  "cfsIds": [1, 2, 3]
}
```

3. **Verificar la disciplina creada con sus CFS**
```
GET http://localhost:3000/disciplinas-catalogo/1
```

## Respuestas de la API

### Respuesta Exitosa (Crear CFS)
```json
{
  "status": 201,
  "data": {
    "id": 1,
    "name": "Bizum",
    "campoN1": "Transferencias Instantáneas",
    "campoN2": "P2P",
    "buId": 1,
    "active": true,
    "createdAt": "2025-08-19T10:30:00.000Z",
    "updatedAt": "2025-08-19T10:30:00.000Z"
  },
  "message": "CFS creado exitosamente"
}
```

### Respuesta con Relaciones (GET CFS)
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "Bizum",
    "campoN1": "Transferencias Instantáneas",
    "campoN2": "P2P",
    "buId": 1,
    "buCatalogo": {
      "id": 1,
      "name": "BBVA Digital España",
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

### Respuesta de Error
```json
{
  "message": "Business Unit con ID 999 no encontrado",
  "error": "Not Found",
  "statusCode": 404
}
```

## Colección de Postman

Para facilitar las pruebas, puedes importar la siguiente colección JSON en Postman:

```json
{
  "info": {
    "name": "SASS Eventos API",
    "description": "Colección completa para probar todos los endpoints de la API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Geography Catalogo",
      "item": [
        {
          "name": "Crear Geografía",
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
              "raw": "{\n  \"name\": \"Colombia\",\n  \"code\": \"CO\",\n  \"active\": true\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/geography",
              "host": ["{{baseUrl}}"],
              "path": ["geography"]
            }
          }
        },
        {
          "name": "Obtener todas las Geografías",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/geography",
              "host": ["{{baseUrl}}"],
              "path": ["geography"]
            }
          }
        },
        {
          "name": "Obtener Geografía por ID",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/geography/{{geographyId}}",
              "host": ["{{baseUrl}}"],
              "path": ["geography", "{{geographyId}}"]
            }
          }
        },
        {
          "name": "Actualizar Geografía",
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
              "raw": "{\n  \"name\": \"España Updated\",\n  \"active\": true\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/geography/{{geographyId}}",
              "host": ["{{baseUrl}}"],
              "path": ["geography", "{{geographyId}}"]
            }
          }
        },
        {
          "name": "Eliminar Geografía",
          "request": {
            "method": "DELETE",
            "url": {
              "raw": "{{baseUrl}}/geography/{{geographyId}}",
              "host": ["{{baseUrl}}"],
              "path": ["geography", "{{geographyId}}"]
            }
          }
        }
      ]
    },
    {
      "name": "BU Catalogo",
      "item": [
        {
          "name": "Crear Business Unit",
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
              "raw": "{\n  \"name\": \"Digital Banking Spain\",\n  \"geographyId\": {{geographyId}},\n  \"active\": true\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/bu-catalogo",
              "host": ["{{baseUrl}}"],
              "path": ["bu-catalogo"]
            }
          }
        },
        {
          "name": "Obtener todos los Business Units",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/bu-catalogo",
              "host": ["{{baseUrl}}"],
              "path": ["bu-catalogo"]
            }
          }
        },
        {
          "name": "Obtener Business Unit por ID",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/bu-catalogo/{{buId}}",
              "host": ["{{baseUrl}}"],
              "path": ["bu-catalogo", "{{buId}}"]
            }
          }
        },
        {
          "name": "Actualizar Business Unit",
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
              "raw": "{\n  \"name\": \"Digital Banking Spain Updated\",\n  \"active\": true\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/bu-catalogo/{{buId}}",
              "host": ["{{baseUrl}}"],
              "path": ["bu-catalogo", "{{buId}}"]
            }
          }
        },
        {
          "name": "Eliminar Business Unit",
          "request": {
            "method": "DELETE",
            "url": {
              "raw": "{{baseUrl}}/bu-catalogo/{{buId}}",
              "host": ["{{baseUrl}}"],
              "path": ["bu-catalogo", "{{buId}}"]
            }
          }
        }
      ]
    },
    {
      "name": "CFS Catalogo",
      "item": [
        {
          "name": "Crear CFS",
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
              "raw": "{\n  \"name\": \"Bizum\",\n  \"campoN1\": \"Transferencias Instantáneas\",\n  \"campoN2\": \"P2P\",\n  \"buId\": {{buId}}\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/cfs-catalogo",
              "host": ["{{baseUrl}}"],
              "path": ["cfs-catalogo"]
            }
          }
        },
        {
          "name": "Obtener todos los CFS",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/cfs-catalogo",
              "host": ["{{baseUrl}}"],
              "path": ["cfs-catalogo"]
            }
          }
        },
        {
          "name": "Obtener CFS por ID",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/cfs-catalogo/{{cfsId}}",
              "host": ["{{baseUrl}}"],
              "path": ["cfs-catalogo", "{{cfsId}}"]
            }
          }
        },
        {
          "name": "Obtener CFS por BU (Filtro)",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/cfs-catalogo/by-bu/{{buId}}",
              "host": ["{{baseUrl}}"],
              "path": ["cfs-catalogo", "by-bu", "{{buId}}"]
            }
          }
        },
        {
          "name": "Actualizar CFS",
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
              "raw": "{\n  \"name\": \"Bizum Premium\",\n  \"campoN1\": \"Transferencias Instantáneas Premium\",\n  \"campoN2\": \"P2P Premium\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/cfs-catalogo/{{cfsId}}",
              "host": ["{{baseUrl}}"],
              "path": ["cfs-catalogo", "{{cfsId}}"]
            }
          }
        },
        {
          "name": "Eliminar CFS",
          "request": {
            "method": "DELETE",
            "url": {
              "raw": "{{baseUrl}}/cfs-catalogo/{{cfsId}}",
              "host": ["{{baseUrl}}"],
              "path": ["cfs-catalogo", "{{cfsId}}"]
            }
          }
        }
      ]
    },
    {
      "name": "Disciplinas Catalogo",
      "item": [
        {
          "name": "Crear Disciplina",
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
              "raw": "{\n  \"name\": \"Risk Management\",\n  \"cfsIds\": [1, 2, 3]\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/disciplinas-catalogo",
              "host": ["{{baseUrl}}"],
              "path": ["disciplinas-catalogo"]
            }
          }
        },
        {
          "name": "Obtener todas las Disciplinas",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/disciplinas-catalogo",
              "host": ["{{baseUrl}}"],
              "path": ["disciplinas-catalogo"]
            }
          }
        },
        {
          "name": "Obtener Disciplina por ID",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/disciplinas-catalogo/{{disciplinaId}}",
              "host": ["{{baseUrl}}"],
              "path": ["disciplinas-catalogo", "{{disciplinaId}}"]
            }
          }
        },
        {
          "name": "Actualizar Disciplina",
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
              "raw": "{\n  \"name\": \"Advanced Risk Management\",\n  \"cfsIds\": [1, 2, 3, 4]\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/disciplinas-catalogo/{{disciplinaId}}",
              "host": ["{{baseUrl}}"],
              "path": ["disciplinas-catalogo", "{{disciplinaId}}"]
            }
          }
        },
        {
          "name": "Eliminar Disciplina",
          "request": {
            "method": "DELETE",
            "url": {
              "raw": "{{baseUrl}}/disciplinas-catalogo/{{disciplinaId}}",
              "host": ["{{baseUrl}}"],
              "path": ["disciplinas-catalogo", "{{disciplinaId}}"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    }
  ]
}
```

## Variables de Entorno para Postman

Crea las siguientes variables en tu entorno de Postman:

- `baseUrl`: `http://localhost:3000`
- `geographyId`: `1` (ID de geografía existente)
- `buId`: `1` (ID de BU existente)
- `cfsId`: `1` (ID de CFS existente)
- `disciplinaId`: `1` (ID de disciplina existente)

## Validaciones

### Geography Catalogo
- **name**: Requerido, máximo 100 caracteres, único
- **code**: Requerido, máximo 10 caracteres, único (código de país/región)
- **active**: Opcional, por defecto `true`

### Business Unit
- **name**: Requerido, máximo 100 caracteres, único
- **geographyId**: Requerido, debe existir en la base de datos
- **active**: Opcional, por defecto `true`

### CFS Catalogo
- **name**: Requerido, máximo 100 caracteres, único
- **campoN1**: Requerido, máximo 100 caracteres
- **campoN2**: Requerido, máximo 100 caracteres
- **buId**: Requerido, debe ser un número positivo y existir en la base de datos
- **active**: Opcional, por defecto `true`

### Disciplinas Catalogo
- **name**: Requerido, máximo 100 caracteres, único
- **cfsIds**: Requerido, array de números positivos, mínimo 1 elemento, todos deben existir y estar activos en la base de datos
- **active**: Opcional, por defecto `true`

## Estructura de Base de Datos

### Tabla: cfs_catalogos
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

### Tabla: disciplinas_catalogos
```sql
CREATE TABLE disciplinas_catalogos (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla de relación: disciplina_cfs
```sql
CREATE TABLE disciplina_cfs (
  disciplina_id INTEGER NOT NULL REFERENCES disciplinas_catalogos(id) ON DELETE CASCADE,
  cfs_id INTEGER NOT NULL REFERENCES cfs_catalogos(id) ON DELETE CASCADE,
  PRIMARY KEY (disciplina_id, cfs_id)
);
```

## Casos de Uso del Filtro por BU

El endpoint `GET /cfs-catalogo/by-bu/:buId` permite implementar un selector tipo dropdown donde:

1. El usuario selecciona una Business Unit de una lista
2. La aplicación hace una llamada a este endpoint con el ID de la BU seleccionada
3. Se muestran únicamente los CFS que pertenecen a esa BU

Este patrón es ideal para interfaces de usuario que necesitan filtrado jerárquico.

## Códigos de Error

- `400`: Bad Request - Datos de entrada inválidos
- `404`: Not Found - Recurso no encontrado
- `409`: Conflict - Recurso ya existe (nombre duplicado)
- `500`: Internal Server Error - Error en la base de datos

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
