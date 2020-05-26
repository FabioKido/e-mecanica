import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { Transition } from 'react-native-reanimated';

import Login from '../pages/Login';
import Logout from '../pages/Logout';
import Dashboard from '../pages/Dashboard';
import Step1 from '../pages/Register/step1';
import Step2 from '../pages/Register/step2';

const Routes = createAppContainer(
  createAnimatedSwitchNavigator(
    {
      Logout,
      Login,
      Dashboard,
      Step1,
      Step2
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
