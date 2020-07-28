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

export default function CustonModal({ group_permission, setIsVisible, reloadGroupPermissions, id_group }) {

  const [first_loading, setFirstLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setFirstLoading(false), 300);
  });

  const handleDeleteGroupPermission = async () => {
    try {
      await api.delete(`/user/permission/group/${group_permission.id}`, {
        params: { id_group }
      });

      Alert.alert('Excluído!', 'Permissão deletada com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na exclusão da permissão.'
      );
    } finally {
      setIsVisible(false);
      reloadGroupPermissions();
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
              <Title>{group_permission.name}</Title>
              <Description>
                Você pode excluir essa permissão quando quiser.
            </Description>

              <InputTitle>Nome</InputTitle>
              <InputContainer>
                <Input
                  editable={false}
                  style={{ color: '#f8a920' }}
                  value={group_permission.name}
                />
                <MaterialIcons name="block" size={20} color="#999" />
              </InputContainer>

              <InputTitle>Ação</InputTitle>
              <InputContainer>
                <Input
                  editable={false}
                  style={{ color: '#fff' }}
                  value={group_permission.action}
                />
                <MaterialIcons name="info" size={20} color="#999" />
              </InputContainer>

              <DeleteButton onPress={handleDeleteGroupPermission}>
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