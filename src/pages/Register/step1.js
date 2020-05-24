import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-navigation';
import { Alert } from 'react-native';

import { Form } from '@unform/mobile';
import * as Yup from 'yup';

import api from '../../services/api';
import { login } from '../../services/auth';
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

  async function handleNextSubmit(data) {
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

      setLoading(false);
      navigation.navigate('Step2');

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
        <Title>Registrar</Title>
        <Form ref={formRef} onSubmit={handleNextSubmit}>
          <TextInput
            name="email"
            placeholder="Digite seu melhor e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            name="password"
            placeholder="Crie uma senha forte aqui"
            autoCapitalize="words"
            autoCorrect={false}
          />

          <FormButton onPress={() => formRef.current.submitForm()}>
            <ButtonText>PROXÍMO</ButtonText>
          </FormButton>
        </Form>
        <HelpText>Esqueci a Senha ou Registrar</HelpText>
      </Container>
    </Wrapper>
  );
}
