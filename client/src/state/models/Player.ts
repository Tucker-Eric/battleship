import { types } from 'mobx-state-tree';
import Battleship from './Battleship';

export default types.model('Player', {
  id: types.identifier,
  battleships: types.array(Battleship)
});
