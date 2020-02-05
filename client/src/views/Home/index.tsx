import React, { useMemo, useState } from 'react';
import useStore from './../../state/useStore';
import { Button, Col, Row } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import useGameList from './../../hooks/useGameList';
import SelectGameModal from './SelectGameModal';

const Home: React.FC = () => {
  const { app } = useStore();
  const history = useHistory();
  // Don't need current one
  const { add: addGameToList } = useGameList();
  const [showSelectGame, setShowSelectGame] = useState(false);
  const buttons = useMemo(() => {
    return [
      {
        text: 'Start New Game',
        onClick: () =>
          app.createNewGame().then(id => {
            addGameToList({ id, playerNumber: 1 });
            return history.push(`/games/${id}`);
          })
      },
      { text: 'Join Game With ID', onClick: () => setShowSelectGame(true) }
    ];
  }, [app, history, addGameToList]);

  return (
    <>
      <Row className="mt-3">
        <Col>
          <h2 className="text-center">What would you like to do?</h2>
        </Col>
      </Row>
      {buttons.map(({ text, ...props }) => (
        <Row className="justify-content-center mt-3" key={text}>
          <Col xs="2">
            <Button size="lg" block {...props} color="primary">
              {text}
            </Button>
          </Col>
        </Row>
      ))}
      {showSelectGame && (
        <SelectGameModal toggle={() => setShowSelectGame(false)} />
      )}
    </>
  );
};

export default Home;
