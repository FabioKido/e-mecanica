import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
  DeleteButtonBox,
  DeleteButton,
  DeleteButtonText,
  CancelarButton,
  CancelarButtonText
} from './styles';

import api from '../../../../services/api';

export default function CustonModal({ payment_method, setIsVisible, reloadPaymentMethods }) {

  const taxaInputRef = useRef();
  const operatorInputRef = useRef();

  const [method, setMethod] = useState(payment_method.method);
  const [operator, setOperator] = useState(payment_method.operator);
  const [taxa, setTaxa] = useState(payment_method.taxa);

  const [loading, setLoading] = useState(false);

  const handleDeletePaymentMethod = async () => {
    try {
      await api.delete(`/finance/method/${payment_method.id}`);

      Alert.alert('Excluído!', 'Método deletado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na exclusão do método de pagamento.'
      );
    } finally {
      setIsVisible(false);
      reloadPaymentMethods();
    }
  }

  const handleUpdatePaymentMethod = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      await api.put(`/finance/method/${payment_method.id}`, { method, operator, taxa });

      Alert.alert('Sucesso!', 'Método atualizado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização do método de pagamento, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadPaymentMethods();
    }
  }, [
    method,
    operator,
    taxa
  ]);

  return (
    <LinearGradient
      colors={['#2b475c', '#000']}
      style={{ flex: 1 }}
    >
      <Container>
        <Content keyboardShouldPersistTaps="handled">
          <FormContainer>
            <Title>{payment_method.method}</Title>
            <Description>
              Edite ou exclua esse método de pagamento como quiser.
            </Description>

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
                onSubmitEditing={handleUpdatePaymentMethod}
              />
              <MaterialIcons name="lock" size={20} color="#999" />
            </InputContainer>

            <DeleteButtonBox>
              <DeleteButton onPress={handleDeletePaymentMethod}>
                <DeleteButtonText>Excluir</DeleteButtonText>
              </DeleteButton>
              <SubmitButton style={{ width: 125 }} onPress={handleUpdatePaymentMethod}>
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