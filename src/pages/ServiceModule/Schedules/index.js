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

export default function Schedules() {

  const [schedules, setSchedules] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [add_schedule, setAddSchedule] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [id_customer, setIdCustomer] = useState();

  const [vehicles, setVehicles] = useState([]);
  const [id_vehicle, setIdVehicle] = useState();

  const [status, setStatus] = useState('Á fazer');
  const [sched_date, setSchedDate] = useState('');
  const [observations, setObservations] = useState('');

  const [date, setDate] = useState();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadSchedules() {
      try {
        setLoading(true);

        const response = await api.get('/service/schedules');
        const { schedules } = response.data;

        setSchedules(schedules);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadSchedules();
  }, []);

  useEffect(() => {
    if (add_schedule) {
      async function loadInfos() {
        try {

          const res_cus = await api.get('/customers');
          const { customers } = res_cus.data;

          const res_veh = await api.get('/vehicles');
          const { vehicles } = res_veh.data;

          setCustomers(customers);
          setVehicles(vehicles);
        } catch (err) {
          console.log(err);
        }
      }

      loadInfos();
    }
  }, [add_schedule]);

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

    setSchedDate(momentObj);
  };

  async function reloadSchedules() {
    try {
      setRefreshing(true);

      const response = await api.get('/service/schedules');
      const { schedules } = response.data;

      setSchedules(schedules);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de agendamentos, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  function getSchedule(schedule) {
    setSchedule(schedule);

    setIsVisible(true);
  }

  const handleSaveSchedule = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        status: Yup.string().required('Status é obrigatório')
      });

      await schema.validate({ status }, {
        abortEarly: false,
      });

      await api.post('/service/schedule', {
        id_vehicle,
        status,
        observations,
        date: sched_date
      });

      Alert.alert('Sucesso!', 'Novo Agendamento registrado com sucesso.');

    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha no registro de novo agendamento, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadSchedules();
    }
  }, [
    id_vehicle,
    status,
    observations,
    sched_date
  ]);

  function ViewButton() {
    if (add_schedule) {
      return (
        <>
          <SubmitButton onPress={handleSaveSchedule}>
            {loading ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
                <SubmitButtonText>Salvar</SubmitButtonText>
              )}
          </SubmitButton>
          <CancelarButton onPress={() => setAddSchedule(false)}>
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
                data={schedules}
                renderItem={renderSchedules}
                keyExtractor={schedules => `schedule-${schedules.id}`}
                showsVerticalScrollIndicator={false}
                onRefresh={reloadSchedules}
                refreshing={refreshing}
                ListFooterComponent={<View style={{ height: 20 }} />}
                ListEmptyComponent={<Empty>Nenhum agendamento encontrado.</Empty>}
              />
            )}
          <SubmitButton onPress={() => setAddSchedule(true)}>
            <SubmitButtonText>Novo Agendamento</SubmitButtonText>
          </SubmitButton>
        </>
      );
    }
  }

  function renderSchedules({ item: schedule }) {
    const date_prevent = moment(schedule.date).format('DD-MM-YYYY');

    return (
      <Card
        onPress={() => getSchedule(schedule)}
      >
        <CardInfo>
          <CardTitle numberOfLines={2}>Agendamento - {schedule.id}</CardTitle>
          <CardContainer>
            <CardName>
              Data Agendada{' '}
              <CardSubName>({date_prevent})</CardSubName>
            </CardName>

            <CardStatus>{schedule.status}</CardStatus>

          </CardContainer>
        </CardInfo>
      </Card>
    );
  }

  // TODO Resolver melhor qual eram os status antes visto.
  // TODO Ver se não seria melhor ter o id do serviço também.

  return (
    <>
      <LinearGradient
        colors={['#2b475c', '#000']}
        style={{ flex: 1 }}
      >
        <Container>
          <Content keyboardShouldPersistTaps="handled">
            <FormContainer>
              <Title>Agendamentos</Title>
              <Description>
                Veja todos os seus agendamentos. Crie ou exclua um agendamento como quiser.
              </Description>

              {add_schedule &&
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

                  <InputTitle>Observações</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Observações sobre o agendamento"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={setObservations}
                      value={observations}
                      returnKeyType="send"
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
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
        <CustonModal schedule={schedule} setIsVisible={setIsVisible} reloadSchedules={reloadSchedules} />
      </Modal>
    </>
  );
}

Schedules.navigationOptions = {
  tabBarLabel: 'Agendamentos',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="calendar-alt" size={18} color={tintColor} />
  ),
};