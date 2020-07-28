import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Switch,
  Picker,
  Image
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
  InputContainer,
  Title,
  Description,
  TitleSection,
  InputTitle,
  Input,
  SwitchContainer,
  SwitchText,
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

export default function CustonModal({ worker, setIsVisible, reloadWorkers }) {

  const eMailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const rgInputRef = useRef();
  const orgaoExpeditorInputRef = useRef();
  const observationsInputRef = useRef();

  const ctpsInputRef = useRef();
  const salaryHourInputRef = useRef();
  const salaryInputRef = useRef();
  const commissionInputRef = useRef();
  const rescissionReasonInputRef = useRef();

  const [username, setUsername] = useState(worker.username);
  const [email, setEmail] = useState(worker.email);
  const [enable, setEnable] = useState(worker.enable);
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');

  const [id_worker, setIdWorker] = useState('');

  const [name, setName] = useState('');
  const [sex, setSex] = useState('');
  const [cpf, setCPF] = useState('');
  const [rg, setRG] = useState('');
  const [orgao_expeditor, setOrgaoExpeditor] = useState('');
  const [observations, setObservations] = useState('');
  const [birthday, setBirthday] = useState();

  const [ctps, setCTPS] = useState('');
  const [salary_hour, setSalaryHour] = useState();
  const [salary, setSalary] = useState();
  const [commission, setCommission] = useState();
  const [admission, setAdmission] = useState();
  const [admission_exam, setAdmissionExam] = useState();
  const [next_exam, setNextExam] = useState();
  const [last_vacation, setLastVacation] = useState();
  const [nest_vacation, setNestVacation] = useState();
  const [rescission, setRescission] = useState();
  const [rescission_exam, setRescissionExam] = useState();
  const [rescission_reason, setRescissionReason] = useState('');

  const [more_info, setMoreInfo] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [value_click, setValueClick] = useState(true);
  const [loading, setLoading] = useState(false);
  const [first_loading, setFirstLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setFirstLoading(false), 300);
  });

  async function getInfo(id) {
    if (value_click) {
      try {
        setLoading(true);

        const response = await api.get(`/user/worker/${id}`);
        const { worker } = response.data;

        setIdWorker(worker.id)
        setName(worker.name);
        setSex(worker.sex);
        setCPF(worker.cpf);
        setRG(worker.rg);
        setOrgaoExpeditor(worker.orgao_expeditor);
        setObservations(worker.observations);
        setBirthday(worker.birthday);
        setCTPS(worker.ctps);
        setSalaryHour(worker.salary_hour);
        setSalary(worker.salary);
        setCommission(worker.commission);
        setAdmission(worker.admission);
        setAdmissionExam(worker.admission_exam);
        setNextExam(worker.next_exam);
        setLastVacation(worker.last_vacation);
        setNestVacation(worker.nest_vacation);
        setRescission(worker.rescission);
        setRescissionExam(worker.rescission_exam);
        setRescissionReason(worker.rescission_reason);

      } catch (err) {
        console.log(err);
      } finally {
        setValueClick(false);
        setLoading(false);
      }
    }
  }

  const onDateChange = (date, name) => {

    const momentObj = moment(date, 'DD-MM-YYYY');

    switch (name) {
      case 'birthday':
        setBirthday(momentObj);
        break;
      case 'admission':
        setAdmission(momentObj);
        break;
      case 'admission_exam':
        setAdmissionExam(momentObj);
        break;
      case 'next_exam':
        setNextExam(momentObj);
        break;
      case 'last_vacation':
        setLastVacation(momentObj);
        break;
      case 'nest_vacation':
        setNestVacation(momentObj);
        break;
      case 'rescission':
        setRescission(momentObj);
        break;
      case 'rescission_exam':
        setRescissionExam(momentObj);
        break;
      default:
        break;
    }
  };

  const handleDeleteWorker = async () => {
    try {
      await api.delete(`/user/info/${worker.id}`);

      Alert.alert('Excluído!', 'Colaborador deletado com sucesso.');

    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na exclusão de colaborador.'
      );
    } finally {
      reloadWorkers();
      setIsVisible(false);
    }
  }

  const handleSaveWorkerProfile = useCallback(async () => {
    try {
      setLoading(true);

      const schema = Yup.object().shape({
        username: Yup.string().required('Nome do usuário é obrigatório'),
        email: Yup.string().email('Digite um e-mail válido').required('e-mail é obrigatório')
      });

      await schema.validate({ username, email }, {
        abortEarly: false,
      });

      if (password !== password_confirmation) {
        setLoading(false);

        return;
      }

      await api.put(`/user/info/${worker.id}`, { username, email, enable, password, password_confirmation });

      if (id_worker) {
        await api.put(`/user/worker/${id_worker}`, {
          name,
          sex,
          cpf,
          rg,
          orgao_expeditor,
          observations,
          birthday,
          ctps,
          salary_hour: salary_hour || 0,
          salary: salary || 0,
          commission: commission || 0,
          admission,
          admission_exam,
          next_exam,
          last_vacation,
          nest_vacation,
          rescission,
          rescission_exam,
          rescission_reason
        });
      }

      Alert.alert('Sucesso!', 'Colaborador atualizado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização do colaborador, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadWorkers();
    }
  }, [
    username,
    email,
    enable,
    password,
    password_confirmation,
    name,
    sex,
    cpf,
    rg,
    orgao_expeditor,
    observations,
    birthday,
    ctps,
    salary_hour,
    salary,
    commission,
    admission,
    admission_exam,
    next_exam,
    last_vacation,
    nest_vacation,
    rescission,
    rescission_exam,
    rescission_reason
  ]);

  // TODO Resolver o número da CTPS direito.
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
              <Title>{username}</Title>
              <Description>
                Edite ou exclua esse colaborador como quiser.
            </Description>

              <SwitchContainer>
                <ChoiceText>Ativar Usuário?</ChoiceText>

                <CheckBox
                  iconColor="#f8a920"
                  checkColor="#f8a920"
                  value={enable}
                  onChange={() => setEnable(!enable)}
                />
              </SwitchContainer>

              <InputTitle>Usuário</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Digite um nome"
                  autoCapitalize="words"
                  autoCorrect={false}
                  onChangeText={setUsername}
                  value={username}
                  returnKeyType="next"
                  onSubmitEditing={() => eMailInputRef.current.focus()}
                />
                <MaterialIcons name="person-pin" size={20} color="#999" />
              </InputContainer>

              <InputTitle>E-mail</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Seu endereço de e-mail"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                  ref={eMailInputRef}
                  onChangeText={setEmail}
                  value={email}
                  returnKeyType={changePassword ? 'next' : 'send'}
                  onSubmitEditing={() =>
                    changePassword
                      ? passwordInputRef.current.focus()
                      : handleSaveWorkerProfile()
                  }
                />
                <MaterialIcons name="mail-outline" size={20} color="#999" />
              </InputContainer>

              <SwitchContainer>
                <SwitchText>Alterar senha?</SwitchText>
                <Switch
                  thumbColor="#f8a920"
                  trackColor={{ true: '#f8a920', false: '#2b475c' }}
                  value={changePassword}
                  onValueChange={setChangePassword}
                />
              </SwitchContainer>

              {changePassword && (
                <>
                  <InputTitle>Nova Senha</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Sua nova senha"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry
                      ref={passwordInputRef}
                      onChangeText={setPassword}
                      value={password}
                      returnKeyType="next"
                      onSubmitEditing={() =>
                        confirmPasswordInputRef.current.focus()}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Confirmar Senha</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Confirme a nova senha"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry
                      ref={confirmPasswordInputRef}
                      onChangeText={setPasswordConfirmation}
                      value={password_confirmation}
                      returnKeyType="send"
                      onSubmitEditing={handleSaveWorkerProfile}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>
                </>
              )}

              <ChoiceButton
                onPress={() => {
                  setMoreInfo(ant => !ant)
                  getInfo(worker.id)
                }}
              >
                <ChoiceText>Configurações Extras?</ChoiceText>

                <MaterialIcons name="youtube-searched-for" size={20} color="#f8a920" />
              </ChoiceButton>

              {more_info && (
                <>
                  <TitleSection>Pessoal</TitleSection>

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
                      value={birthday ? moment(birthday).format('DD-MM-YYYY') : ''}
                    />
                    <DatePicker
                      is24Hour={true}
                      format="DD-MM-YYYY"
                      minDate="01-01-2001"
                      maxDate="31-12-2030"
                      hideText={true}
                      iconComponent={<FontAwesome5 name="calendar-alt" size={18} color="#999" />}
                      style={{
                        width: 21
                      }}
                      onDateChange={d => onDateChange(d, 'birthday')}
                    />
                  </InputContainer>

                  <InputTitle>CPF</InputTitle>
                  <InputContainer>
                    <TextInputMask
                      placeholder="Número do CPF"
                      autoCapitalize="none"
                      autoCorrect={false}
                      maxLength={14}
                      type={'cpf'}
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
                      placeholder="Digite o RG"
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
                      autoCapitalize="words"
                      autoCorrect={false}
                      maxLength={30}
                      ref={orgaoExpeditorInputRef}
                      onChangeText={setOrgaoExpeditor}
                      value={orgao_expeditor}
                      returnKeyType="next"
                      onSubmitEditing={() => observationsInputRef.current.focus()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <InputTitle>Observações</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Algo importante sobre o colaborador"
                      autoCapitalize="none"
                      autoCorrect={false}
                      ref={observationsInputRef}
                      onChangeText={setObservations}
                      value={observations}
                      returnKeyType="next"
                      onSubmitEditing={() => ctpsInputRef.current.focus()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <TitleSection>Trabalhista</TitleSection>

                  <InputTitle>CTPS</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Número da carteira de trabalho "
                      autoCapitalize="none"
                      autoCorrect={false}
                      maxLength={13}
                      keyboardType="numeric"
                      ref={ctpsInputRef}
                      onChangeText={setCTPS}
                      value={ctps}
                      returnKeyType="next"
                      onSubmitEditing={() => salaryHourInputRef.current.focus()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <InputTitle>Salário/Hora</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Valor da hora de trabalho"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="numeric"
                      ref={salaryHourInputRef}
                      onChangeText={setSalaryHour}
                      value={salary_hour}
                      returnKeyType="next"
                      onSubmitEditing={() => salaryInputRef.current.focus()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <InputTitle>Salário</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Salário do colaborador"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="numeric"
                      ref={salaryInputRef}
                      onChangeText={setSalary}
                      value={salary}
                      returnKeyType="next"
                      onSubmitEditing={() => commissionInputRef.current.focus()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <InputTitle>Comissão</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Comissão do colaborador, se houver"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="numeric"
                      ref={commissionInputRef}
                      onChangeText={setCommission}
                      value={commission}
                      returnKeyType="next"
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <InputTitle>Adimissão</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Clique no calendário para editar"
                      editable={false}
                      value={admission ? moment(admission).format('DD-MM-YYYY') : ''}
                    />
                    <DatePicker
                      is24Hour={true}
                      format="DD-MM-YYYY"
                      minDate="01-01-2001"
                      maxDate="31-12-2030"
                      hideText={true}
                      iconComponent={<FontAwesome5 name="calendar-alt" size={18} color="#999" />}
                      style={{
                        width: 21
                      }}
                      onDateChange={d => onDateChange(d, 'admission')}
                    />
                  </InputContainer>

                  <InputTitle>Exame de Adimissão</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Clique no calendário para editar"
                      editable={false}
                      value={admission_exam ? moment(admission_exam).format('DD-MM-YYYY') : ''}
                    />
                    <DatePicker
                      is24Hour={true}
                      format="DD-MM-YYYY"
                      minDate="01-01-2001"
                      maxDate="31-12-2030"
                      hideText={true}
                      iconComponent={<FontAwesome5 name="calendar-alt" size={18} color="#999" />}
                      style={{
                        width: 21
                      }}
                      onDateChange={d => onDateChange(d, 'admission_exam')}
                    />
                  </InputContainer>

                  <InputTitle>Proxímo Exame</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Clique no calendário para editar"
                      editable={false}
                      value={next_exam ? moment(next_exam).format('DD-MM-YYYY') : ''}
                    />
                    <DatePicker
                      is24Hour={true}
                      format="DD-MM-YYYY"
                      minDate="01-01-2001"
                      maxDate="31-12-2030"
                      hideText={true}
                      iconComponent={<FontAwesome5 name="calendar-alt" size={18} color="#999" />}
                      style={{
                        width: 21
                      }}
                      onDateChange={d => onDateChange(d, 'next_exam')}
                    />
                  </InputContainer>

                  <InputTitle>Ultima Férias</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Clique no calendário para editar"
                      editable={false}
                      value={last_vacation ? moment(last_vacation).format('DD-MM-YYYY') : ''}
                    />
                    <DatePicker
                      is24Hour={true}
                      format="DD-MM-YYYY"
                      minDate="01-01-2001"
                      maxDate="31-12-2030"
                      hideText={true}
                      iconComponent={<FontAwesome5 name="calendar-alt" size={18} color="#999" />}
                      style={{
                        width: 21
                      }}
                      onDateChange={d => onDateChange(d, 'last_vacation')}
                    />
                  </InputContainer>

                  <InputTitle>Proxíma Férias</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Clique no calendário para editar"
                      editable={false}
                      value={nest_vacation ? moment(nest_vacation).format('DD-MM-YYYY') : ''}
                    />
                    <DatePicker
                      is24Hour={true}
                      format="DD-MM-YYYY"
                      minDate="01-01-2001"
                      maxDate="31-12-2030"
                      hideText={true}
                      iconComponent={<FontAwesome5 name="calendar-alt" size={18} color="#999" />}
                      style={{
                        width: 21
                      }}
                      onDateChange={d => onDateChange(d, 'nest_vacation')}
                    />
                  </InputContainer>

                  <InputTitle>Rescisão</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Clique no calendário para editar"
                      editable={false}
                      value={rescission ? moment(rescission).format('DD-MM-YYYY') : ''}
                    />
                    <DatePicker
                      is24Hour={true}
                      format="DD-MM-YYYY"
                      minDate="01-01-2001"
                      maxDate="31-12-2030"
                      hideText={true}
                      iconComponent={<FontAwesome5 name="calendar-alt" size={18} color="#999" />}
                      style={{
                        width: 21
                      }}
                      onDateChange={d => onDateChange(d, 'rescission')}
                    />
                  </InputContainer>

                  <InputTitle>Exame de Rescisão</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Clique no calendário para editar"
                      editable={false}
                      value={rescission_exam ? moment(rescission_exam).format('DD-MM-YYYY') : ''}
                    />
                    <DatePicker
                      is24Hour={true}
                      format="DD-MM-YYYY"
                      minDate="01-01-2001"
                      maxDate="31-12-2030"
                      hideText={true}
                      iconComponent={<FontAwesome5 name="calendar-alt" size={18} color="#999" />}
                      style={{
                        width: 21
                      }}
                      onDateChange={d => onDateChange(d, 'rescission_exam')}
                    />
                  </InputContainer>

                  <InputTitle>Razão da Rescisão</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Qual foi a razão/motivo?"
                      autoCapitalize="words"
                      autoCorrect={false}
                      ref={rescissionReasonInputRef}
                      onChangeText={setRescissionReason}
                      value={rescission_reason}
                      returnKeyType="send"
                      onSubmitEditing={handleSaveWorkerProfile}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>
                </>
              )}

              <DeleteButtonBox>
                <DeleteButton onPress={handleDeleteWorker}>
                  <DeleteButtonText>Excluir</DeleteButtonText>
                </DeleteButton>
                <SubmitButton style={{ width: 125 }} onPress={handleSaveWorkerProfile}>
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