import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './environments/environment.dev';
import { BuCatalogoModule } from './api/bu-catalogo/bu-catalogo.module';
import { GeographyCatalogoModule } from './api/geography-catalogo/geography-catalogo.module';
import { CfsCatalogoModule } from './api/cfs-catalogo/cfs-catalogo.module';
import { DisciplinaCatalogoModule } from './api/disciplinas-catalogo/disciplina-catalogo.module';
import { ModeloContribuyenteModule } from './api/modelo-contribuyente/modelo-contribuyente.module';
import { StatusModeloCatalogoModule } from './api/status-modelo-catalogo/status-modelo-catalogo.module';
import { RollbackModule } from './api/rollback/rollback.module';
import { SeedModule } from './common/seeds/seed.module';
import { DashboardModule } from './api/dashboard/dashboard.module';




@Module({
  controllers: [],
  providers: [],
  imports: [

    TypeOrmModule.forRoot({
      type: 'postgres',
      username: envs.dbUser,
      password: envs.dbPassword,
      database: envs.dbName,
      host: envs.dbHost,
      port: + (envs.dbPort),
      autoLoadEntities: true,
      synchronize: true, // Set to false in production
    }),

    BuCatalogoModule,

    GeographyCatalogoModule,

    CfsCatalogoModule,

    DisciplinaCatalogoModule,

    

    ModeloContribuyenteModule,

    StatusModeloCatalogoModule,

    RollbackModule,

    SeedModule,

    DashboardModule,

    

    



  ],
})
export class AppModule { }
