import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import moment from 'moment';
import DatePicker from 'react-native-datepicker';

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

import api from '../../../../services/api';
import NavigationService from '../../../../services/navigation';

import CheckBox from '../../../../components/CheckBox';

export default function CustonModal({ order, setIsVisible, reloadOrders }) {

  const tanqueInputRef = useRef();
  const internalControlInputRef = useRef();
  const observationsInputRef = useRef();

  const [vehicle, setVehicle] = useState('');

  const [customer, setCustomer] = useState('');

  const [km, setKM] = useState(order.km);
  const [tanque, setTanque] = useState(order.tanque);
  const [internal_control, setInternalControl] = useState(order.internal_control);
  const [observations, setObservations] = useState(order.observations);
  const [prevision_exit, setPrevisionExit] = useState(order.prevision_exit);
  const [active, setActive] = useState(order.active);

  const [date, setDate] = useState(() => prevision_exit ? moment(prevision_exit).format('DD-MM-YYYY') : '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    async function loadVehicleAndCustomer() {
      try {

        const res_veh = await api.get(`/vehicles/${order.id_vehicle}/one`);
        const { vehicle } = res_veh.data;

        const res_cus = await api.get(`/customers/${vehicle.id_customer}`);
        const { customer } = res_cus.data;

        setVehicle(vehicle);
        setCustomer(customer.name);

      } catch (err) {
        console.log(err);
      }
    }

    setTimeout(loadVehicleAndCustomer, 1000);
  }, []);

  const onDateChange = date => {
    setDate(date);

    const momentObj = moment(date, 'DD-MM-YYYY');

    setPrevisionExit(momentObj);
  };

  const handleNavigateToDetailPage = () => {
    setIsVisible(false);

    // setTimeout(() => NavigationService.navigate('RecipeDetail', recipe), 100);
  }

  const handleDeleteOrder = async () => {
    try {
      await api.delete(`/order/os/${order.id}`);

      Alert.alert('Excluído!', 'OS deletada com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na exclusão da OS.'
      );
    } finally {
      setIsVisible(false);
      reloadOrders();
    }
  }

  const handleUpdateOrder = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      await api.put(`/order/os/${order.id}`, {
        km,
        tanque,
        internal_control,
        prevision_exit,
        observations,
        active
      });

      Alert.alert('Sucesso!', 'OS atualizada com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização da OS, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadOrders();
    }
  }, [
    km,
    tanque,
    internal_control,
    prevision_exit,
    observations,
    active
  ]);

  return (
    <LinearGradient
      colors={['#2b475c', '#000']}
      style={{ flex: 1 }}
    >
      <Container>
        <Content keyboardShouldPersistTaps="handled">
          <FormContainer>
            <Title>OS - {order.id}</Title>
            <Description>
              Edite ou exclua essa OS como quiser.
            </Description>

            <SwitchContainer>
              <ChoiceText>Está Ativa?</ChoiceText>

              <CheckBox
                iconColor="#f8a920"
                checkColor="#f8a920"
                value={active}
                onChange={() => setActive(!active)}
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

            <InputTitle>Kilometragem</InputTitle>
            <InputContainer>
              <Input
                placeholder="Novo valor em Kilometros"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="numeric"
                maxLength={8}
                onChangeText={setKM}
                value={String(km) || ''}
                returnKeyType="next"
                onSubmitEditing={() => tanqueInputRef.current.focus()}
              />
              <MaterialIcons name="person-pin" size={20} color="#999" />
            </InputContainer>

            <InputTitle>Tanque</InputTitle>
            <InputContainer>
              <Input
                placeholder="Novo valor em litros"
                autoCapitalize="none"
                autoCorrect={false}
                ref={tanqueInputRef}
                keyboardType="numeric"
                maxLength={4}
                onChangeText={setTanque}
                value={String(tanque) || ''}
                returnKeyType="next"
                onSubmitEditing={() => internalControlInputRef.current.focus()}
              />
              <MaterialIcons name="person-pin" size={20} color="#999" />
            </InputContainer>

            <InputTitle>Controle Interno</InputTitle>
            <InputContainer>
              <Input
                placeholder="Digite uma descrição"
                autoCapitalize="none"
                autoCorrect={false}
                ref={internalControlInputRef}
                onChangeText={setInternalControl}
                value={internal_control}
                returnKeyType="next"
                onSubmitEditing={() => observationsInputRef.current.focus()}
              />
              <MaterialIcons name="person-pin" size={20} color="#999" />
            </InputContainer>

            <InputTitle>Previsão de Saída</InputTitle>
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
                placeholder="Algo a ser observado"
                autoCapitalize="none"
                autoCorrect={false}
                ref={observationsInputRef}
                onChangeText={setObservations}
                value={observations}
                returnKeyType="send"
                onSubmitEditing={handleUpdateOrder}
              />
              <MaterialIcons name="lock" size={20} color="#999" />
            </InputContainer>

            <ChoiceButton
              onPress={handleNavigateToDetailPage}
            >
              <ChoiceText>Atualizar Detalhes?</ChoiceText>
            </ChoiceButton>

            <DeleteButtonBox>
              <DeleteButton onPress={handleDeleteOrder}>
                <DeleteButtonText>Excluir</DeleteButtonText>
              </DeleteButton>
              <SubmitButton style={{ width: 125 }} onPress={handleUpdateOrder}>
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