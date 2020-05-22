import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-navigation';
import { Alert } from 'react-native';

import { Form } from '@unform/mobile';
import * as Yup from 'yup';

import api from '../../services/api';
import { login } from '../../services/auth';
import argonTheme from '../../constants/Theme';
import TextInput from '../../components/Form/Input';

import {
  Wrapper,
  Container,
  Header,
  Title,
  ButtonText,
  FormButton,
  HelpText,
  Underline,
  Loading
} from './styles';

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

      const response = await api.post("/session/signin", { email, password });
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
      <Header />
      <Container>
        <Title>Autenticar</Title>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <TextInput
            name="email"
            placeholder="Seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            name="password"
            placeholder="Sua senha de acesso"
            autoCapitalize="words"
            autoCorrect={false}
          />

          <FormButton onPress={() => formRef.current.submitForm()}>
            <ButtonText>ENTRAR</ButtonText>
          </FormButton>
        </Form>
        <HelpText><Underline>Esqueci a Senha</Underline> ou <Underline onPress={() => {navigation.navigate('Logout');}}>Registrar</Underline></HelpText>
        {loading && <Loading />}
      </Container>
    </Wrapper>
  );
}
