import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { StatusModeloCatalogoService } from './status-modelo-catalogo.service';
import { CreateStatusModeloCatalogoDto } from './dto/create-status-modelo-catalogo.dto';
import { UpdateStatusModeloCatalogoDto } from './dto/update-status-modelo-catalogo.dto';

@Controller('status-modelo-catalogo')
export class StatusModeloCatalogoController {
  constructor(private readonly statusModeloCatalogoService: StatusModeloCatalogoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createStatusModeloCatalogoDto: CreateStatusModeloCatalogoDto) {
    return this.statusModeloCatalogoService.create(createStatusModeloCatalogoDto);
  }

  @Get()
  findAll() {
    return this.statusModeloCatalogoService.findAll();
  }

  @Get('active')
  findAllActive() {
    return this.statusModeloCatalogoService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.statusModeloCatalogoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateStatusModeloCatalogoDto: UpdateStatusModeloCatalogoDto) {
    return this.statusModeloCatalogoService.update(id, updateStatusModeloCatalogoDto);
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id', ParseIntPipe) id: number) {
    return this.statusModeloCatalogoService.toggleActive(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.statusModeloCatalogoService.remove(id);
  }
}
