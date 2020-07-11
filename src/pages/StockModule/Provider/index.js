import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  View,
  Modal,
  Picker
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInputMask } from 'react-native-masked-text';

import * as Yup from 'yup';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

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
  ChoiceText,
  SubmitButton,
  SubmitButtonText,
  CancelarButton,
  CancelarButtonText,
  Cards,
  Card,
  CardInfo,
  CardTitle,
  CardContainer,
  CardName,
  CardSubName,
  CardStatus,
  Empty
} from './styles';

import Placeholder from './Placeholder';
import CustonModal from './CustonModal';

import CheckBox from "../../../components/CheckBox";

import api from '../../../services/api';

export default function Providers() {

  const observationsInputRef = useRef();
  const cnpjInputRef = useRef();
  const ieInputRef = useRef();

  const [providers, setProviders] = useState([]);
  const [provider, setProvider] = useState({});
  const [add_provider, setAddProvider] = useState(false);

  const [name, setName] = useState('');
  const [cnpj, setCNPJ] = useState('');
  const [ie, setIE] = useState('');
  const [observations, setObservations] = useState('');

  const [product_provider, setProductProvider] = useState(true);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadProviders() {
      try {
        setLoading(true);

        const response = await api.get('/stock/providers');
        const { providers } = response.data;

        setProviders(providers);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadProviders();
  }, []);

  async function reloadProviders() {
    try {
      setRefreshing(true);

      const response = await api.get('/stock/providers');
      const { providers } = response.data;

      setProviders(providers);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de fornecedores, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  function getProvider(provider) {
    setProvider(provider);

    setIsVisible(true);
  }

  const handleSaveProvider = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório')
      });

      await schema.validate({ name }, {
        abortEarly: false,
      });

      await api.post('/stock/provider', {
        name,
        cnpj,
        ie,
        observations,
        product_provider
      });

      Alert.alert('Sucesso!', 'Novo fornecedor registrado com sucesso.');

    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha no registro de novo fornecedor, confira seus dados.'
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
    product_provider
  ]);

  function ViewButton() {
    if (add_provider) {
      return (
        <>
          <SubmitButton onPress={handleSaveProvider}>
            {loading ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
                <SubmitButtonText>Salvar</SubmitButtonText>
              )}
          </SubmitButton>
          <CancelarButton onPress={() => setAddProvider(false)}>
            <CancelarButtonText>Voltar</CancelarButtonText>
          </CancelarButton>
        </>
      );
    } else {
      return (
        <>
          {loading ? (
            <Placeholder />
          ) : (
              <Cards
                data={providers}
                renderItem={renderProviders}
                keyExtractor={providers => `provider-${providers.id}`}
                showsVerticalScrollIndicator={false}
                onRefresh={reloadProviders}
                refreshing={refreshing}
                ListFooterComponent={<View style={{ height: 20 }} />}
                ListEmptyComponent={<Empty>Nenhum fornecedor encontrado.</Empty>}
              />
            )}
          <SubmitButton onPress={() => setAddProvider(true)}>
            <SubmitButtonText>Novo Fornecedor</SubmitButtonText>
          </SubmitButton>
        </>
      );
    }
  }

  function renderProviders({ item: provider }) {
    return (
      <Card
        onPress={() => getProvider(provider)}
      >
        <CardInfo>
          <CardTitle numberOfLines={2}>{provider.name}</CardTitle>
          <CardContainer>
            <CardName>
              Fornece{' '}
              <CardSubName>({provider.product_provider ? 'Produtos' : 'Serviços'})</CardSubName>
            </CardName>

            <CardStatus>{provider.cnpj || 'Falta CNPJ'}</CardStatus>

          </CardContainer>
        </CardInfo>
      </Card>
    );
  }

  // FIXME Resolver os refs dos InputMask(Não funcionam).

  return (
    <>
      <LinearGradient
        colors={['#2b475c', '#000']}
        style={{ flex: 1 }}
      >
        <Container>
          <Content keyboardShouldPersistTaps="handled">
            <FormContainer>
              <Title>Fornecedores</Title>
              <Description>
                Veja todos os seus fornecedores. Crie ou exclua um fornecedor como quiser.
              </Description>

              {add_provider &&
                <>
                  <InputTitle>Nome</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite um nome"
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
                      placeholder="Digite a sua Inscrição Estadual"
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
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>

                  <SwitchContainer>
                    <ChoiceText>Fornecedor de Produtos?</ChoiceText>

                    <CheckBox
                      iconColor="#f8a920"
                      checkColor="#f8a920"
                      value={product_provider}
                      onChange={() => setProductProvider(!product_provider)}
                    />
                  </SwitchContainer>

                </>
              }

              <ViewButton />

            </FormContainer>

          </Content>
        </Container>
      </LinearGradient>
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={is_visible}
        onRequestClose={() => setIsVisible(false)}
      >
        <CustonModal provider={provider} setIsVisible={setIsVisible} reloadProviders={reloadProviders} />
      </Modal>
    </>
  );
}

Providers.navigationOptions = {
  tabBarLabel: 'Fronecedores',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="user-cog" size={18} color={tintColor} />
  ),
};