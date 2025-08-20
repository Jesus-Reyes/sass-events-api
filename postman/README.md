# Instalación y Configuración de Postman para SASS Eventos API

Esta guía te ayudará a configurar Postman para probar todos los endpoints de la API de SASS Eventos.

## Archivos incluidos

- `SASS-Eventos-API.postman_collection.json` - Colección principal con todos los endpoints
- `SASS-Eventos-API.postman_environment.json` - Variables de entorno para desarrollo

## Instalación

### 1. Importar la Colección

1. Abre Postman
2. Haz clic en **Import** (esquina superior izquierda)
3. Selecciona **Files** y elige el archivo `SASS-Eventos-API.postman_collection.json`
4. Haz clic en **Import**

### 2. Importar el Entorno

1. En Postman, haz clic en el icono de **gear** (⚙️) en la esquina superior derecha
2. Selecciona **Import**
3. Elige el archivo `SASS-Eventos-API.postman_environment.json`
4. Haz clic en **Import**

### 3. Activar el Entorno

1. En la esquina superior derecha, en el dropdown de entornos
2. Selecciona **SASS Eventos API - Development**

## Variables de Entorno Configuradas

| Variable | Valor por defecto | Descripción |
|----------|-------------------|-------------|
| `baseUrl` | `http://localhost:3000` | URL base del servidor |
| `geographyId` | `1` | ID de geografía de prueba |
| `buId` | `1` | ID de Business Unit de prueba |
| `cfsId` | `1` | ID de CFS de prueba |
| `disciplinaId` | `1` | ID de disciplina de prueba |
| `statusModeloId` | `1` | ID de status modelo de prueba |
| `modeloContribuyenteId` | `1` | ID de modelo contribuyente de prueba |

## Estructura de la Colección

### 📁 Geography Catalogo
- ✅ Crear Geografía
- 📋 Obtener todas las Geografías
- 🔍 Obtener Geografía por ID
- ✏️ Actualizar Geografía
- ❌ Eliminar Geografía

### 📁 BU Catalogo
- ✅ Crear Business Unit
- 📋 Obtener todos los Business Units
- 🔍 Obtener Business Unit por ID
- ✏️ Actualizar Business Unit
- ❌ Eliminar Business Unit

### 📁 CFS Catalogo
- ✅ Crear CFS
- 📋 Obtener todos los CFS
- 🔍 Obtener CFS por ID
- 🔎 Obtener CFS por BU (Filtro)
- ✏️ Actualizar CFS
- ❌ Eliminar CFS

### 📁 Disciplinas Catalogo
- ✅ Crear Disciplina
- 📋 Obtener todas las Disciplinas
- 🔍 Obtener Disciplina por ID
- ✏️ Actualizar Disciplina
- ❌ Eliminar Disciplina

### 📁 Status Modelo Catalogo
- ✅ Crear Status Modelo
- 📋 Obtener todos los Status
- 🌟 Obtener Status Activos
- 🔍 Obtener Status por ID
- ✏️ Actualizar Status Modelo
- 🔄 Toggle Estado Activo
- ❌ Eliminar Status Modelo

### 📁 Modelo Contribuyente
- ✅ Crear Modelo Contribuyente
- 📋 Obtener todos los Modelos
- 🔍 Obtener Modelo por ID
- 🔎 Obtener Modelos por CFS
- 🔎 Obtener Modelos por Status
- ✏️ Actualizar Modelo Contribuyente
- 🔄 Cambiar Status del Modelo
- ❌ Eliminar Modelo Contribuyente

### 📁 Flujos de Trabajo Completos
- **Flujo 1**: Crear CFS desde cero (Geografia → BU → CFS)
- **Flujo 2**: Crear Disciplina con CFS
- **Flujo 3**: Gestión de Modelos de Contribuyente

## Funcionalidades Incluidas

### ✨ Tests Automáticos
Cada request incluye tests automáticos que verifican:
- ✅ Códigos de estado exitosos (200, 201, 202, 204)
- ✅ Respuestas en formato JSON
- ✅ Estructura correcta de respuesta (status, message)

### 🔄 Scripts Pre-request
- ✅ Headers comunes configurados automáticamente
- ✅ Accept: application/json

### 📊 Variables Dinámicas
- ✅ Todas las variables son editables desde el entorno
- ✅ Fácil cambio entre desarrollo, testing y producción

## Uso Recomendado

### Para Desarrollo
1. Asegúrate de que el servidor esté corriendo en `http://localhost:3000`
2. Ejecuta los requests en el orden de los flujos de trabajo
3. Actualiza las variables con IDs reales después de crear entidades

### Para Testing
1. Ejecuta toda la colección usando **Collection Runner**
2. Revisa los tests automáticos en la pestaña **Test Results**
3. Usa los flujos completos para probar casos de uso reales

### Para Documentación
1. Cada request incluye descripción detallada
2. Los ejemplos de body muestran la estructura esperada
3. Las respuestas documentan el formato de salida

## Personalización

### Cambiar Entorno
Para usar en otro servidor:
1. Duplica el entorno
2. Cambia la variable `baseUrl` 
3. Selecciona el nuevo entorno

### Agregar Nuevos Endpoints
1. Añade requests a la carpeta correspondiente
2. Usa las variables existentes: `{{baseUrl}}`, `{{cfsId}}`, etc.
3. Incluye tests automáticos siguiendo el patrón existente

## Solución de Problemas

### Error de Conexión
- ✅ Verifica que el servidor esté corriendo
- ✅ Confirma que la URL base sea correcta
- ✅ Revisa que no haya proxies bloqueando la conexión

### Variables No Reconocidas
- ✅ Asegúrate de tener el entorno seleccionado
- ✅ Verifica que las variables estén definidas en el entorno
- ✅ Actualiza los IDs después de crear entidades

### Tests Fallando
- ✅ Revisa la respuesta del servidor en la pestaña **Body**
- ✅ Confirma que la estructura de respuesta sea la esperada
- ✅ Verifica que el servidor esté devolviendo JSON válido

## Comandos de Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run start:dev

# El servidor estará disponible en:
# http://localhost:3000
```

## Recursos Adicionales

- 📖 [Documentación principal](../README.md)
- 📖 [Geography Catalogo](../src/api/geography-catalogo/README.md)
- 📖 [BU Catalogo](../src/api/bu-catalogo/README.md)
- 📖 [CFS Catalogo](../src/api/cfs-catalogo/README.md)
- 📖 [Disciplinas Catalogo](../src/api/disciplinas-catalogo/README.md)
- 📖 [Status Modelo Catalogo](../src/api/status-modelo-catalogo/README.md)
- 📖 [Modelo Contribuyente](../src/api/modelo-contribuyente/README.md)
