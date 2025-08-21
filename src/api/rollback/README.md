# Módulo de Rollback

Este módulo proporciona endpoints para limpiar datos de las tablas del sistema, respetando las relaciones de foreign keys.

## Análisis de Relaciones entre Entidades

El sistema tiene las siguientes relaciones:

1. **Geography** → **BuCatalogo** (OneToMany)
2. **BuCatalogo** → **CfsCatalogo** (OneToMany) 
3. **CfsCatalogo** ↔ **DisciplinaCatalogo** (ManyToMany con tabla intermedia `disciplina_cfs`)
4. **CfsCatalogo** → **ModeloContribuyente** (OneToMany)
5. **StatusModeloCatalogo** → **ModeloContribuyente** (OneToMany)

## Orden de Eliminación (Rollback)

Para mantener la integridad referencial, el orden de eliminación es:

1. **ModeloContribuyente** (depende de CfsCatalogo y StatusModeloCatalogo)
2. **Tabla intermedia disciplina_cfs** (relación many-to-many)
3. **DisciplinaCatalogo**
4. **CfsCatalogo** (depende de BuCatalogo)
5. **BuCatalogo** (depende de Geography)
6. **StatusModeloCatalogo** (independiente)
7. **Geography** (base de la jerarquía)

## Endpoints Disponibles

### 1. Estadísticas de Tablas
```
GET /rollback/stats
```
Retorna el número de registros en cada tabla.

**Respuesta:**
```json
{
  "statusCode": 200,
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "modeloContribuyente": 10,
    "disciplinaCatalogo": 5,
    "cfsCatalogo": 8,
    "buCatalogo": 3,
    "statusModeloCatalogo": 4,
    "geography": 2,
    "disciplinaCfs": 12,
    "total": 44
  }
}
```

### 2. Rollback Completo
```
DELETE /rollback/full
```
Elimina todos los datos de todas las tablas en el orden correcto.

**Respuesta:**
```json
{
  "statusCode": 200,
  "message": "Rollback completo ejecutado exitosamente",
  "data": {
    "success": true,
    "message": "Rollback ejecutado exitosamente",
    "deletedRecords": {
      "modeloContribuyente": 10,
      "disciplinaCfs": 12,
      "disciplinaCatalogo": 5,
      "cfsCatalogo": 8,
      "buCatalogo": 3,
      "statusModeloCatalogo": 4,
      "geography": 2
    }
  }
}
```

### 3. Rollback Parcial
```
DELETE /rollback/partial/:tableName
```
Elimina datos de una tabla específica.

**Tablas disponibles:**
- `modelo-contribuyente`
- `disciplina-catalogo`
- `cfs-catalogo`
- `bu-catalogo`
- `status-modelo-catalogo`
- `geography`

**Ejemplo:**
```
DELETE /rollback/partial/modelo-contribuyente
```

**Respuesta:**
```json
{
  "statusCode": 200,
  "message": "Rollback parcial ejecutado exitosamente para modelo-contribuyente",
  "data": {
    "success": true,
    "message": "Rollback parcial ejecutado exitosamente para modelo-contribuyente",
    "deletedRecords": {
      "modeloContribuyente": 10,
      "disciplinaCfs": 0,
      "disciplinaCatalogo": 0,
      "cfsCatalogo": 0,
      "buCatalogo": 0,
      "statusModeloCatalogo": 0,
      "geography": 0
    }
  }
}
```

### 4. Health Check
```
GET /rollback/health
```
Verifica que el servicio está disponible y muestra los endpoints disponibles.

## Consideraciones de Seguridad

⚠️ **ADVERTENCIA**: Este módulo elimina datos permanentemente. 

- Use solo en entornos de desarrollo o testing
- Para producción, considere implementar:
  - Autenticación y autorización
  - Confirmación adicional
  - Backup automático antes del rollback
  - Logging detallado de auditoría

## Manejo de Transacciones

- Todas las operaciones se ejecutan dentro de transacciones
- Si ocurre un error, se hace rollback automático
- Los logs detallan cada paso del proceso

## Ejemplos de Uso

### Obtener estadísticas antes del rollback
```bash
curl -X GET http://localhost:3000/rollback/stats
```

### Ejecutar rollback completo
```bash
curl -X DELETE http://localhost:3000/rollback/full
```

### Ejecutar rollback parcial
```bash
curl -X DELETE http://localhost:3000/rollback/partial/modelo-contribuyente
```

### Verificar estado del servicio
```bash
curl -X GET http://localhost:3000/rollback/health
```
