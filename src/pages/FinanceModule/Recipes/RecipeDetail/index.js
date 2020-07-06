import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  View,
  Picker
} from 'react-native';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import {
  Container,
  Content,
  FormContainer,
  InputContainer,
  InputPicker,
  Title,
  TitleSection,
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

import api from '../../../../services/api';

// TODO Ver se a taxa é em porcentagem ou em dinheiro mesmo!!!
// TODO Colocar os REF nos inputs, para ver se dá certo eles.
// FIXME Resolver os inputs da parcela(Não tem o target?).

export default function ({ options, total_value, reloadRecipes, handleSaveRecipe }) {

  const [parcel, setParcel] = useState(0);
  const [parcels, setParcels] = useState(2);

  const [payment_method, setPayment_method] = useState("");
  const [account_destiny, setAccount_destiny] = useState("");

  const [methods, setMethods] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [document_numbers, setDocument_numbers] = useState("");
  const [taxa_ajustes, setTaxa_ajustes] = useState("");
  const [observations, setObservations] = useState("");

  const [loading, setLoading] = useState(false);

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

    setDocument_numbers("");
    setTaxa_ajustes("");
    setObservations("");

  }, [options, total_value, parcels]);

  function handleInputChangeDocumentNumber(event) {
    const { name, value } = event.target;

    setDocument_numbers({ ...document_numbers, [name]: value });
  };

  function handleInputChangeTaxaAjuste(event) {
    const { name, value } = event.target;

    setTaxa_ajustes({ ...taxa_ajustes, [name]: value });
  };

  function handleInputChangeObservations(event) {
    const { name, value } = event.target;

    setObservations({ ...observations, [name]: value });
  };

  function renderRow(row, index) {

    rows_parcels[index] = {
      indice: row,
      parcel: parcel + (Number(taxa_ajustes[`taxa_ajuste${row}`]) || 0),
      number: document_numbers[`document_number${row}`] || '',
      taxa: taxa_ajustes[`taxa_ajuste${row}`] || 0,
      observation: observations[`observations${row}`] || ''
    }

    return (
      <View key={row}>
        <TitleSection>{`${row + 1}ª Parcela`}</TitleSection>

        <InputTitle>Valor Parcelado </InputTitle>
        <InputContainer>
          <Input
            name='value'
            editable={false}
            style={{ color: '#2b475c' }}
            value={String(parcel)}
          />
          <FontAwesome5 name="file-invoice-dollar" size={20} color="#999" />
        </InputContainer>

        <InputTitle>Número do Documento</InputTitle>
        <InputContainer>
          <Input
            name={`document_number${row}`}
            placeholder="Digite o número do documento"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numeric"
            maxLength={60}
            onChangeText={handleInputChangeDocumentNumber}
            value={document_numbers[`document_number${row}`] || ''}
            returnKeyType="next"
          />
          <MaterialIcons name="person-pin" size={20} color="#999" />
        </InputContainer>

        <InputTitle>Taxa de Ajuste</InputTitle>
        <InputContainer>
          <Input
            name={`taxa_ajuste${row}`}
            placeholder="Digite a taxa de ajuste"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numeric"
            maxLength={60}
            onChangeText={handleInputChangeTaxaAjuste}
            value={taxa_ajustes[`taxa_ajuste${row}`] || ''}
            returnKeyType="next"
          />
          <MaterialIcons name="person-pin" size={20} color="#999" />
        </InputContainer>

        <InputTitle>Observações</InputTitle>
        <InputContainer>
          <Input
            name={`observations${row}`}
            placeholder="Algo a observar referente a parcela"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={60}
            onChangeText={handleInputChangeObservations}
            value={observations[`observations${row}`] || ''}
            returnKeyType="next"
          />
          <MaterialIcons name="person-pin" size={20} color="#999" />
        </InputContainer>
      </View>
    )
  }

  const listItems = rows.map(renderRow);

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
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
          </Picker>
          <MaterialIcons name="lock" size={20} color="#999" />
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
        {listItems}

        <SubmitButton onPress={() => { }}>
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
      <>

      </>
    )
  }
}