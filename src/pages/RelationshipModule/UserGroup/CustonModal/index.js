import React, { useState, useEffect } from 'react';
import {
  Alert,
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
  DeleteButton,
  DeleteButtonText,
  CancelarButton,
  CancelarButtonText,
} from './styles';

import api from '../../../../services/api';
import LoadGif from '../../../../assets/loading.gif';

export default function CustonModal({ user_group, setIsVisible, reloadUserGroups, id_group }) {

  const [first_loading, setFirstLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setFirstLoading(false), 300);
  });

  const handleDeleteUser = async () => {
    try {
      await api.delete(`/user/in/group/${user_group.id}`, {
        params: { id_group }
      });

      Alert.alert('Excluído!', 'Colaborador removido do grupo com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na remoção de colaborador.'
      );
    } finally {
      setIsVisible(false);
      reloadUserGroups();
    }
  }

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
              <Title>{user_group.username}</Title>
              <Description>
                Você pode remover esse colaborador do grupo quando quiser.
            </Description>

              <InputTitle>Usuário</InputTitle>
              <InputContainer>
                <Input
                  editable={false}
                  style={{ color: '#f8a920' }}
                  value={user_group.username}
                />
                <MaterialIcons name="block" size={20} color="#999" />
              </InputContainer>

              <DeleteButton onPress={handleDeleteUser}>
                <DeleteButtonText>Remover</DeleteButtonText>
              </DeleteButton>

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