import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Picker,
  Image,
  TouchableWithoutFeedback
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInputMask } from 'react-native-masked-text';

import { useDispatch } from 'react-redux';

import moment from 'moment';
import DatePicker from 'react-native-datepicker';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import {
  Container,
  Content,
  FormContainer,
  StatusContainer,
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
import { getCustomerInfo } from '../../../../services/infos';
import CheckBox from "../../../../components/CheckBox";
import LoadGif from '../../../../assets/loading.gif';

import { loadDashboardRequest } from '../../../../store/modules/customer/actions';

export default function CustonModal({ customer, setIsVisible, reloadCustomers }) {

  const dispatch = useDispatch();

  const cpfInputRef = useRef();
  const rgInputRef = useRef();
  const observationsInputRef = useRef();
  const cnpjInputRef = useRef();
  const ieInputRef = useRef();

  const phoneInputRef = useRef();
  const eMailInputRef = useRef();

  const streetInputRef = useRef();
  const numberInputRef = useRef();
  const neighborhoodInputRef = useRef();
  const complementInputRef = useRef();
  const cityInputRef = useRef();
  const ufInputRef = useRef();

  const [name, setName] = useState(customer.name);
  const [sex, setSex] = useState(customer.sex);
  const [cpf, setCPF] = useState(customer.cpf);
  const [rg, setRG] = useState(customer.rg);
  const [observations, setObservations] = useState(customer.observations);
  const [birthday, setBirthday] = useState(customer.birthday);
  const [inadimplente, setInadimplente] = useState(customer.inadimplente);
  const [status, setStatus] = useState(customer.status);

  const [cnpj, setCNPJ] = useState(customer.cnpj);
  const [ie, setIE] = useState(customer.ie);

  const [celphone, setCelphone] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [street, setStreet] = useState('');
  const [number, setNumber] = useState(null);
  const [neighborhood, setNeighborhood] = useState('');
  const [complement, setComplement] = useState('');
  const [city, setCity] = useState('');
  const [uf, setUf] = useState('');

  const [date, setDate] = useState(() => birthday ? moment(birthday).format('DD-MM-YYYY') : '');
  const [choice_cnpj, setChoiceCNPJ] = useState(false);
  const [more_info, setMoreInfo] = useState(false);
  const [value_click, setValueClick] = useState(true);

  const [loading, setLoading] = useState(false);
  const [first_loading, setFirstLoading] = useState(true);

  const states = [
    { uf: 'AC', name: 'Acre - AC' },
    { uf: 'AL', name: 'Alagoas - AL' },
    { uf: 'AP', name: 'Amapá - AP' },
    { uf: 'AM', name: 'Amazonas - AM' },
    { uf: 'BA', name: 'Bahia - BA' },
    { uf: 'CE', name: 'Ceará - CE' },
    { uf: 'DF', name: 'Distrito Federal - DF' },
    { uf: 'ES', name: 'Espírito Santo - ES' },
    { uf: 'GO', name: 'Goiás - GO' },
    { uf: 'MA', name: 'Maranhão - MA' },
    { uf: 'MT', name: 'Mato Grosso - MT' },
    { uf: 'MS', name: 'Mato Grosso do Sul - MS' },
    { uf: 'MG', name: 'Minas Gerais - MG' },
    { uf: 'PA', name: 'Pará - PA' },
    { uf: 'PB', name: 'Paraíba - PB' },
    { uf: 'PR', name: 'Paraná - PR' },
    { uf: 'PE', name: 'Pernambuco - PE' },
    { uf: 'PI', name: 'Piauí - PI' },
    { uf: 'RJ', name: 'Rio de Janeiro - RJ' },
    { uf: 'RN', name: 'Rio Grande do Norte - RN' },
    { uf: 'RS', name: 'Rio Grande do Sul - RS' },
    { uf: 'RO', name: 'Rondônia - RO' },
    { uf: 'RR', name: 'Roraima - RR' },
    { uf: 'SC', name: 'Santa Catarina - SC' },
    { uf: 'SP', name: 'São Paulo - SP' },
    { uf: 'SE', name: 'Sergipe - SE' },
    { uf: 'TO', name: 'Tocantins - TO' }
  ];

  useEffect(() => {
    setTimeout(() => setFirstLoading(false), 300);
  });

  async function getInfos() {
    if (value_click) {
      try {
        setLoading(true);

        const response = await getCustomerInfo(customer.id);

        const { contact, address } = response.data.data;

        setCelphone(contact.celphone);
        setPhone(contact.phone);
        setEmail(contact.email);

        setStreet(address.street);
        setNumber(address.number)
        setNeighborhood(address.neighborhood);
        setComplement(address.complement),
          setCity(address.city),
          setUf(address.uf);

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

    setBirthday(momentObj);
  };

  const handleDeleteCustomer = async () => {
    try {
      await api.delete(`/customers/${customer.id}`);

      Alert.alert('Excluído!', 'Cliente deletado com sucesso.');

      dispatch(loadDashboardRequest());
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na exclusão de cliente.'
      );
    } finally {
      reloadCustomers();
      setIsVisible(false);
    }
  }

  const handleUpdateCustomer = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      await api.put(`/customers/${customer.id}`, {
        name,
        sex,
        cpf,
        rg,
        cnpj,
        ie,
        birthday,
        observations,
        status,
        inadimplente,
        celphone,
        phone,
        email,
        street,
        number,
        neighborhood,
        complement,
        city,
        uf
      });

      Alert.alert('Sucesso!', 'Cliente atualizado com sucesso.');

      dispatch(loadDashboardRequest());
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização de cliente, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadCustomers();
    }
  }, [
    name,
    sex,
    cpf,
    rg,
    cnpj,
    ie,
    birthday,
    observations,
    status,
    inadimplente,
    celphone,
    phone,
    email,
    street,
    number,
    neighborhood,
    complement,
    city,
    uf
  ]);

  function StarIcons() {
    return (
      <>
        <TouchableWithoutFeedback onPress={() => setStatus(1)}>
          <MaterialIcons name={status === 1 || status === 2 || status === 3 || status === 4 || status === 5 ? "star" : "star-border"} size={25} color="#fff" />
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => setStatus(2)}>
          <MaterialIcons name={status === 2 || status === 3 || status === 4 || status === 5 ? "star" : "star-border"} size={25} color="#fff" />
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => setStatus(3)}>
          <MaterialIcons name={status === 3 || status === 4 || status === 5 ? "star" : "star-border"} size={25} color="#fff" />
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => setStatus(4)}>
          <MaterialIcons name={status === 4 || status === 5 ? "star" : "star-border"} size={25} color="#fff" />
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => setStatus(5)}>
          <MaterialIcons name={status === 5 ? "star" : "star-border"} size={25} color="#fff" />
        </TouchableWithoutFeedback>
      </>
    );
  }

  // TODO Resolver o status, colocar eles 'dinâmicos' ou otimizados.
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
              <Title>{customer.name}</Title>
              <Description>
                Edite ou exclua esse cliente como quiser.
            </Description>

              <StatusContainer>
                <StarIcons />
              </StatusContainer>

              <InputTitle>Nome</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Digite um nome"
                  autoCapitalize="words"
                  autoCorrect={false}
                  onChangeText={setName}
                  value={name}
                  returnKeyType="next"
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <MaterialIcons name="person-pin" size={20} color="#999" />
              </InputContainer>

              <InputTitle>Sexo</InputTitle>
              <InputContainer>
                <Picker
                  selectedValue={sex}
                  style={{
                    flex: 1,
                    color: '#f8a920',
                    backgroundColor: 'transparent',
                    fontSize: 17
                  }}
                  onValueChange={(itemValue, itemIndex) => setSex(itemValue)}
                >
                  <Picker.Item label='Selecione o Sexo' value={sex} />
                  <Picker.Item label='Masculino' value='M' />
                  <Picker.Item label='Feminino' value='F' />
                </Picker>
                <MaterialIcons name="lock" size={20} color="#999" />
              </InputContainer>

              <InputTitle>Aniversário</InputTitle>
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

              <InputTitle>Observações</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Algo importante sobre o cliente"
                  autoCapitalize="none"
                  autoCorrect={false}
                  ref={observationsInputRef}
                  onChangeText={setObservations}
                  value={observations}
                  returnKeyType="next"
                  onSubmitEditing={() => cpfInputRef.current.focus()}
                />
                <MaterialIcons name="lock" size={20} color="#999" />
              </InputContainer>

              <ChoiceButton
                onPress={() => setChoiceCNPJ(ant => !ant)}
              >
                {choice_cnpj ? <ChoiceText>CPF?</ChoiceText> : <ChoiceText>CNPJ?</ChoiceText>}
              </ChoiceButton>

              {choice_cnpj ? (
                <>
                  <InputTitle>CNPJ</InputTitle>
                  <InputContainer>
                    <TextInputMask
                      placeholder="Número do CNPJ"
                      autoCapitalize="none"
                      autoCorrect={false}
                      maxLength={18}
                      type={'cnpj'}
                      ref={cnpjInputRef}
                      onChangeText={text => setCNPJ(text)}
                      value={cnpj}
                      style={{
                        height: 48,
                        fontSize: 17,
                        color: '#FFF',
                        flex: 1
                      }}
                      placeholderTextColor='#5f6368'
                      returnKeyType="next"
                      onSubmitEditing={() => ieInputRef.current.focus()}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>IE</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite a sua Inscrição Estadual"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="numeric"
                      maxLength={9}
                      ref={ieInputRef}
                      onChangeText={setIE}
                      value={ie}
                      returnKeyType="next"
                      onSubmitEditing={handleUpdateCustomer}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>
                </>
              ) : (
                  <>
                    <InputTitle>CPF</InputTitle>
                    <InputContainer>
                      <TextInputMask
                        placeholder="Número do CPF"
                        autoCapitalize="none"
                        autoCorrect={false}
                        maxLength={14}
                        type={'cpf'}
                        ref={cpfInputRef}
                        onChangeText={text => setCPF(text)}
                        value={cpf}
                        style={{
                          height: 48,
                          fontSize: 17,
                          color: '#FFF',
                          flex: 1
                        }}
                        placeholderTextColor='#5f6368'
                        returnKeyType="next"
                        onSubmitEditing={() => rgInputRef.current.focus()}
                      />
                      <MaterialIcons name="lock" size={20} color="#999" />
                    </InputContainer>

                    <InputTitle>RG</InputTitle>
                    <InputContainer>
                      <Input
                        placeholder="Digite o RG"
                        autoCapitalize="characters"
                        autoCorrect={false}
                        maxLength={14}
                        ref={rgInputRef}
                        onChangeText={setRG}
                        value={rg}
                        returnKeyType="send"
                        onSubmitEditing={handleUpdateCustomer}
                      />
                      <MaterialIcons name="lock" size={20} color="#999" />
                    </InputContainer>
                  </>
                )}

              <SwitchContainer>
                {inadimplente ? <ChoiceText>Não é mais Inadiplente?</ChoiceText> : <ChoiceText>Tornar Inadiplente?</ChoiceText>}

                <CheckBox
                  iconColor="#f8a920"
                  checkColor="#f8a920"
                  value={inadimplente}
                  onChange={() => setInadimplente(!inadimplente)}
                />
              </SwitchContainer>

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
                  <TitleSection>Contato</TitleSection>

                  <InputTitle>Celular</InputTitle>
                  <InputContainer>
                    <TextInputMask
                      placeholder="Digite o número do celular"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="phone-pad"
                      maxLength={15}
                      type={'cel-phone'}
                      options={{
                        maskType: 'BRL',
                        withDDD: true,
                        dddMask: '(99) '
                      }}
                      style={{
                        height: 48,
                        fontSize: 17,
                        color: '#FFF',
                        flex: 1
                      }}
                      placeholderTextColor='#5f6368'
                      onChangeText={text => setCelphone(text)}
                      value={celphone}
                      returnKeyType="next"
                      onSubmitEditing={() => phoneInputRef.current.focus()}
                    />
                    <MaterialIcons name="person-pin" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Telefone</InputTitle>
                  <InputContainer>
                    <TextInputMask
                      placeholder="Digite o número do telefone"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="phone-pad"
                      maxLength={15}
                      type={'cel-phone'}
                      options={{
                        maskType: 'BRL',
                        withDDD: true,
                        dddMask: '(99) '
                      }}
                      style={{
                        height: 48,
                        fontSize: 17,
                        color: '#FFF',
                        flex: 1
                      }}
                      placeholderTextColor='#5f6368'
                      ref={phoneInputRef}
                      onChangeText={text => setPhone(text)}
                      value={phone}
                      returnKeyType="next"
                      onSubmitEditing={() => eMailInputRef.current.focus()}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>E-mail</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Seu endereço de e-mail"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                      ref={eMailInputRef}
                      onChangeText={setEmail}
                      value={email}
                      returnKeyType={'next'}
                      onSubmitEditing={() => streetInputRef.current.focus()}
                    />
                    <MaterialIcons name="mail-outline" size={20} color="#999" />
                  </InputContainer>

                  <TitleSection>Endereço</TitleSection>

                  <InputTitle>Logradouro</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite uma rua/av/outros"
                      autoCapitalize="words"
                      autoCorrect={false}
                      ref={streetInputRef}
                      onChangeText={setStreet}
                      value={street}
                      returnKeyType="next"
                      onSubmitEditing={() => numberInputRef.current.focus()}
                    />
                    <MaterialIcons name="person-pin" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Número</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite o nº do local"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="numeric"
                      ref={numberInputRef}
                      onChangeText={setNumber}
                      value={number === null ? '' : String(number)}
                      returnKeyType="next"
                      onSubmitEditing={() => neighborhoodInputRef.current.focus()}
                    />
                    <MaterialIcons name="person-pin" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Bairro</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite o nome do bairro"
                      autoCapitalize="words"
                      autoCorrect={false}
                      ref={neighborhoodInputRef}
                      onChangeText={setNeighborhood}
                      value={neighborhood}
                      returnKeyType="next"
                      onSubmitEditing={() => complementInputRef.current.focus()}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Complemento</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Complemente se necessário"
                      autoCapitalize="none"
                      autoCorrect={false}
                      ref={complementInputRef}
                      onChangeText={setComplement}
                      value={complement}
                      returnKeyType="next"
                      onSubmitEditing={() => cityInputRef.current.focus()}
                    />
                    <MaterialIcons name="person-pin" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Cidade</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Sua cidade atual"
                      autoCapitalize="words"
                      autoCorrect={false}
                      ref={cityInputRef}
                      onChangeText={setCity}
                      value={city}
                      returnKeyType="next"
                      onSubmitEditing={() => ufInputRef.current.focus()}
                    />
                    <MaterialIcons name="person-pin" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>UF</InputTitle>
                  <InputContainer>
                    <Picker
                      selectedValue={uf}
                      style={{
                        flex: 1,
                        color: '#f8a920',
                        backgroundColor: 'transparent',
                        fontSize: 17
                      }}
                      onValueChange={(itemValue, itemIndex) => setUf(itemValue)}
                    >
                      <Picker.Item label='Selecione a UF' value={uf} />
                      {states && states.map(state => <Picker.Item key={state.uf} label={state.name} value={state.uf} />)}
                    </Picker>
                    <MaterialIcons name="mail-outline" size={20} color="#999" />
                  </InputContainer>
                </>
              )}

              <DeleteButtonBox>
                <DeleteButton onPress={handleDeleteCustomer}>
                  <DeleteButtonText>Excluir</DeleteButtonText>
                </DeleteButton>
                <SubmitButton style={{ width: 125 }} onPress={handleUpdateCustomer}>
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