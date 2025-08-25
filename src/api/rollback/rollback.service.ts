import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ModeloContribuyente } from '../modelo-contribuyente/entities/modelo-contribuyente.entity';
import { DisciplinaCatalogo } from '../disciplinas-catalogo/entities/disciplina-catalogo.entity';
import { CfsCatalogo } from '../cfs-catalogo/entities/cfs-catalogo.entity';
import { BuCatalogo } from '../bu-catalogo/entities/bu-catalogo.entity';
import { StatusModeloCatalogo } from '../status-modelo-catalogo/entities/status-modelo-catalogo.entity';
import { Geography } from '../geography-catalogo/entities/geography.entity';
import { Incidencia } from '../incidencias/entities/incidencia.entity';
import { OperativaCatalogo } from '../operativas-catalogo/entities/operativa-catalogo.entity';
import { MetricaImpacto } from '../metricas-impacto/entities/metrica-impacto.entity';

export interface RollbackResult {
  success: boolean;
  message: string;
  deletedRecords: {
    incidencias: number;
    modeloContribuyente: number;
    disciplinaCfs: number;
    disciplinaCatalogo: number;
    cfsCatalogo: number;
    buCatalogo: number;
    statusModeloCatalogo: number;
    operativaCatalogo: number;
    metricaImpacto: number;
    geography: number;
  };
  errors?: string[];
}

export interface TablesStats {
  incidencias: number;
  modeloContribuyente: number;
  disciplinaCatalogo: number;
  cfsCatalogo: number;
  buCatalogo: number;
  statusModeloCatalogo: number;
  operativaCatalogo: number;
  metricaImpacto: number;
  geography: number;
  disciplinaCfs: number;
  total: number;
}

@Injectable()
export class RollbackService {
  private readonly logger = new Logger(RollbackService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Ejecuta un rollback completo de todas las tablas
   * Elimina todos los datos respetando las relaciones de foreign keys
   */
  async executeFullRollback(): Promise<RollbackResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const result: RollbackResult = {
      success: false,
      message: '',
      deletedRecords: {
        incidencias: 0,
        modeloContribuyente: 0,
        disciplinaCfs: 0,
        disciplinaCatalogo: 0,
        cfsCatalogo: 0,
        buCatalogo: 0,
        statusModeloCatalogo: 0,
        operativaCatalogo: 0,
        metricaImpacto: 0,
        geography: 0,
      },
      errors: [],
    };

    try {
      this.logger.log('Iniciando rollback completo...');

      // 1. Eliminar Incidencias (depende de BuCatalogo, CfsCatalogo, OperativaCatalogo)
      const incidenciasCount = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(Incidencia)
        .execute();
      result.deletedRecords.incidencias = incidenciasCount.affected || 0;
      this.logger.log(`Eliminados ${result.deletedRecords.incidencias} registros de Incidencias`);

      // 2. Eliminar ModeloContribuyente (depende de CfsCatalogo y StatusModeloCatalogo)
      const modeloContribuyenteCount = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(ModeloContribuyente)
        .execute();
      result.deletedRecords.modeloContribuyente = modeloContribuyenteCount.affected || 0;
      this.logger.log(`Eliminados ${result.deletedRecords.modeloContribuyente} registros de ModeloContribuyente`);

      // 3. Eliminar relaciones many-to-many disciplina_cfs
      const disciplinaCfsCount = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from('disciplina_cfs')
        .execute();
      result.deletedRecords.disciplinaCfs = disciplinaCfsCount.affected || 0;
      this.logger.log(`Eliminados ${result.deletedRecords.disciplinaCfs} registros de disciplina_cfs`);

      // 4. Eliminar DisciplinaCatalogo
      const disciplinaCatalogoCount = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(DisciplinaCatalogo)
        .execute();
      result.deletedRecords.disciplinaCatalogo = disciplinaCatalogoCount.affected || 0;
      this.logger.log(`Eliminados ${result.deletedRecords.disciplinaCatalogo} registros de DisciplinaCatalogo`);

      // 5. Eliminar CfsCatalogo (depende de BuCatalogo)
      const cfsCatalogoCount = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(CfsCatalogo)
        .execute();
      result.deletedRecords.cfsCatalogo = cfsCatalogoCount.affected || 0;
      this.logger.log(`Eliminados ${result.deletedRecords.cfsCatalogo} registros de CfsCatalogo`);

      // 6. Eliminar BuCatalogo (depende de Geography)
      const buCatalogoCount = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(BuCatalogo)
        .execute();
      result.deletedRecords.buCatalogo = buCatalogoCount.affected || 0;
      this.logger.log(`Eliminados ${result.deletedRecords.buCatalogo} registros de BuCatalogo`);

      // 7. Eliminar StatusModeloCatalogo (independiente)
      const statusModeloCatalogoCount = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(StatusModeloCatalogo)
        .execute();
      result.deletedRecords.statusModeloCatalogo = statusModeloCatalogoCount.affected || 0;
      this.logger.log(`Eliminados ${result.deletedRecords.statusModeloCatalogo} registros de StatusModeloCatalogo`);

      // 8. Eliminar OperativaCatalogo (independiente)
      const operativaCatalogoCount = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(OperativaCatalogo)
        .execute();
      result.deletedRecords.operativaCatalogo = operativaCatalogoCount.affected || 0;
      this.logger.log(`Eliminados ${result.deletedRecords.operativaCatalogo} registros de OperativaCatalogo`);

      // 9. Eliminar MetricaImpacto (independiente)
      const metricaImpactoCount = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(MetricaImpacto)
        .execute();
      result.deletedRecords.metricaImpacto = metricaImpactoCount.affected || 0;
      this.logger.log(`Eliminados ${result.deletedRecords.metricaImpacto} registros de MetricaImpacto`);

      // 10. Eliminar Geography (base de la jerarquía)
      const geographyCount = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(Geography)
        .execute();
      result.deletedRecords.geography = geographyCount.affected || 0;
      this.logger.log(`Eliminados ${result.deletedRecords.geography} registros de Geography`);

      await queryRunner.commitTransaction();

      result.success = true;
      result.message = 'Rollback ejecutado exitosamente';
      
      const totalDeleted = Object.values(result.deletedRecords).reduce((sum, count) => sum + count, 0);
      this.logger.log(`Rollback completado. Total de registros eliminados: ${totalDeleted}`);

      return result;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error durante el rollback:', error);
      
      result.success = false;
      result.message = 'Error durante el rollback';
      result.errors = [error instanceof Error ? error.message : String(error)];
      return result;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Ejecuta un rollback parcial de una tabla específica
   * @param tableName Nombre de la tabla a limpiar
   */
  async executePartialRollback(tableName: string): Promise<RollbackResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const result: RollbackResult = {
      success: false,
      message: '',
      deletedRecords: {
        incidencias: 0,
        modeloContribuyente: 0,
        disciplinaCfs: 0,
        disciplinaCatalogo: 0,
        cfsCatalogo: 0,
        buCatalogo: 0,
        statusModeloCatalogo: 0,
        operativaCatalogo: 0,
        metricaImpacto: 0,
        geography: 0,
      },
      errors: [],
    };

    try {
      this.logger.log(`Iniciando rollback parcial para tabla: ${tableName}`);

      let entityClass: new () => any;
      let resultKey: keyof typeof result.deletedRecords;

      switch (tableName.toLowerCase()) {
        case 'incidencias':
          entityClass = Incidencia;
          resultKey = 'incidencias';
          break;
        case 'modelo-contribuyente':
        case 'modelo_contribuyentes':
          entityClass = ModeloContribuyente;
          resultKey = 'modeloContribuyente';
          break;
        case 'disciplina-catalogo':
        case 'disciplinas_catalogos':
          entityClass = DisciplinaCatalogo;
          resultKey = 'disciplinaCatalogo';
          break;
        case 'cfs-catalogo':
        case 'cfs_catalogos':
          entityClass = CfsCatalogo;
          resultKey = 'cfsCatalogo';
          break;
        case 'bu-catalogo':
        case 'bu_catalogos':
          entityClass = BuCatalogo;
          resultKey = 'buCatalogo';
          break;
        case 'status-modelo-catalogo':
        case 'status_modelo_catalogos':
          entityClass = StatusModeloCatalogo;
          resultKey = 'statusModeloCatalogo';
          break;
        case 'operativa-catalogo':
        case 'operativas_catalogos':
          entityClass = OperativaCatalogo;
          resultKey = 'operativaCatalogo';
          break;
        case 'metrica-impacto':
        case 'metricas_impacto':
          entityClass = MetricaImpacto;
          resultKey = 'metricaImpacto';
          break;
        case 'geography':
        case 'geographies':
          entityClass = Geography;
          resultKey = 'geography';
          break;
        default:
          throw new Error(`Tabla no reconocida: ${tableName}`);
      }

      const deleteResult = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(entityClass)
        .execute();

      result.deletedRecords[resultKey] = deleteResult.affected || 0;

      await queryRunner.commitTransaction();

      result.success = true;
      result.message = `Rollback parcial ejecutado exitosamente para ${tableName}`;
      
      this.logger.log(`Rollback parcial completado. Eliminados ${result.deletedRecords[resultKey]} registros de ${tableName}`);

      return result;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error durante el rollback parcial de ${tableName}:`, error);
      
      result.success = false;
      result.message = `Error durante la ejecución del rollback parcial de ${tableName}`;
      result.errors = [error instanceof Error ? error.message : String(error)];
      
      return result;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Obtiene estadísticas de registros en todas las tablas
   */
  async getTablesStats(): Promise<TablesStats> {
    try {
      const incidenciasCount = await this.dataSource.manager.count(Incidencia);
      const modeloContribuyenteCount = await this.dataSource.manager.count(ModeloContribuyente);
      const disciplinaCatalogoCount = await this.dataSource.manager.count(DisciplinaCatalogo);
      const cfsCatalogoCount = await this.dataSource.manager.count(CfsCatalogo);
      const buCatalogoCount = await this.dataSource.manager.count(BuCatalogo);
      const statusModeloCatalogoCount = await this.dataSource.manager.count(StatusModeloCatalogo);
      const operativaCatalogoCount = await this.dataSource.manager.count(OperativaCatalogo);
      const metricaImpactoCount = await this.dataSource.manager.count(MetricaImpacto);
      const geographyCount = await this.dataSource.manager.count(Geography);

      // Contar registros en tabla intermedia disciplina_cfs
      const disciplinaCfsResult: Array<{ count: string }> = await this.dataSource.manager.query(
        'SELECT COUNT(*) as count FROM disciplina_cfs'
      );

      const disciplinaCfsCount = disciplinaCfsResult[0]?.count ? parseInt(disciplinaCfsResult[0].count) : 0;

      return {
        incidencias: incidenciasCount,
        modeloContribuyente: modeloContribuyenteCount,
        disciplinaCatalogo: disciplinaCatalogoCount,
        cfsCatalogo: cfsCatalogoCount,
        buCatalogo: buCatalogoCount,
        statusModeloCatalogo: statusModeloCatalogoCount,
        operativaCatalogo: operativaCatalogoCount,
        metricaImpacto: metricaImpactoCount,
        geography: geographyCount,
        disciplinaCfs: disciplinaCfsCount,
        total: incidenciasCount + modeloContribuyenteCount + disciplinaCatalogoCount + cfsCatalogoCount + 
               buCatalogoCount + statusModeloCatalogoCount + operativaCatalogoCount + metricaImpactoCount + geographyCount + disciplinaCfsCount
      };

    } catch (error) {
      this.logger.error('Error obteniendo estadísticas de tablas:', error);
      throw error;
    }
  }
}
