import React from 'react';
import { YellowBox, StatusBar } from 'react-native';

import Routes from './routes/routes.js';

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket'
]);

export default function App() {
  return (
    <>
      <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
      <Routes /> 
    </>
  );
}