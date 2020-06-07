import React, { useRef, useCallback, useState } from 'react';
import {
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import { updateProfileSuccess } from '../../store/modules/auth/actions';
import api from '../../services/api';

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
  const oldPasswordInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const profile = useSelector(state => state.auth.user);

  const [username, setUsername] = useState(profile.username);
  const [email, setEmail] = useState(profile.email);

  const [old_password, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');

  const [changePassword, setChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = useCallback(async () => {
    try {
      setLoading(true);

      const data = new FormData(); //eslint-disable-line

      data.append('username', username);

      if (email) {
        data.append('email', email);
      }

      if (old_password) {
        data.append('old_password', old_password);
        data.append('password', password);
        data.append('password_confirmation', password_confirmation);
      }

      await api.put('/profile', data);

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
    old_password,
    password,
    password_confirmation,
  ]);

  return (
    <Container>
      <Content keyboardShouldPersistTaps="handled">
        <FormContainer>
          <Title>CONFIGURAÇÃO</Title>
          <Description>
            Configure sua conta editando os campos abaixo, logo depois, clique em Salvar. 
          </Description>

          <InputTitle>USUÁRIO</InputTitle>
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

          <InputTitle>E-MAIL</InputTitle>
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
                  ? oldPasswordInputRef.current.focus()
                  : handleSaveProfile()
              }
            />
            <MaterialIcons name="mail-outline" size={20} color="#999" />
          </InputContainer>

          <InputTitle>ACESSO</InputTitle>
          <InputContainer>
            <Input
              editable={false}
              style={{color: '#f8a920'}}
              value={`Plano Free`}
            />
            <FontAwesome5 name="file-invoice-dollar" size={20} color="#999" />
          </InputContainer>

          <SwitchContainer>
            <SwitchText>Alterar senha</SwitchText>
            <Switch
              thumbColor="#38b6ff"
              trackColor={{ true: '#38b6ff', false: '#333' }}
              value={changePassword}
              onValueChange={setChangePassword}
            />
          </SwitchContainer>

          {changePassword && (
            <>
              <InputTitle>SENHA ATUAL</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Sua senha atual"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  ref={oldPasswordInputRef}
                  onChangeText={setOldPassword}
                  value={old_password}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordInputRef.current.focus()}
                />
                <MaterialIcons name="lock" size={20} color="#999" />
              </InputContainer>

              <InputTitle>NOVA SENHA</InputTitle>
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

              <InputTitle>CONFIRMAR SENHA</InputTitle>
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
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <SubmitButtonText>Salvar</SubmitButtonText>
            )}
          </SubmitButton>
        </FormContainer>
      </Content>
    </Container>
  );
}

Profile.navigationOptions = {
  tabBarLabel: 'Configuração',
  tabBarIcon: ({ tintColor }) => (
    <MaterialIcons name="settings" size={24} color={tintColor} />
  ),
};
