import React, { useRef, useCallback, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Picker,
  Image
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import { LinearGradient } from 'expo-linear-gradient';

import * as Yup from 'yup';

import moment from 'moment';
import DatePicker from 'react-native-datepicker';

import { useSelector } from 'react-redux';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import api from '../../../../services/api';
import LoadGif from '../../../../assets/loading.gif';

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

export default function Owner() {

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

  const [date, setDate] = useState();
  const [loading, setLoading] = useState(false);
  const [first_loading, setFirstLoading] = useState(true);

  useEffect(() => {
    async function getInfos() {
      try {
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

        const date = birthday ? moment(birthday).format('DD-MM-YYYY') : '';
        setDate(date);

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
        setFirstLoading(false);
      }
    }

    getInfos();
  }, []);

  const onDateChange = date => {
    setDate(date);

    const momentObj = moment(date, 'DD-MM-YYYY');

    setBirthday(momentObj);
  };

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
              <Title>Perfil</Title>
              <Description>
                Atualize suas informaçoes pessoais editando os campos abaixo, logo depois, clique em Salvar.
          </Description>

              <InputTitle>Nome</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Digite seu nome"
                  autoCapitalize="words"
                  autoCorrect={false}
                  onChangeText={setName}
                  value={name}
                  returnKeyType="next"
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <MaterialIcons name="edit" size={18} color="#999" />
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
                <MaterialIcons name="unfold-more" size={20} color="#999" />
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

              <InputTitle>CPF</InputTitle>
              <InputContainer>
                <TextInputMask
                  placeholder="Número do seu CPF"
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
                <MaterialIcons name="edit" size={18} color="#999" />
              </InputContainer>

              <InputTitle>RG</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Digite o seu RG"
                  autoCapitalize="characters"
                  autoCorrect={false}
                  maxLength={14}
                  ref={rgInputRef}
                  onChangeText={setRG}
                  value={rg}
                  returnKeyType="next"
                  onSubmitEditing={() => orgaoExpeditorInputRef.current.focus()}
                />
                <MaterialIcons name="edit" size={18} color="#999" />
              </InputContainer>

              <InputTitle>Orgão Expeditor</InputTitle>
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
                <MaterialIcons name="edit" size={18} color="#999" />
              </InputContainer>

              <SubmitButton onPress={handleSaveOwner}>
                {loading ? (
                  <ActivityIndicator size="small" color="#333" />
                ) : (
                    <SubmitButtonText>Salvar</SubmitButtonText>
                  )}
              </SubmitButton>
            </FormContainer>
          </Content>
        </Container>
      </LinearGradient>
    );
  }
}