import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { StatusMedicionService } from './status-medicion.service';
import { CreateStatusMedicionDto } from './dto/create-status-medicion.dto';
import { UpdateStatusMedicionDto } from './dto/update-status-medicion.dto';

@Controller('status-medicion')
export class StatusMedicionController {
  constructor(private readonly statusMedicionService: StatusMedicionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createStatusMedicionDto: CreateStatusMedicionDto) {
    return this.statusMedicionService.create(createStatusMedicionDto);
  }

  @Get()
  findAll() {
    return this.statusMedicionService.findAll();
  }

  @Get('active')
  findAllActive() {
    return this.statusMedicionService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.statusMedicionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateStatusMedicionDto: UpdateStatusMedicionDto) {
    return this.statusMedicionService.update(id, updateStatusMedicionDto);
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id', ParseIntPipe) id: number) {
    return this.statusMedicionService.toggleActive(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.statusMedicionService.remove(id);
  }
}
