import { getRepository, Repository } from 'typeorm';
import { random } from 'lodash';
import Ship, { ShipCells } from '../entity/Ship';
// Amount of ships in format of {size: number of ships that size}
const SHIPS: { [key in ShipCells['length']]: number } = {
  1: 1,
  2: 1,
  3: 1,
  4: 1,
  5: 1
};

type Cell = { x: number; y: number };
type Incrememtor = -1 | 1;
enum Orientation {
  HORIZONTAL,
  VERTICAL
}

export default class PlayerShipService {
  private board = {};

  constructor(private GRID_SIZE: { x: number; y: number }) {}

  createShips(): Ship[] {
    const ships = [];
    Object.entries(SHIPS).forEach(([size, count]) => {
      for (let i = 0; i < count; i++) {
        ships.push(this.createShip(parseInt(size) as ShipCells['length']));
      }
    });

    return ships;
  }

  private createShip(size: ShipCells['length']): Ship {
    const cells = this.getShipCells(size);
    // This makes sure we can't place anyone there we aren't supposed to
    this.placeShipOnBoard(cells);

    return new Ship(cells);
  }

  private placeShipOnBoard(cells: Cell[]): void {
    cells.forEach(({ x, y }: Cell) => {
      if (!this.board[x]) {
        this.board[x] = {};
      }
      this.board[x][y] = true;
    });
  }

  private getShipCells(size: ShipCells['length']): ShipCells {
    let { start, orientation, incrementor } = this.randomShipProps();
    let cells = [start];
    let cell = start;
    while (cells.length < size) {
      cell = this.nextCell(cell, orientation, incrementor);
      if (this.cellIsOpen(cell)) {
        cells.push(cell);
      } else {
        // One if the cells can't be placed, get all new random variables here to attempt to place
        const props = this.randomShipProps();
        cell = props.start;
        cells = [cell];
        orientation = props.orientation;
        incrementor = props.incrementor;
      }
    }

    return cells as ShipCells;
  }

  // Calculate the next cell for the ship
  private nextCell(
    { x, y }: Cell,
    orientation: Orientation,
    incrementor: Incrememtor
  ): Cell {
    if (orientation === Orientation.HORIZONTAL) {
      return { x: x + incrementor, y };
    }

    return { x, y: y + incrementor };
  }

  // Get a random open cell
  private getStartCell(): Cell {
    let startCell;
    do {
      startCell = this.randomCell();
    } while (!this.cellIsOpen(startCell));

    return startCell;
  }

  // Randomly generate props/config to place ship cell
  private randomShipProps(): {
    start: Cell;
    orientation: Orientation;
    incrementor: Incrememtor;
  } {
    return {
      start: this.getStartCell(),
      orientation: this.getOrientation(),
      incrementor: this.directionIncrementor()
    };
  }

  private cellIsOpen(cell: Cell) {
    const { x, y } = cell;
    return (
      x > 0 &&
      y > 0 &&
      x <= this.GRID_SIZE.x &&
      y <= this.GRID_SIZE.y &&
      !this.board?.[x]?.[y]
    );
  }

  private randomCell(): Cell {
    const { x: MAX_X, y: MAX_Y } = this.GRID_SIZE;
    return { x: random(0, MAX_X), y: random(0, MAX_Y) };
  }

  private getOrientation(): Orientation {
    return random(0, 1) === 0 ? Orientation.HORIZONTAL : Orientation.VERTICAL;
  }

  private directionIncrementor(): Incrememtor {
    return random(0, 1) === 0 ? 1 : -1;
  }
}
