import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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

import api from '../../../services/api';

export default function PaymentMethods() {

  const taxaInputRef = useRef();
  const operatorInputRef = useRef();

  const [payment_methods, setPaymentMethods] = useState([]);
  const [add_payment_method, setPaymentMethod] = useState(false);

  const [method, setMethod] = useState('');
  const [operator, setOperator] = useState('');
  const [taxa, setTaxa] = useState('');

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function loadPaymentMethods() {
      try {
        setLoading(true);

        const response = await api.get('/finance/methods');
        const { payment_methods } = response.data;

        setPaymentMethods(payment_methods);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadPaymentMethods();
  }, []);

  async function reloadPaymentMethods() {
    try {
      setRefreshing(true);

      const response = await api.get('/finance/methods');
      const { payment_methods } = response.data;

      setPaymentMethods(payment_methods);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de métodos de pagamento, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  const handleDeletePaymentMethod = async ({ id }) => {
    try {
      await api.delete(`/finance/method/${id}`);

      Alert.alert('Excluído!', 'Método deletado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na exclusão do método de pagamento.'
      );
    } finally {
      reloadPaymentMethods();
    }
  }

  const handleSavePaymentMethod = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        method: Yup.string().required('Método é obrigatório'),
        taxa: Yup.number().required('Taxa é obrigatória'),
        operator: Yup.string().required('Operadora é obrigatória')
      });

      await schema.validate({ method, taxa, operator }, {
        abortEarly: false,
      });

      await api.post('/finance/method', { method, taxa, operator });

      Alert.alert('Sucesso!', 'Novo método de pagamento registrado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha no registro do novo método de pagamento, confira seus dados.'
      );
    } finally {
      reloadPaymentMethods();
      setLoading(false);
    }
  }, [
    method,
    taxa,
    operator
  ]);

  function ViewButton() {
    if (add_payment_method) {
      return (
        <>
          <SubmitButton onPress={handleSavePaymentMethod}>
            {loading ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
                <SubmitButtonText>Salvar</SubmitButtonText>
              )}
          </SubmitButton>
          <CancelarButton onPress={() => setPaymentMethod(false)}>
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
                data={payment_methods}
                renderItem={renderPaymentMethod}
                keyExtractor={payment_methods => `method-${payment_methods.id}`}
                showsVerticalScrollIndicator={false}
                onRefresh={reloadPaymentMethods}
                refreshing={refreshing}
                ListFooterComponent={<View style={{ height: 20 }} />}
                ListEmptyComponent={<Empty>Nenhum método de pagamento encontrado.</Empty>}
              />
            )}
          <SubmitButton onPress={() => setPaymentMethod(true)}>
            <SubmitButtonText>Novo Método</SubmitButtonText>
          </SubmitButton>
        </>
      );
    }
  }

  function renderPaymentMethod({ item: method }) {
    return (
      <Card
        onPress={() => handleDeletePaymentMethod(method)}
      >
        <CardInfo>
          <CardTitle numberOfLines={2}>{method.method}</CardTitle>
          <CardContainer>
            <CardName>
              {method.taxa}{' '}
              <CardSubName>({'Em porcentagem'})</CardSubName>
            </CardName>

            <CardStatus>{method.operator}</CardStatus>

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
            <Title>Métodos de Pagamento</Title>
            <Description>
              Veja todos os seus métodos de pagamento. Crie ou exclua um método como quiser.
          </Description>

            {add_payment_method &&
              <>
                <InputTitle>Método de Pagamento</InputTitle>
                <InputContainer>
                  <Input
                    placeholder="Digite um Método, ex: Crédito/Débito"
                    autoCapitalize="words"
                    autoCorrect={false}
                    maxLength={60}
                    onChangeText={setMethod}
                    value={method}
                    returnKeyType="next"
                    onSubmitEditing={() => operatorInputRef.current.focus()}
                  />
                  <MaterialIcons name="person-pin" size={20} color="#999" />
                </InputContainer>

                <InputTitle>Operadora</InputTitle>
                <InputContainer>
                  <Input
                    placeholder="Insira o título ou operadora"
                    autoCapitalize="words"
                    autoCorrect={false}
                    maxLength={10}
                    ref={operatorInputRef}
                    onChangeText={setOperator}
                    value={operator}
                    returnKeyType="next"
                    onSubmitEditing={() => taxaInputRef.current.focus()}
                  />
                  <MaterialIcons name="lock" size={20} color="#999" />
                </InputContainer>

                <InputTitle>Taxa</InputTitle>
                <InputContainer>
                  <Input
                    placeholder="Insira o valor da taxa do método"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="numeric"
                    ref={taxaInputRef}
                    onChangeText={setTaxa}
                    value={taxa}
                    returnKeyType="send"
                    onSubmitEditing={handleSavePaymentMethod}
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

PaymentMethods.navigationOptions = {
  tabBarLabel: 'Métodos',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="user-cog" size={18} color={tintColor} />
  ),
};