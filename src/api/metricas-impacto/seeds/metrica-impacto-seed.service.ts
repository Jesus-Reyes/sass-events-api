import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetricaImpacto, SeriesData, ActivityData } from '../entities/metrica-impacto.entity';

@Injectable()
export class MetricaImpactoSeedService {
  private readonly logger = new Logger(MetricaImpactoSeedService.name);

  constructor(
    @InjectRepository(MetricaImpacto)
    private readonly metricaImpactoRepository: Repository<MetricaImpacto>,
  ) {}

  async executeSeed() {
    await this.seedMetricasImpacto();
  }

  private async seedMetricasImpacto() {
    try {
      const count = await this.metricaImpactoRepository.count();
      
      if (count > 0) {
        this.logger.log('Las métricas de impacto ya están pobladas');
        return;
      }

      const metricas = [
        {
          metricsId: 'IMPACT_SERIES_001',
          fechaImpacto: '2025-07-17',
          series: this.generateSeriesData('2025-07-17', [
            '2025-06-19',
            '2025-05-08',
            '2025-04-15'
          ])
        },
        {
          metricsId: 'IMPACT_SERIES_002',
          fechaImpacto: '2025-07-31',
          series: this.generateSeriesData('2025-07-31', [
            '2025-06-30',
            '2025-05-31',
            '2025-04-30'
          ])
        },
        {
          metricsId: 'IMPACT_SERIES_003',
          fechaImpacto: '2025-08-15',
          series: this.generateSeriesData('2025-08-15', [
            '2025-07-15',
            '2025-06-15',
            '2025-05-15'
          ])
        }
      ];

      for (const metricaData of metricas) {
        const metrica = this.metricaImpactoRepository.create({
          ...metricaData,
          active: true
        });
        
        await this.metricaImpactoRepository.save(metrica);
      }

      this.logger.log(`Se crearon ${metricas.length} métricas de impacto`);

    } catch (error) {
      this.logger.error('Error al poblar métricas de impacto', error);
      throw error;
    }
  }

  private generateSeriesData(fechaImpacto: string, fechasComparacion: string[]): SeriesData[] {
    const series: SeriesData[] = [];

    // Generar serie de impacto
    series.push({
      fecha: fechaImpacto,
      tipo: 'impacto',
      data: this.generateHourlyData(true) // true = con pico de impacto
    });

    // Generar series de comparación
    fechasComparacion.forEach(fecha => {
      series.push({
        fecha: fecha,
        tipo: 'comparado',
        data: this.generateHourlyData(false) // false = actividad normal
      });
    });

    return series;
  }

  private generateHourlyData(conImpacto: boolean): ActivityData[] {
    const data: ActivityData[] = [];
    
    for (let hora = 0; hora < 24; hora++) {
      const horaStr = hora.toString().padStart(2, '0') + ':00';
      let actividad: number;

      if (conImpacto) {
        // Simular un pico de impacto entre las 8:00 y 12:00
        if (hora >= 8 && hora <= 12) {
          actividad = Math.floor(Math.random() * 3000) + 5000; // Pico alto
        } else if (hora >= 6 && hora <= 14) {
          actividad = Math.floor(Math.random() * 2000) + 2500; // Actividad elevada
        } else {
          actividad = Math.floor(Math.random() * 1000) + 500; // Actividad normal
        }
      } else {
        // Actividad normal con variaciones menores
        if (hora >= 8 && hora <= 18) {
          actividad = Math.floor(Math.random() * 1500) + 2000; // Horario laboral
        } else {
          actividad = Math.floor(Math.random() * 800) + 400; // Fuera de horario
        }
      }

      data.push({
        hora: horaStr,
        actividad: actividad
      });
    }

    return data;
  }
}
