import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, Image, Text, TextInput, TouchableOpacity, StyleSheet, Alert, AsyncStorage, Dimensions } from 'react-native';
import argonTheme from '../constants/Theme';

import api from '../services/api';
import { login, TOKEN_KEY } from '../services/auth';

const { width, height } = Dimensions.get("screen");

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    AsyncStorage.getItem(TOKEN_KEY).then(user => {
      if (user) {
        navigation.navigate('Dashboard');
      }
    })
  }, []);

  async function handleSubmit() {
    if (!email || !password) {
      Alert.alert("Preencha e-mail e senha para continuar!");
    } else {
      try {
        const response = await api.post("/login", { email, password });
        const { access_token } = response.data;

        await login(access_token);

        navigation.navigate('Dashboard');

      } catch (err) {
        Alert.alert("Houve um problema, verifique suas credenciais!");
      }
    }
  }

  return (
    <KeyboardAvoidingView enabled={Platform.OS === 'android'} behavior="padding" style={styles.container}>

      <View style={styles.form}>
        <Text style={styles.label}>SEU E-MAIL*</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu e-mail"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>SUA SENHA*</Text>
        <TextInput
          style={styles.input}
          placeholder="Sua senha de acesso"
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00c4cc',
  },

  form: {
    width: width * 0.9,
    height: height * 0.78,
    backgroundColor: "#FFF",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden",
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginTop: 30,
  },

  label: {
    fontWeight: 'bold',
    color: '#00c4cc',
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#444',
    height: 44,
    marginBottom: 20,
    borderRadius: 2
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
