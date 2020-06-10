import React, { useRef, useCallback, useState, useEffect } from 'react';
import {
  Keyboard,
  ActivityIndicator,
  Alert,
} from 'react-native';

import * as Yup from 'yup';

import { useSelector } from 'react-redux';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import api from '../../../services/api';
import { getUserInfo } from '../../../services/infos';

import {
  Container,
  Content,
  FormContainer,
  InputContainer,
  Title,
  Description,
  InputTitle,
  Input,
  SubmitButton,
  SubmitButtonText,
} from './styles';

export default function Profile() {

  const phoneInputRef = useRef();
  const eMailInputRef = useRef();

  const profile = useSelector(state => state.auth.user);

  const [celphone, setCelphone] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getInfos() {
      try{
        setLoading(true);

        const response = await getUserInfo();
        const { contact } = response.data.data; 

        setCelphone(contact.celphone);
        setPhone(contact.phone);
        setEmail(contact.email);
      }catch(err) {
        console.log(err);
      }finally{
        setLoading(false);
      }
    }
    
    getInfos();
  }, []);

  const handleSaveProfile = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        celphone: Yup.string().required('Celular é obrigatório'),
        email: Yup.string().email('Digite um e-mail válido'),
        phone: Yup.string()
      });

      await schema.validate({celphone, email, phone }, {
        abortEarly: false,
      });

      await api.put(`/user/info/${profile.id}`, { celphone, email, phone });

      Alert.alert('Sucesso!', 'Contatos atualizado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização dos contatos, confira seus dados.'
      );
    } finally {
      setLoading(false);
    }
  }, [
    celphone,
    email,
    phone
  ]);

  return (
    <Container>
      <Content keyboardShouldPersistTaps="handled">
        <FormContainer>
          <Title>CONTATO</Title>
          <Description>
            Atualize suas informaçoes de contato editando os campos abaixo, logo depois, clique em Salvar. 
          </Description>

          <InputTitle>CELULAR</InputTitle>
          <InputContainer>
            <Input
              placeholder="Digite o número do celular"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="phone-pad"
              maxLength={16}
              onChangeText={setCelphone}
              value={celphone}
              returnKeyType="next"
              onSubmitEditing={() => phoneInputRef.current.focus()}
            />
            <MaterialIcons name="person-pin" size={20} color="#999" />
          </InputContainer>

          <InputTitle>TELEFONE</InputTitle>
          <InputContainer>
            <Input
              placeholder="Digite o número do telefone"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="phone-pad"
              maxLength={15}
              ref={phoneInputRef}
              onChangeText={setPhone}
              value={phone}
              returnKeyType="next"
              onSubmitEditing={() => eMailInputRef.current.focus()}
            />
            <MaterialIcons name="lock" size={20} color="#999" />
          </InputContainer>

          <InputTitle>E-MAIL</InputTitle>
          <InputContainer>
            <Input
              placeholder="Seu endereço de e-mail"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              ref={eMailInputRef}
              onChangeText={setEmail}
              value={email}
              returnKeyType={'send'}
              onSubmitEditing={handleSaveProfile}
            />
            <MaterialIcons name="mail-outline" size={20} color="#999" />
          </InputContainer>

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
  tabBarLabel: 'Contato',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="phone" size={22} color={tintColor} />
  ),
};