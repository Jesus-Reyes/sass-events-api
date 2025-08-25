import { HttpException, HttpStatus } from '@nestjs/common';

export class ModeloEventoNotFoundException extends HttpException {
  constructor(id: number | string) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: `Modelo de evento con ID ${id} no encontrado`,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class ModeloEventoAlreadyExistsException extends HttpException {
  constructor(nombre: string) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        error: 'Conflict',
        message: `El modelo de evento '${nombre}' ya existe`,
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class VentanaValidationException extends HttpException {
  constructor(message: string) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Validation Error',
        message: `Error de validación en ventanas: ${message}`,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class CatalogoReferenceException extends HttpException {
  constructor(tipo: string, valor: string) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Reference Error',
        message: `Referencia inválida en catálogo ${tipo}: ${valor} no existe`,
      },
      HttpStatus.BAD_REQUEST,
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
