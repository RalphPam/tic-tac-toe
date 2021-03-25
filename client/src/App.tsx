import React from 'react';
import './styles/main.scss'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './components/Home';
import LeaderBoard from './components/LeaderBoard';
import GameRoom from './components/GameRoom';

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/leaderboard' component={LeaderBoard} />
          <Route exact path='/gameRoom' component={GameRoom} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
