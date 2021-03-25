import React from 'react';
import './styles/main.scss'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './components/Home';

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path='/' component={Home} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
