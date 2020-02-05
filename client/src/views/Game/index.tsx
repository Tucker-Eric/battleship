import React, { useEffect, useCallback } from 'react';
import Board from './Board';
import useStore from './../../state/useStore';
import useGameList from './../../hooks/useGameList';
import { useParams, useHistory } from 'react-router-dom';
import SelectPlayerModal from './SelectPlayerModal';
import { Col, Row } from 'reactstrap';
import TurnIndicator from './TurnIndicator';
import { TCoordinates } from '../../state/models/Cell';

const Game: React.FC = () => {
  const { app } = useStore();
  const { id } = useParams();
  const history = useHistory();
  const gamelist = useGameList();
  const selectPlayer = useCallback(
    (playerNumber: number) => {
      if (id !== undefined) {
        // Add to the gamelist when we have a player number
        gamelist.add({ id, playerNumber });
        history.push(`/games/${id}`);
      }
    },
    [gamelist, id, history]
  );

  const game = gamelist.get(id);
  //Fetch Game On ComponentDidMount
  useEffect(() => {
    if (id !== undefined && game !== undefined) {
      app.fetchGame(id, game.playerNumber).catch(resp => {
        gamelist.remove(id);
        history.goBack();
      });
    }
  });

  const onCellGuess = useCallback(
    (coordinates: TCoordinates) => {
      app.guessCell(coordinates).then(win => {
        if (win) {
          const playAgain = window.confirm(
            'You WON!!!\nWould you like to play again?'
          );
          if (id !== undefined) {
            gamelist.remove(id);
          }

          if (playAgain) {
            app.createNewGame().then(id => history.push(`/games/${id}`));
          }
        }
      });
    },
    [app, id, gamelist, history]
  );

  // If we don't have a game from localstorage we don't know what player this is.
  if (!game) {
    return <SelectPlayerModal onSelect={selectPlayer} />;
  }

  return (
    <>
      <Row className="justify-content-center">
        <Col xs="auto" className="game-board text-center">
          <TurnIndicator />
          <h4 className="text-center">Enemy's Board</h4>
          <Board cellClassName={app.getClassForGuess} onClick={onCellGuess} />
        </Col>
      </Row>

      <Row>
        <Col className="text-center my-board">
          <h5 className="text-center">My Board</h5>
          <Board cellClassName={app.getClassForMyBoard} />
          <h5>Game ID: {id}</h5>
        </Col>
      </Row>
    </>
  );
};

export default Game;
