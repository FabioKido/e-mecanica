import React, { useState, useRef } from 'react';
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useSelector, useDispatch } from 'react-redux';

import { signInRequest } from '../../../store/modules/auth/actions';

import {
  Container,
  Title,
  FormContainer,
  InputContainer,
  InputTitle,
  Input,
  EnvelopeIcon,
  LockIcon,
  SubmitButton,
  SubmitButtonText,
  NewAccountButton,
  NewAccountButtonText,
  ForgotPasswordButton,
  ForgotPasswordButtonText
} from './styles';

export default function Login({ navigation }) {
  const loading = useSelector(state => state.auth.loading);

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const passwordInputRef = useRef();

  const dispatch = useDispatch();

  async function handleSubmit() {
    if (!email || !password) return;

    Keyboard.dismiss();

    dispatch(signInRequest(email, password));
  }

  function handleCreateAccount() {
    navigation.navigate('CreateAccount');
  }

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      enabled={Platform.OS === 'ios'}
    >
      <LinearGradient
        colors={['#2b475c', '#000']}
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={{ flex: 1 }}
        >

          <Container>
            <Title>Login</Title>
            <FormContainer>
              <InputTitle>E-mail</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Seu e-mail"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onChangeText={text => setEmail(text)}
                  value={email}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordInputRef.current.focus()}
                />
                <EnvelopeIcon />
              </InputContainer>

              <InputTitle>Senha</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Senha secreta"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  onChangeText={text => setPassword(text)}
                  value={password}
                  ref={passwordInputRef}
                  returnKeyType="send"
                  onSubmitEditing={handleSubmit}
                />
                <LockIcon />
              </InputContainer>

              <SubmitButton onPress={handleSubmit}>
                {loading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                    <SubmitButtonText>ENTRAR</SubmitButtonText>
                  )}
              </SubmitButton>

              <NewAccountButton onPress={handleCreateAccount}>
                <NewAccountButtonText>CRIAR UMA CONTA</NewAccountButtonText>
              </NewAccountButton>

              <ForgotPasswordButton
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <ForgotPasswordButtonText>
                  Esqueci minha senha
                </ForgotPasswordButtonText>
              </ForgotPasswordButton>
            </FormContainer>
          </Container>
        </KeyboardAvoidingView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}
