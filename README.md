# SASS Eventos API

API para la gestión de catálogos de eventos SASS con soporte para geografías, business units y CFS.

## Descripción

Esta API proporciona endpoints para gestionar catálogos centralizados del sistema SASS. La API está modularizada en diferentes endpoints especializados:

- **[Geography Catalogo](./src/api/geography-catalogo/README.md)**: Catálogo de geografías
- **[BU Catalogo](./src/api/bu-catalogo/README.md)**: Catálogo de Business Units
- **[CFS Catalogo](./src/api/cfs-catalogo/README.md)**: Catálogo de CFS (Critical Financial Services)
- **[Disciplinas Catalogo](./src/api/disciplinas-catalogo/README.md)**: Catálogo de disciplinas que agrupan múltiples CFS
- **[Status Modelo Catalogo](./src/api/status-modelo-catalogo/README.md)**: Catálogo de estados para modelos del sistema
- **[Modelo Contribuyente](./src/api/modelo-contribuyente/README.md)**: Gestión de modelos de contribuyentes

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

## Colección de Postman

Para facilitar las pruebas de todos los endpoints, importa la colección de Postman disponible en: [`postman/SASS-Eventos-API.postman_collection.json`](./postman/SASS-Eventos-API.postman_collection.json)

## Arquitectura de la API

La API sigue una arquitectura modular donde cada catálogo está implementado como un módulo independiente con su propia documentación y casos de uso específicos.

### Estructura de Módulos

```
src/api/
├── geography-catalogo/     # Gestión de geografías
├── bu-catalogo/           # Gestión de Business Units
├── cfs-catalogo/          # Gestión de CFS
├── disciplinas-catalogo/  # Gestión de disciplinas
├── status-modelo-catalogo/ # Estados de modelos
└── modelo-contribuyente/  # Modelos de contribuyentes
```

## Enlaces Rápidos

- 🌍 [Documentación Geography Catalogo](./src/api/geography-catalogo/README.md)
- 🏢 [Documentación BU Catalogo](./src/api/bu-catalogo/README.md)
- 🔧 [Documentación CFS Catalogo](./src/api/cfs-catalogo/README.md)
- 📋 [Documentación Disciplinas Catalogo](./src/api/disciplinas-catalogo/README.md)
- ⚡ [Documentación Status Modelo](./src/api/status-modelo-catalogo/README.md)
- 👤 [Documentación Modelo Contribuyente](./src/api/modelo-contribuyente/README.md)

## Respuestas Estándar de la API

Todas las respuestas de la API siguen un formato consistente:

### Respuesta Exitosa
```json
{
  "status": 200,
  "data": { /* objeto o array de datos */ },
  "message": "Operación realizada exitosamente"
}
```

### Respuesta de Error
```json
{
  "message": "Descripción del error",
  "error": "Tipo de error",
  "statusCode": 400
}
```

## Códigos de Error Comunes

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
