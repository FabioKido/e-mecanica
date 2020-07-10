import React, { useState, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard
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

export default function CustonModal({ family, setIsVisible, reloadFamilies }) {

  const descriptionInputRef = useRef();

  const [name, setName] = useState(family.name);
  const [description, setDescription] = useState(family.description);

  const [loading, setLoading] = useState(false);

  const handleDeletefamily = async () => {
    try {
      await api.delete(`/stock/family/${family.id}`);

      Alert.alert('Excluída!', 'Familia deletada com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na exclusão da familia.'
      );
    } finally {
      setIsVisible(false);
      reloadFamilies();
    }
  }

  const handleUpdatefamily = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      await api.put(`/stock/family/${family.id}`, { name, description });

      Alert.alert('Sucesso!', 'Familia atualizada com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização da familia, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadFamilies();
    }
  }, [
    name,
    description
  ]);

  return (
    <LinearGradient
      colors={['#2b475c', '#000']}
      style={{ flex: 1 }}
    >
      <Container>
        <Content keyboardShouldPersistTaps="handled">
          <FormContainer>
            <Title>{family.name}</Title>
            <Description>
              Edite ou exclua essa família como quiser.
            </Description>

            <InputTitle>Nome</InputTitle>
            <InputContainer>
              <Input
                placeholder="Digite o novo nome"
                autoCapitalize="words"
                autoCorrect={false}
                onChangeText={setName}
                value={name}
                returnKeyType="next"
                onSubmitEditing={() => descriptionInputRef.current.focus()}
              />
              <MaterialIcons name="lock" size={20} color="#999" />
            </InputContainer>

            <InputTitle>Descrição</InputTitle>
            <InputContainer>
              <Input
                placeholder="Digite a nova descrição"
                autoCapitalize="words"
                autoCorrect={false}
                ref={descriptionInputRef}
                onChangeText={setDescription}
                value={description}
                returnKeyType="send"
                onSubmitEditing={handleUpdatefamily}
              />
              <MaterialIcons name="person-pin" size={20} color="#999" />
            </InputContainer>

            <DeleteButtonBox>
              <DeleteButton onPress={handleDeletefamily}>
                <DeleteButtonText>Excluir</DeleteButtonText>
              </DeleteButton>
              <SubmitButton style={{ width: 125 }} onPress={handleUpdatefamily}>
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