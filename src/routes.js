import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const Routes = createAppContainer(
  createSwitchNavigator({
    Login,
    Dashboard,
  })
);

export default Routes;