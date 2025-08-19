import { HttpException, HttpStatus } from '@nestjs/common';

export class CfsCatalogoNotFoundException extends HttpException {
  constructor(id: number) {
    super(`CFS con ID ${id} no encontrado`, HttpStatus.NOT_FOUND);
  }
}

export class BuCatalogoNotFoundException extends HttpException {
  constructor(id: number) {
    super(`Business Unit con ID ${id} no encontrado`, HttpStatus.NOT_FOUND);
  }
}

export class CfsCatalogoAlreadyExistsException extends HttpException {
  constructor(name: string) {
    super(`Ya existe un CFS con el nombre '${name}'`, HttpStatus.CONFLICT);
  }
}

export class DatabaseException extends HttpException {
  constructor(message: string = 'Error en la base de datos') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
