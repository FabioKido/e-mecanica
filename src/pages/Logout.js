import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Alert, AsyncStorage, Dimensions } from 'react-native';
import { Form } from '@unform/mobile';
import * as Yup from 'yup';

import api from '../services/api';
import { Loading } from './styles';
import argonTheme from '../constants/Theme';

import { TOKEN_KEY } from '../services/auth';

const { width, height } = Dimensions.get("screen");

export default function Logout({ navigation }) {

  useEffect(() => {
    AsyncStorage.getItem(TOKEN_KEY).then(user => {
      if(user) {
        navigation.navigate('Dashboard');
      }
    })
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.retangule}>
	<Text> Teste</Text>
      </View>
      <View style={styles.buttonBox}>
	  <TouchableOpacity style={styles.buttonLogin} onPress={() => {}}>
            <Text style={styles.buttonTextLogin}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonRegister} onPress={() => {}}>
            <Text style={styles.buttonTextRegister}>Entrar</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  retangule: {
    flex: 5,
    backgroundColor: "#0C7DC9"
  },

  buttonBox: {
    flex: 1,
    backgroundColor: "#FFF",
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  buttonRegister: {
    width: 167,
    height: 52,
    backgroundColor: '#0C7DC9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },

  buttonLogin: {
    width: 167,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#F6AC2D',
    borderRadius: 6
  },

  buttonTextRegister: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

  buttonTextLogin: {
    color: '#F6AC2D',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
