import React, { useState, useCallback, useRef, useEffect } from 'react';
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

export default function CustonModal({ category, setIsVisible, reloadCategories }) {

  const indicatorInputRef = useRef();

  const [description, setDescription] = useState(category.description);
  const [indicator, setIndicator] = useState(category.indicator);

  const [loading, setLoading] = useState(false);
  const [first_loading, setFirstLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setFirstLoading(false), 300);
  });

  const handleDeleteCategory = async () => {
    try {
      await api.delete(`/finance/category/${category.id}`);

      Alert.alert('Excluída!', 'Categoria deletada com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na exclusão da categoria.'
      );
    } finally {
      setIsVisible(false);
      reloadCategories();
    }
  }

  const handleUpdateCategory = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      await api.put(`/finance/category/${category.id}`, { description, indicator });

      Alert.alert('Sucesso!', 'Categoria atualizada com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização da categoria, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadCategories();
    }
  }, [
    description,
    indicator
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
              <Title>{category.description}</Title>
              <Description>
                Edite ou exclua essa categoria como quiser.
            </Description>

              <InputTitle>Descrição</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Digite a nova descrição"
                  autoCapitalize="words"
                  autoCorrect={false}
                  onChangeText={setDescription}
                  value={description}
                  returnKeyType="next"
                  onSubmitEditing={() => indicatorInputRef.current.focus()}
                />
                <MaterialIcons name="person-pin" size={20} color="#999" />
              </InputContainer>

              <InputTitle>Indicador</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Novo indicador, ex: impostos/etc"
                  autoCapitalize="words"
                  autoCorrect={false}
                  ref={indicatorInputRef}
                  onChangeText={setIndicator}
                  value={indicator}
                  returnKeyType="send"
                  onSubmitEditing={handleUpdateCategory}
                />
                <MaterialIcons name="lock" size={20} color="#999" />
              </InputContainer>

              <DeleteButtonBox>
                <DeleteButton onPress={handleDeleteCategory}>
                  <DeleteButtonText>Excluir</DeleteButtonText>
                </DeleteButton>
                <SubmitButton style={{ width: 125 }} onPress={handleUpdateCategory}>
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