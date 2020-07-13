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

import {
  Container,
  Content,
  FormContainer,
  InputPicker,
  InputContainer,
  Title,
  Description,
  InputTitle,
  Input,
  SwitchContainer,
  ChoiceText,
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

import api from '../../../services/api';
import CheckBox from "../../../components/CheckBox";

export default function Acquisitions() {

  const nefNumberInputRef = useRef();
  const totalQtdInputRef = useRef();
  const unityCostInputRef = useRef();
  const discountInputRef = useRef();

  const [acquisitions, setAcquisitions] = useState([]);
  const [acquisition, setAcquisition] = useState({});
  const [add_acquisition, setAddAcquisition] = useState(false);

  const [products, setProducts] = useState([]);
  const [id_product, setIdProduct] = useState({});

  const [providers, setProviders] = useState([]);
  const [id_provider, setIdProvider] = useState();

  const [total_value, setTotalValue] = useState(0);

  const [nef_key, setNefKey] = useState('');
  const [nef_number, setNefNumber] = useState('');
  const [total_qtd, setTotalQtd] = useState('');
  const [unity_cost, setUnityCost] = useState('');
  const [discount, setDiscount] = useState('');
  const [acquisition_date, setAcquisitionDate] = useState('');
  const [approved, setApproved] = useState(false);

  const [date, setDate] = useState();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadAcquisitions() {
      try {
        setLoading(true);

        const response = await api.get('/stock/acquisitions');
        const { acquisitions } = response.data;

        setAcquisitions(acquisitions);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadAcquisitions();
  }, []);

  useEffect(() => {
    if (add_acquisition) {
      async function loadProvidersAndProducts() {
        try {

          const res_prov = await api.get('/stock/providers');
          const { providers } = res_prov.data;

          const res_prod = await api.get('/stock/products');
          const { products } = res_prod.data;

          setProviders(providers);
          setProducts(products);
        } catch (err) {
          console.log(err);
        }
      }

      loadProvidersAndProducts();
    }
  }, [add_acquisition]);


  useEffect(() => {

    function getTotalValue() {
      const total = Number(unity_cost) * Number(total_qtd) - (Number(discount) || 0);

      setTotalValue(total);
    }

    getTotalValue();
  }, [unity_cost, total_qtd, discount]);

  const onDateChange = date => {
    setDate(date);

    const momentObj = moment(date, 'DD-MM-YYYY');

    setAcquisitionDate(momentObj);
  };

  async function reloadAcquisitions() {
    try {
      setRefreshing(true);

      const response = await api.get('/stock/acquisitions');
      const { acquisitions } = response.data;

      setAcquisitions(acquisitions);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de aquisições, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  function getAcquisition(acquisition) {
    setAcquisition(acquisition);

    setIsVisible(true);
  }

  const handleSaveAcquisition = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        unity_cost: Yup.number().required('Preço unitário é obrigatório'),
        total_qtd: Yup.number().required('Quantidade total é obrigatória')
      });

      await schema.validate({ unity_cost, total_qtd }, {
        abortEarly: false,
      });

      await api.post('/stock/acquisition', {
        id_provider,
        nef_key,
        nef_number,
        total_sale: total_value,
        total_qtd,
        unity_cost,
        discount,
        approved,
        acquisition: acquisition_date,
        id_product
      });

      Alert.alert('Sucesso!', 'Nova Aquisição registrada com sucesso.');

    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha no registro de nova aquisição, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadAcquisitions();
    }
  }, [
    id_provider,
    nef_key,
    nef_number,
    total_qtd,
    unity_cost,
    discount,
    approved,
    acquisition_date,
    id_product
  ]);

  function ViewButton() {
    if (add_acquisition) {
      return (
        <>
          <SubmitButton onPress={handleSaveAcquisition}>
            {loading ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
                <SubmitButtonText>Salvar</SubmitButtonText>
              )}
          </SubmitButton>
          <CancelarButton onPress={() => setAddAcquisition(false)}>
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
                data={acquisitions}
                renderItem={renderAcquisitions}
                keyExtractor={acquisitions => `acquisition-${acquisitions.id}`}
                showsVerticalScrollIndicator={false}
                onRefresh={reloadAcquisitions}
                refreshing={refreshing}
                ListFooterComponent={<View style={{ height: 20 }} />}
                ListEmptyComponent={<Empty>Nenhuma aquisição encontrada.</Empty>}
              />
            )}
          <SubmitButton onPress={() => setAddAcquisition(true)}>
            <SubmitButtonText>Nova Aquisição</SubmitButtonText>
          </SubmitButton>
        </>
      );
    }
  }

  function renderAcquisitions({ item: acquisition }) {
    const date = moment(acquisition.acquisition).format('DD-MM-YYYY');

    return (
      <Card
        onPress={() => getAcquisition(acquisition)}
      >
        <CardInfo>
          <CardTitle numberOfLines={2}>{acquisition.total_sale} R$</CardTitle>
          <CardContainer>
            <CardName>
              Quantidade{' '}
              <CardSubName>({acquisition.total_qtd})</CardSubName>
            </CardName>

            <CardStatus>{date}</CardStatus>

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
              <Title>Aquisições</Title>
              <Description>
                Veja todas as suas aquisições. Crie ou exclua uma aquisição como quiser.
              </Description>

              {add_acquisition &&
                <>
                  <InputTitle>Valor Total</InputTitle>
                  <InputContainer>
                    <Input
                      editable={false}
                      style={{ color: '#f8a920' }}
                      value={String(total_value)}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>

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
                      <Picker.Item label="Selecione o Produto Adquirido" value="" />
                      {products && products.map(product => <Picker.Item key={product.id} label={product.name} value={product.id} />)}
                    </Picker>
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputPicker>

                  <InputTitle>Fornecedor</InputTitle>
                  <InputPicker>
                    <Picker
                      selectedValue={id_provider}
                      style={{
                        flex: 1,
                        color: '#f8a920',
                        backgroundColor: 'transparent',
                        fontSize: 17
                      }}
                      onValueChange={(itemValue, itemIndex) => setIdProvider(itemValue)}
                    >
                      <Picker.Item label="Selecione o Fronecedor do Produto" value="" />
                      {providers && providers.map(provider => <Picker.Item key={provider.id} label={provider.name} value={provider.id} />)}
                    </Picker>
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputPicker>

                  <InputTitle>Data da Aquisição</InputTitle>
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

                  <InputTitle>Chave da NFe</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Chave da Nota Fiscal"
                      autoCapitalize="words"
                      autoCorrect={false}
                      keyboardType='numeric'
                      maxLength={44}
                      onChangeText={setNefKey}
                      value={nef_key}
                      returnKeyType="next"
                      onSubmitEditing={() => nefNumberInputRef.current.focus()}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Número da NFe</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Número da Nota Fiscal"
                      autoCapitalize="words"
                      autoCorrect={false}
                      keyboardType='numeric'
                      maxLength={9}
                      ref={nefNumberInputRef}
                      onChangeText={setNefNumber}
                      value={nef_number}
                      returnKeyType="next"
                      onSubmitEditing={() => totalQtdInputRef.current.focus()}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Quantidade Total</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Quantidade total adquirida"
                      autoCapitalize="words"
                      autoCorrect={false}
                      keyboardType='numeric'
                      onChangeText={setTotalQtd}
                      ref={totalQtdInputRef}
                      value={total_qtd}
                      returnKeyType="next"
                      onSubmitEditing={() => unityCostInputRef.current.focus()}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Preço Unitário</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite o Preço Unitário"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType='numeric'
                      ref={unityCostInputRef}
                      onChangeText={setUnityCost}
                      value={unity_cost}
                      returnKeyType="next"
                      onSubmitEditing={() => discountInputRef.current.focus()}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Desconto da Aquisição</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite o desconto, se houver"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType='numeric'
                      ref={discountInputRef}
                      onChangeText={setDiscount}
                      value={discount}
                      returnKeyType="next"
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>

                  <SwitchContainer>
                    <ChoiceText>Aquisição Aprovada?</ChoiceText>
                    <CheckBox
                      iconColor="#f8a920"
                      checkColor="#f8a920"
                      value={approved}
                      onChange={() => setApproved(!approved)}
                    />
                  </SwitchContainer>
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
        <CustonModal acquisition={acquisition} setIsVisible={setIsVisible} reloadAcquisitions={reloadAcquisitions} />
      </Modal>
    </>
  );
}

Acquisitions.navigationOptions = {
  tabBarLabel: 'Aquisições',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="user-cog" size={18} color={tintColor} />
  ),
};