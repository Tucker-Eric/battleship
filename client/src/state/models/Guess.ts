import { Instance, types } from 'mobx-state-tree';

const Guess = types
  .model('Guess', {
    hit: types.boolean,
    x: types.number,
    y: types.number
  })
  .views(self => ({
    isAtCell({ x, y }: { x: number; y: number }) {
      return self.x === x && self.y === y;
    }
  }));

export type TGuess = typeof Guess;
export interface IGuess extends Instance<TGuess> {}
export interface IGuessSnapshot {
  hit: boolean;
  x: number;
  y: number;
}

export default Guess;
