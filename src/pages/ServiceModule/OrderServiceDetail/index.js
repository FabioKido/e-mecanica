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

import moment from 'moment';

import { MaterialIcons } from '@expo/vector-icons';

import {
  Container,
  Content,
  FormContainer,
  Title,
  Description,
  CancelarButton,
  CancelarButtonText,
  InputContainer,
  InputPicker,
  InputTitle,
  Input,
  SubmitButton,
  SubmitButtonText,
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

  const discountInputRef = useRef();
  const qtdInputRef = useRef();

  const [order_service_details, setOrderServiceDetails] = useState([]);
  const [order_service_detail, setOrderServiceDetail] = useState({});
  const [order_service, setOrderService] = useState()

  const [order, setOrder] = useState(navigation.state.params);

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState();
  const [id_product, setIdProduct] = useState();

  const [acquisition_products, setAcquisitionProducts] = useState([]);
  const [acquisition_product, setAcquisitionProduct] = useState();
  const [id_acquisition_product, setIdAcquisitionProduct] = useState();

  const [add_order_product, setAddOrderProduct] = useState(false);
  const [id_prod_acq, setIdProdAcq] = useState();

  const [id_provider, setIdProvider] = useState();
  const [unity_cost, setUnityCost] = useState('');
  const [unit_sale, setUnitSale] = useState('');
  const [discount, setDiscount] = useState(0);
  const [qtd, setQtd] = useState(1);
  const [acquisition, setAcquisition] = useState('');
  const [total_price, setTotalPrice] = useState(0);

  const [date, setDate] = useState('');
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

  useEffect(() => {
    if (add_order_product) {
      async function loadProducts() {
        try {

          const response = await api.get('/stock/products');
          const { products } = response.data;

          setProducts(products);
        } catch (err) {
          console.log(err);
        }
      }

      loadProducts();
    }
  }, [add_order_product]);

  useEffect(() => {
    if (id_product) {
      async function loadProduct() {
        try {

          const res_prod = await api.get(`/stock/product/${id_product}`);
          const { product } = res_prod.data;

          const res_prod_acq = await api.get(`/stock/acquisition/product/${product.id}`);
          const { prod_acqs } = res_prod_acq.data;

          setUnitSale(product.price_sale);
          setProduct(product);
          setAcquisitionProducts(prod_acqs);
        } catch (err) {
          console.log(err);
        }
      }

      loadProduct();
    }
  }, [id_product]);

  useEffect(() => {
    if (id_acquisition_product) {
      async function getAcquisitionProduct() {
        try {

          const response = await api.get(`/stock/inf/product/${id_acquisition_product}`);
          const { prod_acq } = response.data;

          const date = moment(prod_acq.acquisition.acquisition).format('DD-MM-YYYY');

          setDate(date);
          setIdProdAcq(prod_acq.id);
          setUnityCost(prod_acq.unity_cost);
          setAcquisition(prod_acq.acquisition.acquisition);
          setIdProvider(prod_acq.acquisition.id_provider);
          setAcquisitionProduct(prod_acq);
        } catch (err) {
          console.log(err);
        }
      }

      getAcquisitionProduct();
    }
  }, [id_acquisition_product]);

  useEffect(() => {
    const total = Number(unit_sale) * Number(qtd) - Number(discount);

    setTotalPrice(total);
  }, [unit_sale, qtd, discount]);

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

  const handleSaveOrderProduct = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      await api.post(`/order/order-product/${order_service}`, {
        id_product,
        id_provider,
        qtd,
        acquisition,
        unit_sale,
        unit_cost: unity_cost,
        discount,
        id_prod_acq
      });

      Alert.alert('Sucesso!', 'Produto registrado com sucesso.');

    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;
      console.log(err)
      Alert.alert(
        'Ooopsss',
        message || 'Falha no registro do produto, confira seus dados.'
      );
    } finally {
      setLoading(false);
    }
  }, [
    id_product,
    qtd,
    acquisition,
    total_price,
    unit_sale,
    discount,
    id_acquisition_product
  ]);

  function ViewButton() {
    if (add_order_product) {
      return (
        <>
          <SubmitButton onPress={handleSaveOrderProduct}>
            {loading ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
                <SubmitButtonText>Salvar</SubmitButtonText>
              )}
          </SubmitButton>
          <CancelarButton onPress={() => setAddOrderProduct(false)}>
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
          <SubmitButton onPress={() => setAddOrderProduct(true)}>
            <SubmitButtonText>Adicionar Produto</SubmitButtonText>
          </SubmitButton>
        </>
      );
    }
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

  // FIXME Buscar apenas os produtos que a quantidade for maior que zero e previnir qtd maior que o qtd do estoque.
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
                Veja os detalhes do(s) serviço(s) e produto(s) desta OS. Os atualize como quiser.
              </Description>

              {add_order_product &&
                <>
                  <InputTitle>Serviço Referente</InputTitle>
                  <InputPicker>
                    <Picker
                      selectedValue={order_service}
                      style={{
                        flex: 1,
                        color: '#f8a920',
                        backgroundColor: 'transparent',
                        fontSize: 17
                      }}
                      onValueChange={(itemValue, itemIndex) => setOrderService(itemValue)}
                    >
                      <Picker.Item label="Selecione o Serviço" value="" />
                      {order_service_details && order_service_details.map(serv => <Picker.Item key={serv.id} label={`Serviço - ${serv.id}`} value={serv.id} />)}
                    </Picker>
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputPicker>

                  <InputTitle>Produto</InputTitle>
                  <InputPicker>
                    <Picker
                      selectedValue={id_product}
                      style={{
                        flex: 1,
                        color: '#f8a920',
                        backgroundColor: 'transparent',
                        fontSize: 17
                      }}
                      onValueChange={(itemValue, itemIndex) => setIdProduct(itemValue)}
                    >
                      <Picker.Item label="Selecione o Produto" value="" />
                      {products && products.map(product => <Picker.Item key={product.id} label={product.name} value={product.id} />)}
                    </Picker>
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputPicker>

                  {product &&
                    <>
                      <InputTitle>Aquisições</InputTitle>
                      <InputPicker>
                        <Picker
                          selectedValue={id_acquisition_product}
                          style={{
                            flex: 1,
                            color: '#f8a920',
                            backgroundColor: 'transparent',
                            fontSize: 17
                          }}
                          onValueChange={(itemValue, itemIndex) => setIdAcquisitionProduct(itemValue)}
                        >
                          <Picker.Item label="Selecione a Aquisição" value="" />
                          {acquisition_products && acquisition_products.map(product_acq => <Picker.Item key={product_acq.id} label={String(product_acq.qtd)} value={product_acq.id} />)}
                        </Picker>
                        <MaterialIcons name="lock" size={20} color="#999" />
                      </InputPicker>
                    </>
                  }

                  {acquisition_product &&
                    <>
                      <InputTitle>Data de Aquisição</InputTitle>
                      <InputContainer>
                        <Input
                          editable={false}
                          style={{ color: '#f8a920' }}
                          value={date}
                        />
                        <MaterialIcons name="lock" size={20} color="#999" />
                      </InputContainer>

                      <InputTitle>Preço Unitário</InputTitle>
                      <InputContainer>
                        <Input
                          editable={false}
                          style={{ color: '#f8a920' }}
                          value={String(unity_cost)}
                        />
                        <MaterialIcons name="lock" size={20} color="#999" />
                      </InputContainer>

                      <InputTitle>Preço de Venda - Atual: R$ {product.price_sale}</InputTitle>
                      <InputContainer>
                        <Input
                          placeholder={'Digite o Preço de Venda'}
                          autoCapitalize="none"
                          autoCorrect={false}
                          keyboardType="numeric"
                          onChangeText={setUnitSale}
                          value={unit_sale}
                          returnKeyType="next"
                          onSubmitEditing={() => discountInputRef.current.focus()}
                        />
                        <MaterialIcons name="person-pin" size={20} color="#999" />
                      </InputContainer>

                      <InputTitle>Desconto</InputTitle>
                      <InputContainer>
                        <Input
                          placeholder="Desconto no produto, se houver"
                          autoCapitalize="none"
                          autoCorrect={false}
                          keyboardType="numeric"
                          ref={discountInputRef}
                          onChangeText={setDiscount}
                          value={String(discount)}
                          returnKeyType="next"
                          onSubmitEditing={() => qtdInputRef.current.focus()}
                        />
                        <MaterialIcons name="person-pin" size={20} color="#999" />
                      </InputContainer>

                      <InputTitle>Quantidade</InputTitle>
                      <InputContainer>
                        <Input
                          placeholder="Digite a quantidade"
                          autoCapitalize="none"
                          autoCorrect={false}
                          keyboardType="numeric"
                          ref={qtdInputRef}
                          onChangeText={setQtd}
                          value={String(qtd)}
                          returnKeyType="next"
                          onSubmitEditing={() => Keyboard.dismiss()}
                        />
                        <MaterialIcons name="person-pin" size={20} color="#999" />
                      </InputContainer>

                      <InputTitle>Preço Total</InputTitle>
                      <InputContainer>
                        <Input
                          editable={false}
                          style={{ color: '#f8a920' }}
                          value={qtd && qtd > 0 ? String(total_price) : '0.0'}
                        />
                        <MaterialIcons name="lock" size={20} color="#999" />
                      </InputContainer>
                    </>
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
        <CustonModal order_service_detail={order_service_detail} setIsVisible={setIsVisible} reloadOrderServiceDetails={reloadOrderServiceDetails} />
      </Modal>
    </>
  );
}