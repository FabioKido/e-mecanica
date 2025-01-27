import React from 'react';
import { View, YellowBox, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import NavigationService from './services/navigation';
import createRoutes from './routes';

YellowBox.ignoreWarnings(['Unrecognized WebSocket']);

export default function App() {
  const { signed, user } = useSelector(state => state.auth, () => true);

  const RoutesWrapper = createRoutes(signed);

  return (
    <ActionSheetProvider>
      <View style={{ flex: 1, backgroundColor: '#100F12' }}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <RoutesWrapper
          ref={navRef => NavigationService.setTopLevelNavigator(navRef)}
        />
      </View>
    </ActionSheetProvider>
  );
}
