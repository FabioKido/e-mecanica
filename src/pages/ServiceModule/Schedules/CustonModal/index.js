import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Picker
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
  DeleteButtonBox,
  DeleteButton,
  DeleteButtonText
} from './styles';

import api from '../../../../services/api';

export default function CustonModal({ schedule, setIsVisible, reloadSchedules }) {

  const [vehicle, setVehicle] = useState('');

  const [customer, setCustomer] = useState('');

  const [status, setStatus] = useState(schedule.status);
  const [sched_date, setSchedDate] = useState(schedule.date);
  const [observations, setObservations] = useState(schedule.observations);

  const [date, setDate] = useState(() => moment(schedule.date).format('DD-MM-YYYY'));
  const [loading, setLoading] = useState(false);
  const [first_loading, setFirstLoading] = useState(true);

  useEffect(() => {

    async function loadVehicleAndCustomer() {
      try {

        if (schedule.id_vehicle) {
          const res_veh = await api.get(`/vehicles/${schedule.id_vehicle}/one`);
          const { vehicle } = res_veh.data;

          const res_cus = await api.get(`/customers/${vehicle.id_customer}`);
          const { customer } = res_cus.data;

          setVehicle(vehicle);
          setCustomer(customer.name);
        }

      } catch (err) {
        console.log(err);
      } finally {
        setFirstLoading(false);
      }
    }

    setTimeout(loadVehicleAndCustomer, 1000);
  }, []);

  const onDateChange = date => {
    setDate(date);

    const momentObj = moment(date, 'DD-MM-YYYY');

    setSchedDate(momentObj);
  };

  const handleDeleteSchedule = async () => {
    try {
      await api.delete(`/service/schedule/${schedule.id}`);

      Alert.alert('Excluído!', 'Agendamento deletado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na exclusão do agendamento.'
      );
    } finally {
      setIsVisible(false);
      reloadSchedules();
    }
  }

  const handleUpdateSchedule = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      await api.put(`/service/schedule/${schedule.id}`, {
        status,
        observations,
        date: sched_date
      });

      Alert.alert('Sucesso!', 'Agendamento atualizado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização do agendamento, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadSchedules();
    }
  }, [
    status,
    observations
  ]);

  if (first_loading) {
    return (
      <LinearGradient
        colors={['#2b475c', '#000']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="small" color="#fff" />
      </LinearGradient>
    );
  } else {
    return (
      <LinearGradient
        colors={['#2b475c', '#000']}
        style={{ flex: 1 }}
      >
        <Container>
          <Content keyboardShouldPersistTaps="handled">
            <FormContainer>
              <Title>Agendamento - {schedule.id}</Title>
              <Description>
                Edite ou exclua esse agendamento como quiser.
              </Description>

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

              <DeleteButtonBox>
                <DeleteButton onPress={handleDeleteSchedule}>
                  <DeleteButtonText>Excluir</DeleteButtonText>
                </DeleteButton>
                <SubmitButton style={{ width: 125 }} onPress={handleUpdateSchedule}>
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
}