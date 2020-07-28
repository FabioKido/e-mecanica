import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Picker,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import moment from 'moment';
import DatePicker from 'react-native-datepicker';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import {
  Container,
  Content,
  FormContainer,
  InputContainer,
  Title,
  Description,
  TitleSection,
  InputTitle,
  Input,
  SwitchContainer,
  ChoiceButton,
  ChoiceText,
  SubmitButton,
  SubmitButtonText,
  DeleteButtonBox,
  DeleteButton,
  DeleteButtonText,
  CancelarButton,
  CancelarButtonText
} from './styles';

import api from '../../../../services/api';
import CheckBox from "../../../../components/CheckBox";
import LoadGif from '../../../../assets/loading.gif';

export default function CustonModal({ acquisition, setIsVisible, reloadAcquisitions }) {

  const nefNumberInputRef = useRef();
  const totalQtdInputRef = useRef();
  const discountInputRef = useRef();

  const [providers, setProviders] = useState([]);
  const [id_provider, setIdProvider] = useState(acquisition.id_provider);

  const [total_value, setTotalValue] = useState(acquisition.total_sale);
  const [prod_acq, setProdAcq] = useState({});
  const [product, setProduct] = useState({});

  const [nef_key, setNefKey] = useState(acquisition.nef_key);
  const [nef_number, setNefNumber] = useState(acquisition.nef_number);
  const [total_qtd, setTotalQtd] = useState(acquisition.total_qtd);
  const [acquisition_date, setAcquisitionDate] = useState(acquisition.acquisition);
  const [approved, setApproved] = useState(acquisition.approved);

  const [unity_cost, setUnityCost] = useState('');
  const [discount, setDiscount] = useState('');
  const [qtd, setQtd] = useState('');

  const [date, setDate] = useState(() => moment(acquisition_date).format('DD-MM-YYYY'));
  const [more_info, setMoreInfo] = useState(false);
  const [value_click, setValueClick] = useState(true);
  const [first_loading, setFirstLoading] = useState(true);

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    async function loadInfos() {
      try {
        const res_prov = await api.get('/stock/providers');
        const { providers } = res_prov.data;

        const res_pacq = await api.get(`/stock/product/acquisition/${acquisition.id}`);
        const { prod_acq } = res_pacq.data;

        setProviders(providers);
        setProdAcq(prod_acq);
        setUnityCost(prod_acq.unity_cost);
        setDiscount(prod_acq.discount);
        setQtd(prod_acq.qtd);
      } catch (err) {
        console.log(err);
      } finally {
        setFirstLoading(false)
      }
    }

    setTimeout(loadInfos, 1000);

  }, []);

  useEffect(() => {

    const total = getTotalValue();

    setTotalValue(total);

  }, [unity_cost, total_qtd, discount]);

  function getTotalValue() {
    return Number(unity_cost) * Number(total_qtd) - (Number(discount) || 0);
  }

  async function getInfos() {
    if (value_click) {
      try {
        setLoading(true);

        const response = await api.get(`/stock/product/${prod_acq.id_product}`);
        const { product } = response.data;

        setProduct(product);
      } catch (err) {
        console.log(err);
      } finally {
        setValueClick(false);
        setLoading(false);
      }
    }
  }

  const onDateChange = date => {
    setDate(date);

    const momentObj = moment(date, 'DD-MM-YYYY');

    setAcquisitionDate(momentObj);
  };

  const handleDeleteAcquisition = async () => {
    try {
      await api.delete(`/stock/acquisition/${acquisition.id}`);

      Alert.alert('Excluído!', 'Aquisição deletada com sucesso.');

    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na exclusão da aquisição.'
      );
    } finally {
      reloadAcquisitions();
      setIsVisible(false);
    }
  }

  const handleUpdateAcquisition = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const total = getTotalValue();

      await api.put(`/stock/acquisition/${acquisition.id}`, {
        id_provider,
        nef_key,
        nef_number,
        total_sale: total,
        total_qtd,
        unity_cost,
        discount,
        approved,
        acquisition: acquisition_date,
        id_prod_acq: prod_acq.id
      });

      Alert.alert('Sucesso!', 'Aquisição atualizada com sucesso.');

    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização da aquisição, confira seus dados.'
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
    acquisition_date
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
              <Title>R$ {String(acquisition.total_sale)}</Title>
              <Description>
                Edite ou exclua essa aquisição como quiser. Sua quantidade irá diminuir a partir do uso ou venda.
              </Description>

              <SwitchContainer>
                <ChoiceText>Aquisição Aprovada?</ChoiceText>
                <CheckBox
                  iconColor="#f8a920"
                  checkColor="#f8a920"
                  value={approved}
                  onChange={() => setApproved(!approved)}
                />
              </SwitchContainer>

              <InputTitle>Fornecedor</InputTitle>
              <InputContainer>
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
                  <Picker.Item label="Selecione o Fornecedor do Produto" value="" />
                  {providers && providers.map(provider => <Picker.Item key={provider.id} label={provider.name} value={provider.id} />)}
                </Picker>
                <MaterialIcons name="unfold-more" size={20} color="#999" />
              </InputContainer>

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
                <MaterialIcons name="edit" size={18} color="#999" />
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
                <MaterialIcons name="edit" size={18} color="#999" />
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
                  value={String(total_qtd)}
                  returnKeyType="next"
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <MaterialIcons name="edit" size={18} color="#999" />
              </InputContainer>

              <InputTitle>Quantidade Atual</InputTitle>
              <InputContainer>
                <Input
                  editable={false}
                  style={{ color: '#f8a920' }}
                  value={String(qtd)}
                />
                <MaterialIcons name="info" size={18} color="#999" />
              </InputContainer>

              <InputTitle>Preço Unitário</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Novo Preço Unitário"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType='numeric'
                  onChangeText={setUnityCost}
                  value={String(unity_cost)}
                  returnKeyType="next"
                  onSubmitEditing={() => discountInputRef.current.focus()}
                />
                <MaterialIcons name="edit" size={18} color="#999" />
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
                  value={String(discount)}
                  returnKeyType="next"
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <MaterialIcons name="edit" size={18} color="#999" />
              </InputContainer>

              <ChoiceButton
                onPress={() => {
                  setMoreInfo(ant => !ant)
                  getInfos()
                }}
              >
                <ChoiceText>Informações Extras?</ChoiceText>

                <MaterialIcons name="youtube-searched-for" size={20} color="#f8a920" />
              </ChoiceButton>

              {more_info && (
                <>
                  <TitleSection>Produto Adquirido</TitleSection>

                  <InputTitle>Nome</InputTitle>
                  <InputContainer>
                    <Input
                      editable={false}
                      style={{ color: '#f8a920' }}
                      value={product.name || 'Produto não especificado'}
                    />
                    <MaterialIcons name="info" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Unidade</InputTitle>
                  <InputContainer>
                    <Input
                      editable={false}
                      style={{ color: '#f8a920' }}
                      value={product.unidade || 'Produto não especificado'}
                    />
                    <MaterialIcons name="info" size={20} color="#999" />
                  </InputContainer>

                  <TitleSection>Valor Atualizado</TitleSection>

                  <InputTitle>Novo Total</InputTitle>
                  <InputContainer>
                    <Input
                      editable={false}
                      style={{ color: '#f8a920' }}
                      value={String(total_value)}
                    />
                    <MaterialIcons name="info" size={20} color="#999" />
                  </InputContainer>

                </>
              )}

              <DeleteButtonBox>
                <DeleteButton onPress={handleDeleteAcquisition}>
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