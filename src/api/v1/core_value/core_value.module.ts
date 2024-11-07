import { Module } from '@nestjs/common';
import { CoreValueController } from './core_value.controller';
import { CoreValueService } from './core_value.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from 'src/typeorm/entities/settings';

@Module({
  imports:[TypeOrmModule.forFeature([Settings])],
  controllers: [CoreValueController],
  providers: [CoreValueService]
})
export class CoreValueModule {}
