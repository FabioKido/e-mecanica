import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import moment from 'moment';

import { MaterialIcons } from '@expo/vector-icons';

import {
  Container,
  Content,
  FormContainer,
  InputContainer,
  Title,
  Description,
  InputTitle,
  Input,
  SubmitButton,
  SubmitButtonText,
  DeleteButtonBox,
  DeleteButton,
  DeleteButtonText,
  CancelarButton,
  CancelarButtonText
} from './styles';

import api from '../../../../services/api';
import LoadGif from '../../../../assets/loading.gif';

export default function CustonModal({ order_product_detail, setIsVisible, reloadOrderProductDetails }) {

  const discountInputRef = useRef();
  const qtdInputRef = useRef();

  const [product, setProduct] = useState({});

  const [unit_sale, setUnitSale] = useState(order_product_detail.unit_sale);
  const [unit_cost, setUnitCost] = useState(order_product_detail.unit_cost);
  const [discount, setDiscount] = useState(order_product_detail.discount);
  const [qtd, setQtd] = useState(order_product_detail.qtd);
  const [acquisition, setAcquisition] = useState(order_product_detail.acquisition);
  const [total_price, setTotalPrice] = useState(order_product_detail.total_sale);

  const [date, setDate] = useState(() => moment(acquisition).format('DD-MM-YYYY'));

  const [loading, setLoading] = useState(false);
  const [first_loading, setFirstLoading] = useState(true);

  useEffect(() => {

    async function loadProduct() {
      try {
        const response = await api.get(`/stock/product/${order_product_detail.id_product}`);
        const { product } = response.data;

        setProduct(product);
      } catch (err) {
        console.log(err);
      } finally {
        setFirstLoading(false)
      }
    }

    setTimeout(loadProduct, 1000);

  }, []);

  useEffect(() => {

    const total = getTotalPrice();

    setTotalPrice(total);

  }, [unit_sale, qtd, discount]);

  function getTotalPrice() {
    return Number(unit_sale) * Number(qtd) - Number(discount);
  }

  const handleDeleteOrderProduct = async () => {
    try {
      await api.delete(`/order/order-product/${order_product_detail.id}`);

      Alert.alert('Excluído!', 'Produto deletado com sucesso.');

    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na exclusão do produto.'
      );
    } finally {
      reloadOrderProductDetails();
      setIsVisible(false);
    }
  }

  const handleUpdateAcquisition = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const total = getTotalPrice();

      await api.put(`/order/order-product/${order_product_detail.id}`, {
        total_sale: total,
        qtd,
        unit_sale,
        discount,
        qtd_ant: order_product_detail.qtd,
        total_ant: order_product_detail.total_sale,
        id_prod_acq: order_product_detail.id_prod_acq,
        id_os: order_product_detail.id_order_service
      });

      Alert.alert('Sucesso!', 'Produto atualizado com sucesso.');

    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização do produto, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadOrderProductDetails();
      setIsVisible(false);
    }
  }, [
    qtd,
    unit_sale,
    discount,
  ]);

  // TODO Diminuir qtd quando atualizar e aumentar qtd quando excluir um produto!
  if (first_loading) {
    return (
      <LinearGradient
        colors={['#2b475c', '#000']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Image source={LoadGif} resizeMode='contain' style={{ height: 75, width: 75 }} />
      </LinearGradient>
    );
  } else {
    return (
      <LinearGradient
        colors={['#2b475c', '#000']}
        style={{ flex: 1 }}
      >
        <Container>
          <Content keyboardShouldPersistTaps="handled">
            <FormContainer>
              <Title>Produto - {order_product_detail.id}</Title>
              <Description>
                Edite ou exclua esse produto como quiser. Sua quantidade irá diminuir ou aumentar, a partir, de sua atualização ou exclusão.
              </Description>

              <InputTitle>Nome</InputTitle>
              <InputContainer>
                <Input
                  editable={false}
                  style={{ color: '#f8a920' }}
                  value={product.name || 'Produto não especificado'}
                />
                <MaterialIcons name="info" size={20} color="#999" />
              </InputContainer>

              <InputTitle>Data de Aquisição</InputTitle>
              <InputContainer>
                <Input
                  editable={false}
                  style={{ color: '#f8a920' }}
                  value={date}
                />
                <MaterialIcons name="info" size={20} color="#999" />
              </InputContainer>

              <InputTitle>Preço Unitário</InputTitle>
              <InputContainer>
                <Input
                  editable={false}
                  style={{ color: '#f8a920' }}
                  value={String(unit_cost)}
                />
                <MaterialIcons name="info" size={20} color="#999" />
              </InputContainer>

              <InputTitle>Preço de Venda</InputTitle>
              <InputContainer>
                <Input
                  placeholder={'Preço de Venda'}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="numeric"
                  onChangeText={setUnitSale}
                  value={String(unit_sale)}
                  returnKeyType="next"
                  onSubmitEditing={() => discountInputRef.current.focus()}
                />
                <MaterialIcons name="edit" size={18} color="#999" />
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
                <MaterialIcons name="edit" size={18} color="#999" />
              </InputContainer>

              <InputTitle>Quantidade</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Quantidade total"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="numeric"
                  ref={qtdInputRef}
                  onChangeText={setQtd}
                  value={String(qtd)}
                  returnKeyType="next"
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <MaterialIcons name="edit" size={18} color="#999" />
              </InputContainer>

              <InputTitle>Preço Total</InputTitle>
              <InputContainer>
                <Input
                  editable={false}
                  style={{ color: '#f8a920' }}
                  value={qtd && qtd > 0 ? String(total_price) : '0.0'}
                />
                <MaterialIcons name="info" size={20} color="#999" />
              </InputContainer>

              <DeleteButtonBox>
                <DeleteButton onPress={handleDeleteOrderProduct}>
                  <DeleteButtonText>Excluir</DeleteButtonText>
                </DeleteButton>
                <SubmitButton style={{ width: 125 }} onPress={handleUpdateAcquisition}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#333" />
                  ) : (
                      <SubmitButtonText>Salvar</SubmitButtonText>
                    )}
                </SubmitButton>
              </DeleteButtonBox>
              <CancelarButton onPress={() => setIsVisible(false)}>
                <CancelarButtonText>Voltar</CancelarButtonText>
              </CancelarButton>

            </FormContainer>

          </Content>
        </Container>
      </LinearGradient>
    );
  }
}