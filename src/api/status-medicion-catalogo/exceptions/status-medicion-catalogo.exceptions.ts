import { HttpException, HttpStatus } from '@nestjs/common';

export class StatusMedicionNotFoundException extends HttpException {
  constructor(id: number) {
    super(`Status de Medición con ID ${id} no encontrado`, HttpStatus.NOT_FOUND);
  }
}

export class StatusMedicionAlreadyExistsException extends HttpException {
  constructor(name: string) {
    super(`Ya existe un Status de Medición con el nombre '${name}'`, HttpStatus.CONFLICT);
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
