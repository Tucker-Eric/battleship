import { getRepository } from 'typeorm';
import Game from './../entity/Game';
import Player from './../entity/Player';
import PlayerShipService from './PlayerShipService';

const GRID_SIZE = { x: 10, y: 10 };

export default class GameService {
  private playerRepo = getRepository(Player);
  private gameRepo = getRepository(Game);

  async createNewGame() {
    const players = await this.createPlayers();
    const game = new Game();
    game.players = players;
    return this.gameRepo.save(game);
  }

  private createPlayers(): Promise<[Player, Player]> {
    // Create players together
    return Promise.all([this.createPlayer(1), this.createPlayer(2)]);
  }

  private async createPlayer(player_number: number): Promise<Player> {
    const shipService = new PlayerShipService(GRID_SIZE);
    const ships = shipService.createShips();
    return this.playerRepo.save({ player_number, ships });
  }
}
