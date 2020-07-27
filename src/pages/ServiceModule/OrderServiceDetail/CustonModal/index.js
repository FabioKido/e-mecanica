import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons } from '@expo/vector-icons';

import {
  Container,
  Content,
  FormContainer,
  SwitchContainer,
  InputContainer,
  Title,
  Description,
  InputTitle,
  Input,
  SubmitButton,
  SubmitButtonText,
  CancelarButton,
  CancelarButtonText,
  ChoiceButton,
  ChoiceText,
  SwitchText
} from './styles';

import api from '../../../../services/api';
import NavigationService from '../../../../services/navigation';

import CheckBox from '../../../../components/CheckBox';

import LoadGif from '../../../../assets/loading.gif';

export default function CustonModal({ order_service_detail, setIsVisible, reloadOrderServiceDetails }) {

  const priceInputRef = useRef();
  const commissionInputRef = useRef();
  const discountInputRef = useRef();
  const premiumInputRef = useRef();

  const [service, setService] = useState('');
  const [products_value, setProductsValue] = useState('');

  const [type, setType] = useState(order_service_detail.type);
  const [commission, setCommission] = useState(order_service_detail.commission);
  const [price, setPrice] = useState(order_service_detail.price);
  const [discount, setDiscount] = useState(order_service_detail.discount);
  const [premium, setPremium] = useState(order_service_detail.premium);
  const [approved, setApproved] = useState(order_service_detail.approved);

  const [loading, setLoading] = useState(false);
  const [first_loading, setFirstLoading] = useState(true);

  useEffect(() => {
    async function loadService() {
      try {
        if (order_service_detail.id_service) {
          const response = await api.get(`/service/one/${order_service_detail.id_service}`);
          const { service } = response.data;

          setService(service.name);
          loadOrderProducts(order_service_detail.id);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setFirstLoading(false);
      }
    }

    setTimeout(loadService, 1000);
  }, []);

  async function loadOrderProducts(id_serv) {
    const response = await api.get('/order/order-products', {
      params: { id_os: id_serv }
    });
    const { order_products } = response.data;

    // TODO Resolver depois o array vazio.
    if (!order_products) {
      return;
    } else {
      const soma = (acumulador, total) => Number(total) + Number(acumulador);

      const total = order_products
        .map(prod => prod.total_sale)
        .reduce(soma);

      setProductsValue(total);
    }
  }

  const handleNavigateToPaymentPage = () => {
    setIsVisible(false);

    // setTimeout(() => NavigationService.navigate('Payments', order_service_detail, products_value), 100);
  }

  const handleNavigateToDetailPage = () => {
    setIsVisible(false);

    setTimeout(() => NavigationService.navigate('OrderProductDetail', order_service_detail), 100);
  }

  const handleUpdateOrderServiceDetail = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      await api.put(`/order/order-service/${order_service_detail.id}`, {
        price,
        type,
        commission: commission || 0,
        discount: discount || 0,
        premium: premium || 0,
        approved,
        disc_ant: order_service_detail.discount
      });

      Alert.alert('Sucesso!', 'Serviço atualizado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização dServiço, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadOrderServiceDetails();
      setIsVisible(false);
    }
  }, [
    price,
    type,
    commission,
    discount,
    premium,
    approved
  ]);

  // TODO Talvez vai poder excluir no futuro também.
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
              <Title>Serviço - {order_service_detail.id}</Title>
              <Description>
                Edite esse serviço como quiser.
            </Description>

              <InputTitle>Serviço</InputTitle>
              <InputContainer>
                <Input
                  editable={false}
                  style={{ color: '#f8a920' }}
                  value={service || 'Não foi especificado'}
                />
                <MaterialIcons name="lock" size={20} color="#999" />
              </InputContainer>

              <InputTitle>Tipo</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Novo Tipo do Serviço"
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={60}
                  onChangeText={setType}
                  value={type}
                  returnKeyType="next"
                  onSubmitEditing={() => priceInputRef.current.focus()}
                />
                <MaterialIcons name="person-pin" size={20} color="#999" />
              </InputContainer>

              <InputTitle>Preço do Serviço</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Novo Preço do Serviço"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="numeric"
                  ref={priceInputRef}
                  onChangeText={setPrice}
                  value={String(price)}
                  returnKeyType="next"
                  onSubmitEditing={() => discountInputRef.current.focus()}
                />
                <MaterialIcons name="person-pin" size={20} color="#999" />
              </InputContainer>

              <InputTitle>Preço dos Produtos</InputTitle>
              <InputContainer>
                <Input
                  value={products_value ? String(products_value) : 'Não possui produtos'}
                  editable={false}
                  style={{ color: '#f8a920' }}
                />
                <MaterialIcons name="person-pin" size={20} color="#999" />
              </InputContainer>

              <InputTitle>Desconto do Serviço</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Desconto do Serviço, se houver"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="numeric"
                  ref={discountInputRef}
                  onChangeText={setDiscount}
                  value={String(discount)}
                  returnKeyType="next"
                  onSubmitEditing={() => commissionInputRef.current.focus()}
                />
                <MaterialIcons name="person-pin" size={20} color="#999" />
              </InputContainer>

              <InputTitle>Comissão do serviço</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Comissão do colaborador, se houver"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="numeric"
                  ref={commissionInputRef}
                  onChangeText={setCommission}
                  value={String(commission)}
                  returnKeyType="next"
                  onSubmitEditing={() => premiumInputRef.current.focus()}
                />
                <MaterialIcons name="person-pin" size={20} color="#999" />
              </InputContainer>

              <InputTitle>Prêmio do serviço</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Prêmio para o colaborador, se houver"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="numeric"
                  ref={premiumInputRef}
                  onChangeText={setPremium}
                  value={String(premium)}
                  returnKeyType="next"
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <MaterialIcons name="person-pin" size={20} color="#999" />
              </InputContainer>

              <SwitchContainer>
                <ChoiceText>Serviço Aprovado?</ChoiceText>

                <CheckBox
                  iconColor="#f8a920"
                  checkColor="#f8a920"
                  value={approved}
                  onChange={() => setApproved(!approved)}
                />
              </SwitchContainer>

              <ChoiceButton
                onPress={handleNavigateToDetailPage}
              >
                <SwitchText>Ir para Produtos</SwitchText>

                <MaterialIcons name="open-in-new" size={20} color="#fff" />
              </ChoiceButton>

              <ChoiceButton
                onPress={handleNavigateToPaymentPage}
              >
                <SwitchText>Ir para Pagamento</SwitchText>

                <MaterialIcons name="open-in-new" size={20} color="#fff" />
              </ChoiceButton>

              <SubmitButton onPress={handleUpdateOrderServiceDetail}>
                {loading ? (
                  <ActivityIndicator size="small" color="#333" />
                ) : (
                    <SubmitButtonText>Salvar</SubmitButtonText>
                  )}
              </SubmitButton>

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