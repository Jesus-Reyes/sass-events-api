import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { OperativaCatalogoService } from './operativas-catalogo.service';
import { CreateOperativaCatalogoDto } from './dto/create-operativa-catalogo.dto';
import { UpdateOperativaCatalogoDto } from './dto/update-operativa-catalogo.dto';

@Controller('operativas-catalogo')
export class OperativaCatalogoController {
  constructor(private readonly operativaCatalogoService: OperativaCatalogoService) {}

  @Post()
  create(@Body() createOperativaCatalogoDto: CreateOperativaCatalogoDto) {
    return this.operativaCatalogoService.create(createOperativaCatalogoDto);
  }

  @Get()
  findAll() {
    return this.operativaCatalogoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.operativaCatalogoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateOperativaCatalogoDto: UpdateOperativaCatalogoDto) {
    return this.operativaCatalogoService.update(id, updateOperativaCatalogoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.operativaCatalogoService.remove(id);
  }
}
