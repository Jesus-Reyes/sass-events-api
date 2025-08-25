import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ServiceOwnersCatalogoService } from './service-owners-catalogo.service';
import { CreateServiceOwnerDto } from './dto/create-service-owner.dto';
import { UpdateServiceOwnerDto } from './dto/update-service-owner.dto';

@Controller('service-owners-catalogo')
export class ServiceOwnersCatalogoController {
  constructor(private readonly serviceOwnersCatalogoService: ServiceOwnersCatalogoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createServiceOwnerDto: CreateServiceOwnerDto) {
    return this.serviceOwnersCatalogoService.create(createServiceOwnerDto);
  }

  @Get()
  findAll(@Query('active') active?: string, @Query('area') area?: string) {
    if (active === 'true') {
      return this.serviceOwnersCatalogoService.findActive();
    }
    if (area) {
      return this.serviceOwnersCatalogoService.findByArea(area);
    }
    return this.serviceOwnersCatalogoService.findAll();
  }

  @Get('active')
  findActive() {
    return this.serviceOwnersCatalogoService.findActive();
  }

  @Get('by-area/:area')
  findByArea(@Param('area') area: string) {
    return this.serviceOwnersCatalogoService.findByArea(area);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.serviceOwnersCatalogoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceOwnerDto: UpdateServiceOwnerDto,
  ) {
    return this.serviceOwnersCatalogoService.update(id, updateServiceOwnerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.serviceOwnersCatalogoService.remove(id);
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id', ParseIntPipe) id: number) {
    return this.serviceOwnersCatalogoService.toggleActive(id);
  }
}
