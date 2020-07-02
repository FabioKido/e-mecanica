import React, { useRef, useCallback, useState, useEffect } from 'react';
import {
  Keyboard,
  ActivityIndicator,
  Alert,
  Picker
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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

  const profile = useSelector(state => state.auth.user);

  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [complement, setComplement] = useState('');
  const [city, setCity] = useState('');
  const [uf, setUf] = useState('');

  const [loading, setLoading] = useState(false);

  const states = [
    { uf: 'AC', name: 'Acre - AC' },
    { uf: 'AL', name: 'Alagoas - AL' },
    { uf: 'AP', name: 'Amapá - AP' },
    { uf: 'AM', name: 'Amazonas - AM' },
    { uf: 'BA', name: 'Bahia - BA' },
    { uf: 'CE', name: 'Ceará - CE' },
    { uf: 'DF', name: 'Distrito Federal - DF' },
    { uf: 'ES', name: 'Espírito Santo - ES' },
    { uf: 'GO', name: 'Goiás - GO' },
    { uf: 'MA', name: 'Maranhão - MA' },
    { uf: 'MT', name: 'Mato Grosso - MT' },
    { uf: 'MS', name: 'Mato Grosso do Sul - MS' },
    { uf: 'MG', name: 'Minas Gerais - MG' },
    { uf: 'PA', name: 'Pará - PA' },
    { uf: 'PB', name: 'Paraíba - PB' },
    { uf: 'PR', name: 'Paraná - PR' },
    { uf: 'PE', name: 'Pernambuco - PE' },
    { uf: 'PI', name: 'Piauí - PI' },
    { uf: 'RJ', name: 'Rio de Janeiro - RJ' },
    { uf: 'RN', name: 'Rio Grande do Norte - RN' },
    { uf: 'RS', name: 'Rio Grande do Sul - RS' },
    { uf: 'RO', name: 'Rondônia - RO' },
    { uf: 'RR', name: 'Roraima - RR' },
    { uf: 'SC', name: 'Santa Catarina - SC' },
    { uf: 'SP', name: 'São Paulo - SP' },
    { uf: 'SE', name: 'Sergipe - SE' },
    { uf: 'TO', name: 'Tocantins - TO' }
  ];

  useEffect(() => {
    async function getInfos() {
      try {
        setLoading(true);

        const response = await getUserInfo();
        const { address } = response.data.data;

        setStreet(address.street);
        setNumber(address.number)
        setNeighborhood(address.neighborhood);
        setComplement(address.complement),
          setCity(address.city),
          setUf(address.uf);
      } catch (err) {
        console.log(err);
      } finally {
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
    <LinearGradient
      colors={['#2b475c', '#000']}
      style={{ flex: 1 }}
    >
      <Container>
        <Content keyboardShouldPersistTaps="handled">
          <FormContainer>
            <Title>Endereço</Title>
            <Description>
              Atualize suas informaçoes de endereço editando os campos abaixo, logo depois, clique em Salvar.
          </Description>

            <InputTitle>Logradouro</InputTitle>
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

            <InputTitle>Número</InputTitle>
            <InputContainer>
              <Input
                placeholder="Digite o nº do local"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="numeric"
                ref={numberInputRef}
                onChangeText={setNumber}
                value={number === null ? '' : String(number)}
                returnKeyType="next"
                onSubmitEditing={() => neighborhoodInputRef.current.focus()}
              />
              <MaterialIcons name="person-pin" size={20} color="#999" />
            </InputContainer>

            <InputTitle>Bairro</InputTitle>
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

            <InputTitle>Complemento</InputTitle>
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

            <InputTitle>Cidade</InputTitle>
            <InputContainer>
              <Input
                placeholder="Sua cidade atual"
                autoCapitalize="none"
                autoCorrect={false}
                ref={cityInputRef}
                onChangeText={setCity}
                value={city}
                returnKeyType="next"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              <MaterialIcons name="person-pin" size={20} color="#999" />
            </InputContainer>

            <InputTitle>UF</InputTitle>
            <InputContainer>
              <Picker
                selectedValue={uf}
                style={{
                  flex: 1,
                  color: '#f8a920',
                  backgroundColor: 'transparent',
                  fontSize: 17
                }}
                onValueChange={(itemValue, itemIndex) => setUf(itemValue)}
              >
                <Picker.Item label='Selecione a UF' value={uf} />
                {states && states.map(state => <Picker.Item key={state.uf} label={state.name} value={state.uf} />)}
              </Picker>
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

Profile.navigationOptions = {
  tabBarLabel: 'Endereço',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="shipping-fast" size={22} color={tintColor} />
  ),
};