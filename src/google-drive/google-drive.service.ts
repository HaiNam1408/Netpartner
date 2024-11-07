import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { PassThrough } from 'stream';

@Injectable()
export class GoogleDriveService {
  private readonly logger = new Logger(GoogleDriveService.name);
  private driveClient: any;

  constructor(private configService: ConfigService) {
    this.initializeDriveClient();
  }

  // Initialize the Google Drive client using OAuth2 credentials
  private async initializeDriveClient() {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI');
    const refreshToken = this.configService.get<string>('GOOGLE_REFRESH_TOKEN');
    
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    this.driveClient = google.drive({
      version: 'v3',
      auth: oauth2Client,
    });
  }

  // Upload a file to Google Drive
  async uploadFile(fileName: string, fileBuffer: any, mimeType: string) {
    try {
      const fileMetadata = {
        name: fileName,
        mimeType: mimeType
      };

      const media = {
        mimeType: mimeType,
        body: new PassThrough().end(fileBuffer),
      };

      const response = await this.driveClient.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
      });
      const fileId = response.data.id;
      
      await this.driveClient.permissions.create({
          fileId,
          requestBody: {
              role: 'reader',
              type: 'anyone'
          }
      })

      if (mimeType.includes("image")) {
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
      } else if (mimeType.includes("application/pdf")) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      } else {
        return `https://drive.google.com/uc?id=${fileId}&export=download`;
      }
    } catch (error) {
      this.logger.error('Error uploading file to Google Drive', error);
      throw new Error('Error uploading file');
    }
  }

  // List files in Google Drive
  async listFiles() {
    try {
      const res = await this.driveClient.files.list({
        pageSize: 10,
        fields: 'files(id, name)',
      });
      return res.data.files;
    } catch (error) {
      this.logger.error('Error listing files from Google Drive', error);
      throw new Error('Error listing files');
    }
  }
}
