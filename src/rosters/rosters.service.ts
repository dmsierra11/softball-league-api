import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { Roster } from './rosters.types';
import { Player } from '../players/players.types';
import { PlayersService } from '../players/players.service';

@Injectable()
export class RosterService {
  private readonly pool: Pool;
  private readonly playerService: PlayersService;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
    });
    this.playerService = new PlayersService();
  }

  async getRosters(team_id: number, tournament_id: number): Promise<Roster[]> {
    const query = `SELECT DISTINCT(p.id), p.name, p.positions FROM rosters, players p, teams team, tournaments tour
        WHERE rosters.team_id = $1 AND rosters.player_id = p.id AND rosters.tournament_id = $2`;

    const result = await this.pool.query(query, [team_id, tournament_id]);
    return result.rows;
  }

  async createPlayer(
    team_id: number,
    tournament_id: number,
    player: Player,
  ): Promise<Player> {
    const resultPlayer = await this.playerService.createPlayer(player);
    const player_id = resultPlayer.id;
    const query =
      'INSERT INTO rosters (team_id, tournament_id, player_id) VALUES ($1, $2, $3)';
    const result = await this.pool.query(query, [
      team_id,
      tournament_id,
      player_id,
    ]);
    return result.rows[0];
  }

  async createRoster(
    team_id: number,
    tournament_id: number,
    players: Player[],
  ): Promise<Player[]> {
    return Promise.all(
      players.map((player) =>
        this.createPlayer(team_id, tournament_id, player),
      ),
    );
  }

  async updatePlayerRoster(
    team_id: number,
    tournament_id: number,
    player: Player,
  ): Promise<Player> {
    const resultPlayers = await this.playerService.findByName(player.name);
    const player_id = resultPlayers.id;
    if (!player_id) {
      throw new Error('Player not found');
    }
    const resultUpdate = await this.playerService.updatePlayer(
      player_id,
      player,
    );
    return resultUpdate;
  }

  async updateRoster(
    team_id: number,
    tournament_id: number,
    players: Player[],
  ): Promise<Player[]> {
    return Promise.all(
      players.map((player) =>
        this.updatePlayerRoster(team_id, tournament_id, player),
      ),
    );
  }
}
