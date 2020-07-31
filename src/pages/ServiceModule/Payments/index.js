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

export default function OrderProductDetail({ navigation }) {

  const [payments, setPayments] = useState([]);
  const [payment, setPayment] = useState({});

  const [order, setOrder] = useState(navigation.state.params);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadOrderProductDetails() {
      try {
        setLoading(true);

        const response = await api.get('/order/payments', {
          params: { id_order: order.id }
        });
        const { payments } = response.data;

        setPayments(payments);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadOrderProductDetails();
  }, []);

  async function reloadPayments() {
    try {
      setRefreshing(true);

      const response = await api.get('/order/payments', {
        params: { id_order: order.id }
      });
      const { payments } = response.data;

      setPayments(payments);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de pagamentos, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  function getPayment(payment) {
    setPayment(payment);

    setIsVisible(true);
  }

  function renderPayments({ item: payment }) {
    const date = moment(payment.date).format('DD-MM-YYYY');

    return (
      <Card
        onPress={() => getPayment(payment)}
      >
        <CardInfo>
          <CardTitle numberOfLines={1}>Pagamento - {payment.id}</CardTitle>
          <CardContainer>
            <CardName>
              Pagamento: {' '}
              <CardSubName>({date})</CardSubName>
            </CardName>

            <CardStatus>{payment.status ? 'Realizado' : 'Não realizado'}</CardStatus>

          </CardContainer>
        </CardInfo>
      </Card>
    );
  }

  return (
    <>
      <LinearGradient
        colors={['#2b475c', '#000']}
        style={{ flex: 1 }}
      >
        <Container>
          <Content keyboardShouldPersistTaps="handled">
            <FormContainer>
              <Title>OS - {order.id}</Title>
              <Description>
                Veja os detalhes do(s) pagamentos(s) dos serviços desta OS. Atualize como quiser.
              </Description>

              {loading ? (
                <Placeholder />
              ) : (
                  <Cards
                    data={payments}
                    renderItem={renderPayments}
                    keyExtractor={payments => `details-${payments.id}`}
                    showsVerticalScrollIndicator={false}
                    onRefresh={reloadPayments}
                    refreshing={refreshing}
                    ListFooterComponent={<View style={{ height: 20 }} />}
                    ListEmptyComponent={<Empty>Não foi possivel encontrar pagamentos</Empty>}
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
        <CustonModal payment={payment} setIsVisible={setIsVisible} reloadPayments={reloadPayments} />
      </Modal>
    </>
  );
}