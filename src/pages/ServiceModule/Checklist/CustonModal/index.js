import React, { useState, useCallback, useEffect } from 'react';
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
import LoadGif from '../../../../assets/loading.gif';

export default function CustonModal({ checklist_detail, setIsVisible, reloadChecklistDetails }) {

  const [title, setTitle] = useState(checklist_detail.title);
  const [checked, setChecked] = useState(checklist_detail.checked);

  const [loading, setLoading] = useState(false);
  const [first_loading, setFirstLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setFirstLoading(false), 300);
  });

  const handleDeleteChecklistDetail = async () => {
    try {
      await api.delete(`/service/checklist/detail/${checklist_detail.id}`);

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
      reloadChecklistDetails();
    }
  }

  const handleUpdateChecklistDetail = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      await api.put(`/service/checklist/detail/${checklist_detail.id}`, { title, checked });

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
      reloadChecklistDetails();
    }
  }, [
    title,
    checked
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
              <Title>{checklist_detail.title}</Title>
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
                <MaterialIcons name="edit" size={18} color="#999" />
              </InputContainer>

              <SwitchContainer>
                <ChoiceText>Checagem Realizada?</ChoiceText>

                <CheckBox
                  iconColor="#f8a920"
                  checkColor="#f8a920"
                  value={checked}
                  onChange={() => setChecked(!checked)}
                />
              </SwitchContainer>

              <DeleteButtonBox>
                <DeleteButton onPress={handleDeleteChecklistDetail}>
                  <DeleteButtonText>Excluir</DeleteButtonText>
                </DeleteButton>
                <SubmitButton style={{ width: 125 }} onPress={handleUpdateChecklistDetail}>
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