import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Users } from 'src/typeorm/entities/users';
import { BranchingModule } from '../branching/branching.module';
import { JwtModule } from '@nestjs/jwt';
import { Department } from 'src/typeorm/entities/department';
import { GlobalRecusive } from 'src/global/globalRecusive';
import { MailerService } from 'src/mailer/mailer.service';
import { ConfigService } from '@nestjs/config';
import { Branches } from 'src/typeorm/entities/branches';

@Module({
    imports: [TypeOrmModule.forFeature([Users,Department, Branches]),
    BranchingModule,
    JwtModule.register({
      global: true,
      secret: "vya8ygda87dy987y19e812e9ug2197td183tg12gvc712",
      signOptions: { expiresIn: '1d' },
    }),
    ],
    controllers: [UsersController],
    providers: [UsersService,GlobalRecusive,MailerService,ConfigService],
    exports: [TypeOrmModule]
  })
export class UsersModule {}
