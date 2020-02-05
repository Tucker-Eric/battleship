import React from 'react';
import { Col } from 'reactstrap';

export interface CellProps {
  onClick?: () => void;
  className?: string;
}
const Cell: React.FC<CellProps> = ({ className = '', onClick = () => {} }) => (
  <Col xs="auto" className={`p-0 cell ${className}`} onClick={onClick} />
);

export default React.memo(Cell);
