import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
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
  InputContainer,
  InputPicker,
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
import ExpenseDetail from './ExpenseDetail';
import CustonModal from './CustonModal';

import api from '../../../services/api';

export default function Expenses() {

  const descriptionInputRef = useRef();
  const observationsInputRef = useRef();

  const [expenses, setExpenses] = useState([]);
  const [expense, setExpense] = useState({});
  const [add_expense, setAddExpense] = useState(false);

  const [categories, setCategories] = useState([]);
  const [id_category, setIdCategory] = useState();

  const [total_value, setTotalValue] = useState('');
  const [description, setDescription] = useState('');
  const [observations, setObservations] = useState('');
  const [classification, setClassification] = useState('');
  const [options, setOptions] = useState('');
  const [date_expense, setDateExpense] = useState('');

  const [date, setDate] = useState();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadExpenses() {
      try {
        setLoading(true);

        const response = await api.get('/finance/expenses');
        const { expenses } = response.data;

        setExpenses(expenses);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadExpenses();
  }, []);

  useEffect(() => {
    if (add_expense) {
      async function loadCategories() {
        try {

          const response = await api.get('/finance/categories');
          const { categories } = response.data;

          setCategories(categories);
        } catch (err) {
          console.log(err);
        }
      }

      loadCategories();
    }
  }, [add_expense]);

  function getExpense(expense) {
    setExpense(expense);

    setIsVisible(true);
  }

  const onDateChange = date => {
    setDate(date);

    const momentObj = moment(date, 'DD-MM-YYYY');

    setDateExpense(momentObj);
  };

  async function reloadExpenses() {
    try {
      setRefreshing(true);

      const response = await api.get('/finance/expenses');
      const { expenses } = response.data;

      setExpenses(expenses);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de despesas, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  const handleSaveExpense = useCallback(async (obj_parcels, parcels) => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        total_value: Yup.number().required('O valor total é obrigatório')
      });

      await schema.validate({ total_value }, {
        abortEarly: false,
      });

      const res_expense = await api.post('/finance/expense', {
        id_category,
        total_value,
        description,
        parcels,
        date: date_expense,
        observations,
        classification,
        options
      });

      await obj_parcels.map(obj_parcel =>
        api.post(`/finance/expense-detail/${res_expense.data.data.id}`, {
          value: obj_parcel.parcel,
          vencimento: obj_parcel.vencimento,
          document_number: obj_parcel.number,
          taxa_ajuste: obj_parcel.taxa,
          observations: obj_parcel.observation,
          paid_out: obj_parcel.paid_out,
          id_payment_method: obj_parcel.payment_method,
          id_account_destiny: obj_parcel.account_destiny
        })
      );

      Alert.alert('Sucesso!', 'Nova despesa registrada com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;
      console.log(err)
      Alert.alert(
        'Ooopsss',
        message || 'Falha no registro da nova despesa, confira seus dados.'
      );
    } finally {
      reloadExpenses();
      setLoading(false);
    }
  }, [
    id_category,
    total_value,
    description,
    date_expense,
    observations,
    classification,
    options
  ]);

  function ViewButton() {
    if (add_expense) {
      return (
        <CancelarButton onPress={() => setAddExpense(false)}>
          <CancelarButtonText>Voltar</CancelarButtonText>
        </CancelarButton>
      );
    } else {
      return (
        <>
          {loading ? (
            <Placeholder />
          ) : (
              <Cards
                data={expenses}
                renderItem={renderExpenses}
                keyExtractor={expenses => `expense-${expenses.id}`}
                showsVerticalScrollIndicator={false}
                onRefresh={reloadExpenses}
                refreshing={refreshing}
                ListFooterComponent={<View style={{ height: 20 }} />}
                ListEmptyComponent={<Empty>Nenhuma despesa encontrada.</Empty>}
              />
            )}
          <SubmitButton onPress={() => setAddExpense(true)}>
            <SubmitButtonText>Nova Despesa</SubmitButtonText>
          </SubmitButton>
        </>
      );
    }
  }

  function renderExpenses({ item: expense }) {
    const expense_date = moment(expense.date).format('DD-MM-YYYY');

    return (
      <Card
        onPress={() => getExpense(expense)}
      >
        <CardInfo>
          <CardTitle numberOfLines={2}>{expense.description}</CardTitle>
          <CardContainer>
            <CardName>
              Registro {' '}
              <CardSubName>({expense_date})</CardSubName>
            </CardName>

            <CardStatus>{expense.total_value}</CardStatus>

          </CardContainer>
        </CardInfo>
      </Card>
    );
  }

  // TODO Resolver as casas depois da virgula, podendo ser apenas duas.
  // TODO Enviar o valor da parcela, quando quitar a parcela para a conta de destino.
  // FIXME Prevenir o pagamento duplo de uma parcela de receita/despesa(Ou seja, bloquear o quitamento/recebimento e o campo Taxa de Ajuste).
  // FIXME Butão de Page no Dashboard para listar todas as parcelas(por ter algumas que não tem o id da receita)

  return (
    <>
      <LinearGradient
        colors={['#592f2a', '#000']}
        style={{ flex: 1 }}
      >
        <Container>
          <Content keyboardShouldPersistTaps="handled">
            <FormContainer>
              <Title>Despesas</Title>
              <Description>
                Veja todas as suas despesas. Crie ou exclua uma despesa como quiser.
              </Description>

              {add_expense &&
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
                    <MaterialIcons name="unfold-more" size={20} color="#999" />
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
                      onSubmitEditing={() => descriptionInputRef.current.focus()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <InputTitle>Descrição</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite uma breve descrição"
                      autoCapitalize="words"
                      autoCorrect={false}
                      ref={descriptionInputRef}
                      onChangeText={setDescription}
                      value={description}
                      returnKeyType="next"
                      onSubmitEditing={() => observationsInputRef.current.focus()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
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

                  <InputTitle>Classificação</InputTitle>
                  <InputPicker>
                    <Picker
                      selectedValue={classification}
                      style={{
                        flex: 1,
                        color: '#f8a920',
                        backgroundColor: 'transparent',
                        fontSize: 17
                      }}
                      onValueChange={(itemValue, itemIndex) => setClassification(itemValue)}
                    >
                      <Picker.Item label="Despesa Variável" value="Despesa Variável" />
                      <Picker.Item label="Despesa Fixa" value="Despesa Fixa" />
                    </Picker>
                    <MaterialIcons name="unfold-more" size={20} color="#999" />
                  </InputPicker>

                  <InputTitle>Observações</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite algo a ser observado"
                      autoCapitalize="none"
                      autoCorrect={false}
                      ref={observationsInputRef}
                      onChangeText={setObservations}
                      value={observations}
                      returnKeyType="next"
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <InputTitle>Opções</InputTitle>
                  <InputPicker>
                    <Picker
                      selectedValue={options}
                      style={{
                        flex: 1,
                        color: '#f8a920',
                        backgroundColor: 'transparent',
                        fontSize: 17
                      }}
                      onValueChange={(itemValue, itemIndex) => setOptions(itemValue)}
                    >
                      <Picker.Item label="Selecione a Opção de Pagamento" value="á Vista" />
                      <Picker.Item label="á Vista" value="á Vista" />
                      <Picker.Item label="Parcelada" value="Parcelada" />
                    </Picker>
                    <MaterialIcons name="unfold-more" size={20} color="#999" />
                  </InputPicker>

                  {options !== '' &&
                    <ExpenseDetail options={options} total_value={total_value} handleSaveExpense={handleSaveExpense} loading={loading} />
                  }
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
        <CustonModal expense={expense} setIsVisible={setIsVisible} reloadExpenses={reloadExpenses} />
      </Modal>
    </>
  );
}

Expenses.navigationOptions = {
  tabBarLabel: 'Despesas',
  tabBarIcon: ({ tintColor }) => (
    <MaterialIcons name="trending-down" size={28} color={tintColor} />
  ),
};
