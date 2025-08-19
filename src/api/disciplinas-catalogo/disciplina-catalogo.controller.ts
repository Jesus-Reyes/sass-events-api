import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { DisciplinaCatalogoService } from './disciplina-catalogo.service';
import { CreateDisciplinaCatalogoDto } from './dto/create-disciplina-catalogo.dto';
import { UpdateDisciplinaCatalogoDto } from './dto/update-disciplina-catalogo.dto';

@Controller('disciplinas-catalogo')
export class DisciplinaCatalogoController {
  constructor(private readonly disciplinaCatalogoService: DisciplinaCatalogoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDisciplinaCatalogoDto: CreateDisciplinaCatalogoDto) {
    return this.disciplinaCatalogoService.create(createDisciplinaCatalogoDto);
  }

  @Get()
  findAll() {
    return this.disciplinaCatalogoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.disciplinaCatalogoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDisciplinaCatalogoDto: UpdateDisciplinaCatalogoDto) {
    return this.disciplinaCatalogoService.update(id, updateDisciplinaCatalogoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.disciplinaCatalogoService.remove(id);
  }
}
