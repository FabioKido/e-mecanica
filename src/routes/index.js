import React from 'react';
import {
  createAppContainer,
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { Transition } from 'react-native-reanimated';

// Public Routes

import Login from '../pages/Login';
import PasswordRecover from '../pages/PasswordRecover';
import Logout from '../pages/Logout';
import Step1 from '../pages/Register/step1';
import Step2 from '../pages/Register/step2';

// Private Routes

import Dashboard from '../pages/Dashboard';

// Não é esse navigation é o Stack com header(com opção voltar).
// Adicionar um Tab navigation também...

// const Routes = createAppContainer(
//   createAnimatedSwitchNavigator(
//     {
//       Logout,
//       Login,
//       PasswordRecover,
//       Dashboard,
//       Step1,
//       Step2
//     },
//     {
//       transition: (
//         <Transition.Together>
//           <Transition.Out type="fade" durationMs={200} interpolation="easeIn" />
//           <Transition.In type="fade" durationMs={500} />
//         </Transition.Together>
//       ),
//     }
//   )
// );

// export default Routes;

const SignRoutes = createAnimatedSwitchNavigator(
  {
    Logout,
    Login,
    PasswordRecover,
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
        backgroundColor: '#222',
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

