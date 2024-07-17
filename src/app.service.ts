import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): string {
    const port = this.configService.get<string>('PORT', '3000'); // Default to port 3000 if PORT is not set
    return `Hello World! Running on port ${port}`;
  }
}
