import React, { useState, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Picker
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInputMask } from 'react-native-masked-text';

import { MaterialIcons } from '@expo/vector-icons';

import {
  Container,
  Content,
  FormContainer,
  InputContainer,
  Title,
  Description,
  TitleSection,
  InputTitle,
  Input,
  SwitchContainer,
  ChoiceButton,
  ChoiceText,
  SubmitButton,
  SubmitButtonText,
  DeleteButtonBox,
  DeleteButton,
  DeleteButtonText,
  CancelarButton,
  CancelarButtonText
} from './styles';

import api from '../../../../services/api';
import { getProviderInfo } from '../../../../services/infos';
import CheckBox from "../../../../components/CheckBox";

export default function CustonModal({ provider, setIsVisible, reloadProviders }) {

  const cnpjInputRef = useRef();
  const ieInputRef = useRef();
  const observationsInputRef = useRef();

  const phoneInputRef = useRef();
  const eMailInputRef = useRef();

  const logradouroInputRef = useRef();
  const numberInputRef = useRef();
  const neighborhoodInputRef = useRef();
  const complementInputRef = useRef();
  const cityInputRef = useRef();
  const ufInputRef = useRef();

  const [name, setName] = useState(provider.name);
  const [cnpj, setCNPJ] = useState(provider.cnpj);
  const [ie, setIE] = useState(provider.ie);
  const [observations, setObservations] = useState(provider.observations);
  const [product_provider, setProductProvider] = useState(provider.product_provider);

  const [celphone, setCelphone] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [street, setStreet] = useState('');
  const [number, setNumber] = useState(null);
  const [neighborhood, setNeighborhood] = useState('');
  const [complement, setComplement] = useState('');
  const [city, setCity] = useState('');
  const [uf, setUf] = useState('');

  const [more_info, setMoreInfo] = useState(false);
  const [value_click, setValueClick] = useState(true);

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

  async function getInfos() {
    if (value_click) {
      try {
        setLoading(true);

        const response = await getProviderInfo(provider.id);

        const { contact, address } = response.data.data;

        setCelphone(contact.celphone);
        setPhone(contact.phone);
        setEmail(contact.email);

        setStreet(address.street);
        setNumber(address.number)
        setNeighborhood(address.neighborhood);
        setComplement(address.complement),
          setCity(address.city),
          setUf(address.uf);

      } catch (err) {
        console.log(err);
      } finally {
        setValueClick(false);
        setLoading(false);
      }
    }
  }

  const handleDeleteProvider = async () => {
    try {
      await api.delete(`/stock/provider/${provider.id}`);

      Alert.alert('Excluído!', 'Fornecedor deletado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na exclusão de fornecedor.'
      );
    } finally {
      reloadProviders();
      setIsVisible(false);
    }
  }

  const handleUpdateProvider = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      await api.put(`/stock/provider/${provider.id}`, {
        name,
        cnpj,
        ie,
        observations,
        product_provider,
        celphone,
        phone,
        email,
        street,
        number,
        neighborhood,
        complement,
        city,
        uf
      });

      Alert.alert('Sucesso!', 'Fornecedor atualizado com sucesso.');

    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização de fornecedor, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadProviders();
    }
  }, [
    name,
    cnpj,
    ie,
    observations,
    product_provider,
    celphone,
    phone,
    email,
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
            <Title>{provider.name}</Title>
            <Description>
              Edite ou exclua esse fornecedor como quiser.
            </Description>

            <SwitchContainer>
              <ChoiceText>Fornece Produtos?</ChoiceText>

              <CheckBox
                iconColor="#f8a920"
                checkColor="#f8a920"
                value={product_provider}
                onChange={() => setProductProvider(!product_provider)}
              />
            </SwitchContainer>

            <InputTitle>Nome</InputTitle>
            <InputContainer>
              <Input
                placeholder="Novo nome"
                autoCapitalize="words"
                autoCorrect={false}
                onChangeText={setName}
                value={name}
                returnKeyType="next"
                onSubmitEditing={() => cnpjInputRef.current.focus()}
              />
              <MaterialIcons name="person-pin" size={20} color="#999" />
            </InputContainer>

            <InputTitle>CNPJ</InputTitle>
            <InputContainer>
              <TextInputMask
                placeholder="Número do CNPJ"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={18}
                type={'cnpj'}
                ref={cnpjInputRef}
                onChangeText={text => setCNPJ(text)}
                value={cnpj}
                style={{
                  height: 48,
                  fontSize: 17,
                  color: '#FFF',
                  flex: 1
                }}
                placeholderTextColor='#5f6368'
                returnKeyType="next"
                onSubmitEditing={() => ieInputRef.current.focus()}
              />
              <MaterialIcons name="lock" size={20} color="#999" />
            </InputContainer>

            <InputTitle>IE</InputTitle>
            <InputContainer>
              <Input
                placeholder="Sua Inscrição Estadual"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="numeric"
                maxLength={9}
                ref={ieInputRef}
                onChangeText={setIE}
                value={ie}
                returnKeyType="next"
                onSubmitEditing={() => observationsInputRef.current.focus()}
              />
              <MaterialIcons name="lock" size={20} color="#999" />
            </InputContainer>

            <InputTitle>Observações</InputTitle>
            <InputContainer>
              <Input
                placeholder="Algo importante sobre o fornecedor"
                autoCapitalize="none"
                autoCorrect={false}
                ref={observationsInputRef}
                onChangeText={setObservations}
                value={observations}
                returnKeyType="next"
                onSubmitEditing={() => Keyboard.current.focus()}
              />
              <MaterialIcons name="lock" size={20} color="#999" />
            </InputContainer>

            <ChoiceButton
              onPress={() => {
                setMoreInfo(ant => !ant)
                getInfos()
              }}
            >
              <ChoiceText>Informações Adicionais?</ChoiceText>
            </ChoiceButton>

            {more_info && (
              <>
                <TitleSection>Contato</TitleSection>

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
                    returnKeyType={'next'}
                    onSubmitEditing={() => logradouroInputRef.current.focus()}
                  />
                  <MaterialIcons name="mail-outline" size={20} color="#999" />
                </InputContainer>

                <TitleSection>Endereço</TitleSection>

                <InputTitle>Logradouro</InputTitle>
                <InputContainer>
                  <Input
                    placeholder="Digite uma rua/av/outros"
                    autoCapitalize="words"
                    autoCorrect={false}
                    ref={logradouroInputRef}
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
                    autoCapitalize="words"
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
                    autoCapitalize="words"
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
              </>
            )}

            <DeleteButtonBox>
              <DeleteButton onPress={handleDeleteProvider}>
                <DeleteButtonText>Excluir</DeleteButtonText>
              </DeleteButton>
              <SubmitButton style={{ width: 125 }} onPress={handleUpdateProvider}>
                {loading ? (
                  <ActivityIndicator size="small" color="#333" />
                ) : (
                    <SubmitButtonText>Salvar</SubmitButtonText>
                  )}
              </SubmitButton>
            </DeleteButtonBox>
            <CancelarButton onPress={() => setIsVisible(false)}>
              <CancelarButtonText>Voltar</CancelarButtonText>
            </CancelarButton>

          </FormContainer>

        </Content>
      </Container>
    </LinearGradient>
  );
}