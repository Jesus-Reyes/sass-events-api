import { HttpException, HttpStatus } from '@nestjs/common';

export class BuCatalogoNotFoundException extends HttpException {
  constructor(id: number) {
    super(`Business Unit con ID ${id} no encontrado`, HttpStatus.NOT_FOUND);
  }
}

export class GeographyNotFoundException extends HttpException {
  constructor(id: number) {
    super(`Geografía con ID ${id} no encontrada`, HttpStatus.NOT_FOUND);
  }
}

export class BuCatalogoAlreadyExistsException extends HttpException {
  constructor(name: string) {
    super(`Ya existe un Business Unit con el nombre '${name}'`, HttpStatus.CONFLICT);
  }
}

export class DatabaseException extends HttpException {
  constructor(message: string = 'Error en la base de datos') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
