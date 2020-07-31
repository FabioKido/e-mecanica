import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Picker,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import moment from 'moment';
import DatePicker from 'react-native-datepicker';

import {
  Container,
  Content,
  FormContainer,
  InputPicker,
  SwitchContainer,
  InputContainer,
  Title,
  Description,
  InputTitle,
  Input,
  SubmitButton,
  SubmitButtonText,
  CancelarButton,
  CancelarButtonText,
  ChoiceText
} from './styles';

import api from '../../../../services/api';

import CheckBox from '../../../../components/CheckBox';
import LoadGif from '../../../../assets/loading.gif';

export default function CustonModal({ parcel, setIsVisible, reloadParcels, id_payment }) {

  const taxaAjusteInputRef = useRef();
  const observationInputRef = useRef();

  const [payment_method, setPaymentMethod] = useState(parcel.id_payment_method);
  const [bank_account, setBankAccount] = useState(parcel.id_bank_account);

  const [methods, setMethods] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [value, setValue] = useState(parcel.value);
  const [document_number, setDocument_number] = useState(parcel.document_number);
  const [taxa_ajuste, setTaxa_ajuste] = useState();
  const [observation, setObservation] = useState(parcel.observations);
  const [vencimento, setVencimento] = useState(parcel.vencimento);
  const [paid_out, setPaidOut] = useState(parcel.paid_out);

  const [date, setDate] = useState(() => vencimento ? moment(vencimento).format('DD-MM-YYYY') : '');
  const [loading, setLoading] = useState(false);
  const [first_loading, setFirstLoading] = useState(true);

  useEffect(() => {
    async function loadMethodsAndAccounts() {
      try {

        const res_acc = await api.get('/finance/accounts');
        const { accounts } = res_acc.data;

        const res_met = await api.get('/finance/methods');
        const { payment_methods } = res_met.data;

        setAccounts(accounts);
        setMethods(payment_methods);
      } catch (err) {
        console.log(err);
      } finally {
        setFirstLoading(false);
      }
    }

    setTimeout(loadMethodsAndAccounts, 1000);
  }, []);

  const onDateChange = date => {
    setDate(date);

    const momentObj = moment(date, 'DD-MM-YYYY');

    setVencimento(momentObj);
  };

  const handleUpdateParcel = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const taxa_ant = parcel.taxa_ajuste;

      await api.put(`/order/parcel/${parcel.id}`, {
        value,
        document_number,
        taxa_ajuste: taxa_ajuste || taxa_ant,
        vencimento,
        paid_out,
        observations: observation,
        id_payment_method: payment_method,
        id_bank_account: bank_account,
        taxa_ant
      });

      Alert.alert('Sucesso!', 'Parcela atualizada com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização da Parcela, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadParcels();
    }
  }, [
    value,
    document_number,
    taxa_ajuste,
    vencimento,
    paid_out,
    observation,
    payment_method,
    bank_account
  ]);

  // FIXME Botão de Page no Dashboard para listar todas as parcelas(por ter algumas que não tem o id do pagamento, por ter sido excluído).
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
              <Title>Parcela - {parcel.document_number}</Title>
              <Description>
                Edite essa parcela como quiser.
            </Description>

              <InputTitle>Método de Pagamento</InputTitle>
              <InputPicker>
                <Picker
                  selectedValue={payment_method}
                  style={{
                    flex: 1,
                    color: '#f8a920',
                    backgroundColor: 'transparent',
                    fontSize: 17
                  }}
                  onValueChange={(itemValue, itemIndex) => setPaymentMethod(itemValue)}
                >
                  <Picker.Item label="Selecione o Método de Pagamento" value="" />
                  {methods && methods.map(method => <Picker.Item key={method.id} label={method.method} value={method.id} />)}
                </Picker>
                <MaterialIcons name="unfold-more" size={20} color="#999" />
              </InputPicker>

              <InputTitle>Conta de Destino</InputTitle>
              <InputPicker>
                <Picker
                  selectedValue={bank_account}
                  style={{
                    flex: 1,
                    color: '#f8a920',
                    backgroundColor: 'transparent',
                    fontSize: 17
                  }}
                  onValueChange={(itemValue, itemIndex) => setBankAccount(itemValue)}
                >
                  <Picker.Item label="Selecione a Conta de Destino" value="" />
                  {accounts && accounts.map(account => <Picker.Item key={account.id} label={account.title} value={account.id} />)}
                </Picker>
                <MaterialIcons name="unfold-more" size={20} color="#999" />
              </InputPicker>

              <InputTitle>Valor</InputTitle>
              <InputContainer>
                <Input
                  name='value'
                  editable={false}
                  style={{ color: '#f8a920' }}
                  value={String(value)}
                />
                <MaterialIcons name="info" size={20} color="#999" />
              </InputContainer>

              <InputTitle>Vencimento</InputTitle>
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

              <InputTitle>Número do Documento</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Digite o número do documento"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="numeric"
                  maxLength={60}
                  onChangeText={setDocument_number}
                  value={String(document_number)}
                  returnKeyType="next"
                  onSubmitEditing={() => taxaAjusteInputRef.current.focus()}
                />
                <MaterialIcons name="edit" size={18} color="#999" />
              </InputContainer>

              <InputTitle>Taxa de Ajuste</InputTitle>
              <InputContainer>
                <Input
                  placeholder={`Taxa de ajuste atual: ${parcel.taxa_ajuste}`}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="numeric"
                  maxLength={60}
                  onChangeText={setTaxa_ajuste}
                  value={taxa_ajuste}
                  ref={taxaAjusteInputRef}
                  returnKeyType="next"
                  onSubmitEditing={() => observationInputRef.current.focus()}
                />
                <MaterialIcons name="edit" size={18} color="#999" />
              </InputContainer>

              <InputTitle>Observações</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Algo a observar referente a parcela"
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={60}
                  onChangeText={setObservation}
                  value={observation}
                  ref={observationInputRef}
                  returnKeyType="next"
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <MaterialIcons name="edit" size={18} color="#999" />
              </InputContainer>

              <SwitchContainer>
                <ChoiceText>Parcela Recebida?</ChoiceText>

                <CheckBox
                  iconColor="#f8a920"
                  checkColor="#f8a920"
                  value={paid_out}
                  onChange={() => setPaidOut(!paid_out)}
                />
              </SwitchContainer>

              <SubmitButton onPress={handleUpdateParcel}>
                {loading ? (
                  <ActivityIndicator size="small" color="#333" />
                ) : (
                    <SubmitButtonText>Salvar</SubmitButtonText>
                  )}
              </SubmitButton>

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