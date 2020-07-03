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

import { colors } from '../styles';

import CustomDrawer from '../components/Drawer';

// Sign Routes

import Login from '../pages/SessionModule/Login';
import ForgotPassword from '../pages/SessionModule/ForgotPassword';
import CreateAccount from '../pages/SessionModule/CreateAccount';

// App Routes

import Account from '../pages/UserModule/Account';
import Profile from '../pages/UserModule/Profile';
import Contact from '../pages/UserModule/Contact';
import Address from '../pages/UserModule/Address';

import Category from '../pages/FinanceModule/Category';
import Recipes from '../pages/FinanceModule/Recipes';
import Expenses from '../pages/FinanceModule/Expenses';
import Transfers from '../pages/FinanceModule/Transfers';
import Accounts from '../pages/FinanceModule/Accounts';
import PaymentMethods from '../pages/FinanceModule/PaymentMethods';

import Customers from '../pages/CustomerModule/Customer';
import Vehicles from '../pages/CustomerModule/Vehicles';
import CustomerDashboard from '../pages/CustomerModule/Dashboard';

import Dashboard from '../pages/ServiceModule/Dashboard';
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

const CustomerBottomRoutes = createBottomTabNavigator(
  {
    CustomerDashboard,
    Customers,
    Vehicles,
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
        borderTopColor: '#000',
      },
      labelStyle: {
        fontSize: 13,
      },
    },
  }
);

const SettingBottomRoutes = createBottomTabNavigator(
  {
    Profile,
    Contact,
    Address,
    Account,
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
        borderTopColor: '#000',
      },
      labelStyle: {
        fontSize: 13,
      },
    },
  }
);

const FinanceBottomRoutes = createBottomTabNavigator(
  {
    Transfers,
    Recipes,
    Expenses,
    Category,
    Accounts,
    PaymentMethods
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
        borderTopColor: '#000',
      },
      labelStyle: {
        fontSize: 10,
      },
    },
  }
);

const ManagementRoutes = createStackNavigator(
  {
    Dashboard,
  },
  {
    headerMode: 'none',
  }
);

const RelationshipRoutes = createStackNavigator(
  {
    Dashboard,
  },
  {
    headerMode: 'none',
  }
);

const StockRoutes = createStackNavigator(
  {
    Dashboard,
  },
  {
    headerMode: 'none',
  }
);

const FinanceRoutes = createStackNavigator(
  {
    FinanceBottomRoutes,
  },
  {
    headerMode: 'none',
  }
);

const CustomerRoutes = createStackNavigator(
  {
    CustomerBottomRoutes,
  },
  {
    headerMode: 'none',
  }
);

const SettingsRoutes = createStackNavigator(
  {
    SettingBottomRoutes,
  },
  {
    headerMode: 'none',
  }
);

const OrderRoutes = createStackNavigator(
  {
    Dashboard,
  },
  {
    headerMode: 'none',
  }
);

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
          <FontAwesome5 name="file-invoice-dollar" size={19} color={tintColor} />
        ),
      },
    },
    Settings: {
      screen: SettingsRoutes,
      navigationOptions: {
        drawerLabel: 'Configurações',
        drawerIcon: ({ tintColor }) => (
          <FontAwesome5 name="users-cog" size={19} color={tintColor} />
        ),
      },
    },
  },
  {
    initialRouteName: 'Settings',
    contentComponent: CustomDrawer,
    drawerType: 'back',
    lazy: true,
    contentOptions: {
      activeTintColor: `${colors.regular_yellow}`,
      activeBackgroundColor: 'rgba(248, 169, 32, 0.1)',
      inactiveTintColor: `${colors.light_gray}`,
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

