import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { config } from './config';

@Module({
  imports: [UserModule, TypeOrmModule.forRoot({
    type: 'postgres',
    url: config.dbURL,
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
