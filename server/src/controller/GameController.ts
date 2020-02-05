import GameService from './../services/GameService';
import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import Game from '../entity/Game';
import { EnumPlayerNumber } from '../entity/Player';
import Guess from '../entity/Guess';

export interface IDParam {
  [key: string]: string;
  id: string;
}

export interface IShowParams extends IDParam {
  playerNumber: string;
}
const eventClients = new Map<string, Response[]>();

export default class GameController {
  private gameService = new GameService();
  private guessRepo = getRepository(Guess);
  private gameRepo = getRepository(Game);

  async create(request: Request, response: Response) {
    const {
      id,
      players_turn,
      playerOne: { ships, guesses },
      playerTwo: { guesses: opponent_guesses }
    } = await this.gameService.createNewGame();
    // if we are creating a game then we are player 1
    return {
      id,
      ships,
      guesses,
      opponent_guesses,
      player_number: 1,
      players_turn
    };
  }

  async show(
    request: Request<IShowParams>,
    response: Response,
    next: NextFunction
  ) {
    const { id, playerNumber } = request.params;

    const game = await this.gameRepo.findOne(id, {
      relations: ['players', 'players.ships', 'players.guesses']
    });

    if (game === undefined) {
      response.sendStatus(404);
      return;
    }

    const player = game.findPlayer(parseInt(playerNumber) as EnumPlayerNumber);

    const { ships, guesses } = player;

    return {
      id: game.id,
      ships,
      guesses,
      player_number: playerNumber,
      players_turn: game.players_turn,
      opponent_guesses: game.findOpponentsGuesses(player)
    };
  }

  async guess(request: Request<IDParam>, response: Response) {
    const { id } = request.params;
    const game = await this.gameRepo.findOne(id, {
      relations: ['players', 'players.ships', 'players.guesses']
    });

    if (game === undefined) {
      response.sendStatus(404);
      return;
    }
    const { x, y, player_number } = request.body;
    if (parseInt(player_number) !== game.players_turn) {
      // FORBIDDEN TO MAKE A MOVE IF IT's NOT YOU TURN!!
      response.sendStatus(403);
      return { message: `It's not your turn!` };
    }
    const player = game.findPlayer(parseInt(player_number) as EnumPlayerNumber);
    const opponent = game.findOpponentOf(player);
    const guess = this.guessRepo.create({ x, y, player });
    const hitShip = opponent.ships.find(ship => {
      return ship.cells.some(cell => {
        if (cell.x === x && cell.y === y) {
          // using some will short circuit the loops if we find a hit early
          // Also set cell here so we can save it
          return (cell.hit = true);
        }
      });
    });
    // If we have a hit ship we HIT!!
    guess.hit = hitShip !== undefined;
    player.guesses.push(guess);
    // Did we win?!?!?!
    const win = !opponent.hasShipsLeft();
    if (win) {
      // If we won the game is all over here
      game.winner = player;
    }
    game.switchTurns();
    // This will save all of the above from our relation cascading
    this.gameRepo.save(game);

    this.emitGuess(id, {
      x,
      y,
      hit: guess.hit,
      player_number: player.player_number
    });
    // We technically created a guess
    response.status(201);

    return { hit: guess.hit, win };
  }

  private emitGuess(gameId, guess) {
    eventClients.get(gameId)?.forEach(res => {
      res.write(`data: ${JSON.stringify(guess)}\n\n`);
    });
  }

  updateStream(request: Request<IDParam>, response: Response) {
    response.writeHead(200, {
      connection: 'keep-alive',
      'cache-control': 'no-cache',
      'content-type': 'text/event-stream'
    });

    const { id } = request.params;
    if (!eventClients.has(id)) {
      eventClients.set(id, []);
    }
    // add new client
    eventClients.set(id, [...eventClients.get(id), response]);
    request.on('close', () => {
      eventClients.set(
        id,
        eventClients.get(id).filter(r => r !== response)
      );
    });
  }
}
