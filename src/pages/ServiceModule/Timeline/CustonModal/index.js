import React, { useState, useCallback } from 'react';
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
  SwitchContainer,
  ChoiceText,
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

import CheckBox from '../../../../components/CheckBox';

export default function CustonModal({ timeline_detail, setIsVisible, reloadTimelineDetails }) {

  const [title, setTitle] = useState(timeline_detail.title);
  const [complete, setComplete] = useState(timeline_detail.comlete);

  const [loading, setLoading] = useState(false);

  const handleDeleteTimelineDetail = async () => {
    try {
      await api.delete(`/service/timeline/detail/${timeline_detail.id}`);

      Alert.alert('Excluído!', 'Item deletado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na exclusão do item.'
      );
    } finally {
      setIsVisible(false);
      reloadTimelineDetails();
    }
  }

  const handleUpdateTimelineDetail = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      await api.put(`/service/timeline/detail/${timeline_detail.id}`, { title, complete });

      Alert.alert('Sucesso!', 'Item atualizado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização do item, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadTimelineDetails();
    }
  }, [
    title,
    complete
  ]);

  return (
    <LinearGradient
      colors={['#2b475c', '#000']}
      style={{ flex: 1 }}
    >
      <Container>
        <Content keyboardShouldPersistTaps="handled">
          <FormContainer>
            <Title>{timeline_detail.title}</Title>
            <Description>
              Edite ou exclua esse item como quiser.
            </Description>

            <InputTitle>Título</InputTitle>
            <InputContainer>
              <Input
                placeholder="Novo título do item"
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={100}
                onChangeText={setTitle}
                value={title}
                returnKeyType="next"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              <MaterialIcons name="lock" size={20} color="#999" />
            </InputContainer>

            <SwitchContainer>
              <ChoiceText>Objetivo Completo?</ChoiceText>

              <CheckBox
                iconColor="#f8a920"
                checkColor="#f8a920"
                value={complete}
                onChange={() => setComplete(!complete)}
              />
            </SwitchContainer>

            <DeleteButtonBox>
              <DeleteButton onPress={handleDeleteTimelineDetail}>
                <DeleteButtonText>Excluir</DeleteButtonText>
              </DeleteButton>
              <SubmitButton style={{ width: 125 }} onPress={handleUpdateTimelineDetail}>
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