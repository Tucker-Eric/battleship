import {
  BaseEntity,
  Entity,
  Column,
  ColumnOptions,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';
import Player from './Player';

const coordinateColumn: ColumnOptions = {
  type: 'int',
  width: 2,
  unsigned: true
};

@Entity()
export default class Guess extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hit: boolean;

  @Column(coordinateColumn)
  x: number;

  @Column(coordinateColumn)
  y: number;

  @ManyToOne(
    () => Player,
    player => player.guesses,
    { nullable: false }
  )
  player!: Player;
}
