import react from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Login from '../pages/Login';
import Logout from '../pages/Logout';
import Dashboard from '../pages/Dashboard';

const Routes = createAppContainer(
  createSwitchNavigator({
    Logout,
    Login,
    Dashboard,
  })
);

export default Routes;
