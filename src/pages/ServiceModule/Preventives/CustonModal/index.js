import React, { useState, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Picker,
  Image
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
  ChoiceButton,
  ChoiceText,
  SubmitButton,
  SubmitButtonText,
  CancelarButton,
  CancelarButtonText,
  DeleteButtonBox,
  DeleteButton,
  DeleteButtonText
} from './styles';

import api from '../../../../services/api';
import NavigationService from '../../../../services/navigation';

import LoadGif from '../../../../assets/loading.gif';

export default function CustonModal({ preventive, setIsVisible, reloadPreventives }) {

  const [vehicle, setVehicle] = useState('');

  const [customer, setCustomer] = useState('');

  const [service, setService] = useState('');

  const [status, setStatus] = useState(preventive.status);
  const [prevent_date, setPreventDate] = useState(preventive.date);

  const [date, setDate] = useState(() => moment(preventive.date).format('DD-MM-YYYY'));
  const [loading, setLoading] = useState(false);
  const [first_loading, setFirstLoading] = useState(true);

  useEffect(() => {

    async function loadInfos() {
      try {
        if (preventive.id_service) {
          const res_serv = await api.get(`/service/one/${preventive.id_service}`);
          const { service } = res_serv.data;

          setService(service);
        }

        if (preventive.id_vehicle) {
          const res_veh = await api.get(`/vehicles/${preventive.id_vehicle}/one`);
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

    setTimeout(loadInfos, 1000);
  }, []);

  const handleNavigateToOrderServicePage = () => {
    setIsVisible(false);

    // setTimeout(() => NavigationService.navigate('OrderService', preventive.id), 100);
  }

  const onDateChange = date => {
    setDate(date);

    const momentObj = moment(date, 'DD-MM-YYYY');

    setPreventDate(momentObj);
  };

  const handleDeletePreventive = async () => {
    try {
      await api.delete(`/service/preventive/${preventive.id}`);

      Alert.alert('Excluído!', 'revisão Preventiva deletada com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na exclusão da revisão preventiva.'
      );
    } finally {
      setIsVisible(false);
      reloadPreventives();
    }
  }

  const handleUpdatePreventive = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      await api.put(`/service/preventive/${preventive.id}`, {
        status,
        date: prevent_date
      });

      Alert.alert('Sucesso!', 'Revisão Preventiva atualizada com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização da revisão preventiva, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadPreventives();
    }
  }, [
    status
  ]);

  if (first_loading) {
    return (
      <LinearGradient
        colors={['#2b475c', '#000']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Image source={LoadGif} resizeMode='contain' style={{ height: 75, width: 75 }} />
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
              <Title>Preventiva - {preventive.id}</Title>
              <Description>
                Edite ou exclua essa revisão preventiva com quiser.
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

              <InputTitle>Serviço</InputTitle>
              <InputContainer>
                <Input
                  editable={false}
                  style={{ color: '#f8a920' }}
                  value={service.name || 'Não foi especificado'}
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

              <ChoiceButton
                onPress={handleNavigateToOrderServicePage}
              >
                <ChoiceText>Ir criar OS?</ChoiceText>

                <MaterialIcons name="open-in-new" size={20} color="#f8a920" />
              </ChoiceButton>

              <DeleteButtonBox>
                <DeleteButton onPress={handleDeletePreventive}>
                  <DeleteButtonText>Excluir</DeleteButtonText>
                </DeleteButton>
                <SubmitButton style={{ width: 125 }} onPress={handleUpdatePreventive}>
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