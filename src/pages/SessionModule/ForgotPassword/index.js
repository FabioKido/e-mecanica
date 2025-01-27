import React, { useState, useRef } from 'react';
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { resetPassword } from '../../../services/auth';

import {
  Container,
  FormContainer,
  InputContainer,
  InputTitle,
  Input,
  EnvelopeIcon,
  SubmitButton,
  SubmitButtonText,
  BackToLoginButton,
  BackToLoginButtonText,
} from './styles';

export default function ForgotPassword({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const emailInputRef = useRef();

  async function handleSubmit() {
    if (!email) return;

    Keyboard.dismiss();

    try {
      setLoading(true);

      await resetPassword(email);

      Alert.alert(
        'Sucesso!',
        'Cheque seu e-mail para instruções de recuperação de senha!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (err) {
      Alert.alert('Opss...', 'Houve um erro ao tentar recuperar sua senha.', [
        {
          text: 'OK',
          style: 'default',
          onPress: () => emailInputRef.current.focus(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={['#2b475c', '#000']}
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          behavior="padding"
          style={{ flex: 1 }}
          enabled={Platform.OS === 'ios'}
        >
          <Container>
            <FormContainer>
              <InputTitle>E-mail</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Digite um e-mail válido"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onChangeText={text => setEmail(text)}
                  selectTextOnFocus
                  ref={emailInputRef}
                  returnKeyType="send"
                  onSubmitEditing={handleSubmit}
                />
                <EnvelopeIcon />
              </InputContainer>

              <SubmitButton onPress={handleSubmit}>
                {loading ? (
                  <ActivityIndicator color="#000" size="small" />
                ) : (
                    <SubmitButtonText>RECUPERAR SENHA</SubmitButtonText>
                  )}
              </SubmitButton>

              <BackToLoginButton onPress={() => navigation.navigate('Login')}>
                <BackToLoginButtonText>Voltar ao login</BackToLoginButtonText>
              </BackToLoginButton>
            </FormContainer>
          </Container>
        </KeyboardAvoidingView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}
