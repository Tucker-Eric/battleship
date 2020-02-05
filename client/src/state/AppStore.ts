import { Instance, flow, types, IMSTArray } from 'mobx-state-tree';
import http from './../services/http';
import { TCoordinates } from './models/Cell';
import Battleships, { TBattleship } from './models/Battleship';
import Guess, { IGuess, IGuessSnapshot } from './models/Guess';

interface IGameResponse {
  id: string;
  guesses: IMSTArray<typeof Guess>;
  opponent_guesses: IMSTArray<typeof Guess>;
  ships: IMSTArray<TBattleship>;
  player_number: string;
  players_turn: number;
}

let eventSource: EventSource;

const AppStore = types
  .model('AppStore', {
    player_number: types.maybe(types.number),
    gameId: types.maybe(types.string),
    ships: types.array(Battleships),
    guesses: types.array(Guess),
    opponent_guesses: types.array(Guess),
    players_turn: types.maybe(types.number)
  })
  .views(self => ({
    get myTurn() {
      return (
        self.player_number &&
        self.players_turn &&
        self.player_number === self.players_turn
      );
    },
    findGuess: (coordinates: TCoordinates) =>
      self.guesses.find((guess: IGuess) => guess.isAtCell(coordinates)),
    findOpponentGuess: (coordinates: TCoordinates) =>
      self.opponent_guesses.find((guess: IGuess) =>
        guess.isAtCell(coordinates)
      ),
    findShip: (coordinates: TCoordinates) =>
      self.ships.find(ship => ship.isInCell(coordinates)),
    get hasShipsLeft() {
      return self.ships.some(ship => ship.cells.some(({ hit }) => !hit));
    }
  }))
  .actions(self => ({
    registerOpponentGuess: (guess: IGuessSnapshot) => {
      self.opponent_guesses.push(guess);
      const ship = self.findShip(guess);
      if (ship) {
        const cell = ship.cells.find(cell => cell.isAt(guess));
        if (cell) {
          cell.hit = true;
        }
      }

      if (!self.hasShipsLeft) {
        window.alert('YOU LOST!!');
      } else {
        // Opponent just went so it's our turn now
        self.players_turn = self.player_number;
      }
    }
  }))
  .actions(self => {
    const _setGame = ({
      id,
      guesses,
      ships,
      player_number,
      players_turn,
      opponent_guesses
    }: IGameResponse): string => {
      self.gameId = id;
      self.guesses = guesses;
      self.ships = ships;
      self.player_number = parseInt(player_number);
      self.players_turn = players_turn;
      self.opponent_guesses = opponent_guesses;
      eventSource = http.createEventSource(`/games/${id}/updates`);
      eventSource.onmessage = e => {
        const guess = JSON.parse(e.data);
        // if it's from another player then emit
        if (guess.player_number !== self.player_number) {
          self.registerOpponentGuess(guess);
        }
      };
      return id;
    };
    return {
      createNewGame: flow(function*() {
        const resp = yield http.post<IGameResponse>('/games');
        return _setGame(resp);
      }),
      fetchGame: flow(function*(gameId: string, playerNumber: number) {
        // If we already have this game as the current game (ie: after we create it), we don't need to fetch again
        if (gameId === self.gameId) {
          return self.gameId;
        }
        const resp = yield http.get<IGameResponse>(
          `/games/${gameId}/${playerNumber}`
        );
        return _setGame(resp);
      }),
      guessCell: flow(function*(coordinates: TCoordinates) {
        // You can't go if it's not your turn!!
        if (!self.myTurn) {
          window.alert(`It's not your turn!!`);
          return;
        }
        const guess = self.findGuess(coordinates);
        // Only send if it doesn't exist
        if (!guess) {
          const { hit, win } = yield http.post(
            `/games/${self.gameId}`,
            Object.assign({ player_number: self.player_number }, coordinates)
          );
          self.guesses.push(Object.assign({ hit }, coordinates));
          self.players_turn = undefined;
          return win;
        }
      })
    };
  })
  .views(self => {
    const _getShipClass = (coordinates: TCoordinates): string => {
      let classes = '';
      const ship = self.ships.find(ship => ship.isInCell(coordinates));

      if (ship !== undefined) {
        classes += `ship ${ship.name.replace(/\s+/g, '-').toLocaleLowerCase()}`;
      }
      return classes;
    };

    return {
      getClassForMyBoard(coordinates: TCoordinates): string | undefined {
        let classes = _getShipClass(coordinates);
        const guess = self.findOpponentGuess(coordinates);
        if (guess) {
          classes += ' guess';
          if (guess.hit) {
            classes += ' hit';
          }
        }
        return classes;
      },
      getClassForGuess(coordinates: TCoordinates): string | undefined {
        const guess = self.findGuess(coordinates);

        if (!guess) {
          return undefined;
        }
        const classes = 'guess';
        return guess.hit ? classes + ' hit' : classes;
      }
    };
  });

export type TAppStore = Instance<typeof AppStore>;

export default AppStore;
