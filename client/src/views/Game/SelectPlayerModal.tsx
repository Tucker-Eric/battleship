import React, { memo, useCallback } from 'react';
import { Button, Col, Row, Modal, ModalHeader, ModalBody } from 'reactstrap';

interface SelectPlayerModalProps {
  onSelect(playerNumber: number): void;
}

const SelectPlayerModal: React.FC<SelectPlayerModalProps> = ({ onSelect }) => {
  const onClick = useCallback(
    ({ target: { value } }) => onSelect(parseInt(value)),
    [onSelect]
  );

  return (
    <Modal isOpen={true}>
      <ModalHeader>Select Your Player Number</ModalHeader>
      <ModalBody>
        <Row className="text-center">
          <Col>
            Looks like we don't have a history of you playing this game.
            <h5>Let's change that!</h5>
          </Col>
        </Row>
        <Row>
          <Col>
            <h4 className="text-center">Which player would you like to be?</h4>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Button block onClick={onClick} value="1">
              Player 1
            </Button>
          </Col>
          <Col>
            <Button block onClick={onClick} value="2">
              Player 2
            </Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default memo(SelectPlayerModal);
