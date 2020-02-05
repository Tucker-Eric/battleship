import React from 'react';
import Cell from './Cell';
import { Row } from 'reactstrap';
import { Observer } from 'mobx-react';
import { TCoordinates } from './../../state/models/Cell';

import './Board.scss';

interface BoardProps {
  onClick?: (coordinates: TCoordinates) => void;
  cellClassName: (coordinates: TCoordinates) => string | undefined;
}

const GRID_SIZE = { x: 10, y: 10 };
const rows = new Array(GRID_SIZE.x).fill(new Array(GRID_SIZE.y).fill(null));
/*eslint @typescript-eslint/no-unused-expressions: 0 */
const Board: React.FC<BoardProps> = ({ cellClassName, onClick = () => {} }) => {
  return (
    <>
      {rows.map((cols: null[], rowIndex: number) => {
        const row = rowIndex + 1;
        return (
          <Row key={row} className="justify-content-center">
            {cols.map((noVal, colIndex: number) => {
              const cell = colIndex + 1;
              const coordinates = { x: cell, y: row };
              return (
                <Observer key={`${cell}-${row}`}>
                  {() => (
                    <Cell
                      onClick={() => onClick(coordinates)}
                      className={cellClassName(coordinates)}
                    />
                  )}
                </Observer>
              );
            })}
          </Row>
        );
      })}
    </>
  );
};

export default React.memo(Board);
