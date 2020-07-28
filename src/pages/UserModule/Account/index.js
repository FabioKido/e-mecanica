import React, { useRef, useCallback, useState } from 'react';
import {
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import * as Yup from 'yup';

import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import { updateProfileSuccess } from '../../../store/modules/auth/actions';
import api from '../../../services/api';

import {
  Container,
  Content,
  FormContainer,
  InputContainer,
  Title,
  Description,
  InputTitle,
  Input,
  SwitchContainer,
  SwitchText,
  SubmitButton,
  SubmitButtonText,
} from './styles';

export default function Profile() {

  const dispatch = useDispatch();

  const eMailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const profile = useSelector(state => state.auth.user);

  const [username, setUsername] = useState(profile.username);
  const [email, setEmail] = useState(profile.email);

  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');

  const [changePassword, setChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = useCallback(async () => {
    try {
      setLoading(true);

      const schema = Yup.object().shape({
        username: Yup.string().required('Nome de usuário é obrigatório'),
        email: Yup.string().email('Digite um e-mail válido').required('e-mail é obrigatório'),
        password: Yup.string(),
        password_confirmation: Yup.string()
      });

      await schema.validate({ username, email, password, password_confirmation }, {
        abortEarly: false,
      });

      if (password !== password_confirmation) {
        setLoading(false);

        return;
      }

      await api.put(`/user/info/${profile.id}`, { username, email, password, password_confirmation });

      dispatch(
        updateProfileSuccess({
          username,
          email,
        })
      );

      Alert.alert('Sucesso!', 'Perfil atualizado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização do perfil, confira seus dados.'
      );
    } finally {
      setLoading(false);
    }
  }, [
    username,
    email,
    password,
    password_confirmation,
  ]);

  // Resolver como irão ver o plano de acesso.

  return (
    <LinearGradient
      colors={['#2b475c', '#000']}
      style={{ flex: 1 }}
    >
      <Container>
        <Content keyboardShouldPersistTaps="handled">
          <FormContainer>
            <Title>Conta</Title>
            <Description>
              Atualize as informaçoes da sua conta editando os campos abaixo, logo depois, clique em Salvar.
          </Description>

            <InputTitle>Usúario</InputTitle>
            <InputContainer>
              <Input
                placeholder="Digite nome de usuário"
                autoCapitalize="words"
                autoCorrect={false}
                onChangeText={setUsername}
                value={username}
                returnKeyType="next"
                onSubmitEditing={() => eMailInputRef.current.focus()}
              />
              <MaterialIcons name="person-pin" size={20} color="#999" />
            </InputContainer>

            <InputTitle>E-mail</InputTitle>
            <InputContainer>
              <Input
                placeholder="Seu endereço de e-mail"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                ref={eMailInputRef}
                onChangeText={setEmail}
                value={email}
                returnKeyType={changePassword ? 'next' : 'send'}
                onSubmitEditing={() =>
                  changePassword
                    ? passwordInputRef.current.focus()
                    : handleSaveProfile()
                }
              />
              <MaterialIcons name="mail-outline" size={20} color="#999" />
            </InputContainer>

            <InputTitle>Acesso</InputTitle>
            <InputContainer>
              <Input
                editable={false}
                style={{ color: '#2b475c' }}
                value={String(profile.id_access_plan)}
              />
              <FontAwesome5 name="block" size={20} color="#999" />
            </InputContainer>

            <SwitchContainer>
              <SwitchText>Alterar senha?</SwitchText>
              <Switch
                thumbColor="#f8a920"
                trackColor={{ true: '#f8a920', false: '#2b475c' }}
                value={changePassword}
                onValueChange={setChangePassword}
              />
            </SwitchContainer>

            {changePassword && (
              <>
                <InputTitle>Nova Senha</InputTitle>
                <InputContainer>
                  <Input
                    placeholder="Sua nova senha"
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
                  <MaterialIcons name="lock" size={20} color="#999" />
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
                    onSubmitEditing={handleSaveProfile}
                  />
                  <MaterialIcons name="lock" size={20} color="#999" />
                </InputContainer>
              </>
            )}

            <SubmitButton onPress={handleSaveProfile}>
              {loading ? (
                <ActivityIndicator size="small" color="#333" />
              ) : (
                  <SubmitButtonText>Salvar</SubmitButtonText>
                )}
            </SubmitButton>
          </FormContainer>
        </Content>
      </Container>
    </LinearGradient>
  );
}

Profile.navigationOptions = {
  tabBarLabel: 'Conta',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="user-cog" size={22} color={tintColor} />
  ),
};