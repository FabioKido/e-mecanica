import React, { useState, useEffect } from 'react';
import {
  Alert,
  View,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import moment from 'moment';

import {
  Container,
  Content,
  FormContainer,
  Title,
  Description,
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

import api from '../../../services/api';
import NavigationService from '../../../services/navigation';

export default function ExpenseDetail({ navigation }) {

  const [expense_details, setExpenseDetails] = useState([]);
  const [expense_detail, setExpenseDetail] = useState({});

  const [expense, setExpense] = useState(navigation.state.params);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadExpenseDetails() {
      try {
        setLoading(true);

        const response = await api.get('/finance/expense-details', {
          params: { id_expense: expense.id }
        });
        const { expense_details } = response.data;

        setExpenseDetails(expense_details);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadExpenseDetails();
  }, []);

  async function reloadExpenseDetails() {
    try {
      setRefreshing(true);

      const response = await api.get('/finance/expense-details', {
        params: { id_expense: expense.id }
      });
      const { expense_details } = response.data;

      setExpenseDetails(expense_details);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de receitas, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  function getExpenseDetail(expense_detail) {
    setExpenseDetail(expense_detail);

    setIsVisible(true);
  }

  function renderExpenseDetails({ item: expense_detail }) {
    const datail_date = moment(expense_detail.vencimento).format('DD-MM-YYYY');

    return (
      <Card
        onPress={() => getExpenseDetail(expense_detail)}
      >
        <CardInfo>
          <CardTitle numberOfLines={2}>R$ {expense_detail.value}</CardTitle>
          <CardContainer>
            <CardName>
              Vencimento: {' '}
              <CardSubName>({datail_date})</CardSubName>
            </CardName>

            <CardStatus>{expense_detail.paid_out ? 'Já recebi' : 'á Receber'}</CardStatus>

          </CardContainer>
        </CardInfo>
      </Card>
    );
  }

  // TODO O id_payment(e a categoria de serviço) vem do pagamento de um serviço... resolverei com o redux.
  // TODO Resolver as casa depois da virgula, podendo apenas duas.
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
              <Title>{expense.description}</Title>
              <Description>
                Veja os detalhes da(s) parcela(s) desta despesa. Atualize como quiser.
              </Description>

              {loading ? (
                <Placeholder />
              ) : (
                  <Cards
                    data={expense_details}
                    renderItem={renderExpenseDetails}
                    keyExtractor={expense_details => `details-${expense_details.id}`}
                    showsVerticalScrollIndicator={false}
                    onRefresh={reloadExpenseDetails}
                    refreshing={refreshing}
                    ListFooterComponent={<View style={{ height: 20 }} />}
                    ListEmptyComponent={<Empty>Não foi possivel encontrar parcelas</Empty>}
                  />
                )}

              <CancelarButton onPress={() => NavigationService.goBack()}>
                <CancelarButtonText>Voltar</CancelarButtonText>
              </CancelarButton>

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
        <CustonModal expense_detail={expense_detail} setIsVisible={setIsVisible} reloadExpenseDetails={reloadExpenseDetails} id_expense={expense.id} />
      </Modal>
    </>
  );
}