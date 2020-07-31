import React, { useState, useEffect } from 'react';
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

export default function OrderProductDetail({ navigation }) {

  const [order_product_details, setOrderProductDetails] = useState([]);
  const [order_product_detail, setOrderProductDetail] = useState({});

  const [order_service, setOrderService] = useState(navigation.state.params);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadOrderProductDetails() {
      try {
        setLoading(true);

        const response = await api.get('/order/order-products', {
          params: { id_os: order_service.id }
        });
        const { order_products } = response.data;

        setOrderProductDetails(order_products);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadOrderProductDetails();
  }, []);

  async function reloadOrderProductDetails() {
    try {
      setRefreshing(true);

      const response = await api.get('/order/order-products', {
        params: { id_os: order_service.id }
      });
      const { order_products } = response.data;

      setOrderProductDetails(order_products);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de produtos, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  function getOrderProductDetail(order_product_detail) {
    setOrderProductDetail(order_product_detail);

    setIsVisible(true);
  }

  function renderOrderProductDetails({ item: order_product_detail }) {
    return (
      <Card
        onPress={() => getOrderProductDetail(order_product_detail)}
      >
        <CardInfo>
          <CardTitle numberOfLines={1}>Produto - {order_product_detail.id}</CardTitle>
          <CardContainer>
            <CardName>
              Quantidade: {' '}
              <CardSubName>({order_product_detail.qtd})</CardSubName>
            </CardName>

            <CardStatus>R$ {order_product_detail.total_sale}</CardStatus>

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
              <Title>Serviço - {order_service.id}</Title>
              <Description>
                Veja os detalhes do(s) produtos(s) deste serviço. Atualize como quiser.
              </Description>

              {loading ? (
                <Placeholder />
              ) : (
                  <Cards
                    data={order_product_details}
                    renderItem={renderOrderProductDetails}
                    keyExtractor={order_product_details => `details-${order_product_details.id}`}
                    showsVerticalScrollIndicator={false}
                    onRefresh={reloadOrderProductDetails}
                    refreshing={refreshing}
                    ListFooterComponent={<View style={{ height: 20 }} />}
                    ListEmptyComponent={<Empty>Não foi possivel encontrar produtos</Empty>}
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
        <CustonModal order_product_detail={order_product_detail} setIsVisible={setIsVisible} reloadOrderProductDetails={reloadOrderProductDetails} />
      </Modal>
    </>
  );
}