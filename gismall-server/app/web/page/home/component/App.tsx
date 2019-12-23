import React from 'react';

import { Switch, Route, Redirect } from 'react-router';
import Home from './Home';

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Redirect path="*" to="/" />
    </Switch>
  );
}
