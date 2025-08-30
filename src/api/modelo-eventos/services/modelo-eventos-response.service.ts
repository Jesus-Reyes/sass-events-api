import { ModeloEvento } from '../entities/modelo-evento.entity';

export interface ApiResponse<T> {
  status: number;
  data?: T;
  message: string;
}

export interface ModeloEventoResponseData {
  id: number;
  datosCFS: {
    buId: number;
    buNombre?: string;
    cfsId: number;
    cfsNombre?: string;
    serviceOwnerId: number;
    serviceOwnerNombre?: string;
  };
  datosMedicion: {
    estatusModeloId: number;
    estatusModeloNombre?: string;
    estatusMedicionId: number;
    estatusMedicionNombre?: string;
    modelo: string;
    fuente: string;
    metaDisponibilidad: number;
  };
  partnership: {
    partnershipId: number;
    partnershipNombre?: string;
    estatusMedicionPartnership: string;
    metaPartnershipExpectedSLA: number;
    metaPartnershipMinimumSLA: number;
    metaPartnershipStretchedSLA: number;
    definirFuncionalidadDependencia: string;
  };
  fechas: {
    fechaAlta: Date;
    fechaActivacion: Date;
    fechaInicioPeriodoGarantia: Date;
    fechaInicioOficial: Date;
    version: number;
    fechaInicioVersion: Date;
    fechaInactivacion?: Date | null;
  };
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ModeloEventosResponseService {
  /**
   * Transforma una entidad ModeloEvento en el formato de respuesta estándar
   */
  static transformToResponseData(modeloEvento: ModeloEvento): ModeloEventoResponseData {
    return {
      id: modeloEvento.id,
      datosCFS: {
        buId: modeloEvento.buId,
        buNombre: modeloEvento.buCatalogo?.name,
        cfsId: modeloEvento.cfsId,
        cfsNombre: modeloEvento.cfsCatalogo?.name,
        serviceOwnerId: modeloEvento.serviceOwnerId,
        serviceOwnerNombre: modeloEvento.serviceOwner?.name
      },
      datosMedicion: {
        estatusModeloId: modeloEvento.estatusModeloId,
        estatusModeloNombre: modeloEvento.estatusModelo?.name,
        estatusMedicionId: modeloEvento.estatusMedicionId,
        estatusMedicionNombre: modeloEvento.estatusMedicion?.name,
        modelo: modeloEvento.modelo,
        fuente: modeloEvento.fuente,
        metaDisponibilidad: modeloEvento.metaDisponibilidad
      },
      partnership: {
        partnershipId: modeloEvento.partnershipId,
        partnershipNombre: modeloEvento.partnership?.name,
        estatusMedicionPartnership: modeloEvento.estatusMedicionPartnership,
        metaPartnershipExpectedSLA: modeloEvento.metaPartnershipExpectedSLA,
        metaPartnershipMinimumSLA: modeloEvento.metaPartnershipMinimumSLA,
        metaPartnershipStretchedSLA: modeloEvento.metaPartnershipStretchedSLA,
        definirFuncionalidadDependencia: modeloEvento.definirFuncionalidadDependencia
      },
      fechas: {
        fechaAlta: modeloEvento.fechaAlta,
        fechaActivacion: modeloEvento.fechaActivacion,
        fechaInicioPeriodoGarantia: modeloEvento.fechaInicioPeriodoGarantia,
        fechaInicioOficial: modeloEvento.fechaInicioOficial,
        version: modeloEvento.version,
        fechaInicioVersion: modeloEvento.fechaInicioVersion,
        fechaInactivacion: modeloEvento.fechaInactivacion
      },
      active: modeloEvento.active,
      createdAt: modeloEvento.createdAt,
      updatedAt: modeloEvento.updatedAt
    };
  }

  /**
   * Crea una respuesta exitosa estándar
   */
  static createSuccessResponse<T>(
    data: T,
    message: string,
    status: number = 200
  ): ApiResponse<T> {
    return {
      status,
      data,
      message
    };
  }

  /**
   * Crea una respuesta exitosa para un solo modelo de evento
   */
  static createSingleModeloResponse(
    modeloEvento: ModeloEvento,
    message: string,
    status: number = 200
  ): ApiResponse<ModeloEventoResponseData> {
    return this.createSuccessResponse(
      this.transformToResponseData(modeloEvento),
      message,
      status
    );
  }

  /**
   * Crea una respuesta exitosa para múltiples modelos de evento
   */
  static createMultipleModelosResponse(
    modelosEventos: ModeloEvento[],
    message: string,
    status: number = 200
  ): ApiResponse<ModeloEventoResponseData[]> {
    const transformedData = modelosEventos.map(modelo => 
      this.transformToResponseData(modelo)
    );
    
    return this.createSuccessResponse(
      transformedData,
      message,
      status
    );
  }

  /**
   * Crea una respuesta para operaciones de eliminación (sin data)
   */
  static createDeleteResponse(message: string = 'Elemento eliminado exitosamente'): ApiResponse<void> {
    return {
      status: 200,
      message
    };
  }
}
