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
import { TextInputMask } from 'react-native-masked-text';

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

export default function Products() {

  const nefCodInputRef = useRef();
  const nameInputRef = useRef();
  const locationInputRef = useRef();
  const ncmInputRef = useRef();
  const unidadeInputRef = useRef();
  const unityCostInputRef = useRef();
  const minQtdInputRef = useRef();
  const priceSaleInputRef = useRef();
  const CommissionInputRef = useRef();
  const premiumInputRef = useRef();
  const profitInputRef = useRef();
  const kmLimitInputRef = useRef();
  const applicationsInputRef = useRef();
  const observationsInputRef = useRef();

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [add_product, setAddProduct] = useState(false);

  const [families, setFamilies] = useState([]);
  const [id_family, setIdFamily] = useState();

  const [nef_cod, setNefCod] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [ncm, setNcm] = useState('');
  const [unidade, setUnidade] = useState('Lote');
  const [unity_cost, setUnityCost] = useState('');
  const [min_qtd, setMinQtd] = useState('1');
  const [price_sale, setPriceSale] = useState('');
  const [premium, setPremium] = useState('');
  const [commission, setCommission] = useState('');
  const [profit, setProfit] = useState('');
  const [km_limit, setKmLimit] = useState('');
  const [applications, setApplications] = useState('');
  const [observations, setObservations] = useState('');
  const [repos, setRepos] = useState(false);
  const [validity, setValidity] = useState('');
  const [origin_product, setOriginProduct] = useState('');

  const [date, setDate] = useState();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);

        const response = await api.get('/stock/products');
        const { products } = response.data;

        setProducts(products);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    if (add_product) {
      async function loadFamilies() {
        try {

          const response = await api.get('/stock/families');
          const { families } = response.data;

          setFamilies(families);
        } catch (err) {
          console.log(err);
        }
      }

      loadFamilies();
    }
  }, [add_product]);

  const onDateChange = date => {
    setDate(date);

    const momentObj = moment(date, 'DD-MM-YYYY');

    setValidity(momentObj);
  };

  async function reloadProducts() {
    try {
      setRefreshing(true);

      const response = await api.get('/stock/products');
      const { products } = response.data;

      setProducts(products);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de produtos, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  function getProduct(product) {
    setProduct(product);

    setIsVisible(true);
  }

  const handleSaveProduct = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório'),
        unity_cost: Yup.number().required('Preço unitário é obrigatório'),
        price_sale: Yup.number().required('Preço de venda é obrigatório'),
        km_limit: Yup.number().required('Kilometragem límite é obrigatória')
      });

      await schema.validate({ name, unity_cost, price_sale, km_limit }, {
        abortEarly: false,
      });

      await api.post('/stock/product', {
        id_family,
        nef_cod,
        name,
        location,
        ncm,
        unidade,
        unity_cost,
        min_qtd,
        price_sale,
        premium,
        commission,
        profit,
        km_limit,
        applications,
        observations,
        repos,
        validity,
        origin_product,
        image: 'Ok'
      });

      Alert.alert('Sucesso!', 'Novo Produto registrado com sucesso.');

    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha no registro de novo produto, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadProducts();
    }
  }, [
    id_family,
    nef_cod,
    name,
    location,
    ncm,
    unidade,
    unity_cost,
    min_qtd,
    price_sale,
    premium,
    commission,
    profit,
    km_limit,
    applications,
    observations,
    repos,
    validity,
    origin_product
  ]);

  function ViewButton() {
    if (add_product) {
      return (
        <>
          <SubmitButton onPress={handleSaveProduct}>
            {loading ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
                <SubmitButtonText>Salvar</SubmitButtonText>
              )}
          </SubmitButton>
          <CancelarButton onPress={() => setAddProduct(false)}>
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
                data={products}
                renderItem={renderProducts}
                keyExtractor={products => `product-${products.id}`}
                showsVerticalScrollIndicator={false}
                onRefresh={reloadProducts}
                refreshing={refreshing}
                ListFooterComponent={<View style={{ height: 20 }} />}
                ListEmptyComponent={<Empty>Nenhum produto encontrado.</Empty>}
              />
            )}
          <SubmitButton onPress={() => setAddProduct(true)}>
            <SubmitButtonText>Novo Produto</SubmitButtonText>
          </SubmitButton>
        </>
      );
    }
  }

  function renderProducts({ item: product }) {
    const date_Val = moment(product.validity).format('DD-MM-YYYY');

    return (
      <Card
        onPress={() => getProduct(product)}
      >
        <CardInfo>
          <CardTitle numberOfLines={2}>{product.name}</CardTitle>
          <CardContainer>
            <CardName>
              Quantidade Mínima{' '}
              <CardSubName>({product.min_qtd})</CardSubName>
            </CardName>

            <CardStatus>{date_Val}</CardStatus>

          </CardContainer>
        </CardInfo>
      </Card>
    );
  }

  // TODO melhorar as propriedades NCM, Unidade e Origem do Produto(Usar o Picker talvez).
  // FIXME Resolver a inserção e atualização de imagens.

  return (
    <>
      <LinearGradient
        colors={['#2b475c', '#000']}
        style={{ flex: 1 }}
      >
        <Container>
          <Content keyboardShouldPersistTaps="handled">
            <FormContainer>
              <Title>Produtos</Title>
              <Description>
                Veja todos os seus produtos. Crie ou exclua um produto como quiser.
              </Description>

              {add_product &&
                <>
                  <InputTitle>Família</InputTitle>
                  <InputPicker>
                    <Picker
                      selectedValue={id_family}
                      style={{
                        flex: 1,
                        color: '#f8a920',
                        backgroundColor: 'transparent',
                        fontSize: 17
                      }}
                      onValueChange={(itemValue, itemIndex) => setIdFamily(itemValue)}
                    >
                      <Picker.Item label="Selecione a Família do Produto" value="" />
                      {families && families.map(family => <Picker.Item key={family.id} label={family.name} value={family.id} />)}
                    </Picker>
                    <MaterialIcons name="unfold-more" size={20} color="#999" />
                  </InputPicker>

                  <InputTitle>Origem do Produto</InputTitle>
                  <InputPicker>
                    <Picker
                      selectedValue={origin_product}
                      style={{
                        flex: 1,
                        color: '#f8a920',
                        backgroundColor: 'transparent',
                        fontSize: 17
                      }}
                      onValueChange={(itemValue, itemIndex) => setOriginProduct(itemValue)}
                    >
                      <Picker.Item label="Selecione a Origem do Produto" value="Origem Nacional" />
                      <Picker.Item label="Origem Nacional" value="Origem Nacional" />
                      <Picker.Item label="Origem Estrangeira" value="Origem Estrangeira" />
                    </Picker>
                    <MaterialIcons name="unfold-more" size={20} color="#999" />
                  </InputPicker>

                  <InputTitle>Código da NFe</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Código da Nota Fiscal"
                      autoCapitalize="words"
                      autoCorrect={false}
                      maxLength={60}
                      ref={nefCodInputRef}
                      onChangeText={setNefCod}
                      value={nef_cod}
                      returnKeyType="next"
                      onSubmitEditing={() => nameInputRef.current.focus()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <InputTitle>Nome</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Nome do produto"
                      autoCapitalize="words"
                      autoCorrect={false}
                      ref={nameInputRef}
                      onChangeText={setName}
                      value={name}
                      returnKeyType="next"
                      onSubmitEditing={() => locationInputRef.current.focus()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <InputTitle>Validade do Produto</InputTitle>
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

                  <InputTitle>Localização</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Onde fica sua localização"
                      autoCapitalize="words"
                      autoCorrect={false}
                      ref={locationInputRef}
                      onChangeText={setLocation}
                      value={location}
                      returnKeyType="next"
                      onSubmitEditing={() => ncmInputRef.current.focus()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <InputTitle>Código NCM</InputTitle>
                  <InputContainer>
                    <TextInputMask
                      placeholder="Nomeclatura Comum do Mercosul"
                      autoCapitalize="none"
                      autoCorrect={false}
                      maxLength={10}
                      keyboardType='numeric'
                      type={'custom'}
                      options={{
                        mask: '9999.99.99'
                      }}
                      ref={ncmInputRef}
                      onChangeText={text => setNcm(text)}
                      value={ncm}
                      style={{
                        height: 48,
                        fontSize: 17,
                        color: '#FFF',
                        flex: 1
                      }}
                      placeholderTextColor='#5f6368'
                      returnKeyType="next"
                      onSubmitEditing={() => unidadeInputRef.current.focus()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <InputTitle>Unidade</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Qual a Unidade, ex: Lote/Caixa/Peça"
                      autoCapitalize="words"
                      autoCorrect={false}
                      onChangeText={setUnidade}
                      ref={unidadeInputRef}
                      value={unidade}
                      returnKeyType="next"
                      onSubmitEditing={() => unityCostInputRef.current.focus()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
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
                      onSubmitEditing={() => minQtdInputRef.current.focus()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <InputTitle>Quantidade Mínima</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite a quantidade mínima"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType='numeric'
                      ref={minQtdInputRef}
                      onChangeText={setMinQtd}
                      value={min_qtd}
                      returnKeyType="next"
                      onSubmitEditing={() => priceSaleInputRef.current.focus()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <InputTitle>Preço de Venda</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite o preço de sua venda"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType='numeric'
                      ref={priceSaleInputRef}
                      onChangeText={setPriceSale}
                      value={price_sale}
                      returnKeyType="next"
                      onSubmitEditing={() => premiumInputRef.current.focus()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <InputTitle>Prêmio</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="O prêmio para quem vendê-lo é?"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType='numeric'
                      onChangeText={setPremium}
                      ref={premiumInputRef}
                      value={premium}
                      onSubmitEditing={() => CommissionInputRef.current.focus()}
                      returnKeyType="next"
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <InputTitle>Comissão</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="A comissão para quem vendê-lo é?"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType='numeric'
                      ref={CommissionInputRef}
                      maxLength={60}
                      onChangeText={setCommission}
                      value={commission}
                      returnKeyType="next"
                      onSubmitEditing={() => profitInputRef.current.focus()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <InputTitle>Lucro Desejado</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite o valor da porcentagem"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType='numeric'
                      onChangeText={setProfit}
                      ref={profitInputRef}
                      value={profit}
                      returnKeyType="next"
                      onSubmitEditing={() => kmLimitInputRef.current.focus()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <InputTitle>Limite de KM</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Kilometragem limite do produto?"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="numeric"
                      ref={kmLimitInputRef}
                      onChangeText={setKmLimit}
                      value={km_limit}
                      returnKeyType="next"
                      onSubmitEditing={() => applicationsInputRef.current.focus()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <InputTitle>Aplicações</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Insira as aplicações do produto"
                      autoCapitalize="words"
                      autoCorrect={false}
                      onChangeText={setApplications}
                      ref={applicationsInputRef}
                      value={applications}
                      returnKeyType="next"
                      onSubmitEditing={() => observationsInputRef.current.focus()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <InputTitle>Observações</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Algo a ser observado sobre o produto"
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

                  <SwitchContainer>
                    <ChoiceText>Produto para Reposição?</ChoiceText>
                    <CheckBox
                      iconColor="#f8a920"
                      checkColor="#f8a920"
                      value={repos}
                      onChange={() => setRepos(!repos)}
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
        <CustonModal product={product} setIsVisible={setIsVisible} reloadProducts={reloadProducts} />
      </Modal>
    </>
  );
}

Products.navigationOptions = {
  tabBarLabel: 'Produtos',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="box-open" size={18} color={tintColor} />
  ),
};