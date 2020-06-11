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

  const numberInputRef = useRef();
  const neighborhoodInputRef = useRef();
  const complementInputRef = useRef();
  const cityInputRef = useRef();
  const ufInputRef = useRef();

  const profile = useSelector(state => state.auth.user);
  
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [complement, setComplement] = useState('');
  const [city, setCity] = useState('');
  const [uf, setUf] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getInfos() {
      try{
        setLoading(true);

        const response = await getUserInfo();
        const { address } = response.data.data; 

        setStreet(address.street);
        setNumber(address.number)
        setNeighborhood(address.neighborhood);
        setComplement(address.complement),
        setCity(address.city),
        setUf(address.uf);
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
        city: Yup.string().required('Cidade é obrigatória'),
        uf: Yup.string().required('Estado é obrigatório')
      });

      await schema.validate({ number, city, uf }, {
        abortEarly: false,
      });

      await api.put(`/user/info/${profile.id}`, { street, number, neighborhood, complement, city, uf });

      Alert.alert('Sucesso!', 'Endereço atualizado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização do endereço, confira seus dados.'
      );
    } finally {
      setLoading(false);
    }
  }, [
    street,
    number,
    neighborhood,
    complement,
    city,
    uf
  ]);

  return (
    <Container>
      <Content keyboardShouldPersistTaps="handled">
        <FormContainer>
          <Title>ENDEREÇO</Title>
          <Description>
            Atualize suas informaçoes de endereço editando os campos abaixo, logo depois, clique em Salvar. 
          </Description>

          <InputTitle>LOGRADOURO</InputTitle>
          <InputContainer>
            <Input
              placeholder="Digite uma rua/av/outros"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setStreet}
              value={street}
              returnKeyType="next"
              onSubmitEditing={() => numberInputRef.current.focus()}
            />
            <MaterialIcons name="person-pin" size={20} color="#999" />
          </InputContainer>

          <InputTitle>NÚMERO</InputTitle>
          <InputContainer>
            <Input
              placeholder="Digite o nº do local"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="phone-pad"
              ref={numberInputRef}
              onChangeText={setNumber}
              value={number === null ? '' : String(number)}
              returnKeyType="next"
              onSubmitEditing={() => neighborhoodInputRef.current.focus()}
            />
            <MaterialIcons name="person-pin" size={20} color="#999" />
          </InputContainer>

          <InputTitle>BAIRRO</InputTitle>
          <InputContainer>
            <Input
              placeholder="Digite o nome do bairro"
              autoCapitalize="none"
              autoCorrect={false}
              ref={neighborhoodInputRef}
              onChangeText={setNeighborhood}
              value={neighborhood}
              returnKeyType="next"
              onSubmitEditing={() => complementInputRef.current.focus()}
            />
            <MaterialIcons name="lock" size={20} color="#999" />
          </InputContainer>

          <InputTitle>COMPLEMENTO</InputTitle>
          <InputContainer>
            <Input
              placeholder="Complemente se necessário"
              autoCapitalize="none"
              autoCorrect={false}
              ref={complementInputRef}
              onChangeText={setComplement}
              value={complement}
              returnKeyType="next"
              onSubmitEditing={() => cityInputRef.current.focus()}
            />
            <MaterialIcons name="person-pin" size={20} color="#999" />
          </InputContainer>

          <InputTitle>CIDADE</InputTitle>
          <InputContainer>
            <Input
              placeholder="Sua cidade atual"
              autoCapitalize="none"
              autoCorrect={false}
              ref={cityInputRef}
              onChangeText={setCity}
              value={city}
              returnKeyType="next"
              onSubmitEditing={() => ufInputRef.current.focus()}
            />
            <MaterialIcons name="person-pin" size={20} color="#999" />
          </InputContainer>

          <InputTitle>UF</InputTitle>
          <InputContainer>
            <Input
              placeholder="Seu estado federativo atual"
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={2}
              ref={ufInputRef}
              onChangeText={setUf}
              value={uf}
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
  tabBarLabel: 'Endereço',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="shipping-fast" size={22} color={tintColor} />
  ),
};