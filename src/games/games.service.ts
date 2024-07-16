import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GamesService {
  private readonly games = [];

  constructor() {
    const dataPath = path.join(__dirname, '../../data/games.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    this.games = JSON.parse(data);
  }

  findAll(type?: string) {
    const now = new Date();
    if (type === 'upcoming') {
      return this.games.filter((game) => new Date(game.date) >= now);
    } else if (type === 'results') {
      return this.games.filter((game) => new Date(game.date) < now);
    }

    return this.games;
  }

  findOne(id: number) {
    return this.games.find((game) => game.id === id);
  }
}
