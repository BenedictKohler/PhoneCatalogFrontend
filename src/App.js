// Description: This page specifies routes for the different components that the app uses.

import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import AddPhone from './components/AddPhone';
import PhoneView from './components/PhoneView';
import NotFound from './components/NotFound';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home}></Route>
          <Route exact path="/addphone" component={AddPhone}></Route>
          <Route exact path="/viewphone" component={PhoneView}></Route>
          <Route path="*" component={NotFound}></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
