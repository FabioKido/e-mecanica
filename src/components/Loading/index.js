import React from 'react';
import Lottie from "lottie-react-native";

import loading from '../../assets/loading.json';

export default function Loading() {
  return (
    <Lottie resizeMode="contain" autoSize source={loading} autoPlay loop />
  )
}
