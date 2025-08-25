import { HttpException, HttpStatus } from '@nestjs/common';

export class IncidenciaNotFoundException extends HttpException {
  constructor(id: number | string) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: `Incidencia con ID ${id} no encontrada`,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class IncidenciaAlreadyExistsException extends HttpException {
  constructor(incidentId: string) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        error: 'Conflict',
        message: `La incidencia '${incidentId}' ya existe`,
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class BuCatalogoNotFoundException extends HttpException {
  constructor(id: number) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: `Business Unit con ID ${id} no encontrada`,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class CfsCatalogoNotFoundException extends HttpException {
  constructor(id: number) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: `CFS con ID ${id} no encontrado`,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class OperativaCatalogoNotFoundException extends HttpException {
  constructor(id: number) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: `Operativa con ID ${id} no encontrada`,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class DatabaseException extends HttpException {
  constructor(message?: string) {
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: message || 'Error interno del servidor',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
