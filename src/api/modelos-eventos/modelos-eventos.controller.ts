import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  ParseIntPipe
} from '@nestjs/common';
import { ModelosEventosService } from './modelos-eventos.service';

import { UpdateModeloEventoDto } from './dto/update-modelo-evento.dto';
import { ModeloEvento } from './entities/modelo-evento.entity';
import { TipoVentana } from './entities/ventana-tiempo.entity';

@Controller('modelos-eventos')
export class ModelosEventosController {
  constructor(private readonly modelosEventosService: ModelosEventosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ 
    transform: true, 
    whitelist: true, 
    forbidNonWhitelisted: true 
  }))
  async create(@Body() createModeloEventoDto: CreateModeloEventoDto): Promise<ModeloEvento> {
    return this.modelosEventosService.create(createModeloEventoDto);
  }

  @Get()
  async findAll(): Promise<ModeloEvento[]> {
    return this.modelosEventosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ModeloEvento> {
    return this.modelosEventosService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ 
    transform: true, 
    whitelist: true, 
    forbidNonWhitelisted: true,
    skipMissingProperties: true 
  }))
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateModeloEventoDto: UpdateModeloEventoDto
  ): Promise<ModeloEvento> {
    return this.modelosEventosService.update(id, updateModeloEventoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.modelosEventosService.remove(id);
  }

  // Endpoints adicionales para operaciones específicas

  @Get(':id/ventanas')
  async getVentanas(@Param('id', ParseIntPipe) id: number) {
    const modelo = await this.modelosEventosService.findOne(id);
    return {
      ventanaGeneral: modelo.ventanas.filter(v => v.tipo === TipoVentana.GENERAL),
      ventanaCritica: modelo.ventanas.filter(v => v.tipo === TipoVentana.CRITICA),
      ventanaNoCritica: modelo.ventanas.filter(v => v.tipo === TipoVentana.NO_CRITICA),
    };
  }

  @Get(':id/datos-medicion')
  async getDatosMedicion(@Param('id', ParseIntPipe) id: number) {
    const modelo = await this.modelosEventosService.findOne(id);
    return modelo.datosMedicion;
  }

  @Get(':id/fechas')
  async getFechas(@Param('id', ParseIntPipe) id: number) {
    const modelo = await this.modelosEventosService.findOne(id);
    return modelo.fechas;
  }

  @Get(':id/partnership')
  async getPartnership(@Param('id', ParseIntPipe) id: number) {
    const modelo = await this.modelosEventosService.findOne(id);
    return modelo.partnership;
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  async activate(@Param('id', ParseIntPipe) id: number): Promise<ModeloEvento> {
    return this.modelosEventosService.update(id, { activo: true });
  }

  @Post(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivate(@Param('id', ParseIntPipe) id: number): Promise<ModeloEvento> {
    return this.modelosEventosService.update(id, { activo: false });
  }
}
