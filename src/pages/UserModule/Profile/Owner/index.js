import React, { useRef, useCallback, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard
} from 'react-native';

import * as Yup from 'yup';
import DatePicker from 'react-native-datepicker';

import { useSelector } from 'react-redux';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import api from '../../../../services/api';

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
} from './styles';

// FIXME Terminar de resolver a validação da data de aniversário:
//    - Resolver conversão da data vinda do banco para o front/mobile;
//    - Resolver a conversão da string para salvar no banco depois;
//
// FIXME Resolver a validação do CPF e CNPJ;

export default function Owner() {

  const sexInputRef = useRef();
  const cpfInputRef = useRef();
  const rgInputRef = useRef();
  const orgaoExpeditorInputRef = useRef();

  const profile = useSelector(state => state.auth.user);

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [sex, setSex] = useState('');
  const [cpf, setCPF] = useState('');
  const [rg, setRG] = useState('');
  const [birthday, setBirthday] = useState('');
  const [orgao_expeditor, setOrgaoExpeditor] = useState('');

  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const onDateChange = date => {
    setDate(date);

    setBirthday(date);
  };

  useEffect(() => {
    async function getInfos() {
      try {
        setLoading(true);

        const response = await api.get(`/user/owner/${profile.id}`);
        const {
          id,
          name,
          sex,
          cpf,
          rg,
          birthday,
          orgao_expeditor
        } = response.data;

        setId(id)
        setName(name);
        setSex(sex);
        setCPF(cpf);
        setRG(rg);
        setBirthday(birthday);
        setOrgaoExpeditor(orgao_expeditor);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    getInfos();
  }, []);

  const handleSaveOwner = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório')
      });

      await schema.validate({ name }, {
        abortEarly: false,
      });

      await api.put(`/user/owner/${id}`, { name, sex, cpf, rg, birthday, orgao_expeditor });

      Alert.alert('Sucesso!', 'Perfil atualizado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização do perfil, confira seus dados.'
      );
    } finally {
      setLoading(false);
    }
  }, [
    name,
    sex,
    cpf,
    rg,
    birthday,
    orgao_expeditor
  ]);

  return (
    <Container>
      <Content keyboardShouldPersistTaps="handled">
        <FormContainer>
          <Title>PERFIL</Title>
          <Description>
            Atualize suas informaçoes pessoais editando os campos abaixo, logo depois, clique em Salvar.
          </Description>

          <InputTitle>NOME</InputTitle>
          <InputContainer>
            <Input
              placeholder="Digite seu nome"
              autoCapitalize="words"
              autoCorrect={false}
              onChangeText={setName}
              value={name}
              returnKeyType="next"
              onSubmitEditing={() => sexInputRef.current.focus()}
            />
            <MaterialIcons name="person-pin" size={20} color="#999" />
          </InputContainer>

          <InputTitle>SEXO</InputTitle>
          <InputContainer>
            <Input
              placeholder="Seu sexo é"
              autoCapitalize="none"
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

          <InputTitle>ANIVERSÁRIO</InputTitle>
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

          <InputTitle>CPF</InputTitle>
          <InputContainer>
            <Input
              placeholder="Número do seu CPF"
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

          <InputTitle>RG</InputTitle>
          <InputContainer>
            <Input
              placeholder="Digite o seu RG"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={14}
              ref={rgInputRef}
              onChangeText={setRG}
              value={rg}
              returnKeyType="next"
              onSubmitEditing={() => orgaoExpeditorInputRef.current.focus()}
            />
            <MaterialIcons name="lock" size={20} color="#999" />
          </InputContainer>

          <InputTitle>ORGÃO EXPEDITOR</InputTitle>
          <InputContainer>
            <Input
              placeholder="Orgão de expedição SSP/Outros"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={30}
              ref={orgaoExpeditorInputRef}
              onChangeText={setOrgaoExpeditor}
              value={orgao_expeditor}
              returnKeyType="send"
              onSubmitEditing={handleSaveOwner}
            />
            <MaterialIcons name="lock" size={20} color="#999" />
          </InputContainer>

          <SubmitButton onPress={handleSaveOwner}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
                <SubmitButtonText>Salvar</SubmitButtonText>
              )}
          </SubmitButton>
        </FormContainer>
      </Content>
    </Container>
  );
}