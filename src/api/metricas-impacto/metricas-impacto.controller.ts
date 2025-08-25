import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { MetricaImpactoService } from './metricas-impacto.service';
import { CreateMetricaImpactoDto } from './dto/create-metrica-impacto.dto';
import { UpdateMetricaImpactoDto } from './dto/update-metrica-impacto.dto';

@Controller('metricas-impacto')
export class MetricaImpactoController {
  constructor(private readonly metricaImpactoService: MetricaImpactoService) {}

  @Post()
  create(@Body() createMetricaImpactoDto: CreateMetricaImpactoDto) {
    return this.metricaImpactoService.create(createMetricaImpactoDto);
  }

  @Get()
  findAll() {
    return this.metricaImpactoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.metricaImpactoService.findOne(id);
  }

  @Get('metrics/:metricsId')
  findByMetricsId(@Param('metricsId') metricsId: string) {
    return this.metricaImpactoService.findByMetricsId(metricsId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMetricaImpactoDto: UpdateMetricaImpactoDto) {
    return this.metricaImpactoService.update(id, updateMetricaImpactoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.metricaImpactoService.remove(id);
  }
}
