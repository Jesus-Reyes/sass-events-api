import { PartialType } from '@nestjs/mapped-types';
import { CreateModeloEventoDto } from './create-modelo-evento.dto';

export class UpdateModeloEventoDto extends PartialType(CreateModeloEventoDto) {
  // Lista de campos de fecha para transformación automática
  private static readonly DATE_FIELDS = [
    'fechaAlta',
    'fechaActivacion', 
    'fechaInicioPeriodoGarantia',
    'fechaInicioOficial',
    'fechaInicioVersion',
    'fechaInactivacion'
  ] as const;

  /**
   * Filtra propiedades undefined del DTO para evitar actualizaciones innecesarias
   * @param dto - DTO con posibles valores undefined
   * @returns Objeto con solo las propiedades definidas
   */
  static filterUndefined<T extends Record<string, any>>(dto: T): Record<string, any> {
    return Object.entries(dto).reduce((acc: Record<string, any>, [key, value]) => {
      if (value !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  /**
   * Convierte campos de fecha de string a Date objects
   * @param data - Datos que pueden contener fechas como strings
   * @returns Datos con fechas convertidas a Date objects
   */
  static transformDates<T extends Record<string, any>>(data: T): Record<string, any> {
    const transformed: Record<string, any> = { ...data };
    
    this.DATE_FIELDS.forEach(field => {
      if (transformed[field] && typeof transformed[field] === 'string') {
        transformed[field] = new Date(transformed[field]);
      }
    });

    return transformed;
  }

  /**
   * Procesa el DTO completo: filtra undefined y transforma fechas
   * @param dto - DTO a procesar
   * @returns Datos listos para actualización en base de datos
   */
  static processForUpdate<T extends Record<string, any>>(dto: T): Record<string, any> {
    const filtered = this.filterUndefined(dto);
    return this.transformDates(filtered);
  }
}
