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
import { PartnershipCatalogoService } from './partnership-catalogo.service';
import { CreatePartnershipDto } from './dto/create-partnership.dto';
import { UpdatePartnershipDto } from './dto/update-partnership.dto';

@Controller('partnership-catalogo')
export class PartnershipCatalogoController {
  constructor(private readonly partnershipCatalogoService: PartnershipCatalogoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPartnershipDto: CreatePartnershipDto) {
    return this.partnershipCatalogoService.create(createPartnershipDto);
  }

  @Get()
  findAll(@Query('active') active?: string, @Query('tipo') tipo?: string) {
    if (active === 'true') {
      return this.partnershipCatalogoService.findActive();
    }
    if (tipo) {
      return this.partnershipCatalogoService.findByType(tipo);
    }
    return this.partnershipCatalogoService.findAll();
  }

  @Get('active')
  findActive() {
    return this.partnershipCatalogoService.findActive();
  }

  @Get('by-type/:tipo')
  findByType(@Param('tipo') tipo: string) {
    return this.partnershipCatalogoService.findByType(tipo);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.partnershipCatalogoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePartnershipDto: UpdatePartnershipDto,
  ) {
    return this.partnershipCatalogoService.update(id, updatePartnershipDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.partnershipCatalogoService.remove(id);
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id', ParseIntPipe) id: number) {
    return this.partnershipCatalogoService.toggleActive(id);
  }
}
