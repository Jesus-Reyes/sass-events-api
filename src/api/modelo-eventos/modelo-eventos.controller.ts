import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ModeloEventosService } from './modelo-eventos.service';
import { CreateModeloEventoDto } from './dto/create-modelo-evento.dto';
import { UpdateModeloEventoDto } from './dto/update-modelo-evento.dto';

@Controller('modelo-eventos')
export class ModeloEventosController {
  constructor(private readonly modeloEventosService: ModeloEventosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createModeloEventoDto: CreateModeloEventoDto) {
    return this.modeloEventosService.create(createModeloEventoDto);
  }

  @Get()
  findAll() {
    return this.modeloEventosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.modeloEventosService.findOne(id);
  }

  @Get('bu/:buId')
  findByBuId(@Param('buId', ParseIntPipe) buId: number) {
    return this.modeloEventosService.findByBuId(buId);
  }

  @Get('cfs/:cfsId')
  findByCfsId(@Param('cfsId', ParseIntPipe) cfsId: number) {
    return this.modeloEventosService.findByCfsId(cfsId);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
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
