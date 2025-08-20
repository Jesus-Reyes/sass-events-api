import { Controller } from '@nestjs/common';
import { ModeloContribuyenteService } from './modelo-contribuyente.service';

@Controller('modelo-contribuyente')
export class ModeloContribuyenteController {
  constructor(private readonly modeloContribuyenteService: ModeloContribuyenteService) {}
}
