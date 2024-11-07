import { Module } from '@nestjs/common';
import { PlayListController } from './play-list.controller';
import { PlayListService } from './play-list.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayList } from 'src/typeorm/entities/playList';

@Module({
  imports:[TypeOrmModule.forFeature([PlayList])],
  controllers: [PlayListController],
  providers: [PlayListService]
})
export class PlayListModule {}
