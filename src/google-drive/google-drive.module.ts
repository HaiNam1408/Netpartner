import { Module } from '@nestjs/common';
import { UploadController } from './google-drive.controller';
import { GoogleDriveService } from './google-drive.service';

@Module({
  imports: [],
  controllers: [UploadController],
  providers: [GoogleDriveService],
})
export class GoogleDriveModule {}
