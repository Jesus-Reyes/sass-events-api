import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { CfsCatalogoService } from './cfs-catalogo.service';
import { CreateCfsCatalogoDto } from './dto/create-cfs-catalogo.dto';
import { UpdateCfsCatalogoDto } from './dto/update-cfs-catalogo.dto';

@Controller('cfs-catalogo')
export class CfsCatalogoController {
  constructor(private readonly cfsCatalogoService: CfsCatalogoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCfsCatalogoDto: CreateCfsCatalogoDto) {
    return this.cfsCatalogoService.create(createCfsCatalogoDto);
  }

  @Get()
  findAll() {
    return this.cfsCatalogoService.findAll();
  }

  @Get('by-bu/:buId')
  findByBuId(@Param('buId', ParseIntPipe) buId: number) {
    return this.cfsCatalogoService.findByBuId(buId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cfsCatalogoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCfsCatalogoDto: UpdateCfsCatalogoDto) {
    return this.cfsCatalogoService.update(id, updateCfsCatalogoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cfsCatalogoService.remove(id);
  }
}
