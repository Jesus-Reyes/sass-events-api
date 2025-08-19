import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { BuCatalogoService } from './bu-catalogo.service';
import { CreateBuCatalogoDto } from './dto/create-bu-catalogo.dto';
import { UpdateBuCatalogoDto } from './dto/update-bu-catalogo.dto';

@Controller('bu-catalogo')
export class BuCatalogoController {
  constructor(private readonly buCatalogoService: BuCatalogoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBuCatalogoDto: CreateBuCatalogoDto) {
    return this.buCatalogoService.create(createBuCatalogoDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.buCatalogoService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.buCatalogoService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBuCatalogoDto: UpdateBuCatalogoDto) {
    return this.buCatalogoService.update(id, updateBuCatalogoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.buCatalogoService.remove(id);
  }
}
