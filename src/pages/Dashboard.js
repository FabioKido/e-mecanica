import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { logout } from '../services/auth';

export default function Dashboard({navigation}) {

  async function handleLogout() {
    await logout();
    navigation.navigate('Login')
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text>Logado</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Text style={styles.buttonText}>Sair</Text>
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