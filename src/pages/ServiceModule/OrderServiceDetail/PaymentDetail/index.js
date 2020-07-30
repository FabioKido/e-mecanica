import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  View,
  Picker
} from 'react-native';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import moment from 'moment';
import DatePicker from 'react-native-datepicker';

import {
  SwitchContainer,
  ChoiceText,
  InputContainer,
  InputPicker,
  TitleSection,
  InputTitle,
  Input,
  SubmitButton,
  SubmitButtonText
} from './styles';

import api from '../../../../services/api';

import CheckBox from "../../../../components/CheckBox";

export default function ({ options, total_value, handleSavePayment, loading }) {

  const [parcel, setParcel] = useState(0);
  const [parcels, setParcels] = useState(2);

  const [payment_method, setPaymentMethod] = useState("");
  const [bank_account, setBankAccount] = useState("");

  const [methods, setMethods] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [document_number, setDocument_number] = useState('');
  const [taxa_ajuste, setTaxa_ajuste] = useState('');
  const [observation, setObservation] = useState('');
  const [vencimento, setVencimento] = useState();
  const [paid_out, setPaidOut] = useState(false);

  const [document_numbers, setDocument_numbers] = useState("");
  const [taxa_ajustes, setTaxa_ajustes] = useState("");
  const [observations, setObservations] = useState("");
  const [vencimentos, setVencimentos] = useState("");
  const [paid_outs, setPaidOuts] = useState("");

  const [date, setDate] = useState("");
  const [dates, setDates] = useState("");

  let rows = [];
  let rows_parcels = [];

  for (let i = 0; i < parcels; i++) {
    rows.push(i);
    rows_parcels.push({});
  }

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

    loadMethodsAndAccounts();
  }, []);

  useEffect(() => {
    setParcel(() => (options === 'á Vista' ? total_value : total_value / parcels));

  }, [options, total_value, parcels]);

  const onDateChange = (date, name) => {

    const momentObj = moment(date, 'DD-MM-YYYY');

    setVencimentos({ ...vencimentos, [name]: momentObj });
    setDates({ ...dates, [name]: date });
  };

  const onChangeDate = date => {
    setDate(date);

    const momentObj = moment(date, 'DD-MM-YYYY');

    setVencimento(momentObj);
  };

  const onCheckBoxChange = (value, name) => {
    setPaidOuts({ ...paid_outs, [name]: value });
  };

  function handleInputChangeDocumentNumber(value, name) {
    setDocument_numbers({ ...document_numbers, [name]: value });
  };

  function handleInputChangeTaxaAjuste(value, name) {
    setTaxa_ajustes({ ...taxa_ajustes, [name]: value });
  };

  function handleInputChangeObservations(value, name) {
    setObservations({ ...observations, [name]: value });
  };

  function renderParcelRow(row, index) {

    rows_parcels[index] = {
      parcel: parcel + (Number(taxa_ajustes[`taxa_ajuste${row}`]) || 0),
      number: document_numbers[`document_number${row}`] || row + 1,
      taxa: taxa_ajustes[`taxa_ajuste${row}`] || 0,
      observation: observations[`observations${row}`] || '',
      vencimento: vencimentos[`dates${row}`] || '',
      paid_out: paid_outs[`paid_outs${row}`] || false,
      payment_method,
      bank_account
    }

    return (
      <View key={row}>
        <TitleSection>{`${row + 1}ª Parcela`}</TitleSection>

        <InputTitle>Valor Parcelado </InputTitle>
        <InputContainer>
          <Input
            name='value'
            editable={false}
            style={{ color: '#f8a920' }}
            value={String(parcel)}
          />
          <MaterialIcons name="info" size={20} color="#999" />
        </InputContainer>

        <InputTitle>Vencimento</InputTitle>
        <InputContainer>
          <Input
            placeholder="Clique no calendário para editar"
            editable={false}
            value={dates[`dates${row}`] || ''}
          />
          <DatePicker
            date={dates[`dates${row}`]}
            is24Hour={true}
            format="DD-MM-YYYY"
            minDate="01-01-2001"
            maxDate="31-12-2030"
            hideText={true}
            iconComponent={<FontAwesome5 name="calendar-alt" size={18} color="#999" />}
            style={{
              width: 21
            }}
            onDateChange={d => onDateChange(d, `dates${row}`)}
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
            onChangeText={v => handleInputChangeDocumentNumber(v, `document_number${row}`)}
            value={document_numbers[`document_number${row}`] || ''}
            returnKeyType="next"
          />
          <MaterialIcons name="edit" size={18} color="#999" />
        </InputContainer>

        <InputTitle>Taxa de Ajuste</InputTitle>
        <InputContainer>
          <Input
            placeholder="Digite a taxa de ajuste"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numeric"
            maxLength={60}
            onChangeText={v => handleInputChangeTaxaAjuste(v, `taxa_ajuste${row}`)}
            value={taxa_ajustes[`taxa_ajuste${row}`] || ''}
            returnKeyType="next"
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
            onChangeText={v => handleInputChangeObservations(v, `observations${row}`)}
            value={observations[`observations${row}`] || ''}
            returnKeyType="next"
          />
          <MaterialIcons name="edit" size={18} color="#999" />
        </InputContainer>

        <SwitchContainer>
          <ChoiceText>Parcela Recebida?</ChoiceText>

          <CheckBox
            iconColor="#f8a920"
            checkColor="#f8a920"
            value={paid_outs[`paid_outs${row}`]}
            onChange={() => onCheckBoxChange(!paid_outs[`paid_outs${row}`], `paid_outs${row}`)}
          />
        </SwitchContainer>

      </View>
    )
  }

  function setInfosParcel() {

    let row_parcel = [{
      parcel: Number(total_value) + (Number(taxa_ajuste) || 0),
      number: document_number || 1,
      taxa: taxa_ajuste || 0,
      observation: observation,
      vencimento: vencimento || '',
      paid_out: paid_out,
      payment_method,
      bank_account
    }];

    handleSavePayment(row_parcel, 1);

  }

  const listItems = rows.map(renderParcelRow);

  if (options === 'Parcelada') {
    return (
      <>
        <InputTitle>Escolha as Parcelas</InputTitle>
        <InputPicker>
          <Picker
            selectedValue={parcels}
            style={{
              flex: 1,
              color: '#f8a920',
              backgroundColor: 'transparent',
              fontSize: 17
            }}
            onValueChange={(itemValue, itemIndex) => setParcels(itemValue)}
          >
            <Picker.Item label="2" value={2} />
            <Picker.Item label="3" value={3} />
            <Picker.Item label="4" value={4} />
          </Picker>
          <MaterialIcons name="unfold-more" size={20} color="#999" />
        </InputPicker>

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

        {listItems}

        <SubmitButton onPress={() => handleSavePayment(rows_parcels, parcels)}>
          {loading ? (
            <ActivityIndicator size="small" color="#333" />
          ) : (
              <SubmitButtonText>Salvar</SubmitButtonText>
            )}
        </SubmitButton>
      </>
    )
  } else {
    return (
      <View>
        <TitleSection>{'Detalhes'}</TitleSection>

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

        <InputTitle>Valor á Vista </InputTitle>
        <InputContainer>
          <Input
            name='value'
            editable={false}
            style={{ color: '#f8a920' }}
            value={String(parcel)}
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
            onDateChange={onChangeDate}
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
            value={document_number}
            returnKeyType="next"
          />
          <MaterialIcons name="edit" size={18} color="#999" />
        </InputContainer>

        <InputTitle>Taxa de Ajuste</InputTitle>
        <InputContainer>
          <Input
            placeholder="Digite a taxa de ajuste"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numeric"
            maxLength={60}
            onChangeText={setTaxa_ajuste}
            value={taxa_ajuste}
            returnKeyType="next"
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
            returnKeyType="next"
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

        <SubmitButton onPress={setInfosParcel}>
          {loading ? (
            <ActivityIndicator size="small" color="#333" />
          ) : (
              <SubmitButtonText>Salvar</SubmitButtonText>
            )}
        </SubmitButton>

      </View>
    )
  }
}