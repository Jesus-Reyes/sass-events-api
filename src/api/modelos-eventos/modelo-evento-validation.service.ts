import { Injectable } from '@nestjs/common';
import { VentanasDto, VentanaConfigDto, FechasDto, PartnershipDto, DiasSemanaDto } from './dto/create-modelo-evento.dto';

@Injectable()
export class ModeloEventoValidationService {

  /**
   * Valida que las ventanas críticas y no críticas cubran exactamente la ventana general
   */
  validateVentanas(ventanas: VentanasDto): void {
    const logicValidation = this.validateVentanasLogic(ventanas);
    const overlapValidation = this.validateNoOverlap([
      ...(ventanas.ventanaGeneral || []),
      ...(ventanas.ventanaCritica || []),
      ...(ventanas.ventanaNoCritica || [])
    ]);

    const allErrors = [...logicValidation.errors, ...overlapValidation.errors];
    
    if (allErrors.length > 0) {
      throw new Error(allErrors.join(', '));
    }
  }

  /**
   * Valida que las ventanas críticas y no críticas cubran exactamente la ventana general
   */
  validateVentanasLogic(ventanas: VentanasDto): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validar que existe al menos una ventana general
    if (!ventanas.ventanaGeneral || ventanas.ventanaGeneral.length === 0) {
      errors.push('Debe existir al menos una ventana general');
      return { isValid: false, errors };
    }

    for (const ventanaGeneral of ventanas.ventanaGeneral) {
      const coberturaCritica = this.calculateCobertura(ventanas.ventanaCritica || []);
      const coberturaNoCritica = this.calculateCobertura(ventanas.ventanaNoCritica || []);
      const coberturaGeneral = this.calculateCobertura([ventanaGeneral]);

      // Validar que crítica + no crítica = general
      if (!this.isCoberturaEqual(coberturaGeneral, this.mergeCoberturas(coberturaCritica, coberturaNoCritica))) {
        errors.push('Las ventanas críticas y no críticas deben cubrir exactamente la ventana general');
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Valida que no existan solapamientos en las ventanas del mismo tipo
   */
  validateNoOverlap(ventanas: VentanaConfigDto[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (let i = 0; i < ventanas.length; i++) {
      for (let j = i + 1; j < ventanas.length; j++) {
        if (this.hasTimeOverlap(ventanas[i], ventanas[j])) {
          errors.push(`Solapamiento detectado entre ventanas ${i + 1} y ${j + 1}`);
        }
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Valida fechas de manera consistente
   */
  validateFechasConsistency(fechas: FechasDto): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    const fechaAlta = new Date(fechas.fechaAlta);
    const fechaActivacion = new Date(fechas.fechaActivacion);
    const fechaInicioPeriodoGarantia = new Date(fechas.fechaInicioPeriodoGarantia);
    const fechaInicioOficial = new Date(fechas.fechaInicioOficial);
    const fechaInicioVersion = new Date(fechas.fechaInicioVersion);
    const fechaInactivacion = fechas.fechaInactivacion ? new Date(fechas.fechaInactivacion) : null;

    // Validar orden cronológico
    if (fechaActivacion < fechaAlta) {
      errors.push('La fecha de activación no puede ser anterior a la fecha de alta');
    }

    if (fechaInicioPeriodoGarantia < fechaActivacion) {
      errors.push('La fecha de inicio del período de garantía no puede ser anterior a la activación');
    }

    if (fechaInicioOficial < fechaInicioPeriodoGarantia) {
      errors.push('La fecha de inicio oficial no puede ser anterior al período de garantía');
    }

    if (fechaInactivacion && fechaInactivacion < fechaInicioOficial) {
      errors.push('La fecha de inactivación no puede ser anterior al inicio oficial');
    }

    if (fechaInicioVersion < fechaAlta) {
      errors.push('La fecha de inicio de versión no puede ser anterior a la fecha de alta');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Valida que las metas de partnership sean consistentes
   */
  validatePartnershipMetas(partnership: PartnershipDto): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (partnership.partnershipId) {
      // Si hay partnership, validar que las metas sean coherentes
      const { metaPartnershipMinimumSLA, metaPartnershipExpectedSLA, metaPartnershipStretchedSLA } = partnership;

      if (metaPartnershipMinimumSLA > metaPartnershipExpectedSLA) {
        errors.push('El SLA mínimo no puede ser mayor que el SLA esperado');
      }

      if (metaPartnershipExpectedSLA > metaPartnershipStretchedSLA) {
        errors.push('El SLA esperado no puede ser mayor que el SLA extendido');
      }

      if (metaPartnershipMinimumSLA === 0 && metaPartnershipExpectedSLA === 0 && metaPartnershipStretchedSLA === 0) {
        errors.push('Si hay partnership definido, al menos uno de los SLAs debe ser mayor a 0');
      }
    } else {
      // Si no hay partnership, las metas deberían ser 0
      const { metaPartnershipMinimumSLA, metaPartnershipExpectedSLA, metaPartnershipStretchedSLA } = partnership;
      
      if (metaPartnershipMinimumSLA > 0 || metaPartnershipExpectedSLA > 0 || metaPartnershipStretchedSLA > 0) {
        errors.push('Si el partnership es "NA", todos los SLAs deben ser 0');
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  // Métodos privados de utilidad

  private calculateCobertura(ventanas: VentanaConfigDto[]): CoberturaMap {
    const cobertura: CoberturaMap = {};
    
    for (const ventana of ventanas) {
      for (const [dia, activo] of Object.entries(ventana.diasSemana)) {
        if (activo && this.isValidDia(dia)) {
          if (!cobertura[dia]) {
            cobertura[dia] = [];
          }
          cobertura[dia].push({
            inicio: this.timeToMinutes(ventana.horaInicio),
            fin: this.timeToMinutes(ventana.horaFin)
          });
        }
      }
    }

    // Mergear intervalos solapados por día
    for (const dia in cobertura) {
      cobertura[dia] = this.mergeIntervals(cobertura[dia]);
    }

    return cobertura;
  }

  private mergeCoberturas(cobertura1: CoberturaMap, cobertura2: CoberturaMap): CoberturaMap {
    const merged: CoberturaMap = {};
    
    const allDays = new Set([...Object.keys(cobertura1), ...Object.keys(cobertura2)]);
    
    for (const dia of allDays) {
      const intervals1 = cobertura1[dia] || [];
      const intervals2 = cobertura2[dia] || [];
      merged[dia] = this.mergeIntervals([...intervals1, ...intervals2]);
    }

    return merged;
  }

  private isCoberturaEqual(cobertura1: CoberturaMap, cobertura2: CoberturaMap): boolean {
    const days1 = Object.keys(cobertura1).sort();
    const days2 = Object.keys(cobertura2).sort();

    if (days1.length !== days2.length || !days1.every((day, i) => day === days2[i])) {
      return false;
    }

    for (const dia of days1) {
      if (!this.areIntervalsEqual(cobertura1[dia], cobertura2[dia])) {
        return false;
      }
    }

    return true;
  }

  private hasTimeOverlap(ventana1: VentanaConfigDto, ventana2: VentanaConfigDto): boolean {
    // Verificar si hay días en común
    const diasComunes = this.getDiasComunes(ventana1.diasSemana, ventana2.diasSemana);
    
    if (diasComunes.length === 0) {
      return false;
    }

    // Verificar si hay solapamiento de horarios
    const inicio1 = this.timeToMinutes(ventana1.horaInicio);
    const fin1 = this.timeToMinutes(ventana1.horaFin);
    const inicio2 = this.timeToMinutes(ventana2.horaInicio);
    const fin2 = this.timeToMinutes(ventana2.horaFin);

    return !(fin1 <= inicio2 || fin2 <= inicio1);
  }

  private getDiasComunes(dias1: DiasSemanaDto, dias2: DiasSemanaDto): string[] {
    const comunes: string[] = [];
    
    const diasArray: (keyof DiasSemanaDto)[] = ['L', 'M', 'Mi', 'J', 'V', 'S', 'D'];
    for (const dia of diasArray) {
      if (dias1[dia] && dias2[dia]) {
        comunes.push(dia);
      }
    }

    return comunes;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private mergeIntervals(intervals: TimeInterval[]): TimeInterval[] {
    if (intervals.length === 0) return [];

    const sorted = intervals.sort((a, b) => a.inicio - b.inicio);
    const merged: TimeInterval[] = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const last = merged[merged.length - 1];

      if (current.inicio <= last.fin) {
        last.fin = Math.max(last.fin, current.fin);
      } else {
        merged.push(current);
      }
    }

    return merged;
  }

  private areIntervalsEqual(intervals1: TimeInterval[], intervals2: TimeInterval[]): boolean {
    if (intervals1.length !== intervals2.length) {
      return false;
    }

    for (let i = 0; i < intervals1.length; i++) {
      if (intervals1[i].inicio !== intervals2[i].inicio || intervals1[i].fin !== intervals2[i].fin) {
        return false;
      }
    }

    return true;
  }

  private isValidDia(dia: string): boolean {
    return ['L', 'M', 'Mi', 'J', 'V', 'S', 'D'].includes(dia);
  }
}

// Interfaces de utilidad
interface TimeInterval {
  inicio: number;
  fin: number;
}

interface CoberturaMap {
  [dia: string]: TimeInterval[];
}
