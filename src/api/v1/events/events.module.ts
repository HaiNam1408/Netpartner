import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Events } from 'src/typeorm/entities/events';

@Module({
  imports:[TypeOrmModule.forFeature([Events])],
  controllers: [EventsController],
  providers: [EventsService]
})
export class EventsModule {}
