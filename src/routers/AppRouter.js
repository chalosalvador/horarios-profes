import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFoundPage from '../containers/NotFoundPage';

import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import Loadable from 'react-loadable';
import Loading from '../components/Loading';
import { ABOUT, HOME, LOGIN, MANAGE_SCHEDULES } from '../constants/routes';

const AsyncLogin = Loadable( {
  loader: () => import( '../containers/LoginPage' ),
  loading: Loading
} );


const AsyncHome = Loadable( {
  loader: () => import( '../containers/HomePage' ),
  loading: Loading
} );

const AsyncManageSchedules = Loadable( {
  loader: () => import( '../containers/ManageSchedulesPage' ),
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
      <PrivateRoute exact={ true } path={ MANAGE_SCHEDULES } component={ AsyncManageSchedules } />

      <PublicRoute path={ LOGIN } component={ AsyncLogin } />
      <PublicRoute path={ ABOUT } component={ AsyncAbout } />


      <Route component={ NotFoundPage } />
    </Switch>
  );
};

export default AppRouter;