import { HttpException, HttpStatus } from '@nestjs/common';

export class ModeloContribuyenteNotFoundException extends HttpException {
  constructor(id: number) {
    super(`Modelo contribuyente con ID ${id} no encontrado`, HttpStatus.NOT_FOUND);
  }
}

export class CfsCatalogoNotFoundException extends HttpException {
  constructor(id: number) {
    super(`CFS Catálogo con ID ${id} no encontrado`, HttpStatus.NOT_FOUND);
  }
}

export class StatusModeloCatalogoNotFoundException extends HttpException {
  constructor(id: number) {
    super(`Status Modelo Catálogo con ID ${id} no encontrado`, HttpStatus.NOT_FOUND);
  }
}

export class InvalidDateFormatException extends HttpException {
  constructor(field: string) {
    super(`Formato de fecha inválido para ${field}. Use YYYY-MM-DD`, HttpStatus.BAD_REQUEST);
  }
}

export class InvalidDateSequenceException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
