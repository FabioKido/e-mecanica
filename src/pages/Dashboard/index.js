import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { Switch } from 'galio-framework';
import Icon from 'react-native-vector-icons/Ionicons';

import api from '../../services/api';
import { logout } from '../../services/auth';
import argonTheme from '../../constants/Theme';
import Tabs from '../../components/Tabs';

import { signOutRequest } from '../../store/modules/auth/actions';
import { useDispatch } from 'react-redux';

export default function Dashboard({navigation}) {
  const dispatch = useDispatch();

  const [switch_1, setSwitch_1] = useState(false);

  navigation.navigationOptions = {
    drawerLabel: 'Dashboard',
    drawerIcon: ({ focused, tintColor }) => (
      <Icon name="grid-outline" size={16} style={styles.mainIcon} />
    ),
  };

  async function loadDash() {
    try {
      const response = await api.get('/user/info');
      const { enable } = response.data.data;

      setSwitch_1(enable);
    } catch (err) {
      console.log(err);
      Alert.alert("Houve um problema, verifique suas credenciais!");
    }
  }

  useEffect( () => {
    loadDash();
  }, []);

  async function handleLogout() {
    dispatch(signOutRequest());
  }

  async function handleSubmit() {
    try {
      const enable = switch_1 === false ? 0 : 1;

      const response = await api.put('/user/info/3', { enable });
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
      <Tabs/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  button: {
    height: 42,
    backgroundColor: '#0C7CC8',
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
