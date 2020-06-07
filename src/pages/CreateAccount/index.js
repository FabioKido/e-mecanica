import React, { useState, useRef, useCallback } from 'react';
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';

import * as Yup from 'yup';

import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import api from '../../services/api';

import {
  Container,
  Title,
  Description,
  FormContainer,
  InputContainer,
  InputTitle,
  Input,
  SubmitButton,
  SubmitButtonText,
  ForgotPasswordButton,
  ForgotPasswordButtonText,
} from './styles';

export default function CreateAccount({ navigation }) {
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const handleCreateAccount = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        username: Yup.string().required('Senha é obrigatória'),
        email: Yup.string().email('Digite um e-mail válido').required('O email é obrigatório'),
        password: Yup.string().required('Senha é obrigatória'),
        password_confirmation: Yup.string().required('Confirme sua senha')
      });

      await schema.validate({username, email, password, password_confirmation}, {
        abortEarly: false,
      });

      if (password !== password_confirmation) {
        setLoading(false);

        return;
      }

      await api.post('/session/signup', { username, email, password });

      Alert.alert(
        'Sucesso!',
        'Sua conta foi criada, agora faça login para entrar no app.',
        [
          {
            text: 'Fazer login',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
      
    } catch (err) {
      console.log(err);

      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message ||
          'Falha na criação de conta, verifique seus dados e tente novamente!'
      );

      setLoading(false);
    }

  }, [
    username,
    email,
    password,
    password_confirmation,
  ]);

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      enabled={Platform.OS === 'ios'}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Container>
          <FormContainer keyboardShouldPersistTaps="handled">
            <Title>CRIE SUA CONTA</Title>
            <Description>
              Digite suas informações para criar sua conta no app.
            </Description>

            <InputTitle>Nome de Usuário</InputTitle>
            <InputContainer>
              <Input
                placeholder="Digite o nome de usuário"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setUsername}
                value={username}
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current.focus()}
              />
              <MaterialIcons
                name="person-pin"
                size={20}
                color="#999"
              />
            </InputContainer>

            <InputTitle>E-mail de acesso</InputTitle>
            <InputContainer>
              <Input
                placeholder="Digite seu e-mail"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={setEmail}
                value={email}
                ref={emailInputRef}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current.focus()}
              />
              <MaterialIcons name="mail-outline" size={20} color="#999" />
            </InputContainer>

            <InputTitle>Senha de acesso</InputTitle>
            <InputContainer>
            <Input
                placeholder="Digite sua senha forte"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                ref={passwordInputRef}
                onChangeText={setPassword}
                value={password}
                returnKeyType="next"
                onSubmitEditing={() =>
                  confirmPasswordInputRef.current.focus()}
              />
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color="#999"
              />
            </InputContainer>

            <InputTitle>Confirmar Senha</InputTitle>
            <InputContainer>
                <Input
                  placeholder="Confirme a nova senha"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  ref={confirmPasswordInputRef}
                  onChangeText={setPasswordConfirmation}
                  value={password_confirmation}
                  returnKeyType="send"
                  textContentType="oneTimeCode"
                  onSubmitEditing={handleCreateAccount}
                />
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  color="#999"
                />
              </InputContainer>

            <SubmitButton onPress={handleCreateAccount}>
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <SubmitButtonText>CRIAR MINHA CONTA</SubmitButtonText>
              )}
            </SubmitButton>

            <ForgotPasswordButton onPress={() => navigation.navigate('Login')}>
              <ForgotPasswordButtonText>Voltar</ForgotPasswordButtonText>
            </ForgotPasswordButton>
          </FormContainer>
        </Container>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
