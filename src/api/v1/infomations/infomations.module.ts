import { Module } from '@nestjs/common';
import { InfomationsController } from './infomations.controller';
import { InfomationsService } from './infomations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Infomation } from 'src/typeorm/entities/infomation';

@Module({
  imports:[TypeOrmModule.forFeature([Infomation])],
  controllers: [InfomationsController],
  providers: [InfomationsService]
})
export class InfomationsModule {}
