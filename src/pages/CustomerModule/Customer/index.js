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
import DatePicker from 'react-native-datepicker';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import {
  Container,
  Content,
  FormContainer,
  InputContainer,
  Title,
  Description,
  InputTitle,
  Input,
  ChoiceButton,
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

export default function Customers() {

  const cpfInputRef = useRef();
  const rgInputRef = useRef();
  const observationsInputRef = useRef();
  const cnpjInputRef = useRef();
  const ieInputRef = useRef();

  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState({});
  const [add_customer, setAddCustomer] = useState(false);

  const [name, setName] = useState('');
  const [sex, setSex] = useState('');
  const [cpf, setCPF] = useState('');
  const [rg, setRG] = useState('');
  const [observations, setObservations] = useState('');
  const [birthday, setBirthday] = useState('');

  const [cnpj, setCNPJ] = useState('');
  const [ie, setIE] = useState('');

  const [date, setDate] = useState(new Date());
  const [choice_cnpj, setChoiceCNPJ] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadCustomers() {
      try {
        setLoading(true);

        const response = await api.get('/customers');
        const { customers } = response.data;

        setCustomers(customers);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, []);

  async function reloadCustomers() {
    try {
      setRefreshing(true);

      const response = await api.get('/customers');
      const { customers } = response.data;

      setCustomers(customers);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de clientes, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  const onDateChange = date => {
    setDate(date);

    setBirthday(date);
  };

  function getCustomer(customer) {
    setCustomer(customer);

    setIsVisible(true);
  }

  const handleSaveCustomer = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório')
      });

      await schema.validate({ name }, {
        abortEarly: false,
      });

      await api.post('/customers/add', {
        name,
        sex,
        cpf,
        rg,
        cnpj,
        ie,
        birthday
      });

      Alert.alert('Sucesso!', 'Novo cliente registrado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha no registro de novo cliente, confira seus dados.'
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
    birthday
  ]);

  function ViewButton() {
    if (add_customer) {
      return (
        <>
          <SubmitButton onPress={handleSaveCustomer}>
            {loading ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
                <SubmitButtonText>Salvar</SubmitButtonText>
              )}
          </SubmitButton>
          <CancelarButton onPress={() => setAddCustomer(false)}>
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
                data={customers}
                renderItem={renderCustomers}
                keyExtractor={customers => `customer-${customers.id}`}
                showsVerticalScrollIndicator={false}
                onRefresh={reloadCustomers}
                refreshing={refreshing}
                ListFooterComponent={<View style={{ height: 20 }} />}
                ListEmptyComponent={<Empty>Nenhum cliente encontrado.</Empty>}
              />
            )}
          <SubmitButton onPress={() => setAddCustomer(true)}>
            <SubmitButtonText>Novo Cliente</SubmitButtonText>
          </SubmitButton>
        </>
      );
    }
  }

  function renderCustomers({ item: customer }) {
    return (
      <Card
        onPress={() => getCustomer(customer)}
      >
        <CardInfo>
          <CardTitle numberOfLines={2}>{customer.name}</CardTitle>
          <CardContainer>
            <CardName>
              Inadimplente:{' '}
              <CardSubName>{customer.inadimplente ? 'Sim' : 'Não'}</CardSubName>
            </CardName>

            <CardStatus>{customer.birthday || '--/--/--'}</CardStatus>

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
              <Title>Clientes</Title>
              <Description>
                Veja todos os seus cliente. Crie ou exclua um cliente como quiser.
              </Description>

              {add_customer &&
                <>
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
                      <Picker.Item label='Selecione o Sexo' value='' />
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
                      onChangeText={setBirthday}
                      value={birthday}
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
                        <Input
                          placeholder="Número do CNPJ"
                          autoCapitalize="none"
                          autoCorrect={false}
                          maxLength={25}
                          ref={cnpjInputRef}
                          onChangeText={setCNPJ}
                          value={cnpj}
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
                          maxLength={13}
                          ref={ieInputRef}
                          onChangeText={setIE}
                          value={ie}
                          returnKeyType="next"
                          onSubmitEditing={() => rgInputRef.current.focus()}
                        />
                        <MaterialIcons name="lock" size={20} color="#999" />
                      </InputContainer>
                    </>
                  ) : (
                      <>
                        <InputTitle>CPF</InputTitle>
                        <InputContainer>
                          <Input
                            placeholder="Número do CPF"
                            autoCapitalize="none"
                            autoCorrect={false}
                            maxLength={14}
                            ref={cpfInputRef}
                            onChangeText={setCPF}
                            value={cpf}
                            returnKeyType="next"
                            onSubmitEditing={() => rgInputRef.current.focus()}
                          />
                          <MaterialIcons name="lock" size={20} color="#999" />
                        </InputContainer>
                      </>
                    )}

                  <InputTitle>RG</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite o RG"
                      autoCapitalize="none"
                      autoCorrect={false}
                      maxLength={14}
                      ref={rgInputRef}
                      onChangeText={setRG}
                      value={rg}
                      returnKeyType="send"
                      onSubmitEditing={handleSaveCustomer}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>

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
        <CustonModal customer={customer} setIsVisible={setIsVisible} reloadCustomers={reloadCustomers} />
      </Modal>
    </>
  );
}

Customers.navigationOptions = {
  tabBarLabel: 'Clientes',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="user-cog" size={18} color={tintColor} />
  ),
};