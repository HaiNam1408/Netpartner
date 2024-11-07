export interface MailerOptions {
    service: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  }
  