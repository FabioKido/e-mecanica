import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Picker,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInputMask } from 'react-native-masked-text';

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
  DeleteButtonBox,
  DeleteButton,
  DeleteButtonText
} from './styles';

import api from '../../../../services/api';
import CheckBox from "../../../../components/CheckBox";
import LoadGif from '../../../../assets/loading.gif';

export default function CustonModal({ product, setIsVisible, reloadProducts }) {

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

  const [families, setFamilies] = useState([]);
  const [id_family, setIdFamily] = useState(product.id_family);

  const [nef_cod, setNefCod] = useState(product.nef_cod);
  const [name, setName] = useState(product.name);
  const [location, setLocation] = useState(product.location);
  const [ncm, setNcm] = useState(product.ncm);
  const [unidade, setUnidade] = useState(product.unidade);
  const [unity_cost, setUnityCost] = useState(product.unity_cost);
  const [min_qtd, setMinQtd] = useState(product.min_qtd);
  const [price_sale, setPriceSale] = useState(product.price_sale);
  const [premium, setPremium] = useState(product.premium);
  const [commission, setCommission] = useState(product.commission);
  const [profit, setProfit] = useState(product.profit);
  const [km_limit, setKmLimit] = useState(product.km_limit);
  const [applications, setApplications] = useState(product.applications);
  const [observations, setObservations] = useState(product.observations);
  const [repos, setRepos] = useState(product.repos);
  const [origin_product, setOriginProduct] = useState(product.origin_product);
  const [validity, setValidity] = useState(product.validity);

  const [date, setDate] = useState(() => moment(product.validity).format('DD-MM-YYYY'));
  const [loading, setLoading] = useState(false);
  const [first_loading, setFirstLoading] = useState(true);

  useEffect(() => {

    async function loadFamilies() {

      try {

        const response = await api.get('/stock/families');
        const { families } = response.data;

        setFamilies(families);
      } catch (err) {
        console.log(err);
      } finally {
        setFirstLoading(false);
      }

    }

    setTimeout(loadFamilies, 1000);
  }, []);

  const onDateChange = date => {
    setDate(date);

    const momentObj = moment(date, 'DD-MM-YYYY');

    setValidity(momentObj);
  };

  const handleDeleteProduct = async () => {
    try {
      await api.delete(`/stock/product/${product.id}`);

      Alert.alert('Excluído!', 'Produto deletado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na exclusão do produto.'
      );
    } finally {
      setIsVisible(false);
      reloadProducts();
    }
  }

  const handleUpdateProduct = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      await api.put(`/stock/product/${product.id}`, {
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
              <Title>{product.name}</Title>
              <Description>
                Edite ou exclua esse produto com quiser.
              </Description>

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
                <MaterialIcons name="lock" size={20} color="#999" />
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
                  <Picker.Item label="Selecione a Origem do Produto" value={origin_product} />
                  <Picker.Item label="Origem Nacional" value="Origem Nacional" />
                  <Picker.Item label="Origem Estrangeira" value="Origem Estrangeira" />
                </Picker>
                <MaterialIcons name="lock" size={20} color="#999" />
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
                <MaterialIcons name="lock" size={20} color="#999" />
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
                <MaterialIcons name="lock" size={20} color="#999" />
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
                <MaterialIcons name="lock" size={20} color="#999" />
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
                <MaterialIcons name="lock" size={20} color="#999" />
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
                  onSubmitEditing={() => minQtdInputRef.current.focus()}
                />
                <MaterialIcons name="lock" size={20} color="#999" />
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
                  value={String(min_qtd)}
                  returnKeyType="next"
                  onSubmitEditing={() => priceSaleInputRef.current.focus()}
                />
                <MaterialIcons name="lock" size={20} color="#999" />
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
                <MaterialIcons name="lock" size={20} color="#999" />
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
                <MaterialIcons name="lock" size={20} color="#999" />
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
                <MaterialIcons name="lock" size={20} color="#999" />
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
                <MaterialIcons name="lock" size={20} color="#999" />
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
                  value={String(km_limit)}
                  returnKeyType="next"
                  onSubmitEditing={() => applicationsInputRef.current.focus()}
                />
                <MaterialIcons name="lock" size={20} color="#999" />
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
                <MaterialIcons name="lock" size={20} color="#999" />
              </InputContainer>

              <InputTitle>Observações</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Algo do produto a ser observado"
                  autoCapitalize="none"
                  autoCorrect={false}
                  ref={observationsInputRef}
                  onChangeText={setObservations}
                  value={observations}
                  returnKeyType="send"
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <MaterialIcons name="lock" size={20} color="#999" />
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

              <DeleteButtonBox>
                <DeleteButton onPress={handleDeleteProduct}>
                  <DeleteButtonText>Excluir</DeleteButtonText>
                </DeleteButton>
                <SubmitButton style={{ width: 125 }} onPress={handleUpdateProduct}>
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