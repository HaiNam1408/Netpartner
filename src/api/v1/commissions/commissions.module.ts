import { Module } from '@nestjs/common';
import { CommissionsController } from './commissions.controller';
import { CommissionsService } from './commissions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commissions } from 'src/typeorm/entities/commissions';
import { GlobalRecusive } from 'src/global/globalRecusive';
import { Users } from 'src/typeorm/entities/users';

@Module({
  imports:[TypeOrmModule.forFeature([Commissions,Users])],
  controllers: [CommissionsController],
  providers: [CommissionsService,GlobalRecusive]
})
export class CommissionsModule {}
