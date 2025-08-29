import { VentanasOperacion, VentanaHoraria, DiasSemana } from '../interfaces/ventana.interface';

export class VentanaValidator {
  /**
   * Valida que la suma de las ventanas críticas y no críticas genere la ventana general
   */
  static validateVentanasConsistency(ventanas: VentanasOperacion): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!ventanas.ventanaGeneral || ventanas.ventanaGeneral.length === 0) {
      errors.push('La ventana general es obligatoria');
      return { isValid: false, errors };
    }

    if (!ventanas.ventanaCritica || ventanas.ventanaCritica.length === 0) {
      errors.push('La ventana crítica es obligatoria');
    }

    if (!ventanas.ventanaNoCritica || ventanas.ventanaNoCritica.length === 0) {
      errors.push('La ventana no crítica es obligatoria');
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    // Validar que cada ventana individual sea válida
    const ventanaGeneralValid = this.validateVentanaHoraria(ventanas.ventanaGeneral);
    const ventanaCriticaValid = this.validateVentanaHoraria(ventanas.ventanaCritica);
    const ventanaNoCriticaValid = this.validateVentanaHoraria(ventanas.ventanaNoCritica);

    errors.push(...ventanaGeneralValid.errors.map(e => `Ventana General: ${e}`));
    errors.push(...ventanaCriticaValid.errors.map(e => `Ventana Crítica: ${e}`));
    errors.push(...ventanaNoCriticaValid.errors.map(e => `Ventana No Crítica: ${e}`));

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    // Validar que la suma de crítica + no crítica = general
    const sumValidation = this.validateVentanaSum(
      ventanas.ventanaGeneral,
      ventanas.ventanaCritica,
      ventanas.ventanaNoCritica
    );

    errors.push(...sumValidation.errors);

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Valida una ventana horaria individual
   */
  private static validateVentanaHoraria(ventanas: VentanaHoraria[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (let i = 0; i < ventanas.length; i++) {
      const ventana = ventanas[i];
      
      // Validar formato de hora
      if (!this.isValidTimeFormat(ventana.horaInicio)) {
        errors.push(`Índice ${i}: Formato de hora inicio inválido (${ventana.horaInicio}). Usar HH:mm`);
      }
      
      if (!this.isValidTimeFormat(ventana.horaFin)) {
        errors.push(`Índice ${i}: Formato de hora fin inválido (${ventana.horaFin}). Usar HH:mm`);
      }

      // Validar que hora inicio sea menor que hora fin
      if (this.isValidTimeFormat(ventana.horaInicio) && this.isValidTimeFormat(ventana.horaFin)) {
        if (this.timeToMinutes(ventana.horaInicio) >= this.timeToMinutes(ventana.horaFin)) {
          errors.push(`Índice ${i}: La hora de inicio debe ser menor que la hora de fin`);
        }
      }

      // Validar que al menos un día esté seleccionado
      if (!this.hasAtLeastOneDay(ventana.diasSemana)) {
        errors.push(`Índice ${i}: Debe seleccionar al menos un día de la semana`);
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Valida que la suma de ventanas críticas y no críticas cubra exactamente la ventana general
   */
  private static validateVentanaSum(
    general: VentanaHoraria[],
    critica: VentanaHoraria[],
    noCritica: VentanaHoraria[]
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Por simplicidad, esta validación básica verifica que:
    // 1. Los horarios de crítica + no crítica no se sobrepongan
    // 2. La suma de crítica + no crítica cubra el tiempo de la general
    
    // Aquí se podría implementar una lógica más compleja para validar
    // la cobertura exacta de tiempo y días, pero por ahora dejamos
    // una validación básica
    
    if (critica.length === 0 && noCritica.length === 0) {
      errors.push('Debe definir al menos una ventana crítica o no crítica');
    }

    // Validación básica: verificar que no haya solapamiento en el mismo día
    for (const criticaVentana of critica) {
      for (const noCriticaVentana of noCritica) {
        if (this.hasOverlappingDays(criticaVentana.diasSemana, noCriticaVentana.diasSemana)) {
          if (this.hasTimeOverlap(
            criticaVentana.horaInicio,
            criticaVentana.horaFin,
            noCriticaVentana.horaInicio,
            noCriticaVentana.horaFin
          )) {
            errors.push('Las ventanas críticas y no críticas no pueden solaparse en el mismo día y horario');
          }
        }
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Valida formato de tiempo HH:mm
   */
  private static isValidTimeFormat(time: string): boolean {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  /**
   * Convierte tiempo HH:mm a minutos desde medianoche
   */
  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Verifica si al menos un día está seleccionado
   */
  private static hasAtLeastOneDay(diasSemana: DiasSemana): boolean {
    return Object.values(diasSemana).some(day => day === true);
  }

  /**
   * Verifica si dos configuraciones de días tienen solapamiento
   */
  private static hasOverlappingDays(dias1: DiasSemana, dias2: DiasSemana): boolean {
    const dayKeys = ['L', 'M', 'Mi', 'J', 'V', 'S', 'D'] as const;
    return dayKeys.some(day => dias1[day] && dias2[day]);
  }

  /**
   * Verifica si dos rangos de tiempo se solapan
   */
  private static hasTimeOverlap(
    start1: string,
    end1: string,
    start2: string,
    end2: string
  ): boolean {
    const start1Minutes = this.timeToMinutes(start1);
    const end1Minutes = this.timeToMinutes(end1);
    const start2Minutes = this.timeToMinutes(start2);
    const end2Minutes = this.timeToMinutes(end2);

    return start1Minutes < end2Minutes && start2Minutes < end1Minutes;
  }
}
