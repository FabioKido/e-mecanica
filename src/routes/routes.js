import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { Transition } from 'react-native-reanimated';

import Login from '../pages/Login';
import Logout from '../pages/Logout';
import Dashboard from '../pages/Dashboard';

const Routes = createAppContainer(
  createAnimatedSwitchNavigator(
    {
      Logout,
      Login,
      Dashboard
    },
    {
      transition: (
        <Transition.Together>
          <Transition.Out type="fade" durationMs={200} interpolation="easeIn" />
          <Transition.In type="fade" durationMs={500} />
        </Transition.Together>
      ),
    }
  )
);

export default Routes;
