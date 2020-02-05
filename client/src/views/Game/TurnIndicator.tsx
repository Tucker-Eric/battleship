import React from 'react';
import { observer } from 'mobx-react';
import useStore from '../../state/useStore';

import './TurnIndicator.scss';

const TurnIndicator: React.FC = () => {
  const {
    app: { myTurn, player_number }
  } = useStore();
  return (
    <>
      <h3>
        <strong>Player {player_number}</strong>
      </h3>
      <h3>
        <span
          className={`turn-indicator ${myTurn ? 'my-turn' : 'opponents-turn'}`}
        ></span>
        {` `}
        {myTurn ? 'Your Turn' : 'Waiting On Opponent'}
      </h3>
    </>
  );
};

export default observer(TurnIndicator);
