import React, { useState, useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
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
  InputContainer,
  SwitchContainer,
  SwitchText,
  Title,
  Description,
  InputTitle,
  Input,
  ChoiceButton,
  ChoiceText,
  SubmitButton,
  SubmitButtonText,
  DeleteButtonBox,
  DeleteButton,
  DeleteButtonText,
  CancelarButton,
  CancelarButtonText
} from './styles';

import api from '../../../../services/api';
import NavigationService from '../../../../services/navigation';

import CheckBox from '../../../../components/CheckBox';
import LoadGif from '../../../../assets/loading.gif';

export default function CustonModal({ payment, setIsVisible, reloadPayments }) {

  const [parcels, setParcels] = useState(payment.parcels);
  const [status, setStatus] = useState(payment.status);
  const [pay_date, setPayDate] = useState(payment.date);

  const [date, setDate] = useState(() => moment(pay_date).format('DD-MM-YYYY'));
  const [loading, setLoading] = useState(false);
  const [first_loading, setFirstLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setFirstLoading(false), 300);
  });

  const onDateChange = date => {
    setDate(date);

    const momentObj = moment(date, 'DD-MM-YYYY');

    setPayDate(momentObj);
  };

  const handleNavigateToParcels = () => {
    setIsVisible(false);

    setTimeout(() => NavigationService.navigate('Parcels', payment), 100);
  }

  const handleDeletePayment = async () => {
    try {
      await api.delete(`/order/payment/${payment.id}`);

      Alert.alert('Excluído!', 'Pagamento deletado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na exclusão do pagamento.'
      );
    } finally {
      setIsVisible(false);
      reloadPayments();
    }
  }

  const handleUpdatePayment = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      await api.put(`/order/payment/${payment.id}`, { status, date: pay_date });

      Alert.alert('Sucesso!', 'Pagamento atualizado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização do pagamento, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadPayments();
    }
  }, [
    status,
    pay_date
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
              <Title>Pagamento - {payment.id}</Title>
              <Description>
                Edite ou exclua esse pagamento como quiser.
            </Description>

              <SwitchContainer>
                <ChoiceText>Pagamento Realizado?</ChoiceText>

                <CheckBox
                  iconColor="#f8a920"
                  checkColor="#f8a920"
                  value={status}
                  onChange={() => setStatus(!status)}
                />
              </SwitchContainer>

              <InputTitle>Opção de Pagamento</InputTitle>
              <InputContainer>
                <Input
                  editable={false}
                  style={{ color: '#f8a920' }}
                  value={parcels > 1 ? 'Parcelada' : 'á Vista'}
                />
                <MaterialIcons name="edit" size={18} color="#999" />
              </InputContainer>

              <InputTitle>Data do Pagamento</InputTitle>
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

              <ChoiceButton
                onPress={handleNavigateToParcels}
              >
                <SwitchText>Ir para Parcelas?</SwitchText>

                <MaterialIcons name="open-in-new" size={20} color="#fff" />
              </ChoiceButton>

              <DeleteButtonBox>
                <DeleteButton onPress={handleDeletePayment}>
                  <DeleteButtonText>Excluir</DeleteButtonText>
                </DeleteButton>
                <SubmitButton style={{ width: 125 }} onPress={handleUpdatePayment}>
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