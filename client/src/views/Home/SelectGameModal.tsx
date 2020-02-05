import React, { memo, useCallback, useState, useMemo } from 'react';
import useGameList from './../../hooks/useGameList';
import { isValidUUID } from './../../utils';
import {
  Button,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  Row,
  FormGroup,
  ModalHeader
} from 'reactstrap';
import { useHistory } from 'react-router-dom';

interface GameListProps {
  onClick: (id: string) => void;
}

const idListWidths = { offset: 1, size: 10 };

const GameList: React.FC<GameListProps> = memo(({ onClick }) => {
  const handleClick = useCallback(id => onClick(id), [onClick]);
  const [gameId, setGameId] = useState('');
  const gameIdIsValid = useMemo(() => isValidUUID(gameId), [gameId]);
  const gameIds = useGameList().ids();
  return (
    <>
      {gameIds.length > 0 && (
        <>
          <Row className="text-center mb-4">
            <Col>
              <h5>
                Whoa! Looks like we you've played before! Select a previous game
                or enter a Game ID below to join!
              </h5>
              <Row>
                <Col xs={idListWidths}>
                  {gameIds.map(id => (
                    <Button
                      key={id}
                      block
                      color="success"
                      onClick={() => handleClick(id)}
                    >
                      {id}
                    </Button>
                  ))}
                </Col>
              </Row>
            </Col>
          </Row>
          <hr />
        </>
      )}
      <FormGroup row>
        <Label xs={4}>Enter GameID:</Label>
        <Col xs={8}>
          <Input
            value={gameId}
            onChange={({ target: { value } }) => setGameId(value)}
          />
        </Col>
        <Col xs={{ size: 10, offset: 1 }} className="mt-3">
          <Button
            color="primary"
            disabled={!gameIdIsValid}
            onClick={() => handleClick(gameId)}
            block
          >
            Join Game
          </Button>
        </Col>
      </FormGroup>
    </>
  );
});

const SelectGameModal: React.FC<{ toggle: () => void }> = ({ toggle }) => {
  const history = useHistory();
  const goToGame = useCallback(id => history.push(`/games/${id}`), [history]);

  return (
    <Modal isOpen={true} toggle={toggle}>
      <ModalHeader>
        <h4>Join Game</h4>
      </ModalHeader>
      <ModalBody>
        <GameList onClick={goToGame} />
      </ModalBody>
    </Modal>
  );
};

export default memo(SelectGameModal);
