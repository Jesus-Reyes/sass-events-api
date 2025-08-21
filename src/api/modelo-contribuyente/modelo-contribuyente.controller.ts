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
  Query
} from '@nestjs/common';
import { ModeloContribuyenteService } from './modelo-contribuyente.service';
import { CreateModeloContribuyenteDto } from './dto/create-modelo-contribuyente.dto';
import { UpdateModeloContribuyenteDto } from './dto/update-modelo-contribuyente.dto';

@Controller('modelo-contribuyente')
export class ModeloContribuyenteController {
  constructor(private readonly modeloContribuyenteService: ModeloContribuyenteService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createModeloContribuyenteDto: CreateModeloContribuyenteDto) {
    return this.modeloContribuyenteService.create(createModeloContribuyenteDto);
  }

  @Get()
  findAll() {
    return this.modeloContribuyenteService.findAll();
  }

  @Get('by-version')
  findByVersion(@Query('version') version: string) {
    return this.modeloContribuyenteService.findByVersion(version);
  }

  @Get('by-cfs/:idCFS')
  findByCfsId(@Param('idCFS', ParseIntPipe) idCFS: number) {
    return this.modeloContribuyenteService.findByCfsId(idCFS);
  }

  @Get('by-status/:idStatusModelo')
  findByStatusModeloId(@Param('idStatusModelo', ParseIntPipe) idStatusModelo: number) {
    return this.modeloContribuyenteService.findByStatusModeloId(idStatusModelo);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.modeloContribuyenteService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateModeloContribuyenteDto: UpdateModeloContribuyenteDto
  ) {
    return this.modeloContribuyenteService.update(id, updateModeloContribuyenteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.modeloContribuyenteService.remove(id);
  }
}
