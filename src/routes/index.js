import React from 'react';
import {
  createAppContainer,
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { Transition } from 'react-native-reanimated';

// Sign Routes

import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import CreateAccount from '../pages/CreateAccount';

// App Routes

import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';

const SignRoutes = createAnimatedSwitchNavigator(
  {
    Login,
    CreateAccount,
    ForgotPassword,
  },
  {
    transition: (
      <Transition.Together>
        <Transition.Out type="fade" durationMs={200} interpolation="easeIn" />
        <Transition.In type="fade" durationMs={500} />
      </Transition.Together>
    ),
  }
);

const BottomRoutes = createBottomTabNavigator(
  {
    Profile,
    Dashboard,
  },
  {
    tabBarOptions: {
      keyboardHidesTabBar: true,
      inactiveTintColor: 'rgba(255, 2555, 255, 0.5)',
      activeTintColor: '#fff',
      style: {
        height: 54,
        paddingVertical: 5,
        backgroundColor: '#000',
        borderTopColor: 'rgba(255, 255, 255, 0.4)',
      },
      labelStyle: {
        fontSize: 13,
      },
    },
  }
);

const AppRoutes = createStackNavigator(
  {
    BottomRoutes,
  },
  {
    headerMode: 'none',
  }
);

function getInitialRoute(signed) {
  if (signed) {
    return 'AppRoutes';
  }
  return 'SignRoutes';
}

export default (signed) =>
  createAppContainer(
    createAnimatedSwitchNavigator(
      {
        SignRoutes,
        AppRoutes,
      },
      {
        initialRouteName: getInitialRoute(signed),
        transition: (
          <Transition.Together>
            <Transition.Out
              type="fade"
              durationMs={300}
              interpolation="easeOut"
            />
            <Transition.In type="fade" delayMs={500} durationMs={300} />
          </Transition.Together>
        ),
      }
    )
  );

