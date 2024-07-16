import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TeamsService {
  private readonly teams = [];

  constructor() {
    const dataPath = path.join(__dirname, '../../data/teams.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    this.teams = JSON.parse(data);
  }

  findAll() {
    return this.teams;
  }

  findOne(id: number) {
    return this.teams.find((team) => team.id === id);
  }
}
