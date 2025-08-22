import { HttpException, HttpStatus } from '@nestjs/common';

export class StatusMedicionNotFoundException extends HttpException {
  constructor(id: number) {
    super(`Status Medición con ID ${id} no encontrado`, HttpStatus.NOT_FOUND);
  }
}

export class StatusMedicionAlreadyExistsException extends HttpException {
  constructor(nombre: string) {
    super(`Ya existe un Status Medición con el nombre '${nombre}'`, HttpStatus.CONFLICT);
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
