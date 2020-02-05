import { types } from 'mobx-state-tree';

export type TCoordinates = { x: number; y: number };

const Cell = types
  .model('Cell', {
    id: types.identifier,
    x: types.number,
    y: types.number,
    hit: false
  })
  .views(self => ({
    isAt: ({ x, y }: TCoordinates) => self.x === x && self.y === y
  }));

export default types.snapshotProcessor(Cell, {
  preProcessor: (snapshot: TCoordinates) => {
    const { x, y } = snapshot;
    return { id: `${x}-${y}`, ...snapshot };
  }
});
