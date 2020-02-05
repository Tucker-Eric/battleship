import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';
import Player from './Player';

export type Cell = { x: number; y: number; hit: boolean };

export interface ShipCells extends Array<Cell> {
  length: 1 | 2 | 3 | 4 | 5;
}

export enum SHIP_NAMES {
  AIRCRAFT_CARRIER = 'Aircraft Carrier',
  BATTLESHIP = 'Battleship',
  CRUISER = 'Cruiser',
  DESTROYER = 'Destroyer',
  SUBMARINE = 'Submarine'
}

const SHIP_LENGTHS = {
  5: SHIP_NAMES.AIRCRAFT_CARRIER,
  4: SHIP_NAMES.BATTLESHIP,
  3: SHIP_NAMES.CRUISER,
  2: SHIP_NAMES.DESTROYER,
  1: SHIP_NAMES.SUBMARINE
};

@Entity()
export default class Ship extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-json')
  cells!: ShipCells;

  @ManyToOne(
    () => Player,
    player => player.ships
  )
  player: Player;

  @Column()
  readonly name!: SHIP_NAMES;

  constructor(cells: ShipCells) {
    super();
    this.cells = cells;
    // TypeORM will fail metadata generation if we don't check for cells
    this.name = cells && SHIP_LENGTHS[cells.length];
  }
}
