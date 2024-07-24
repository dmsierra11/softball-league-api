import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    const result = await this.databaseService.query('SELECT * FROM USERS');
    return `Hello World! Database result: ${JSON.stringify(result)}`;
  }
}
