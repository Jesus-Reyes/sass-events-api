import { HttpException, HttpStatus } from '@nestjs/common';

export class ModeloEventoNotFoundException extends HttpException {
  constructor(id: number) {
    super(`Modelo de Evento con ID ${id} no encontrado`, HttpStatus.NOT_FOUND);
  }
}

export class BuCatalogoNotFoundException extends HttpException {
  constructor(id: number) {
    super(`Business Unit con ID ${id} no encontrado o inactivo`, HttpStatus.BAD_REQUEST);
  }
}

export class CfsCatalogoNotFoundException extends HttpException {
  constructor(id: number) {
    super(`CFS con ID ${id} no encontrado o inactivo`, HttpStatus.BAD_REQUEST);
  }
}

export class ServiceOwnerNotFoundException extends HttpException {
  constructor(id: number) {
    super(`Service Owner con ID ${id} no encontrado o inactivo`, HttpStatus.BAD_REQUEST);
  }
}

export class StatusModeloNotFoundException extends HttpException {
  constructor(id: number) {
    super(`Status de Modelo con ID ${id} no encontrado o inactivo`, HttpStatus.BAD_REQUEST);
  }
}

export class StatusMedicionNotFoundException extends HttpException {
  constructor(id: number) {
    super(`Status de Medición con ID ${id} no encontrado o inactivo`, HttpStatus.BAD_REQUEST);
  }
}

export class PartnershipNotFoundException extends HttpException {
  constructor(id: number) {
    super(`Partnership con ID ${id} no encontrado o inactivo`, HttpStatus.BAD_REQUEST);
  }
}

export class InvalidDateRangeException extends HttpException {
  constructor(message: string) {
    super(`Rango de fechas inválido: ${message}`, HttpStatus.BAD_REQUEST);
  }
}

export class InvalidVentanasException extends HttpException {
  constructor(errors: string[]) {
    super(`Configuración de ventanas inválida: ${errors.join('; ')}`, HttpStatus.BAD_REQUEST);
  }
}

export class DatabaseException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'Error interno del servidor al procesar la operación',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
