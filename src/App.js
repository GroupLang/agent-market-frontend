import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import LoginForm from './components/auth/LoginForm';
import RegistrationForm from './components/auth/RegistrationForm';
import PrivateRoute from './components/auth/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthCallback from './components/auth/AuthCallback';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/register" component={RegistrationForm} />
        <Route path="/login" component={LoginForm} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route path="/auth/callback" component={AuthCallback} />
      </Switch>
      <ToastContainer />
    </Router>
  );
};

export default App;