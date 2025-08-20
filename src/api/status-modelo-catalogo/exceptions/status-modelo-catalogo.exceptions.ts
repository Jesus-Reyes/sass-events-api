import { HttpException, HttpStatus } from '@nestjs/common';

export class StatusModeloCatalogoNotFoundException extends HttpException {
  constructor(id: number) {
    super(`Status Modelo con ID ${id} no encontrado`, HttpStatus.NOT_FOUND);
  }
}

export class StatusModeloCatalogoAlreadyExistsException extends HttpException {
  constructor(name: string) {
    super(`Ya existe un Status Modelo con el nombre '${name}'`, HttpStatus.CONFLICT);
  }
}

export class DatabaseException extends HttpException {
  constructor(message: string = 'Error en la base de datos') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class InvalidDataException extends HttpException {
  constructor(message: string = 'Datos inválidos proporcionados') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
