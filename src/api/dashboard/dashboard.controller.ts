import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe,
  HttpCode
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createDashboardDto: CreateDashboardDto) {
    return this.dashboardService.create(createDashboardDto);
  }

  @Get()
  findAll() {
    return this.dashboardService.findAll();
  }

  @Get('search/by-bu/:idBU')
  findByBU(@Param('idBU', ParseIntPipe) idBU: number) {
    return this.dashboardService.findByBU(idBU);
  }

  @Get('search/by-disciplina/:idDisciplina')
  findByDisciplina(@Param('idDisciplina', ParseIntPipe) idDisciplina: number) {
    return this.dashboardService.findByDisciplina(idDisciplina);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dashboardService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateDashboardDto: UpdateDashboardDto
  ) {
    return this.dashboardService.update(id, updateDashboardDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.dashboardService.remove(id);
  }
}
