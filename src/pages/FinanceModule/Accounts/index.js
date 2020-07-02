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
  SubmitButton,
  SubmitButtonText,
  DeleteButtonBox,
  DeleteButton,
  DeleteButtonText,
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

import api from '../../../services/api';

export default function Accounts() {

  const descriptionInputRef = useRef();
  const typeInputRef = useRef();
  const initialValueInputRef = useRef();

  const [accounts, setAccounts] = useState([]);
  const [account, setAccount] = useState({});
  const [add_account, setAddAccount] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [initial_value, setInitialValue] = useState('');

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadAccounts() {
      try {
        setLoading(true);

        const response = await api.get('/finance/accounts');
        const { accounts } = response.data;

        setAccounts(accounts);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadAccounts();
  }, []);

  function getAccount(account) {
    setAccount(account);
    setTitle(account.title);
    setDescription(account.description);
    setType(account.type);
    setInitialValue(account.initial_value);
    setIsVisible(true);
  }

  async function reloadAccounts() {
    try {
      setRefreshing(true);

      const response = await api.get('/finance/accounts');
      const { accounts } = response.data;

      setAccounts(accounts);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de categorias, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await api.delete(`/finance/account/${account.id}`);

      setAccount({});

      Alert.alert('Excluída!', 'Conta deletada com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na exclusão da conta.'
      );
    } finally {
      setIsVisible(false);
      reloadAccounts();
    }
  }

  const handleUpdateAccount = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      await api.put(`/finance/account/${account.id}`, { title, description, type, initial_value });

      Alert.alert('Sucesso!', 'Conta pessoal atualizada com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização conta, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadAccounts();
    }
  }, [
    title,
    description,
    type,
    initial_value
  ]);

  const handleSaveAccount = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        title: Yup.string().required('Título é obrigatório'),
        type: Yup.string().required('Tipo é obrigatório'),
        initial_value: Yup.number().required('Valor inícial é obrigatório')
      });

      await schema.validate({ title, type, initial_value }, {
        abortEarly: false,
      });

      await api.post('/finance/account', { title, description, type, initial_value });

      Alert.alert('Sucesso!', 'Nova conta pessoal registrada com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha no registro da nova conta, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadAccounts();
    }
  }, [
    title,
    description,
    type,
    initial_value
  ]);

  function ViewButton() {
    if (add_account) {
      return (
        <>
          <SubmitButton onPress={handleSaveAccount}>
            {loading ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
                <SubmitButtonText>Salvar</SubmitButtonText>
              )}
          </SubmitButton>
          <CancelarButton onPress={() => setAddAccount(false)}>
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
                data={accounts}
                renderItem={renderAccounts}
                keyExtractor={accounts => `account-${accounts.id}`}
                showsVerticalScrollIndicator={false}
                onRefresh={reloadAccounts}
                refreshing={refreshing}
                ListFooterComponent={<View style={{ height: 20 }} />}
                ListEmptyComponent={<Empty>Nenhuma conta encontrada.</Empty>}
              />
            )}
          <SubmitButton onPress={() => setAddAccount(true)}>
            <SubmitButtonText>Nova Conta</SubmitButtonText>
          </SubmitButton>
        </>
      );
    }
  }

  function renderAccounts({ item: account }) {
    return (
      <Card
        onPress={() => getAccount(account)}
      >
        <CardInfo>
          <CardTitle numberOfLines={2}>{account.title}</CardTitle>
          <CardContainer>
            <CardName>
              {account.description}{' '}
              <CardSubName>({account.type})</CardSubName>
            </CardName>

            <CardStatus>{account.initial_value}</CardStatus>

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
              <Title>Contas Pessoais</Title>
              <Description>
                Veja todas as suas contas. Crie ou exclua uma conta como quiser.
          </Description>

              {add_account &&
                <>
                  <InputTitle>Título</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite um título para a conta"
                      autoCapitalize="words"
                      autoCorrect={false}
                      maxLength={60}
                      onChangeText={setTitle}
                      value={title}
                      returnKeyType="next"
                      onSubmitEditing={() => descriptionInputRef.current.focus()}
                    />
                    <MaterialIcons name="person-pin" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Descrição</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite uma descrição"
                      autoCapitalize="words"
                      autoCorrect={false}
                      ref={descriptionInputRef}
                      onChangeText={setDescription}
                      value={description}
                      returnKeyType="next"
                      onSubmitEditing={() => typeInputRef.current.focus()}
                    />
                    <MaterialIcons name="person-pin" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Tipo de Conta</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Insira o tipo, ex: cc/cd/Caixa/etc"
                      autoCapitalize="words"
                      autoCorrect={false}
                      maxLength={10}
                      ref={typeInputRef}
                      onChangeText={setType}
                      value={type}
                      returnKeyType="next"
                      onSubmitEditing={() => initialValueInputRef.current.focus()}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Valor Inícial</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Insira um valor inícial"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="numeric"
                      ref={initialValueInputRef}
                      onChangeText={setInitialValue}
                      value={initial_value}
                      returnKeyType="send"
                      onSubmitEditing={handleSaveAccount}
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
        <LinearGradient
          colors={['#2b475c', '#000']}
          style={{ flex: 1 }}
        >
          <Container>
            <Content keyboardShouldPersistTaps="handled">
              <FormContainer>
                <Title>{account.title}</Title>
                <Description>
                  Edite ou exclua essa conta como quiser.
                </Description>

                <InputTitle>Título</InputTitle>
                <InputContainer>
                  <Input
                    placeholder='Novo título'
                    autoCapitalize="words"
                    autoCorrect={false}
                    maxLength={60}
                    onChangeText={setTitle}
                    value={title}
                    returnKeyType="next"
                    onSubmitEditing={() => descriptionInputRef.current.focus()}
                  />
                  <MaterialIcons name="person-pin" size={20} color="#999" />
                </InputContainer>

                <InputTitle>Descrição</InputTitle>
                <InputContainer>
                  <Input
                    placeholder='Nova descrição'
                    autoCapitalize="words"
                    autoCorrect={false}
                    ref={descriptionInputRef}
                    onChangeText={setDescription}
                    value={description}
                    returnKeyType="next"
                    onSubmitEditing={() => typeInputRef.current.focus()}
                  />
                  <MaterialIcons name="person-pin" size={20} color="#999" />
                </InputContainer>

                <InputTitle>Tipo de Conta</InputTitle>
                <InputContainer>
                  <Input
                    placeholder='Novo tipo, ex: cc/cd/Caixa/etc'
                    autoCapitalize="words"
                    autoCorrect={false}
                    maxLength={10}
                    ref={typeInputRef}
                    onChangeText={setType}
                    value={type}
                    returnKeyType="next"
                    onSubmitEditing={() => initialValueInputRef.current.focus()}
                  />
                  <MaterialIcons name="lock" size={20} color="#999" />
                </InputContainer>

                <InputTitle>Valor Inícial</InputTitle>
                <InputContainer>
                  <Input
                    placeholder='Novo valor'
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="numeric"
                    ref={initialValueInputRef}
                    onChangeText={setInitialValue}
                    value={initial_value}
                    returnKeyType="send"
                    onSubmitEditing={handleUpdateAccount}
                  />
                  <MaterialIcons name="lock" size={20} color="#999" />
                </InputContainer>

                <DeleteButtonBox>
                  <DeleteButton onPress={handleDeleteAccount}>
                    <DeleteButtonText>Excluir</DeleteButtonText>
                  </DeleteButton>
                  <SubmitButton style={{ width: 125 }} onPress={handleUpdateAccount}>
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
      </Modal>
    </>
  );
}

Accounts.navigationOptions = {
  tabBarLabel: 'Contas',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="user-cog" size={18} color={tintColor} />
  ),
};