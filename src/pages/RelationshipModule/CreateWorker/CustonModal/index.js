import React, { useState, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons } from '@expo/vector-icons';

import {
  Container,
  Content,
  FormContainer,
  InputContainer,
  Title,
  Description,
  InputTitle,
  Input,
  SubmitButton,
  SubmitButtonText,
  DeleteButtonBox,
  DeleteButton,
  DeleteButtonText,
  CancelarButton,
  CancelarButtonText
} from './styles';

import api from '../../../../services/api';

export default function CustonModal({ worker, setIsVisible, reloadWorkers }) {

  return (
    <LinearGradient
      colors={['#2b475c', '#000']}
      style={{ flex: 1 }}
    >

    </LinearGradient>
  );
}