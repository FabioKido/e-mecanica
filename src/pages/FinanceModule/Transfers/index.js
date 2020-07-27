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

import { useDispatch } from 'react-redux';

import {
  Container,
  Content,
  FormContainer,
  InputContainer,
  Title,
  Description,
  InputPicker,
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

import { updateAccountRequest } from '../../../store/modules/finance/actions';

import api from '../../../services/api';

export default function Accounts() {

  const dispatch = useDispatch();

  const observationsInputRef = useRef();

  const [categories, setCategories] = useState([]);
  const [id_category, setIdCategory] = useState();

  const [accounts, setAccounts] = useState([]);
  const [id_account_origin, setIdAccountOrigin] = useState('');
  const [id_account_destiny, setIdAccountDestiny] = useState('');

  const [transfers, setTransfers] = useState([]);
  const [transfer, setTransfer] = useState([]);
  const [add_transfer, setAddTransfer] = useState(false);

  const [total_value, setTotalValue] = useState('');
  const [description, setDescription] = useState('');
  const [observations, setObservations] = useState('');
  const [date_transfer, setDateTransfer] = useState('');

  const [date, setDate] = useState();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadTransfers() {
      try {
        setLoading(true);

        const response = await api.get('/finance/transfers');
        const { transfers } = response.data;

        setTransfers(transfers);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadTransfers();
  }, []);

  useEffect(() => {
    if (add_transfer) {
      async function loadAccountsAndCategories() {
        try {

          const res_cat = await api.get('/finance/categories');
          const { categories } = res_cat.data;

          const res_acc = await api.get('/finance/accounts');
          const { accounts } = res_acc.data;

          setAccounts(accounts);
          setCategories(categories);
        } catch (err) {
          console.log(err);
        }
      }

      loadAccountsAndCategories();
    }
  }, [add_transfer]);

  function getTransfer(transfer) {
    setTransfer(transfer);

    setIsVisible(true);
  }

  const onDateChange = date => {
    setDate(date);

    const momentObj = moment(date, 'DD-MM-YYYY');

    setDateTransfer(momentObj);
  };

  async function reloadTransfers() {
    try {
      setRefreshing(true);

      const response = await api.get('/finance/transfers');
      const { transfers } = response.data;

      setTransfers(transfers);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de transferências, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  const handleSaveTransfer = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        total_value: Yup.number().required('Valor é obrigatório')
      });

      await schema.validate({ total_value }, {
        abortEarly: false,
      });

      const response = await api.post('/finance/transfer', {
        id_category,
        id_account_origin,
        id_account_destiny,
        total_value,
        description,
        date_transfer,
        observations
      });

      const { origin_value, destiny_value } = response.data;

      dispatch(
        updateAccountRequest(
          id_account_origin,
          id_account_destiny,
          total_value,
          origin_value,
          destiny_value
        )
      );

      Alert.alert('Sucesso!', 'Transferência realizada com sucesso.');
    } catch (err) {

      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na transferência, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadTransfers();
    }
  }, [
    id_category,
    id_account_origin,
    id_account_destiny,
    total_value,
    description,
    date_transfer,
    observations
  ]);

  function ViewButton() {
    if (add_transfer) {
      return (
        <>
          <SubmitButton onPress={handleSaveTransfer}>
            {loading ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
                <SubmitButtonText>Salvar</SubmitButtonText>
              )}
          </SubmitButton>
          <CancelarButton onPress={() => setAddTransfer(false)}>
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
                data={transfers}
                renderItem={renderTransfers}
                keyExtractor={transfers => `transfer-${transfers.id}`}
                showsVerticalScrollIndicator={false}
                onRefresh={reloadTransfers}
                refreshing={refreshing}
                ListFooterComponent={<View style={{ height: 20 }} />}
                ListEmptyComponent={<Empty>Nenhuma transferência encontrada.</Empty>}
              />
            )}
          <SubmitButton onPress={() => setAddTransfer(true)}>
            <SubmitButtonText>Nova Transferência</SubmitButtonText>
          </SubmitButton>
        </>
      );
    }
  }

  function renderTransfers({ item: transfer }) {
    const transfer_date = moment(transfer.date).format('DD-MM-YYYY');

    return (
      <Card
        onPress={() => getTransfer(transfer)}
      >
        <CardInfo>
          <CardTitle numberOfLines={2}>{transfer.description}</CardTitle>
          <CardContainer>
            <CardName>
              Transferência{' '}
              <CardSubName>({transfer_date})</CardSubName>
            </CardName>

            <CardStatus>R$ {transfer.total_value}</CardStatus>

          </CardContainer>
        </CardInfo>
      </Card>
    );
  }

  // TODO Atualizar as contas co redux ou no controller(Transfer) mesmo.
  return (
    <>
      <LinearGradient
        colors={['#2b475c', '#000']}
        style={{ flex: 1 }}
      >
        <Container>
          <Content keyboardShouldPersistTaps="handled">
            <FormContainer>
              <Title>Transferências</Title>
              <Description>
                Veja todas as suas transferências feitas. Crie ou exclua uma transferência como quiser.
          </Description>

              {add_transfer &&
                <>
                  <InputTitle>Categoria</InputTitle>
                  <InputPicker>
                    <Picker
                      selectedValue={id_category}
                      style={{
                        flex: 1,
                        color: '#f8a920',
                        backgroundColor: 'transparent',
                        fontSize: 17
                      }}
                      onValueChange={(itemValue, itemIndex) => setIdCategory(itemValue)}
                    >
                      <Picker.Item label="Selecione a Categoria" value="" />
                      {categories && categories.map(category => <Picker.Item key={category.id} label={category.description} value={category.id} />)}
                    </Picker>
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputPicker>

                  <InputTitle>Conta de Origem</InputTitle>
                  <InputPicker>
                    <Picker
                      selectedValue={id_account_origin}
                      style={{
                        flex: 1,
                        color: '#592f2a',
                        backgroundColor: 'transparent',
                        fontSize: 17
                      }}
                      onValueChange={(itemValue, itemIndex) => setIdAccountOrigin(itemValue)}
                    >
                      <Picker.Item label="Selecione a Conta de Origem" value="" />
                      {accounts && accounts.map(account => <Picker.Item key={account.id} label={account.title} value={account.id} />)}
                    </Picker>
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputPicker>

                  <InputTitle>Valor Total</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite o valor total da receita"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="numeric"
                      maxLength={60}
                      onChangeText={setTotalValue}
                      value={total_value}
                      returnKeyType="next"
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                    <MaterialIcons name="person-pin" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Conta de Destino</InputTitle>
                  <InputPicker>
                    <Picker
                      selectedValue={id_account_destiny}
                      style={{
                        flex: 1,
                        color: '#2b5b2e',
                        backgroundColor: 'transparent',
                        fontSize: 17
                      }}
                      onValueChange={(itemValue, itemIndex) => setIdAccountDestiny(itemValue)}
                    >
                      <Picker.Item label="Selecione a Conta de Destino" value="" />
                      {accounts && accounts.map(account => <Picker.Item key={account.id} label={account.title} value={account.id} />)}
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

                  <InputTitle>Descrição</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite uma breve descrição"
                      autoCapitalize="words"
                      autoCorrect={false}
                      onChangeText={setDescription}
                      value={description}
                      returnKeyType="next"
                      onSubmitEditing={() => observationsInputRef.current.focus()}
                    />
                    <MaterialIcons name="person-pin" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Observações</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite algo a ser observado"
                      autoCapitalize="none"
                      autoCorrect={false}
                      ref={observationsInputRef}
                      onChangeText={setObservations}
                      value={observations}
                      returnKeyType="send"
                      onSubmitEditing={handleSaveTransfer}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>

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
        <CustonModal transfer={transfer} setIsVisible={setIsVisible} reloadTransfers={reloadTransfers} />
      </Modal>
    </>
  );
}

Accounts.navigationOptions = {
  tabBarLabel: 'Transferir',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="exchange-alt" size={18} color={tintColor} />
  ),
};