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
  SwitchContainer,
  SwitchText,
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
  CancelarButtonText,
  ChoiceButton,
  ChoiceText
} from './styles';

import CheckBox from '../../../../components/CheckBox';

import api from '../../../../services/api';
import NavigationService from '../../../../services/navigation';

export default function CustonModal({ diagnostic, setIsVisible, reloadDiagnostics, id_customer }) {

  const observationsInputRef = useRef();

  const [vehicle, setVehicle] = useState('');

  const [customer, setCustomer] = useState('');

  const [value, setValue] = useState(diagnostic.value);
  const [observations, setObservations] = useState(diagnostic.observations);
  const [approved, setApproved] = useState(diagnostic.approved);

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    async function loadVehicleAndCustomer() {
      try {

        if (diagnostic.id_vehicle) {
          const res_veh = await api.get(`/vehicles/${diagnostic.id_vehicle}/one`);
          const { vehicle } = res_veh.data;

          const res_cus = await api.get(`/customers/${vehicle.id_customer}`);
          const { customer } = res_cus.data;

          setVehicle(vehicle);
          setCustomer(customer.name);
        }

      } catch (err) {
        console.log(err);
      }
    }

    setTimeout(loadVehicleAndCustomer, 1000);
  }, []);

  const handleNavigateToOrderServicePage = () => {
    setIsVisible(false);

    // setTimeout(() => NavigationService.navigate('OrderService', diagnostic.id), 100);
  }

  const handleNavigateToChecklistPage = () => {
    setIsVisible(false);

    setTimeout(() => NavigationService.navigate('Checklist', diagnostic.id), 100);
  }

  const handleDeleteDiagnostic = async () => {
    try {
      await api.delete(`/service/diagnostic/${diagnostic.id}`);

      Alert.alert('Excluído!', 'Diagnóstico deletado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na exclusão do diagnóstico.'
      );
    } finally {
      setIsVisible(false);
      reloadDiagnostics();
    }
  }

  const handleUpdateDiagnostic = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      await api.put(`/service/diagnostic/${diagnostic.id}`, {
        value,
        approved,
        observations
      });

      Alert.alert('Sucesso!', 'Diagnóstico atualizado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização do diagnóstico, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadDiagnostics();
    }
  }, [
    value,
    approved,
    observations
  ]);

  return (
    <LinearGradient
      colors={['#2b475c', '#000']}
      style={{ flex: 1 }}
    >
      <Container>
        <Content keyboardShouldPersistTaps="handled">
          <FormContainer>
            <Title>Diagnóstico - {diagnostic.id}</Title>
            <Description>
              Edite ou exclua esse diagnóstico como quiser.
            </Description>

            <SwitchContainer>
              <ChoiceText>Diagnóstico Aprovado?</ChoiceText>

              <CheckBox
                iconColor="#f8a920"
                checkColor="#f8a920"
                value={approved}
                onChange={() => setApproved(!approved)}
              />
            </SwitchContainer>

            <InputTitle>Veículo</InputTitle>
            <InputContainer>
              <Input
                editable={false}
                style={{ color: '#f8a920' }}
                value={vehicle.model || 'Não foi especificado'}
              />
              <MaterialIcons name="lock" size={20} color="#999" />
            </InputContainer>

            <InputTitle>Proprietário</InputTitle>
            <InputContainer>
              <Input
                editable={false}
                style={{ color: '#f8a920' }}
                value={customer || 'Não foi especificado'}
              />
              <MaterialIcons name="lock" size={20} color="#999" />
            </InputContainer>

            <InputTitle>Valor</InputTitle>
            <InputContainer>
              <Input
                placeholder="Novo valor, sendo diagnóstico pago"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="numeric"
                onChangeText={setValue}
                value={String(value)}
                returnKeyType="next"
                onSubmitEditing={() => observationsInputRef.current.focus()}
              />
              <MaterialIcons name="person-pin" size={20} color="#999" />
            </InputContainer>

            <InputTitle>Observações</InputTitle>
            <InputContainer>
              <Input
                placeholder="Digite algo a ser observado"
                autoCapitalize="none"
                autoCorrect={false}
                ref={observationsInputRef}
                onChangeText={setObservations}
                value={observations}
                returnKeyType="next"
                onSubmitEditing={handleUpdateDiagnostic}
              />
              <MaterialIcons name="lock" size={20} color="#999" />
            </InputContainer>

            <ChoiceButton
              onPress={handleNavigateToChecklistPage}
            >
              <SwitchText>Abrir Checklist</SwitchText>
            </ChoiceButton>

            <ChoiceButton
              onPress={handleNavigateToOrderServicePage}
            >
              <ChoiceText>Criar OS?</ChoiceText>
            </ChoiceButton>

            <DeleteButtonBox>
              <DeleteButton onPress={handleDeleteDiagnostic}>
                <DeleteButtonText>Excluir</DeleteButtonText>
              </DeleteButton>
              <SubmitButton style={{ width: 125 }} onPress={handleUpdateDiagnostic}>
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