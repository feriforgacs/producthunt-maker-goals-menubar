import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./style.min.css";
import Goals from "./Components/Goals";
import MakersGoals from "./Components/MakersGoals";
import Settings from "./Components/Settings";

require("es6-promise").polyfill();
require("isomorphic-fetch");

ReactDOM.render(<App />, document.getElementById("root"));

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Goals}></Route>
        <Route path="/goals/" component={Goals}></Route>
        <Route path="/makersgoals/" component={MakersGoals}></Route>
        <Route path="/settings/" component={Settings}></Route>
      </Switch>
    </Router>
  );
}

export default App;