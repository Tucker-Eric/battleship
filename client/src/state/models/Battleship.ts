import { types, SnapshotIn } from 'mobx-state-tree';
import Cell, { TCoordinates } from './Cell';

const Battleship = types
  .model('Battleship', {
    name: types.string,
    cells: types.array(Cell)
  })
  .views(self => ({
    isInCell(coordinates: TCoordinates): boolean {
      return self.cells.some(cell => cell.isAt(coordinates));
    },
    cellIsHit(coordinates: TCoordinates): boolean {
      return !!self.cells.find(cell => cell.isAt(coordinates))?.hit;
    }
  }));

export type TBattleship = typeof Battleship;
export interface IBattleshipSnapshot extends SnapshotIn<TBattleship> {}

export default Battleship;
