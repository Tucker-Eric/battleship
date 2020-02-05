import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany
} from 'typeorm';
import Game from './Game';
import Guess from './Guess';
import Ship from './Ship';

export enum EnumPlayerNumber {
  ONE = 1,
  TWO = 2
}

@Entity()
export default class Player extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  player_number: EnumPlayerNumber;

  @ManyToOne(
    () => Game,
    game => game.players
  )
  game: Game;

  @OneToMany(
    () => Guess,
    guess => guess.player,
    { cascade: true }
  )
  guesses: Guess[];

  @OneToMany(
    () => Ship,
    ship => ship.player,
    { cascade: true }
  )
  ships: Ship[];

  hasShipsLeft(): boolean {
    return this.ships.some(ship => ship.cells.some(({ hit }) => !hit));
  }
}
