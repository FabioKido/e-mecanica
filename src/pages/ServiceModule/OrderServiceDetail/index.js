import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Alert,
  View,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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

export default function OrderServiceDetail({ navigation }) {

  const [order_service_details, setOrderServiceDetails] = useState([]);
  const [order_service_detail, setOrderServiceDetail] = useState({});

  const [order, setOrder] = useState(navigation.state.params);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadOrderServiceDetails() {
      try {
        setLoading(true);

        const res_ord_serv = await api.get('/order/order-services', {
          params: { id_order: order.id }
        });
        const { order_services } = res_ord_serv.data;

        setOrderServiceDetails(order_services);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadOrderServiceDetails();
  }, []);

  async function reloadOrderServiceDetails() {
    try {
      setRefreshing(true);

      const response = await api.get('/order/order-services', {
        params: { id_order: order.id }
      });
      const { order_services } = response.data;

      setOrderServiceDetails(order_services);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de serviços, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  function getOrderServiceDetail(order_service_detail) {
    setOrderServiceDetail(order_service_detail);

    setIsVisible(true);
  }

  function renderOrderServiceDetails({ item: order_service_detail }) {
    return (
      <Card
        onPress={() => getOrderServiceDetail(order_service_detail)}
      >
        <CardInfo>
          <CardTitle numberOfLines={1}>Serviço - {order_service_detail.id}</CardTitle>
          <CardContainer>
            <CardName>
              Serviço: {' '}
              <CardSubName>({order_service_detail.approved ? 'Aprovado' : 'Recusado'})</CardSubName>
            </CardName>

            <CardStatus>R$ {order_service_detail.price}</CardStatus>

          </CardContainer>
        </CardInfo>
      </Card>
    );
  }

  // TODO Resolver o Approved, ver o que significa.
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
                Veja os detalhes do(s) serviço(s) desta OS. Atualize como quiser.
              </Description>

              {loading ? (
                <Placeholder />
              ) : (
                  <Cards
                    data={order_service_details}
                    renderItem={renderOrderServiceDetails}
                    keyExtractor={order_service_details => `details-${order_service_details.id}`}
                    showsVerticalScrollIndicator={false}
                    onRefresh={reloadOrderServiceDetails}
                    refreshing={refreshing}
                    ListFooterComponent={<View style={{ height: 20 }} />}
                    ListEmptyComponent={<Empty>Não foi possivel encontrar serviços</Empty>}
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
        <CustonModal order_service_detail={order_service_detail} setIsVisible={setIsVisible} reloadOrderServiceDetails={reloadOrderServiceDetails} />
      </Modal>
    </>
  );
}