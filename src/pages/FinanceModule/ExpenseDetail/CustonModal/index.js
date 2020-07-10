import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Picker
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

export default function CustonModal({ expense_detail, setIsVisible, reloadExpenseDetails, id_expense }) {

  const taxaAjusteInputRef = useRef();
  const observationInputRef = useRef();

  const [payment_method, setPayment_method] = useState(expense_detail.id_payment_method);
  const [account_destiny, setAccount_destiny] = useState(expense_detail.id_account_destiny);

  const [methods, setMethods] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [value, setValue] = useState(expense_detail.value);
  const [document_number, setDocument_number] = useState(expense_detail.document_number);
  const [taxa_ajuste, setTaxa_ajuste] = useState();
  const [observation, setObservation] = useState(expense_detail.observations);
  const [vencimento, setVencimento] = useState(expense_detail.vencimento);
  const [paid_out, setPaidOut] = useState(expense_detail.paid_out);

  const [date, setDate] = useState(() => vencimento ? moment(vencimento).format('DD-MM-YYYY') : '');
  const [loading, setLoading] = useState(false);

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
      }
    }

    setTimeout(loadMethodsAndAccounts, 1000);
  }, []);

  const onDateChange = date => {
    setDate(date);

    const momentObj = moment(date, 'DD-MM-YYYY');

    setVencimento(momentObj);
  };

  const handleUpdateExpenseDetail = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const taxa_ant = expense_detail.taxa_ajuste;

      await api.put(`/finance/expense-detail/${expense_detail.id}`, {
        value: Number(value) + ((Number(taxa_ajuste) - Number(taxa_ant)) || 0),
        document_number,
        taxa_ajuste,
        vencimento,
        paid_out,
        observations: observation,
        id_payment_method: payment_method,
        id_account_destiny: account_destiny,
        taxa_ant
      }, {
        params: { id_expense }
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
      reloadExpenseDetails();
    }
  }, [
    value,
    document_number,
    taxa_ajuste,
    vencimento,
    paid_out,
    observation,
    payment_method,
    account_destiny
  ]);

  return (
    <LinearGradient
      colors={['#592f2a', '#000']}
      style={{ flex: 1 }}
    >
      <Container>
        <Content keyboardShouldPersistTaps="handled">
          <FormContainer>
            <Title>Parcela - {expense_detail.document_number}</Title>
            <Description>
              Edite ou exclua essa parcela como quiser.
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
                onValueChange={(itemValue, itemIndex) => setPayment_method(itemValue)}
              >
                <Picker.Item label="Selecione o Método de Pagamento" value="" />
                {methods && methods.map(method => <Picker.Item key={method.id} label={method.method} value={method.id} />)}
              </Picker>
              <MaterialIcons name="lock" size={20} color="#999" />
            </InputPicker>

            <InputTitle>Conta de Destino</InputTitle>
            <InputPicker>
              <Picker
                selectedValue={account_destiny}
                style={{
                  flex: 1,
                  color: '#f8a920',
                  backgroundColor: 'transparent',
                  fontSize: 17
                }}
                onValueChange={(itemValue, itemIndex) => setAccount_destiny(itemValue)}
              >
                <Picker.Item label="Selecione a Conta de Destino" value="" />
                {accounts && accounts.map(account => <Picker.Item key={account.id} label={account.title} value={account.id} />)}
              </Picker>
              <MaterialIcons name="lock" size={20} color="#999" />
            </InputPicker>

            <InputTitle>Valor</InputTitle>
            <InputContainer>
              <Input
                name='value'
                editable={false}
                style={{ color: '#f8a920' }}
                value={String(value)}
              />
              <FontAwesome5 name="file-invoice-dollar" size={20} color="#999" />
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
              <MaterialIcons name="person-pin" size={20} color="#999" />
            </InputContainer>

            <InputTitle>Taxa de Ajuste</InputTitle>
            <InputContainer>
              <Input
                placeholder={`Taxa de ajuste atual: ${expense_detail.taxa_ajuste}`}
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
              <MaterialIcons name="person-pin" size={20} color="#999" />
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
              <MaterialIcons name="person-pin" size={20} color="#999" />
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

            <SubmitButton onPress={handleUpdateExpenseDetail}>
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