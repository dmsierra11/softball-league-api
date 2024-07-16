import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StatsService {
  private battingStats: any[];
  private defenseStats: any[];
  private pitchingStats: any[];

  constructor() {
    this.battingStats = this.loadStats('battingStats.json');
    this.defenseStats = this.loadStats('defenseStats.json');
    this.pitchingStats = this.loadStats('pitchingStats.json');
  }

  private loadStats(filename: string): any[] {
    const filePath = path.resolve(__dirname, '../../data', filename);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  getStats(type: string): any[] {
    switch (type) {
      case 'batting':
        return this.battingStats;
      case 'defense':
        return this.defenseStats;
      case 'pitching':
        return this.pitchingStats;
      default:
        throw new BadRequestException('Invalid stats type');
    }
  }
}
