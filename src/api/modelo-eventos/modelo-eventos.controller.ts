import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  ParseFloatPipe
} from '@nestjs/common';
import { ModeloEventosService } from './modelo-eventos.service';
import { CreateModeloEventoDto } from './dto/create-modelo-evento.dto';
import { UpdateModeloEventoDto } from './dto/update-modelo-evento.dto';

@Controller('modelo-eventos')
export class ModeloEventosController {
  constructor(private readonly modeloEventosService: ModeloEventosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createModeloEventoDto: CreateModeloEventoDto) {
    return this.modeloEventosService.create(createModeloEventoDto);
  }

  @Get()
  findAll() {
    return this.modeloEventosService.findAll();
  }

  @Get('by-bu/:buId')
  findByBuId(@Param('buId', ParseIntPipe) buId: number) {
    return this.modeloEventosService.findByBuId(buId);
  }

  @Get('by-cfs/:cfsId')
  findByCfsId(@Param('cfsId', ParseIntPipe) cfsId: number) {
    return this.modeloEventosService.findByCfsId(cfsId);
  }

  @Get('by-version/:version')
  findByVersion(@Param('version', ParseFloatPipe) version: number) {
    return this.modeloEventosService.findByVersion(version);
  }

  @Get('by-status-modelo/:estatusModeloId')
  findByStatusModelo(@Param('estatusModeloId', ParseIntPipe) estatusModeloId: number) {
    return this.modeloEventosService.findByStatusModelo(estatusModeloId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.modeloEventosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateModeloEventoDto: UpdateModeloEventoDto
  ) {
    return this.modeloEventosService.update(id, updateModeloEventoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.modeloEventosService.remove(id);
  }
}
