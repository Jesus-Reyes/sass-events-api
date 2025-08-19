import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './environments/environment.dev';
import { BuCatalogoModule } from './api/bu-catalogo/bu-catalogo.module';
import { GeographyCatalogoModule } from './api/geography-catalogo/geography-catalogo.module';
import { CfsCatalogoModule } from './api/cfs-catalogo/cfs-catalogo.module';



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

    



  ],
})
export class AppModule { }
