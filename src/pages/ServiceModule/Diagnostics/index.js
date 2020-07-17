import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Alert,
  ActivityIndicator,
  Keyboard,
  View,
  Modal,
  Picker
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import * as Yup from 'yup';

import moment from 'moment';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import {
  Container,
  Content,
  FormContainer,
  InputContainer,
  SwitchContainer,
  InputPicker,
  Title,
  ChoiceText,
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
import CustonModal from './CustonModal';

import CheckBox from '../../../components/CheckBox';

import api from '../../../services/api';

export default function Diagnostics() {

  const observationsInputRef = useRef();

  const [diagnostics, setDiagnostics] = useState([]);
  const [diagnostic, setDiagnostic] = useState({});
  const [add_diagnostic, setAddDiagnostic] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [id_customer, setIdCustomer] = useState();

  const [vehicles, setVehicles] = useState();
  const [id_vehicle, setIdVehicle] = useState();

  const [value, setValue] = useState('');
  const [observations, setObservations] = useState('');
  const [approved, setApproved] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadDiagnostics() {
      try {
        setLoading(true);

        const response = await api.get('/service/diagnostics');
        const { diagnostics } = response.data;

        setDiagnostics(diagnostics);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadDiagnostics();
  }, []);

  useEffect(() => {
    if (add_diagnostic) {
      async function loadCustomers() {
        try {

          const response = await api.get('/customers');
          const { customers } = response.data;

          setCustomers(customers);

        } catch (err) {
          console.log(err);
        }
      }

      loadCustomers();
    }
  }, [add_diagnostic]);

  useEffect(() => {
    if (id_customer) {
      async function loadVehicles() {
        try {

          const response = await api.get(`/customers/vehicles/${id_customer}`);
          const { vehicles } = response.data;

          setVehicles(vehicles);

        } catch (err) {
          console.log(err);
        }
      }

      loadVehicles();
    }
  }, [id_customer]);

  function getDiagnostic(diagnostic) {
    setDiagnostic(diagnostic);

    setIsVisible(true);
  }

  async function reloadDiagnostics() {
    try {
      setRefreshing(true);

      const response = await api.get('/service/diagnostics');
      const { diagnostics } = response.data;

      setDiagnostics(diagnostics);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de diagnósticos, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  const handleSaveDiagnostic = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        value: Yup.number().required('O valor é obrigatório')
      });

      await schema.validate({ value }, {
        abortEarly: false,
      });

      const response = await api.post('/service/diagnostic', {
        id_vehicle,
        value,
        approved,
        observations
      });

      const { diagnostic } = response.data;

      await api.post(`/service/checklist/${diagnostic}`);

      Alert.alert('Sucesso!', 'Novo diagnóstico registrado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;
      console.log(err)
      Alert.alert(
        'Ooopsss',
        message || 'Falha no registro de novo diagnóstico, confira seus dados.'
      );
    } finally {
      reloadDiagnostics();
      setLoading(false);
    }
  }, [
    id_vehicle,
    value,
    approved,
    observations
  ]);

  function ViewButton() {
    if (add_diagnostic) {
      return (
        <>
          <SubmitButton onPress={handleSaveDiagnostic}>
            {loading ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
                <SubmitButtonText>Salvar</SubmitButtonText>
              )}
          </SubmitButton>
          <CancelarButton onPress={() => setAddDiagnostic(false)}>
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
                data={diagnostics}
                renderItem={renderDiagnostics}
                keyExtractor={diagnostics => `diagnostic-${diagnostics.id}`}
                showsVerticalScrollIndicator={false}
                onRefresh={reloadDiagnostics}
                refreshing={refreshing}
                ListFooterComponent={<View style={{ height: 20 }} />}
                ListEmptyComponent={<Empty>Nenhum diagnóstico encontrado.</Empty>}
              />
            )}
          <SubmitButton onPress={() => setAddDiagnostic(true)}>
            <SubmitButtonText>Novo Diagnóstico</SubmitButtonText>
          </SubmitButton>
        </>
      );
    }
  }

  function renderDiagnostics({ item: diagnostic }) {
    const diagnostic_date = moment(diagnostic.created_at).format('DD-MM-YYYY');

    return (
      <Card
        onPress={() => getDiagnostic(diagnostic)}
      >
        <CardInfo>
          <CardTitle numberOfLines={2}>Diagnóstico - {diagnostic.id}</CardTitle>
          <CardContainer>
            <CardName>
              Registro {' '}
              <CardSubName>({diagnostic_date})</CardSubName>
            </CardName>

            <CardStatus>R$ {diagnostic.value}</CardStatus>

          </CardContainer>
        </CardInfo>
      </Card>
    );
  }

  return (
    <>
      <LinearGradient
        colors={['#2b475c', '#000']}
        style={{ flex: 1 }}
      >
        <Container>
          <Content keyboardShouldPersistTaps="handled">
            <FormContainer>
              <Title>Diagnósticos</Title>
              <Description>
                Veja todos os seus diagnósticos. Crie ou exclua um diagnóstico como quiser.
              </Description>

              {add_diagnostic &&
                <>
                  <InputTitle>Proprietário</InputTitle>
                  <InputPicker>
                    <Picker
                      selectedValue={id_customer}
                      style={{
                        flex: 1,
                        color: '#f8a920',
                        backgroundColor: 'transparent',
                        fontSize: 17
                      }}
                      onValueChange={(itemValue, itemIndex) => setIdCustomer(itemValue)}
                    >
                      <Picker.Item label="Selecione o Proprietário do Veículo" value="" />
                      {customers && customers.map(customer => <Picker.Item key={customer.id} label={customer.name} value={customer.id} />)}
                    </Picker>
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputPicker>

                  {vehicles &&
                    <>
                      <InputTitle>Veículo</InputTitle>
                      <InputPicker>
                        <Picker
                          selectedValue={id_vehicle}
                          style={{
                            flex: 1,
                            color: '#f8a920',
                            backgroundColor: 'transparent',
                            fontSize: 17
                          }}
                          onValueChange={(itemValue, itemIndex) => setIdVehicle(itemValue)}
                        >
                          <Picker.Item label="Selecione o Veículo" value="" />
                          {vehicles && vehicles.map(vehicle => <Picker.Item key={vehicle.id} label={vehicle.model} value={vehicle.id} />)}
                        </Picker>
                        <MaterialIcons name="lock" size={20} color="#999" />
                      </InputPicker>
                    </>
                  }

                  <InputTitle>Valor</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite o valor, sendo diagnóstico pago"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="numeric"
                      onChangeText={setValue}
                      value={value}
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
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>

                  <SwitchContainer>
                    <ChoiceText>Diagnóstico Aprovado?</ChoiceText>

                    <CheckBox
                      iconColor="#f8a920"
                      checkColor="#f8a920"
                      value={approved}
                      onChange={() => setApproved(!approved)}
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
        <CustonModal diagnostic={diagnostic} setIsVisible={setIsVisible} reloadDiagnostics={reloadDiagnostics} id_customer={id_customer} />
      </Modal>
    </>
  );
}

Diagnostics.navigationOptions = {
  tabBarLabel: 'Diagnósticos',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="user-cog" size={18} color={tintColor} />
  ),
};