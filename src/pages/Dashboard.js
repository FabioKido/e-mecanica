import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { Switch } from 'galio-framework';

import api from '../services/api';
import { logout } from '../services/auth';
import argonTheme from '../constants/Theme';

export default function Dashboard({navigation}) {

  const [switch_1, setSwitch_1] = useState(false);

  useEffect( () => {
    loadingState();
  }, []);

  async function loadingState() {
    try {
      const response = await api.get('/user/1');
      const { enable } = response.data.data;
         
      setSwitch_1(enable);
    } catch (err) {
      console.log(err);
      Alert.alert("Houve um problema, verifique suas credenciais!");
    }
  }

  async function handleLogout() {
    await logout();
    navigation.navigate('Login');
  }

  async function handleSubmit() {
    try {
      const enable = switch_1 === false ? 0 : 1;

      const response = await api.put('/user/1', { enable });
      const { message } = response.data;      

      Alert.alert(message);

      navigation.navigate('Dashboard');

    } catch (err) {
      console.log(err);
      Alert.alert("Houve um problema, verifique suas credenciais!");
    }
  }

  const thumbColor = switch_1 === false ? argonTheme.COLORS.SWITCH_OFF : argonTheme.COLORS.SWITCH_ON;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text>Logado</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
        <Switch
          value={switch_1}
          thumbColor={thumbColor}
          onChange={setSwitch_1}
          trackColor={{ false: argonTheme.COLORS.SWITCH_OFF, true: argonTheme.COLORS.SWITCH_ON }}
        />
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Salvar Switch</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  button: {
    height: 42,
    backgroundColor: '#00c4cc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});