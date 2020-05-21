import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  Dimensions
} from 'react-native';
import { Form } from '@unform/mobile';
import * as Yup from 'yup';

import api from '../../services/api';
import argonTheme from '../../constants/Theme';
import TextInput from '../../components/Form/Input';
import { login } from '../../services/auth';

import {
  Wrapper,
  Container,
  Header,
  Title,
  FormInput,
  ButtonText,
  FormButton,
  HelpText,
  Underline,
  Loading
} from './styles';

const { width, height } = Dimensions.get("screen");

export default function Login({ navigation }) {

  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(data) {
    try{
      const schema = Yup.object().shape({
        email: Yup.string().email('Digite um e-mail válido').required('O email é obrigatório'),
        password: Yup.string().required('Senha é obrigatória')
      });

      await schema.validate(data, {
        abortEarly: false,
      })

      if(loading) return;

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
    <Wrapper>
      <Container>
        <Header />
        <Title>Autenticar</Title>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <FormInput
            name="email"
            placeholder="Seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <FormInput
            name="password"
            placeholder="Sua senha de acesso"
            autoCapitalize="words"
            autoCorrect={false}
          />

          <FormButton onPress={() => formRef.current.submitForm()}>
            <ButtonText>ENTRAR</ButtonText>
          </FormButton>
          {loading && <Loading />}
        </Form>
        <HelpText>Não consigo entrar: <Underline>Esqueci a senha</Underline> ou <Underline>Suporte</Underline></HelpText>
      </Container>
    </Wrapper>
  );
}
