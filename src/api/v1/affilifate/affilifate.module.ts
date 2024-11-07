import { Module } from '@nestjs/common';
import { AffilifateController } from './affilifate.controller';
import { AffilifateService } from './affilifate.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Affiliate } from 'src/typeorm/entities/Affiliate';

@Module({
  imports:[TypeOrmModule.forFeature([Affiliate])],
  controllers: [AffilifateController],
  providers: [AffilifateService]
})
export class AffilifateModule {}
