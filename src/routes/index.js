import React from 'react';
import {
  createAppContainer,
  createStackNavigator,
  createBottomTabNavigator,
  createDrawerNavigator
} from 'react-navigation';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { Transition } from 'react-native-reanimated';

import CustomDrawer from '../components/Drawer';

// Sign Routes

import Login from '../pages/UserModule/Login';
import ForgotPassword from '../pages/UserModule/ForgotPassword';
import CreateAccount from '../pages/UserModule/CreateAccount';

// App Routes

import Dashboard from '../pages/ServiceModule/Dashboard';
import Profile from '../pages/UserModule/Profile';
import OrderService from '../pages/ServiceModule/OrderService';

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

const ManagementRoutes = createStackNavigator(
  {
    OrderService,
    Dashboard
  },
  {
    headerMode: 'none',
  }
);

const RelationshipRoutes = createStackNavigator(
  {
    Profile,
  },
  {
    headerMode: 'none',
  }
);

const StockRoutes = createStackNavigator(
  {
    OrderService,
    Dashboard
  },
  {
    headerMode: 'none',
  }
);

const FinanceRoutes = createStackNavigator(
  {
    Profile,
  },
  {
    headerMode: 'none',
  }
);

const CustomerRoutes = createStackNavigator(
  {
    OrderService,
    Dashboard
  },
  {
    headerMode: 'none',
  }
);

const ProfileRoutes = createStackNavigator(
  {
    Profile,
  },
  {
    headerMode: 'none',
  }
);

const OrderRoutes = createStackNavigator(
  {
    OrderService,
    Dashboard
  },
  {
    headerMode: 'none',
  }
);

// const AppRoutes = createBottomTabNavigator(
//   {

//   },
//   {
//     tabBarOptions: {
//       keyboardHidesTabBar: true,
//       inactiveTintColor: 'rgba(255, 2555, 255, 0.5)',
//       activeTintColor: '#fff',
//       style: {
//         height: 54,
//         paddingVertical: 5,
//         backgroundColor: '#000',
//         borderTopColor: 'rgba(255, 255, 255, 0.4)',
//       },
//       labelStyle: {
//         fontSize: 13,
//       },
//     },
//   }
// );

const AppRoutes = createDrawerNavigator(
  {
    Management: {
      screen: ManagementRoutes,
      navigationOptions: {
        drawerLabel: 'Dashboard',
        drawerIcon: ({ tintColor }) => (
          <FontAwesome5 name="chart-line" size={19} color={tintColor} />
        ),
      },
    },
    Order: {
      screen: OrderRoutes,
      navigationOptions: {
        drawerLabel: 'Serviços',
        drawerIcon: ({ tintColor }) => (
          <MaterialIcons name="build" size={19} color={tintColor} />
        ),
      },
    },
    Customer: {
      screen: CustomerRoutes,
      navigationOptions: {
        drawerLabel: 'Clientes',
        drawerIcon: ({ tintColor }) => (
          <FontAwesome5 name="users" size={19} color={tintColor} />
        ),
      },
    },
    Stock: {
      screen: StockRoutes,
      navigationOptions: {
        drawerLabel: 'Aquisições',
        drawerIcon: ({ tintColor }) => (
          <FontAwesome5 name="layer-group" size={19} color={tintColor} />
        ),
      },
    },
    Relationship: {
      screen: RelationshipRoutes,
      navigationOptions: {
        drawerLabel: 'Colaboradores',
        drawerIcon: ({ tintColor }) => (
          <FontAwesome5 name="user-tie" size={19} color={tintColor} />
        ),
      },
    },
    Finance: {
      screen: FinanceRoutes,
      navigationOptions: {
        drawerLabel: 'Finanças',
        drawerIcon: ({ tintColor }) => (
          <FontAwesome5 name="dollar-sign" size={19} color={tintColor} />
        ),
      },
    },
    Settings: {
      screen: ProfileRoutes,
      navigationOptions: {
        drawerLabel: 'Configurações',
        drawerIcon: ({ tintColor }) => (
          <FontAwesome5 name="users-cog" size={19} color={tintColor} />
        ),
      },
    },
  },
  {
    initialRouteName: 'Management',
    contentComponent: CustomDrawer,
    drawerType: 'back',
    lazy: true,
    contentOptions: {
      activeTintColor: '#f8a920',
      activeBackgroundColor: 'rgba(255, 255, 255, 0.1)',
      inactiveTintColor: '#999',
      labelStyle: {
        fontSize: 14
      }
    },
  },
)

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

