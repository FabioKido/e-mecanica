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

import * as Yup from 'yup';

import moment from 'moment';
import DatePicker from 'react-native-datepicker';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import {
  Container,
  Content,
  FormContainer,
  InputPicker,
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
import CustonModal from './CustonModal';

import api from '../../../services/api';

export default function Preventives() {

  const [preventives, setPreventives] = useState([]);
  const [preventive, setPreventive] = useState({});
  const [add_preventive, setAddPreventive] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [id_customer, setIdCustomer] = useState();

  const [vehicles, setVehicles] = useState([]);
  const [id_vehicle, setIdVehicle] = useState();

  const [services, setServices] = useState([]);
  const [id_service, setIdService] = useState();

  const [status, setStatus] = useState('Á fazer');
  const [prevent_date, setPreventDate] = useState('');

  const [date, setDate] = useState();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadPreventives() {
      try {
        setLoading(true);

        const response = await api.get('/service/preventives');
        const { preventives } = response.data;

        setPreventives(preventives);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadPreventives();
  }, []);

  useEffect(() => {
    if (add_preventive) {
      async function loadInfos() {
        try {

          const res_cus = await api.get('/customers');
          const { customers } = res_cus.data;

          const res_veh = await api.get('/vehicles');
          const { vehicles } = res_veh.data;

          const res_serv = await api.get('/service/all');
          const { services } = res_serv.data;

          setCustomers(customers);
          setVehicles(vehicles);
          setServices(services);
        } catch (err) {
          console.log(err);
        }
      }

      loadInfos();
    }
  }, [add_preventive]);

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

  const onDateChange = date => {
    setDate(date);

    const momentObj = moment(date, 'DD-MM-YYYY');

    setPreventDate(momentObj);
  };

  async function reloadPreventives() {
    try {
      setRefreshing(true);

      const response = await api.get('/service/preventives');
      const { preventives } = response.data;

      setPreventives(preventives);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de revisões preventivas, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  function getPreventive(preventive) {
    setPreventive(preventive);

    setIsVisible(true);
  }

  const handleSavePreventive = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        status: Yup.string().required('Status é obrigatório')
      });

      await schema.validate({ status }, {
        abortEarly: false,
      });

      await api.post('/service/preventive', {
        id_service,
        id_vehicle,
        status,
        date: prevent_date
      });

      Alert.alert('Sucesso!', 'Nova Revisão Preventiva registrada com sucesso.');

    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha no registro de nova revisão preventiva, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadPreventives();
    }
  }, [
    id_service,
    id_vehicle,
    status,
    prevent_date
  ]);

  function ViewButton() {
    if (add_preventive) {
      return (
        <>
          <SubmitButton onPress={handleSavePreventive}>
            {loading ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
                <SubmitButtonText>Salvar</SubmitButtonText>
              )}
          </SubmitButton>
          <CancelarButton onPress={() => setAddPreventive(false)}>
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
                data={preventives}
                renderItem={renderPreventives}
                keyExtractor={preventives => `preventive-${preventives.id}`}
                showsVerticalScrollIndicator={false}
                onRefresh={reloadPreventives}
                refreshing={refreshing}
                ListFooterComponent={<View style={{ height: 20 }} />}
                ListEmptyComponent={<Empty>Nenhuma revisão preventiva encontrada.</Empty>}
              />
            )}
          <SubmitButton onPress={() => setAddPreventive(true)}>
            <SubmitButtonText>Nova Preventiva</SubmitButtonText>
          </SubmitButton>
        </>
      );
    }
  }

  function renderPreventives({ item: preventive }) {
    const date_prevent = moment(preventive.date).format('DD-MM-YYYY');

    return (
      <Card
        onPress={() => getPreventive(preventive)}
      >
        <CardInfo>
          <CardTitle numberOfLines={2}>Preventiva - {preventive.id}</CardTitle>
          <CardContainer>
            <CardName>
              Data da Revisão{' '}
              <CardSubName>({date_prevent})</CardSubName>
            </CardName>

            <CardStatus>{preventive.status}</CardStatus>

          </CardContainer>
        </CardInfo>
      </Card>
    );
  }

  // TODO Resolver melhor qual eram os status antes visto.

  return (
    <>
      <LinearGradient
        colors={['#2b475c', '#000']}
        style={{ flex: 1 }}
      >
        <Container>
          <Content keyboardShouldPersistTaps="handled">
            <FormContainer>
              <Title>Preventivas</Title>
              <Description>
                Veja todas as suas revisões preventivas. Crie ou exclua uma revisão preventiva como quiser.
              </Description>

              {add_preventive &&
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

                  <InputTitle>Serviço</InputTitle>
                  <InputPicker>
                    <Picker
                      selectedValue={id_service}
                      style={{
                        flex: 1,
                        color: '#f8a920',
                        backgroundColor: 'transparent',
                        fontSize: 17
                      }}
                      onValueChange={(itemValue, itemIndex) => setIdService(itemValue)}
                    >
                      <Picker.Item label="Selecione o Serviço da Preventiva" value="" />
                      {services && services.map(service => <Picker.Item key={service.id} label={service.name} value={service.id} />)}
                    </Picker>
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputPicker>

                  <InputTitle>Data</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Clique no calendário para editar"
                      editable={false}
                      value={date}
                    />
                    <DatePicker
                      date={date}
                      is24Hour={true}
                      format="DD-MM-YYYY"
                      minDate="01-01-2001"
                      maxDate="31-12-2030"
                      hideText={true}
                      iconComponent={<FontAwesome5 name="calendar-alt" size={18} color="#999" />}
                      style={{
                        width: 21
                      }}
                      onDateChange={onDateChange}
                    />
                  </InputContainer>

                  <InputTitle>Status</InputTitle>
                  <InputPicker>
                    <Picker
                      selectedValue={status}
                      style={{
                        flex: 1,
                        color: '#f8a920',
                        backgroundColor: 'transparent',
                        fontSize: 17
                      }}
                      onValueChange={(itemValue, itemIndex) => setStatus(itemValue)}
                    >
                      <Picker.Item label="Á fazer" value="Á fazer" />
                      <Picker.Item label="Em andamento" value="Em andamento" />
                      <Picker.Item label="Concluído" value="Concluído" />
                    </Picker>
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputPicker>
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
        <CustonModal preventive={preventive} setIsVisible={setIsVisible} reloadPreventives={reloadPreventives} />
      </Modal>
    </>
  );
}

Preventives.navigationOptions = {
  tabBarLabel: 'Preventivas',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="user-cog" size={18} color={tintColor} />
  ),
};