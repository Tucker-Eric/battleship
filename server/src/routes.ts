import GameController from './controller/GameController';

interface TController {
  new (): void;
}

export interface IRoute {
  method: 'get' | 'post';
  route: string;
  controller: TController;
  action: string;
  keepOpen?: boolean;
}

export const Routes: IRoute[] = [
  {
    method: 'post',
    route: '/games',
    controller: GameController,
    action: 'create'
  },
  {
    method: 'get',
    route: '/games/:id/updates',
    controller: GameController,
    action: 'updateStream',
    keepOpen: true
  },
  {
    method: 'get',
    route: '/games/:id/:playerNumber',
    controller: GameController,
    action: 'show'
  },
  {
    method: 'post',
    route: '/games/:id',
    controller: GameController,
    action: 'guess'
  }
];
