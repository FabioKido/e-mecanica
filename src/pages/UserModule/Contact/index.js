import React, { useRef, useCallback, useState, useEffect } from 'react';
import {
  Keyboard,
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInputMask } from 'react-native-masked-text';

import * as Yup from 'yup';

import { useSelector } from 'react-redux';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import api from '../../../services/api';
import { getUserInfo } from '../../../services/infos';

import LoadGif from '../../../assets/loading.gif';

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
  const [first_loading, setFirstLoading] = useState(true);

  useEffect(() => {
    async function getInfos() {
      try {

        const response = await getUserInfo();
        const { contact } = response.data.data;

        setCelphone(contact.celphone);
        setPhone(contact.phone);
        setEmail(contact.email);
      } catch (err) {
        console.log(err);
      } finally {
        setFirstLoading(false);
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

      await schema.validate({ celphone, email, phone }, {
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

  if (first_loading) {
    return (
      <LinearGradient
        colors={['#2b475c', '#000']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Image source={LoadGif} resizeMode='contain' style={{ height: 75, width: 75 }} />
      </LinearGradient>
    );
  } else {
    return (
      <LinearGradient
        colors={['#2b475c', '#000']}
        style={{ flex: 1 }}
      >
        <Container>
          <Content keyboardShouldPersistTaps="handled">
            <FormContainer>
              <Title>Contato</Title>
              <Description>
                Atualize suas informaçoes de contato editando os campos abaixo, logo depois, clique em Salvar.
          </Description>

              <InputTitle>Celular</InputTitle>
              <InputContainer>
                <TextInputMask
                  placeholder="Digite o número do celular"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="phone-pad"
                  maxLength={15}
                  type={'cel-phone'}
                  options={{
                    maskType: 'BRL',
                    withDDD: true,
                    dddMask: '(99) '
                  }}
                  style={{
                    height: 48,
                    fontSize: 17,
                    color: '#FFF',
                    flex: 1
                  }}
                  placeholderTextColor='#5f6368'
                  onChangeText={text => setCelphone(text)}
                  value={celphone}
                  returnKeyType="next"
                  onSubmitEditing={() => phoneInputRef.current.focus()}
                />
                <MaterialIcons name="person-pin" size={20} color="#999" />
              </InputContainer>

              <InputTitle>Telefone</InputTitle>
              <InputContainer>
                <TextInputMask
                  placeholder="Digite o número do telefone"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="phone-pad"
                  maxLength={15}
                  type={'cel-phone'}
                  options={{
                    maskType: 'BRL',
                    withDDD: true,
                    dddMask: '(99) '
                  }}
                  style={{
                    height: 48,
                    fontSize: 17,
                    color: '#FFF',
                    flex: 1
                  }}
                  placeholderTextColor='#5f6368'
                  ref={phoneInputRef}
                  onChangeText={text => setPhone(text)}
                  value={phone}
                  returnKeyType="next"
                  onSubmitEditing={() => eMailInputRef.current.focus()}
                />
                <MaterialIcons name="lock" size={20} color="#999" />
              </InputContainer>

              <InputTitle>E-mail</InputTitle>
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
}

Profile.navigationOptions = {
  tabBarLabel: 'Contato',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="mobile-alt" size={22} color={tintColor} />
  ),
};