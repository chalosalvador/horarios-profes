import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFoundPage from '../containers/NotFoundPage';

import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import Loadable from 'react-loadable';
import Loading from '../components/Loading';
import { ABOUT, ADD_SCHEDULE, EDIT_SCHEDULE, HOME, LOGIN } from '../constants/routes';

const AsyncLogin = Loadable( {
  loader: () => import( '../containers/LoginPage' ),
  loading: Loading
} );


const AsyncHome = Loadable( {
  loader: () => import( '../containers/HomePage' ),
  loading: Loading
} );

const AsyncAddSchedule = Loadable( {
  loader: () => import( '../containers/AddSchedulePage' ),
  loading: Loading
} );

const AsyncEditSchedule = Loadable( {
  loader: () => import( '../containers/EditSchedulePage' ),
  loading: Loading
} );

const AsyncAbout = Loadable( {
  loader: () => import( '../containers/AboutPage' ),
  loading: Loading
} );

const AppRouter = () => {

  return (
    <Switch>
      <PrivateRoute exact={ true } path={ HOME } component={ AsyncHome } />
      <PrivateRoute exact={ true } path={ ADD_SCHEDULE } component={ AsyncAddSchedule } />
      <PrivateRoute exact={ true } path={ EDIT_SCHEDULE } component={ AsyncEditSchedule } />

      <PublicRoute path={ LOGIN } component={ AsyncLogin } />
      <PublicRoute path={ ABOUT } component={ AsyncAbout } />


      <Route component={ NotFoundPage } />
    </Switch>
  );
};

export default AppRouter;