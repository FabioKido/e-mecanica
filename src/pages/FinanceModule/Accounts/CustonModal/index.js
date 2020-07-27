import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons } from '@expo/vector-icons';

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
  CancelarButtonText
} from './styles';

import api from '../../../../services/api';
import LoadGif from '../../../../assets/loading.gif';

export default function CustonModal({ account, setIsVisible, reloadAccounts }) {

  const descriptionInputRef = useRef();
  const typeInputRef = useRef();
  const initialValueInputRef = useRef();

  const [title, setTitle] = useState(account.title);
  const [description, setDescription] = useState(account.description);
  const [type, setType] = useState(account.type);
  const [initial_value, setInitialValue] = useState(account.initial_value);

  const [loading, setLoading] = useState(false);
  const [first_loading, setFirstLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setFirstLoading(false), 300);
  });

  const handleDeleteAccount = async () => {
    try {
      await api.delete(`/finance/account/${account.id}`);

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
        message || 'Falha na atualização da conta, confira seus dados.'
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
    );
  }
}