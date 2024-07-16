import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StandingsService {
  private standings: any[];

  constructor() {
    this.standings = this.loadStandings();
  }

  private loadStandings(): any[] {
    const filePath = path.resolve(__dirname, '../../data/standings.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  findAll(): any[] {
    return this.standings;
  }

  findByName(name: string): any {
    console.log(name);
    return this.standings.find((standing) => standing.name === name);
  }

  findById(id: string): any {
    return this.standings.find((standing) => standing.id === id);
  }
}
