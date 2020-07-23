import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  View,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import * as Yup from 'yup';

import { MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

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
  CancelarButton,
  CancelarButtonText,
  Cards,
  Card,
  CardInfo,
  CardTitle,
  CardContainer,
  CardName,
  CardStatus,
  Empty
} from './styles';

import Placeholder from './Placeholder';
import CustonModal from './CustonModal';

import api from '../../../services/api';

export default function CreateWorker() {

  const eMailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const [workers, setWorkers] = useState([]);
  const [worker, setWorker] = useState({});
  const [add_worker, setAddWorker] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadWorkers() {
      try {
        setLoading(true);

        const response = await api.get('/user/workers');
        const { workers } = response.data;

        setWorkers(workers);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadWorkers();
  }, []);

  function getWorker(worker) {
    setWorker(worker);

    setIsVisible(true);
  }

  async function reloadWorkers() {
    try {
      setRefreshing(true);

      const response = await api.get('/user/workers');
      const { workers } = response.data;

      setWorkers(workers);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de colaboradores, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  const handleCreateAccount = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        username: Yup.string().required('Nome de usuário é obrigatório'),
        email: Yup.string().email('Digite um e-mail válido').required('O email é obrigatório'),
        password: Yup.string().required('Senha é obrigatória'),
        password_confirmation: Yup.string().required('Confirme sua senha')
      });

      await schema.validate({ username, email, password, password_confirmation }, {
        abortEarly: false,
      });

      if (password !== password_confirmation) {
        setLoading(false);

        return;
      }

      await api.post('/session/create', { username, email, password });

      Alert.alert('Sucesso!', 'Conta de colaborador(a) foi criada com sucesso.');

    } catch (err) {
      console.log(err);

      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message ||
        'Falha na criação de conta, verifique seus dados e tente novamente!'
      );
    } finally {
      setLoading(false);
      reloadWorkers();
    }

  }, [
    username,
    email,
    password,
    password_confirmation,
  ]);

  function ViewButton() {
    if (add_worker) {
      return (
        <>
          <SubmitButton onPress={handleCreateAccount}>
            {loading ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
                <SubmitButtonText>Salvar</SubmitButtonText>
              )}
          </SubmitButton>
          <CancelarButton onPress={() => setAddWorker(false)}>
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
                data={workers}
                renderItem={renderWorkers}
                keyExtractor={workers => `worker-${workers.id}`}
                showsVerticalScrollIndicator={false}
                onRefresh={reloadWorkers}
                refreshing={refreshing}
                ListFooterComponent={<View style={{ height: 20 }} />}
                ListEmptyComponent={<Empty>Nenhum(a) colaborador(a) encontrado.</Empty>}
              />
            )}
          <SubmitButton onPress={() => setAddWorker(true)}>
            <SubmitButtonText>Adicionar</SubmitButtonText>
          </SubmitButton>
        </>
      );
    }
  }

  function renderWorkers({ item: worker }) {
    return (
      <Card
        onPress={() => getWorker(worker)}
      >
        <CardInfo>
          <CardTitle numberOfLines={1}>{worker.username}</CardTitle>
          <CardContainer>
            <CardName>
              {worker.email}
            </CardName>

            <CardStatus>{worker.enable ? 'Ativo' : 'Inativo'}</CardStatus>

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
              <Title>Colaboradores</Title>
              <Description>
                Veja todos os seus colaboradores. Crie ou exclua um colaborador como quiser.
              </Description>

              {add_worker &&
                <>
                  <InputTitle>Nome de Usuário</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite o nome de usuário"
                      autoCapitalize="words"
                      autoCorrect={false}
                      onChangeText={setUsername}
                      value={username}
                      returnKeyType="next"
                      onSubmitEditing={() => eMailInputRef.current.focus()}
                    />
                    <MaterialIcons
                      name="person-pin"
                      size={20}
                      color="#999"
                    />
                  </InputContainer>

                  <InputTitle>E-mail de Acesso</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite um e-mail"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                      onChangeText={setEmail}
                      value={email}
                      ref={eMailInputRef}
                      returnKeyType="next"
                      onSubmitEditing={() => passwordInputRef.current.focus()}
                    />
                    <MaterialIcons name="mail-outline" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Senha de Acesso</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite uma senha forte"
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
                    <MaterialCommunityIcons
                      name="lock-outline"
                      size={20}
                      color="#999"
                    />
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
                      textContentType="oneTimeCode"
                      onSubmitEditing={handleCreateAccount}
                    />
                    <MaterialCommunityIcons
                      name="lock-outline"
                      size={20}
                      color="#999"
                    />
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
        <CustonModal worker={worker} setIsVisible={setIsVisible} reloadWorkers={reloadWorkers} />
      </Modal>
    </>
  );
}

CreateWorker.navigationOptions = {
  tabBarLabel: 'Categorias',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="user-cog" size={18} color={tintColor} />
  ),
};