import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
import { getCustomerInfo } from '../../../../services/infos';
import CheckBox from "../../../../components/CheckBox";

export default function CustonModal({ customer, setIsVisible, reloadCustomers }) {

  const sexInputRef = useRef();
  const cpfInputRef = useRef();
  const rgInputRef = useRef();
  const observationsInputRef = useRef();
  const cnpjInputRef = useRef();
  const ieInputRef = useRef();

  const phoneInputRef = useRef();
  const eMailInputRef = useRef();

  const logradouroInputRef = useRef();
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

  const [date, setDate] = useState(new Date());
  const [choice_cnpj, setChoiceCNPJ] = useState(false);
  const [more_info, setMoreInfo] = useState(false);
  const [value_click, setValueClick] = useState(true);

  const [loading, setLoading] = useState(false);

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

    setBirthday(date);
  };

  const handleDeleteCustomer = async () => {
    try {
      await api.delete(`/customers/${customer.id}`);

      Alert.alert('Excluído!', 'Cliente deletado com sucesso.');
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

  // TODO Resolver o status, colocar ele como estrelinhas de 0 a 5

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

            <InputTitle>Status do Cliente</InputTitle>
            <InputContainer>
              <Input
                placeholder="Insira um nº de 0 a 5"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="numeric"
                onChangeText={setStatus}
                value={status === null ? '' : String(status)}
                returnKeyType="next"
                onSubmitEditing={() => neighborhoodInputRef.current.focus()}
              />
              <MaterialIcons name="person-pin" size={20} color="#999" />
            </InputContainer>

            <SwitchContainer>
              {inadimplente ? <ChoiceText>Não é mais Inadiplente?</ChoiceText> : <ChoiceText>Tornar Inadiplente?</ChoiceText>}

              <CheckBox
                iconColor="#f8a920"
                checkColor="#f8a920"
                value={inadimplente}
                onChange={() => setInadimplente(!inadimplente)}
              />
            </SwitchContainer>

            <InputTitle>Nome</InputTitle>
            <InputContainer>
              <Input
                placeholder="Digite um nome"
                autoCapitalize="words"
                autoCorrect={false}
                onChangeText={setName}
                value={name}
                returnKeyType="next"
                onSubmitEditing={() => sexInputRef.current.focus()}
              />
              <MaterialIcons name="person-pin" size={20} color="#999" />
            </InputContainer>

            <InputTitle>Sexo</InputTitle>
            <InputContainer>
              <Input
                placeholder="O sexo é"
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={1}
                ref={sexInputRef}
                onChangeText={setSex}
                value={sex}
                returnKeyType="next"
                onSubmitEditing={() => cpfInputRef.current.focus()}
              />
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
                onSubmitEditing={handleUpdateCustomer}
              />
              <MaterialIcons name="lock" size={20} color="#999" />
            </InputContainer>

            <ChoiceButton
              onPress={() => {
                setMoreInfo(ant => !ant)
                getInfos()
              }}
            >
              <ChoiceText>Informações Adicionais?</ChoiceText>
            </ChoiceButton>

            {more_info && (
              <>
                <TitleSection>Contato</TitleSection>

                <InputTitle>Celular</InputTitle>
                <InputContainer>
                  <Input
                    placeholder="Digite o número do celular"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="phone-pad"
                    maxLength={16}
                    onChangeText={setCelphone}
                    value={celphone}
                    returnKeyType="next"
                    onSubmitEditing={() => phoneInputRef.current.focus()}
                  />
                  <MaterialIcons name="person-pin" size={20} color="#999" />
                </InputContainer>

                <InputTitle>Telefone</InputTitle>
                <InputContainer>
                  <Input
                    placeholder="Digite o número do telefone"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="phone-pad"
                    maxLength={15}
                    ref={phoneInputRef}
                    onChangeText={setPhone}
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
                    onSubmitEditing={() => logradouroInputRef.current.focus()}
                  />
                  <MaterialIcons name="mail-outline" size={20} color="#999" />
                </InputContainer>

                <TitleSection>Endereço</TitleSection>

                <InputTitle>Logradouro</InputTitle>
                <InputContainer>
                  <Input
                    placeholder="Digite uma rua/av/outros"
                    autoCapitalize="none"
                    autoCorrect={false}
                    ref={logradouroInputRef}
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
                    autoCapitalize="none"
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
                    autoCapitalize="none"
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
                  <Input
                    placeholder="Seu estado federativo atual"
                    autoCapitalize="words"
                    autoCorrect={false}
                    maxLength={2}
                    ref={ufInputRef}
                    onChangeText={setUf}
                    value={uf}
                    returnKeyType={'send'}
                    onSubmitEditing={handleUpdateCustomer}
                  />
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