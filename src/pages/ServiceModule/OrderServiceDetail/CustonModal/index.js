import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard
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
  ChoiceText
} from './styles';

import api from '../../../../services/api';

import CheckBox from '../../../../components/CheckBox';

export default function CustonModal({ order_service_detail, setIsVisible, reloadOrderServiceDetails }) {

  const priceInputRef = useRef();
  const commissionInputRef = useRef();
  const discountInputRef = useRef();
  const premiumInputRef = useRef();

  const [service, setService] = useState('');

  const [type, setType] = useState(order_service_detail.type);
  const [commission, setCommission] = useState(order_service_detail.commission);
  const [price, setPrice] = useState(order_service_detail.price);
  const [discount, setDiscount] = useState(order_service_detail.discount);
  const [premium, setPremium] = useState(order_service_detail.premium);
  const [approved, setApproved] = useState(order_service_detail.approved);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadService() {
      try {
        if (order_service_detail.id_service) {
          const response = await api.get(`/service/one/${order_service_detail.id_service}`);
          const { service } = response.data;

          setService(service.name);
        }
      } catch (err) {
        console.log(err);
      }
    }

    setTimeout(loadService, 1000);
  }, []);

  const handleUpdateOrderServiceDetail = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      await api.put(`/order/order-service/${order_service_detail.id}`, {
        price,
        type,
        commission,
        discount,
        premium,
        approved
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

            <InputTitle>Preço do Serviço - R$ {Number(price) - Number(discount)}</InputTitle>
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