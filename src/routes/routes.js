import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
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

const Routes = createAppContainer(
  createAnimatedSwitchNavigator(
    {
      Logout,
      Login,
      PasswordRecover,
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
