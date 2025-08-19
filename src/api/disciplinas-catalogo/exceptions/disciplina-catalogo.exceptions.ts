import { HttpException, HttpStatus } from '@nestjs/common';

export class DisciplinaCatalogoNotFoundException extends HttpException {
  constructor(id: number) {
    super(`Disciplina con ID ${id} no encontrada`, HttpStatus.NOT_FOUND);
  }
}

export class CfsCatalogoNotFoundException extends HttpException {
  constructor(ids: number[]) {
    super(`CFS con IDs ${ids.join(', ')} no encontrados`, HttpStatus.NOT_FOUND);
  }
}

export class DisciplinaCatalogoAlreadyExistsException extends HttpException {
  constructor(name: string) {
    super(`Ya existe una disciplina con el nombre '${name}'`, HttpStatus.CONFLICT);
  }
}

export class DatabaseException extends HttpException {
  constructor(message: string = 'Error en la base de datos') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class InvalidCfsIdsException extends HttpException {
  constructor(invalidIds: number[]) {
    super(`Los siguientes IDs de CFS no existen o están inactivos: ${invalidIds.join(', ')}`, HttpStatus.BAD_REQUEST);
  }
}
