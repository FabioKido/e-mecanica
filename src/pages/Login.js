import React, { useState, useEffect, useRef } from 'react';
import { View, KeyboardAvoidingView, Platform, Image, Text, StyleSheet, TouchableOpacity, Alert, AsyncStorage, Dimensions } from 'react-native';
import { Form } from '@unform/mobile';
import * as Yup from 'yup';

import api from '../services/api';
import { Loading } from './styles';
import argonTheme from '../constants/Theme';
import TextInput from '../components/Form/Input';
import { login, TOKEN_KEY } from '../services/auth';

const { width, height } = Dimensions.get("screen");

export default function Login({ navigation }) {

  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(TOKEN_KEY).then(user => {
      if (user) {
        navigation.navigate('Dashboard');
      }
    })
  }, []);

  async function handleSubmit(data) {
    try{
      const schema = Yup.object().shape({
        email: Yup.string().email('Digite um e-mail válido').required('O email é obrigatório'),
        password: Yup.string().required('Senha é obrigatória')
      });

      await schema.validate(data, {
        abortEarly: false,
      })

      if (loading) return;

      setLoading(true);

      const email = formRef.current.getFieldValue('email');
      const password = formRef.current.getFieldValue('password');

      const response = await api.post("/login", { email, password });
      const { access_token } = response.data;

      await login(access_token);

      //formRef.current.setErrors({});

      setLoading(false);
      navigation.navigate('Dashboard');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages = {};

        err.inner.forEach(error => {
          errorMessages[error.path] = error.message;
        })

        formRef.current.setErrors(errorMessages);
      }else{
        Alert.alert("Houve um problema, verifique suas credenciais!");
        setLoading(false);
      }
    }
  }
  //Resolver o StatusBar
  return (
    <KeyboardAvoidingView enabled={Platform.OS === 'android'} behavior="padding" style={styles.container}>
      <View style={styles.form}>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <TextInput
            name="email"
            label="SEU E-MAIL*"
            style={styles.input}
            placeholder="Seu e-mail"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            name="password"
            label="SUA SENHA*"
            style={styles.input}
            placeholder="Sua senha de acesso"
            placeholderTextColor="#999"
            autoCapitalize="words"
            autoCorrect={false}
          />

          <TouchableOpacity style={styles.button} onPress={() => formRef.current.submitForm()}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
          {loading && <Loading />}
        </Form>
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
