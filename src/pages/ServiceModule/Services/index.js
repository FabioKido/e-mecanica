import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import * as Yup from 'yup';

import { MaterialIcons } from '@expo/vector-icons';

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
  CancelarButton,
  CancelarButtonText,
  Cards,
  Card,
  CardInfo,
  CardTitle,
  CardContainer,
  CardName,
  Empty
} from './styles';

import Placeholder from './Placeholder';

import api from '../../../services/api';

export default function Services() {

  const [services, setServices] = useState([]);
  const [add_service, setAddService] = useState(false);

  const [name, setName] = useState('');

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);

        const response = await api.get('/service/all');
        const { services } = response.data;

        setServices(services);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  async function reloadServices() {
    try {
      setRefreshing(true);

      const response = await api.get('/service/all');
      const { services } = response.data;

      setServices(services);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de serviços, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  const handleSaveService = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório')
      });

      await schema.validate({ name }, {
        abortEarly: false,
      });

      await api.post('/service/add', { name });

      Alert.alert('Sucesso!', 'Novo serviço registrado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha no registro de novo serviço, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadServices();
    }
  }, [
    name
  ]);

  function ViewButton() {
    if (add_service) {
      return (
        <>
          <SubmitButton onPress={handleSaveService}>
            {loading ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
                <SubmitButtonText>Salvar</SubmitButtonText>
              )}
          </SubmitButton>
          <CancelarButton onPress={() => setAddService(false)}>
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
                data={services}
                renderItem={renderServices}
                keyExtractor={services => `service-${services.id}`}
                showsVerticalScrollIndicator={false}
                onRefresh={reloadServices}
                refreshing={refreshing}
                ListFooterComponent={<View style={{ height: 20 }} />}
                ListEmptyComponent={<Empty>Nenhum serviço encontrado.</Empty>}
              />
            )}
          <SubmitButton onPress={() => setAddService(true)}>
            <SubmitButtonText>Novo Serviço</SubmitButtonText>
          </SubmitButton>
        </>
      );
    }
  }

  function renderServices({ item: service }) {
    return (
      <Card>
        <CardInfo>
          <CardTitle numberOfLines={2}>{service.name}</CardTitle>
          <CardContainer>
            <CardName>
              Os serviços são fixos.
            </CardName>
          </CardContainer>
        </CardInfo>
      </Card>
    );
  }

  return (
    <LinearGradient
      colors={['#2b475c', '#000']}
      style={{ flex: 1 }}
    >
      <Container>
        <Content keyboardShouldPersistTaps="handled">
          <FormContainer>
            <Title>Serviços</Title>
            <Description>
              Veja todos os serviços. Ao criar novo serviço, o nome tem que ser único ou não será criado.
          </Description>

            {add_service &&
              <>
                <InputTitle>Nome do Serviço</InputTitle>
                <InputContainer>
                  <Input
                    placeholder="Insira um nome"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={setName}
                    value={name}
                    returnKeyType="send"
                    onSubmitEditing={handleSaveService}
                  />
                  <MaterialIcons name="lock" size={20} color="#999" />
                </InputContainer>
              </>
            }

            <ViewButton />

          </FormContainer>

        </Content>
      </Container>
    </LinearGradient>
  );
}

Services.navigationOptions = {
  tabBarLabel: 'Serviços',
  tabBarIcon: ({ tintColor }) => (
    <MaterialIcons name="build" size={18} color={tintColor} />
  ),
};