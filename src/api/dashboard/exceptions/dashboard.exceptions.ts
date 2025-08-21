import { HttpException, HttpStatus } from '@nestjs/common';

export class DashboardNotFoundException extends HttpException {
  constructor(id: number) {
    super(`Dashboard con ID ${id} no encontrado`, HttpStatus.NOT_FOUND);
  }
}

export class BuCatalogoNotFoundException extends HttpException {
  constructor(idBU: number) {
    super(`Business Unit con ID ${idBU} no encontrado o no activo`, HttpStatus.NOT_FOUND);
  }
}

export class DisciplinaCatalogoNotFoundException extends HttpException {
  constructor(idDisciplina: number) {
    super(`Disciplina con ID ${idDisciplina} no encontrada o no activa`, HttpStatus.NOT_FOUND);
  }
}

export class StatusModeloCatalogoNotFoundException extends HttpException {
  constructor(idStatusModelo: number) {
    super(`Status Modelo con ID ${idStatusModelo} no encontrado o no activo`, HttpStatus.NOT_FOUND);
  }
}

export class DashboardAlreadyExistsException extends HttpException {
  constructor(nombreDashboard: string) {
    super(`Ya existe un Dashboard con el nombre "${nombreDashboard}"`, HttpStatus.CONFLICT);
  }
}

export class InvalidDateRangeException extends HttpException {
  constructor(message: string = 'La fecha de fin debe ser mayor a la fecha de inicio') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class InvalidOrderException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class DatabaseException extends HttpException {
  constructor(message: string = 'Error interno del servidor') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
