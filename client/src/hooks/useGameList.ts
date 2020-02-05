import useLocalStorage from './useLocalStorage';

export type TGameId = string;

export interface IGame {
  id: string;
  playerNumber: number;
}

export interface IGameList {
  [key: string]: IGame;
}

export interface IUseGameList {
  all(): IGameList;
  ids(): TGameId[];
  remove(id: string): void;
  get(gameId?: string): IGame | undefined;
  add(game: IGame): void;
}

function useGameList<T extends string>(gameId?: T): IUseGameList {
  const [gameList, setGamelist] = useLocalStorage<IGameList>(
    'BATTLESHIP_GAMES',
    {}
  );

  return {
    all(): IGameList {
      return gameList;
    },
    add(game: IGame): void {
      gameList[game.id] = game;
      setGamelist(gameList);
    },
    get(gameId?: IGame['id']): IGame | undefined {
      return gameId === undefined ? undefined : gameList[gameId];
    },
    ids(): TGameId[] {
      return Object.keys(gameList);
    },
    remove(id: string): void {
      delete gameList[id];
      setGamelist(gameList);
    }
  };
}

export default useGameList;
