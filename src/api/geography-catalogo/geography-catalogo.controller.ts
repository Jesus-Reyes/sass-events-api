import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { GeographySeedService } from './seeds/geography-seed.service';
// import { GeographyCatalogoService } from './geography-catalogo.service';

@Controller('geography')
export class GeographyCatalogoController {
  constructor(private readonly geographySeedService: GeographySeedService) {}



  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const geographies = await this.geographySeedService.findAll();

    return {
      status: 200,
      data: geographies,
      message: "Geografías obtenidas exitosamente"
    };
  }


}
