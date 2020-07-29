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
  CancelarButtonText,
  ChoiceButton,
  ChoiceText
} from './styles';

import api from '../../../../services/api';
import NavigationService from '../../../../services/navigation';

import LoadGif from '../../../../assets/loading.gif';

export default function CustonModal({ group, setIsVisible, reloadGroups }) {

  const descriptionInputRef = useRef();

  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description);

  const [loading, setLoading] = useState(false);
  const [first_loading, setFirstLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setFirstLoading(false), 300);
  });

  const handleNavigateToPermissions = () => {
    setIsVisible(false);

    setTimeout(() => NavigationService.navigate('Permissions', group), 100);
  }

  const handleNavigateToUsers = () => {
    setIsVisible(false);

    setTimeout(() => NavigationService.navigate('UserGroup', group), 100);
  }

  const handleDeleteGroup = async () => {
    try {
      await api.delete(`/user/group/${group.id}`);

      Alert.alert('Excluído!', 'Grupo deletado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na exclusão do grupo.'
      );
    } finally {
      setIsVisible(false);
      reloadGroups();
    }
  }

  const handleUpdateGroup = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      await api.put(`/user/group/${group.id}`, {
        name,
        description
      });

      Alert.alert('Sucesso!', 'Grupo atualizado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização do grupo, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadGroups();
    }
  }, [
    name,
    description
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
              <Title>{group.name}</Title>
              <Description>
                Edite ou exclua esse grupo como quiser.
            </Description>

              <InputTitle>Nome</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Digite um Nome, ex: Mecânicos..."
                  autoCapitalize="words"
                  autoCorrect={false}
                  onChangeText={setName}
                  value={name}
                  returnKeyType="next"
                  onSubmitEditing={() => descriptionInputRef.current.focus()}
                />
                <MaterialIcons name="edit" size={18} color="#999" />
              </InputContainer>

              <InputTitle>Descrição</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Digite uma descrição"
                  autoCapitalize="none"
                  autoCorrect={false}
                  ref={descriptionInputRef}
                  onChangeText={setDescription}
                  value={description}
                  returnKeyType="next"
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <MaterialIcons name="edit" size={18} color="#999" />
              </InputContainer>

              <ChoiceButton
                onPress={handleNavigateToPermissions}
              >
                <ChoiceText>Ir para Permissões</ChoiceText>

                <MaterialIcons name="open-in-new" size={20} color="#f8a920" />
              </ChoiceButton>

              <ChoiceButton
                onPress={handleNavigateToUsers}
              >
                <ChoiceText>Ir para Colaboradores</ChoiceText>

                <MaterialIcons name="open-in-new" size={20} color="#f8a920" />
              </ChoiceButton>

              <DeleteButtonBox>
                <DeleteButton onPress={handleDeleteGroup}>
                  <DeleteButtonText>Excluir</DeleteButtonText>
                </DeleteButton>
                <SubmitButton style={{ width: 125 }} onPress={handleUpdateGroup}>
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