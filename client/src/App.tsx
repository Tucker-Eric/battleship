import React, { lazy, Suspense } from 'react';
import { Provider } from 'mobx-react';
import AppStore from './state/AppStore';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container, Navbar, NavbarBrand } from 'reactstrap';
import ErrorBoundry from './components/ErrorBoundry';
import './App.scss';

const Home = lazy(() => import('./views/Home'));
const Game = lazy(() => import('./views/Game'));

const appStore = AppStore.create();

const App: React.FC = () => (
  <ErrorBoundry>
    <Provider app={appStore}>
      <div className="app">
        <Navbar light color="light">
          <NavbarBrand>BATTLESHIP</NavbarBrand>
        </Navbar>

        <Router>
          <Container fluid>
            <Suspense fallback={`Loading...`}>
              <Switch>
                <Route path="/games/:id" component={Game} />
                <Route path="/" component={Home} />
              </Switch>
            </Suspense>
          </Container>
        </Router>
      </div>
    </Provider>
  </ErrorBoundry>
);

export default App;
