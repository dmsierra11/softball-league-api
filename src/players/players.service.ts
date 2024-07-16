import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PlayersService {
  private readonly players = [];

  constructor() {
    const dataPath = path.join(__dirname, '../../data/players.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    this.players = JSON.parse(data);
  }

  findAll() {
    return this.players;
  }

  findOne(id: number) {
    return this.players.find((player) => player.id === id);
  }

  findByTeam(teamId: number) {
    return this.players.filter((player) => player.teamId === teamId);
  }
}
