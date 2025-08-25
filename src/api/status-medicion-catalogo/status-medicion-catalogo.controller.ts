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
} from '@nestjs/common';
import { StatusMedicionCatalogoService } from './status-medicion-catalogo.service';
import { CreateStatusMedicionDto } from './dto/create-status-medicion.dto';
import { UpdateStatusMedicionDto } from './dto/update-status-medicion.dto';

@Controller('status-medicion-catalogo')
export class StatusMedicionCatalogoController {
  constructor(private readonly statusMedicionCatalogoService: StatusMedicionCatalogoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createStatusMedicionDto: CreateStatusMedicionDto) {
    return this.statusMedicionCatalogoService.create(createStatusMedicionDto);
  }

  @Get()
  findAll() {
    return this.statusMedicionCatalogoService.findAll();
  }

  @Get('active')
  findAllActive() {
    return this.statusMedicionCatalogoService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.statusMedicionCatalogoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusMedicionDto: UpdateStatusMedicionDto,
  ) {
    return this.statusMedicionCatalogoService.update(id, updateStatusMedicionDto);
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id', ParseIntPipe) id: number) {
    return this.statusMedicionCatalogoService.toggleActive(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.statusMedicionCatalogoService.remove(id);
  }
}
