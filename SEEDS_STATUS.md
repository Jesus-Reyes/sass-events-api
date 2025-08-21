# Seeds Status - SASS Eventos API

## Resumen de Seeds Implementados

### ✅ Módulos con Seeds Implementados

1. **geography-catalogo** 
   - ✅ Seed: `geography-seed.service.ts`
   - ✅ Registrado en módulo
   - Datos: 16 geografías (América del Norte, Sur, Europa, APAC, etc.)

2. **bu-catalogo** 
   - ✅ Seed: `bu-catalogo-seed.service.ts`
   - ✅ Registrado en módulo
   - Datos: 17 BU catálogos distribuidos por geografías (España, México, Argentina, etc.)

3. **cfs-catalogo** 
   - ✅ Seed: `cfs-catalogo-seed.service.ts`
   - ✅ Registrado en módulo
   - Datos: 18 CFS catálogos (Préstamos, Hipotecas, Tarjetas, PYME, etc.)

4. **disciplinas-catalogo** 
   - ✅ Seed: `disciplina-catalogo-seed.service.ts`
   - ✅ Registrado en módulo
   - Datos: 33 disciplinas (Riesgo de Crédito, Mercado, Operacional, etc.)

5. **status-modelo-catalogo** 
   - ✅ Seed: `status-modelo-catalogo-seed.service.ts`
   - ✅ Registrado en módulo
   - Datos: 31 estados del ciclo de vida del modelo

6. **modelo-contribuyente** 
   - ✅ Seed: `modelo-contribuyente-seed.service.ts`
   - ✅ Registrado en módulo
   - Datos: 8 modelos contribuyentes con diferentes estados y versiones

## Orden de Ejecución de Seeds

Los seeds se ejecutan automáticamente en el siguiente orden basado en las dependencias:

1. **geography-catalogo** (sin dependencias)
2. **bu-catalogo** (depende de geography)
3. **cfs-catalogo** (depende de bu-catalogo)
4. **disciplinas-catalogo** (sin dependencias directas)
5. **status-modelo-catalogo** (sin dependencias)
6. **modelo-contribuyente** (depende de cfs-catalogo y status-modelo-catalogo)

## Características de los Seeds

### Protección contra Duplicados
- Todos los seeds verifican si ya existen datos antes de insertar
- Si hay datos existentes, el seed se omite con un mensaje de log

### Validación de Dependencias
- Los seeds que requieren datos de otros módulos verifican la existencia de esos datos
- Si no existen las dependencias, el seed se omite con una advertencia

### Logging
- Cada seed registra el número de registros creados exitosamente
- Los errores se registran con detalles para debugging

### Datos Realistas
- Los datos sembrados son realistas y representativos del dominio bancario de BBVA
- Incluyen ejemplos de diferentes geografías, productos financieros y estados de modelo

## Ejecución

Los seeds se ejecutan automáticamente cuando la aplicación se inicia mediante el hook `OnModuleInit` de cada servicio de seed.

Para ejecutar la aplicación y poblar la base de datos:

```bash
npm run start:dev
```

Los logs mostrarán el progreso de cada seed:
```
[GeographySeedService] Se han creado 16 geografías exitosamente
[BuCatalogoSeedService] Se han creado 17 BU catálogos exitosamente
[CfsCatalogoSeedService] Se han creado 18 CFS catálogos exitosamente
[DisciplinaCatalogoSeedService] Se han creado 33 disciplinas catálogos exitosamente
[StatusModeloCatalogoSeedService] Se han creado 31 status modelo catálogos exitosamente
[ModeloContribuyenteSeedService] Se han creado 8 modelos contribuyentes exitosamente
```
