import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Events } from 'src/typeorm/entities/events';
import { Between, Like, Repository } from 'typeorm';
import { CreateEventDto } from './dto/createEvent.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events)
    private EventsRepository: Repository<Events>,
  ) {}
  async createEvents(data: CreateEventDto): Promise<Events> {
    return this.EventsRepository.save(data);
  }

  async findEventsFollowRange(start_at: Date, end_at: Date): Promise<Events[]> {
    return this.EventsRepository.find({
      where: {
        start_at: Between(start_at, end_at),
      },
      order: {
        start_at: 'DESC',
      },
    });
  }

  async removeEvents(id: number) {
    return this.EventsRepository.delete(id);
  }
}
