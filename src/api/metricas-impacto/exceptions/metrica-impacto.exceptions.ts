import { HttpException, HttpStatus } from '@nestjs/common';

export class MetricaImpactoNotFoundException extends HttpException {
  constructor(id: number | string) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: `Métrica de impacto con ID ${id} no encontrada`,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class MetricaImpactoAlreadyExistsException extends HttpException {
  constructor(metricsId: string) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        error: 'Conflict',
        message: `La métrica de impacto '${metricsId}' ya existe`,
      },
      HttpStatus.CONFLICT,
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
