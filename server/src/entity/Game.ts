import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
  OneToOne,
  Column,
  JoinColumn
} from 'typeorm';
import Player from './Player';
import Guess from './Guess';

@Entity()
export default class Game extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(
    () => Player,
    player => player.game,
    { cascade: true }
  )
  players: Player[];

  @OneToOne(() => Player, { nullable: true })
  @JoinColumn()
  winner: Player;

  @Column('tinyint')
  players_turn: number = 1;

  get playerOne(): Player {
    return this.findPlayer(1);
  }

  get playerTwo(): Player {
    return this.findPlayer(2);
  }

  findPlayer(number: 1 | 2): Player {
    return this.players.find(({ player_number }) => player_number === number);
  }

  findOpponentOf(player: Player): Player {
    return this.players.find(
      ({ player_number }) => player_number !== player.player_number
    );
  }

  switchTurns(): void {
    this.players_turn = this.players_turn === 1 ? 2 : 1;
  }

  findOpponentsGuesses(player: Player): Guess[] {
    return this.findOpponentOf(player).guesses;
  }
}
