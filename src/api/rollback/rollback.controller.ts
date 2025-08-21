import { Controller, Delete, Get, Param, HttpStatus, HttpCode, Logger } from '@nestjs/common';
import { RollbackService, RollbackResult, TablesStats } from './rollback.service';

@Controller('rollback')
export class RollbackController {
  private readonly logger = new Logger(RollbackController.name);

  constructor(private readonly rollbackService: RollbackService) {}

  /**
   * Obtiene estadísticas de todas las tablas
   * GET /rollback/stats
   */
  @Get('stats')
  async getStats(): Promise<{
    statusCode: number;
    message: string;
    data?: TablesStats;
    error?: string;
  }> {
    try {
      this.logger.log('Obteniendo estadísticas de tablas...');
      const stats = await this.rollbackService.getTablesStats();
      return {
        statusCode: HttpStatus.OK,
        message: 'Estadísticas obtenidas exitosamente',
        data: stats,
      };
    } catch (error) {
      this.logger.error('Error obteniendo estadísticas:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error obteniendo estadísticas',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Ejecuta un rollback completo de todas las tablas
   * DELETE /rollback/full
   */
  @Delete('full')
  @HttpCode(HttpStatus.OK)
  async executeFullRollback(): Promise<{
    statusCode: number;
    message: string;
    data?: RollbackResult;
    error?: string;
  }> {
    try {
      this.logger.log('Iniciando rollback completo...');
      const result = await this.rollbackService.executeFullRollback();
      
      if (result.success) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Rollback completo ejecutado exitosamente',
          data: result,
        };
      } else {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error durante el rollback completo',
          data: result,
        };
      }
    } catch (error) {
      this.logger.error('Error ejecutando rollback completo:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error interno durante el rollback completo',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Ejecuta un rollback parcial de una tabla específica
   * DELETE /rollback/partial/:tableName
   * 
   * Tablas disponibles:
   * - modelo-contribuyente
   * - disciplina-catalogo
   * - cfs-catalogo
   * - bu-catalogo
   * - status-modelo-catalogo
   * - geography
   */
  @Delete('partial/:tableName')
  @HttpCode(HttpStatus.OK)
  async executePartialRollback(
    @Param('tableName') tableName: string,
  ): Promise<{
    statusCode: number;
    message: string;
    data?: RollbackResult;
    error?: string;
  }> {
    try {
      this.logger.log(`Iniciando rollback parcial para tabla: ${tableName}`);
      
      const validTables = [
        'modelo-contribuyente',
        'modelo_contribuyentes',
        'disciplina-catalogo',
        'disciplinas_catalogos',
        'cfs-catalogo',
        'cfs_catalogos',
        'bu-catalogo',
        'bu_catalogos',
        'status-modelo-catalogo',
        'status_modelo_catalogos',
        'geography',
        'geographies'
      ];

      if (!validTables.includes(tableName.toLowerCase())) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Tabla no válida: ${tableName}. Tablas disponibles: ${validTables.filter(t => !t.includes('_')).join(', ')}`,
        };
      }

      const result = await this.rollbackService.executePartialRollback(tableName);
      
      if (result.success) {
        return {
          statusCode: HttpStatus.OK,
          message: `Rollback parcial ejecutado exitosamente para ${tableName}`,
          data: result,
        };
      } else {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Error durante el rollback parcial de ${tableName}`,
          data: result,
        };
      }
    } catch (error) {
      this.logger.error(`Error ejecutando rollback parcial para ${tableName}:`, error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error interno durante el rollback parcial de ${tableName}`,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Endpoint de confirmación para verificar que el servicio está disponible
   * GET /rollback/health
   */
  @Get('health')
  healthCheck() {
    return {
      statusCode: HttpStatus.OK,
      message: 'Servicio de rollback disponible',
      timestamp: new Date().toISOString(),
      availableEndpoints: {
        stats: 'GET /rollback/stats - Obtener estadísticas de tablas',
        fullRollback: 'DELETE /rollback/full - Ejecutar rollback completo',
        partialRollback: 'DELETE /rollback/partial/:tableName - Ejecutar rollback parcial',
        health: 'GET /rollback/health - Verificar estado del servicio'
      }
    };
  }
}
